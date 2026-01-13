const API = "https://s77-frontend.onrender.com";

async function enviar() {
  const input = document.getElementById("nuevo");
  const numero = parseInt(input.value);

  if (isNaN(numero)) return;

  const res = await fetch(`${API}/nuevo-numero`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numero })
  });

  const data = await res.json();
  render(data);
  input.value = "";
}

async function reiniciar() {
  await fetch(`${API}/reiniciar`, { method: "POST" });
  location.reload();
}

function render(data) {
  const fichas = document.getElementById("fichas");
  const favoritos = document.getElementById("favoritos");
  const repetidos = document.getElementById("repetidos");
  const numeros = document.getElementById("numeros");

  fichas.innerText = data.fichas;

  favoritos.innerText =
    data.favoritos.length > 0 ? data.favoritos.join(", ") : "—";

  repetidos.innerHTML = "";
  data.repetidos.forEach((lista, i) => {
    const div = document.createElement("div");
    div.innerText = `Repetido ${i + 1}: ${lista.join(", ") || "—"}`;
    repetidos.appendChild(div);
  });

  numeros.innerText = data.sistemaActivo
    ? data.ultimos5.join(" | ")
    : data.ultimos16.join(" | ");
}
