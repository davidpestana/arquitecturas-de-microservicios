import express from "express";
import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";
const HTTP_PORT = Number(process.env.HTTP_PORT || 3003);

async function startConsumer() {
  const conn = await amqp.connect(RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertExchange("eventos", "topic", { durable: true });

  const q = await ch.assertQueue("notifications");
  await ch.bindQueue(q.queue, "eventos", "pedido.enviado");

  console.log("✉️ Notifications Service escuchando 'pedido.enviado'...");

  ch.consume(q.queue, msg => {
    const data = JSON.parse(msg.content.toString());
    console.log(`✉️ Email enviado al cliente del pedido ${data.pedidoId}`);
    ch.ack(msg);
  });
}

async function main() {
  await startConsumer();

  const app = express();
  app.use(express.json());

  app.post("/email", (req, res) => {
    const { pedidoId } = req.body;
    console.log(`✉️ Email (invocado por HTTP / orquestador) pedido ${pedidoId}`);
    res.json({ ok: true, pedidoId });
  });

  app.listen(HTTP_PORT, () => console.log(`✉️ Notifications HTTP en ${HTTP_PORT}`));
}

main().catch(console.error);
