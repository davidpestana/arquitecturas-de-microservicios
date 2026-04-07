import express from "express";
import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";
const HTTP_PORT = Number(process.env.HTTP_PORT || 3002);

async function startConsumer() {
  const conn = await amqp.connect(RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertExchange("eventos", "topic", { durable: true });

  const q = await ch.assertQueue("shipping");
  await ch.bindQueue(q.queue, "eventos", "pago.confirmado");

  console.log("🚚 Shipping Service escuchando 'pago.confirmado'...");

  ch.consume(q.queue, msg => {
    const data = JSON.parse(msg.content.toString());
    console.log(`🚚 Envío preparado para pedido ${data.pedidoId}`);
    const eventoEnvio = { pedidoId: data.pedidoId };
    ch.publish("eventos", "pedido.enviado", Buffer.from(JSON.stringify(eventoEnvio)));
    ch.ack(msg);
  });
}

async function main() {
  await startConsumer();

  const app = express();
  app.use(express.json());

  app.post("/enviar", (req, res) => {
    const { pedidoId } = req.body;
    console.log(
      `🚚 Paso HTTP /enviar (orquestador) para pedido ${pedidoId}; el evento 'pedido.enviado' lo publica el consumidor Rabbit al procesar 'pago.confirmado'`
    );
    res.json({ ok: true, pedidoId, nota: "no publica en RabbitMQ para evitar duplicar el evento" });
  });

  app.listen(HTTP_PORT, () => console.log(`🚚 Shipping HTTP en ${HTTP_PORT}`));
}

main().catch(console.error);
