import express from "express";
import amqp from "amqplib";

const app = express();
app.use(express.json());
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";
const EXCHANGE = "eventos_pedidos";

async function publicarEvento(evento) {
  const conn = await amqp.connect(RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertExchange(EXCHANGE, "fanout", { durable: true });
  ch.publish(EXCHANGE, "", Buffer.from(JSON.stringify(evento)));
  console.log("📤 Evento publicado:", evento.tipo);
  await ch.close();
  await conn.close();
}

app.post("/pedido", async (req, res) => {
  const pedido = {
    id: Date.now(),
    cliente: req.body.cliente,
    total: req.body.total,
    estado: "CREADO",
  };

  const evento = {
    tipo: "pedido_creado",
    timestamp: new Date().toISOString(),
    data: pedido,
  };

  await publicarEvento(evento);
  res.json({ status: "ok", evento });
});

app.listen(5000, () => console.log("🟦 Commands Service en puerto 5000"));
