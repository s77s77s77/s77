const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* ===================== LOGIN ===================== */
const ADMIN_KEY = "ADMIN-1407";
let usuarios = {}; // { clave: vencimiento }

app.post("/login", (req, res) => {
  const { clave } = req.body;
  const ahora = Date.now();

  if (clave === ADMIN_KEY) return res.json({ ok: true, admin: true });
  if (!usuarios[clave]) return res.status(401).json({ ok: false, error: "Clave inválida" });
  if (ahora > usuarios[clave]) return res.status(401).json({ ok: false, error: "Acceso vencido" });

  res.json({ ok: true, admin: false });
});

/* ===================== SISTEMA ===================== */

// lotes clásicos
const lotes3 = [
  [0,13,28],[1,18,36],[1,25,34],[2,10,35],[2,10,22],
  [3,18,19],[4,10,22],[6,17,28],[7,19,27],
  [7,9,32],[8,33,28],[8,26,35],[9,14,30],
  [9,1,30],[9,25,36],[10,26,24],[11,22,33],
  [17,20,35],[7,3,30]
];

const lotes4 = [
  [3,18,24,26],[4,11,15,29],[5,12,16,21],
  [6,10,13,31],[14,23,25,16]
];

// lotes dirigidos
const lotesDirigidos = [
  { lote:"A", pareja:[6,10], busca:[13,36,27] },
  { lote:"A", pareja:[6,20], busca:[17,29,31] },
  { lote:"B", pareja:[9,14], busca:[2,18,22,35] }
];

let ultimos = [];
let sistemaActivo = false;
let fichas = 1;
let acumulado = 0;

// suspensiones por pareja
let suspensiones = {}; // key pareja -> contador

function parejaKey(a,b){ return [a,b].sort().join("-"); }

app.post("/nuevo-numero", (req,res)=>{
  const { numero } = req.body;
  if (numero===undefined) return res.json({});

  ultimos.unshift(numero);
  if (ultimos.length>16) ultimos.pop();
  if (ultimos.length>=17) sistemaActivo=true;

  let favoritos = [];
  let repetidos = Array.from({length:8},()=>[]);

  if(sistemaActivo){
    let conteo = {};

    // clásicos de 3
    lotes3.forEach(l=>{
      let p=l.filter(n=>ultimos.includes(n));
      if(p.length===2){
        let f=l.find(n=>!p.includes(n));
        conteo[f]=(conteo[f]||0)+1;
      }
    });

    // clásicos de 4 (con 3 se acierta)
    lotes4.forEach(l=>{
      let p=l.filter(n=>ultimos.includes(n));
      if(p.length===2){
        l.filter(n=>!p.includes(n)).forEach(n=>{
          conteo[n]=(conteo[n]||0)+1;
        });
      }
    });

    // dirigidos
    lotesDirigidos.forEach(ld=>{
      const key=parejaKey(ld.pareja[0],ld.pareja[1]);
      if(suspensiones[key]>0) return;

      let activos = ld.pareja.filter(n=>ultimos.includes(n));
      if(activos.length===2){
        ld.busca.forEach(n=>{
          conteo[n]=(conteo[n]||0)+1;
        });
      }
    });

    Object.keys(conteo).forEach(n=>{
      let c=conteo[n];
      if(c===1) favoritos.push(n);
      else if(c-2<8) repetidos[c-2].push(n);
    });

    let total = favoritos.length + repetidos.flat().length;
    acumulado += total;

    fichas = Math.floor(acumulado/25)+1;
  }

  res.json({
    sistemaActivo,
    ultimos16: ultimos.slice(0,16),
    ultimos5: ultimos.slice(0,5),
    fichas,
    favoritos,
    repetidos
  });
});

app.post("/reiniciar",(req,res)=>{
  ultimos=[];
  sistemaActivo=false;
  fichas=1;
  acumulado=0;
  suspensiones={};
  res.json({ok:true});
});

app.get("/estado",(req,res)=>res.json({ok:true}));

app.listen(PORT,()=>console.log("Backend S77 activo"));
  
