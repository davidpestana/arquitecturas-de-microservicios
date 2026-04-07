import express from "express";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

const SECRET = "CLAVE_SUPER_SECRETA";

app.post("/login", (req, res) => {
  const { usuario, password } = req.body;
  if (usuario === "admin" && password === "1234") {
    const token = jwt.sign({ sub: usuario, rol: "admin" }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Credenciales inválidas" });
  }
});

app.get("/verify", (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Falta token" });

  try {
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, SECRET);
    res.json(payload);
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
});

app.listen(3005, () => console.log("🔐 Auth Service en puerto 3005"));
