import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const ORDERS_URL = process.env.ORDERS_URL || "http://orders-service:3000";
const PAYMENTS_URL = process.env.PAYMENTS_URL || "http://payments-service:3001";
const SHIPPING_URL = process.env.SHIPPING_URL || "http://shipping-service:3002";
const NOTIFICATIONS_URL = process.env.NOTIFICATIONS_URL || "http://notifications-service:3003";

app.post("/procesar-pedido", async (req, res) => {
  try {
    const { cliente } = req.body;
    console.log("🎛️ Iniciando flujo orquestado...");

    const { data } = await axios.post(`${ORDERS_URL}/orders`, {
      cliente,
      orchestrated: true,
    });
    const pedidoId = data.pedido.id;

    await axios.post(`${PAYMENTS_URL}/pagar`, { pedidoId, cliente });

    await axios.post(`${SHIPPING_URL}/enviar`, { pedidoId });
    await axios.post(`${NOTIFICATIONS_URL}/email`, { pedidoId });

    res.json({ status: "ok", pedidoId });
  } catch (e) {
    console.error("❌ Error en orquestador:", e.response?.data || e.message);
    res.status(500).json({ error: "Fallo en flujo orquestado" });
  }
});

app.listen(4000, () => console.log("🎛️ Orchestrator Service en puerto 4000"));
