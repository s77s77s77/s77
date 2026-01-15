const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ================== LOGIN ==================
const ADMIN_KEY = "ADMIN-1407";
let usuarios = {}; // { clave: vencimiento }

// LOGIN
app.post("/login", (req, res) => {
  const { clave } = req.body;
  const ahora = Date.now();

  if (clave === ADMIN_KEY) {
    return res.json({ ok: true, admin: true });
  }

  if (!usuarios[clave]) {
    return res.status(401).json({ ok: false, error: "Clave inválida" });
  }

  if (ahora > usuarios[clave]) {
    return res.status(401).json({ ok: false, error: "Acceso vencido" });
  }

  return res.json({ ok: true, admin: false });
});

// CREAR USUARIO (ADMIN)
app.post("/admin/crear-usuario", (req, res) => {
  const { adminKey, clave, dias } = req.body;

  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ ok: false });
  }

  usuarios[clave] = Date.now() + dias * 86400000;
  res.json({ ok: true });
});

// ================== SISTEMA ==================
let ultimos = [];
let sistemaActivo = false;

app.post("/nuevo-numero", (req, res) => {
  const { numero } = req.body;
  if (numero === undefined) return res.json({});

  ultimos.unshift(numero);
  if (ultimos.length > 16) ultimos.pop();

  if (ultimos.length === 17) sistemaActivo = true;

  res.json({
    sistemaActivo,
    ultimos16: ultimos.slice(0, 16),
    ultimos5: ultimos.slice(0, 5),
    fichas: 1,
    favoritos: [],
    repetidos: []
  });
});

app.post("/reiniciar", (req, res) => {
  ultimos = [];
  sistemaActivo = false;
  res.json({ ok: true });
});

app.get("/estado", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log("Backend S77 activo");
});
      
