import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/* ================== ESTADO GLOBAL ================== */
let ultimos16 = [];
let sistemaActivo = false;
let ultimos5 = [];

let favoritos = new Set();
let repetidos = Array.from({ length: 8 }, () => new Set());

let fichasAcumulado = 0;
let fichas = 1;

/* Suspensiones */
let parejasSuspendidas = new Map();       // key: "a-b" → contador
let lotesSuspendidos = new Map();          // key: "LOTE_A" → contador

/* ================== LOTES ================== */

// Lotes clásicos (2 de 3 → buscar 1)
const lotesClasicos = [
  [0,13,28],[1,18,36],[1,25,34],[2,10,35],[2,10,22],
  [3,18,19],[4,10,22],[6,17,28],[7,19,27],
  [7,9,32],[8,33,28],[8,26,35],[9,14,30],
  [9,1,30],[9,25,36],[10,26,24],[11,22,33],
  [17,20,35],[7,3,30]
];

// Lotes de 4 (acierto con 3°)
const lotes4 = [
  [3,18,24,26],
  [4,11,15,29],
  [5,12,16,21],
  [6,10,13,31],
  [14,23,25,16]
];

// Lotes dirigidos (resumido – todos confirmados)
const lotesDirigidos = {
  A: [
    { pareja:[6,10], busca:[13,36,27] },
    { pareja:[6,5], busca:[13,36,27] }
    // 👉 acá van TODOS los del Lote A (los confirmados)
  ],
  // B, C, D, E, F igual estructura
};

/* ================== UTILIDADES ================== */

function tickSuspensiones() {
  for (let [k,v] of parejasSuspendidas) {
    if (v <= 1) parejasSuspendidas.delete(k);
    else parejasSuspendidas.set(k, v - 1);
  }
  for (let [k,v] of lotesSuspendidos) {
    if (v <= 1) lotesSuspendidos.delete(k);
    else lotesSuspendidos.set(k, v - 1);
  }
}

function keyPareja(a,b) {
  return [a,b].sort((x,y)=>x-y).join("-");
}

/* ================== ENDPOINTS ================== */

app.post("/nuevo-numero", (req,res)=>{
  const { numero } = req.body;
  if (numero === undefined) return res.status(400).end();

  ultimos16.unshift(numero);
  if (ultimos16.length > 16) ultimos16.pop();

  ultimos5.unshift(numero);
  if (ultimos5.length > 5) ultimos5.pop();

  if (ultimos16.length === 16 && !sistemaActivo) {
    sistemaActivo = true;
    fichas = 1;
    fichasAcumulado = 0;
  }

  if (sistemaActivo) {
    tickSuspensiones();
    // 👉 acá entra TODA la lógica de búsqueda, aciertos,
    // suspensión por pareja y por lote dirigido
    // (ya preparada con las estructuras correctas)
  }

  return res.json(estado());
});

app.post("/reiniciar", (req,res)=>{
  ultimos16 = [];
  ultimos5 = [];
  favoritos.clear();
  repetidos.forEach(r=>r.clear());
  parejasSuspendidas.clear();
  lotesSuspendidos.clear();
  fichas = 1;
  fichasAcumulado = 0;
  sistemaActivo = false;
  res.json({ ok:true });
});

app.get("/estado", (req,res)=>{
  res.json(estado());
});

function estado() {
  return {
    sistemaActivo,
    ultimos16,
    ultimos5,
    fichas,
    favoritos: [...favoritos],
    repetidos: repetidos.map(r=>[...r])
  };
}

app.listen(3000, ()=>console.log("Backend S77 activo"));
