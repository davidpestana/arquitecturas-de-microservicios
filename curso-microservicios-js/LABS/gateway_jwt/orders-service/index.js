import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const SECRET = "CLAVE_SUPER_SECRETA";

function verificarToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Falta token" });
  const token = header.split(" ")[1];

  try {
    req.usuario = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}

app.get("/pedidos", verificarToken, (req, res) => {
  res.json({
    usuario: req.usuario.sub,
    pedidos: [
      { id: 101, producto: "Portátil", total: 1200 },
      { id: 102, producto: "Teclado", total: 80 },
    ],
  });
});

app.listen(3006, () => console.log("📦 Orders Service en puerto 3006"));
