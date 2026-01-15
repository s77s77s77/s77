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
