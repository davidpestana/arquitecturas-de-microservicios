const axios = require("axios");
const Consul = require("consul");

const SERVICE_NAME = "demo-service";
const CONSUL_HOST = process.env.CONSUL_HOST || "127.0.0.1";
const CONSUL_PORT = Number(process.env.CONSUL_PORT || 8500);
const consul = new Consul({ host: CONSUL_HOST, port: CONSUL_PORT, promisify: true });

async function discoverService() {
  // Obtiene las instancias del servicio desde Consul
  const services = await consul.health.service({
    service: SERVICE_NAME,
    passing: true
  });

  if (!services || services.length === 0) {
    throw new Error(`No hay instancias saludables de ${SERVICE_NAME}`);
  }

  // Estrategia simple: coge la primera (podrías hacer round-robin)
  const srv = services[0].Service;
  const address = srv.Address || "127.0.0.1";
  const port = srv.Port;

  return `http://${address}:${port}`;
}

async function main() {
  try {
    const baseUrl = await discoverService();
    console.log(`🔎 Servicio resuelto en: ${baseUrl}`);

    const resp = await axios.get(`${baseUrl}/hello`);
    console.log("📦 Respuesta:", resp.data);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
