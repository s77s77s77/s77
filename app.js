const API="PEGAR_URL_DE_RENDER";

async function login(){
  const clave=document.getElementById("clave").value;
  const r=await fetch(API+"/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({clave})});
  const d=await r.json();
  if(!r.ok){document.getElementById("error").innerText=d.error;return;}
  document.getElementById("login").style.display="none";
  document.getElementById("app").style.display="block";
}

async function enviar(){
  const v=parseInt(document.getElementById("nuevo").value);
  if(isNaN(v))return;
  const r=await fetch(API+"/nuevo-numero",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({numero:v})});
  const d=await r.json();

  document.getElementById("numeros").innerText=d.sistemaActivo?d.ultimos5.join(" | "):d.ultimos16.join(" | ");
  document.getElementById("fichas").innerText=d.fichas;
  document.getElementById("favoritos").innerText=d.favoritos.join(", ")||"—";

  let rep="";
  d.repetidos.forEach((l,i)=>rep+=`<div>R${i+1}: ${l.join(", ")||"—"}</div>`);
  document.getElementById("repetidos").innerHTML=rep;

  document.getElementById("nuevo").value="";
}

async function reiniciar(){
  await fetch(API+"/reiniciar",{method:"POST"});
  location.reload();
    }
