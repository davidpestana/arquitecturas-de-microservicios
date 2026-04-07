import express from "express";
import amqp from "amqplib";

const app = express();
let pedidos = [];
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";
const EXCHANGE = "eventos_pedidos";

async function escucharEventos() {
  const conn = await amqp.connect(RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertExchange(EXCHANGE, "fanout", { durable: true });

  const q = await ch.assertQueue("cola_pedidos", { durable: false });
  await ch.bindQueue(q.queue, EXCHANGE, "");

  console.log("📥 Query Service escuchando eventos...");

  ch.consume(q.queue, msg => {
    const evento = JSON.parse(msg.content.toString());
    console.log("🔄 Evento recibido:", evento.tipo);

    if (evento.tipo === "pedido_creado") {
      pedidos.push(evento.data);
    }

    ch.ack(msg);
  });
}

app.get("/pedidos", (req, res) => {
  res.json({ total: pedidos.length, data: pedidos });
});

escucharEventos()
  .then(() => {
    app.listen(5001, () => console.log("🟧 Queries Service en puerto 5001"));
  })
  .catch(err => {
    console.error("No se pudo suscribir al bus de eventos:", err);
    process.exit(1);
  });
