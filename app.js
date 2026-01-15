const API = "https://s77.onrender.com";

async function login() {
  const clave = document.getElementById("clave").value;
  const error = document.getElementById("error");

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clave })
  });

  const data = await res.json();

  if (!res.ok) {
    error.innerText = data.error || "Error";
    return;
  }

  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";
}

async function enviar() {
  const numero = parseInt(document.getElementById("nuevo").value);
  if (isNaN(numero)) return;

  const res = await fetch(`${API}/nuevo-numero`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numero })
  });

  const data = await res.json();
  document.getElementById("numeros").innerText = data.sistemaActivo
    ? data.ultimos5.join(" | ")
    : data.ultimos16.join(" | ");

  document.getElementById("nuevo").value = "";
}

async function reiniciar() {
  await fetch(`${API}/reiniciar`, { method: "POST" });
  location.reload();
    }
    
