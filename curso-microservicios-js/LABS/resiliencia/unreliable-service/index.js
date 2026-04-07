import express from "express";
import amqp from "amqplib";

const app = express();
app.use(express.json());

const PORT = 4000;
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";

let channel;

async function getChannel() {
  if (channel) return channel;
  const conn = await amqp.connect(RABBITMQ_URL);
  channel = await conn.createChannel();
  await channel.assertQueue("pedidos_creados", { durable: true });
  console.log("📡 Conectado a RabbitMQ y cola asegurada");
  return channel;
}

app.get("/sometimes-fails", (req, res) => {
  if (Math.random() < 0.5) {
    console.log("❌ /sometimes-fails falló");
    return res.status(500).json({ error: "Fallo aleatorio" });
  }
  console.log("✅ /sometimes-fails OK");
  res.json({ message: "OK" });
});

app.get("/slow", (req, res) => {
  console.log("⏱️ /slow iniciando...");
  setTimeout(() => res.json({ message: "Respuesta lenta tras 5s" }), 5000);
});

app.get("/always-ok", (req, res) => {
  res.json({ message: "Siempre OK" });
});

app.post("/orders", async (req, res) => {
  const pedido = { id: Date.now(), user: req.body.user || "Anónimo" };
  console.log(`🧾 Pedido recibido: ${pedido.id}`);
  const ch = await getChannel();
  ch.sendToQueue("pedidos_creados", Buffer.from(JSON.stringify(pedido)));
  console.log("📤 Evento enviado a cola 'pedidos_creados'");
  res.json({ status: "ok", pedido });
});

app.listen(PORT, () => {
  console.log(`🚨 Unreliable Service en http://unreliable-service:${PORT}`);
});
