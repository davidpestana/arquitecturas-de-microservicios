import express from "express";
import amqp from "amqplib";

const app = express();
app.use(express.json());
const PORT = 3000;
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";

app.post("/orders", async (req, res) => {
  const { cliente, orchestrated } = req.body;
  const pedido = { id: Date.now(), cliente };

  if (orchestrated !== true) {
    const conn = await amqp.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    await ch.assertExchange("eventos", "topic", { durable: true });

    ch.publish("eventos", "pedido.creado", Buffer.from(JSON.stringify(pedido)));
    console.log("📤 Evento 'pedido.creado' emitido:", pedido.id);

    await ch.close();
    await conn.close();
  } else {
    console.log("🎛️ Pedido creado (orquestado, sin publicar aún en RabbitMQ):", pedido.id);
  }

  res.json({ status: "ok", pedido });
});

app.listen(PORT, () => console.log(`🧾 Orders Service en puerto ${PORT}`));
