import express from "express";
import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";
const HTTP_PORT = Number(process.env.HTTP_PORT || 3001);

async function startConsumer() {
  const conn = await amqp.connect(RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertExchange("eventos", "topic", { durable: true });

  const q = await ch.assertQueue("payments");
  await ch.bindQueue(q.queue, "eventos", "pedido.creado");

  console.log("💳 Payments Service escuchando 'pedido.creado'...");

  ch.consume(q.queue, msg => {
    const pedido = JSON.parse(msg.content.toString());
    console.log(`💳 Pago realizado para pedido ${pedido.id}`);

    const eventoPago = { pedidoId: pedido.id, cliente: pedido.cliente };
    ch.publish("eventos", "pago.confirmado", Buffer.from(JSON.stringify(eventoPago)));

    ch.ack(msg);
  });
}

async function main() {
  await startConsumer();

  const app = express();
  app.use(express.json());

  app.post("/pagar", async (req, res) => {
    const { pedidoId, cliente } = req.body;
    const conn = await amqp.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    await ch.assertExchange("eventos", "topic", { durable: true });
    const eventoPago = { pedidoId, cliente: cliente || "orquestado" };
    ch.publish("eventos", "pago.confirmado", Buffer.from(JSON.stringify(eventoPago)));
    await ch.close();
    await conn.close();
    console.log(`💳 Pago (HTTP) → publicado 'pago.confirmado' para pedido ${pedidoId}`);
    res.json({ ok: true, evento: "pago.confirmado", pedidoId });
  });

  app.listen(HTTP_PORT, () => console.log(`💳 Payments HTTP en ${HTTP_PORT}`));
}

main().catch(console.error);
