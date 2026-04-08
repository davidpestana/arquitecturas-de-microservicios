const express = require("express");
const Consul = require("consul");

const PORT = Number(process.env.PORT || 3001);
const CONSUL_HOST = process.env.CONSUL_HOST || "127.0.0.1";
const CONSUL_PORT = Number(process.env.CONSUL_PORT || 8500);
const SERVICE_ADDRESS = process.env.SERVICE_ADDRESS || "127.0.0.1";
const SERVICE_NAME = "demo-service";
const SERVICE_ID = `${SERVICE_NAME}-${PORT}`;

const app = express();
const consul = new Consul({ host: CONSUL_HOST, port: CONSUL_PORT, promisify: true });

// Endpoint de ejemplo
app.get("/hello", (req, res) => {
  res.json({ message: "Hola desde demo-service", port: PORT });
});

// Registro del servicio en Consul
async function registerService() {
  await consul.agent.service.register({
    id: SERVICE_ID,
    name: SERVICE_NAME,
    address: SERVICE_ADDRESS,
    port: PORT,
    check: {
      http: `http://${SERVICE_ADDRESS}:${PORT}/health`,
      interval: "10s",
      timeout: "1s"
    }
  });
  console.log(`✅ Servicio registrado en Consul: ${SERVICE_ID}`);
}

// Deregistro limpio al terminar
async function deregisterService() {
  await consul.agent.service.deregister(SERVICE_ID);
  console.log(`🧹 Servicio deregistrado de Consul: ${SERVICE_ID}`);
}

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, async () => {
  console.log(`🚀 Servicio escuchando en http://0.0.0.0:${PORT}`);
  try {
    await registerService();
  } catch (err) {
    console.error("Error registrando servicio en Consul:", err);
  }
});

// Manejar SIGINT/SIGTERM
process.on("SIGINT", async () => {
  try {
    await deregisterService();
  } finally {
    process.exit(0);
  }
});
