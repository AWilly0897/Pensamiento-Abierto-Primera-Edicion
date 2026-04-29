document.addEventListener("DOMContentLoaded", () => {
  mostrarComentariosPublicados();

  // Delegar evento cuando el formulario se cargue dinámicamente
  document.addEventListener("submit", async function (e) {
    if (e.target && e.target.id === "formulario-comentario") {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim() || "Anónimo";
      const comentario = document.getElementById("comentario").value.trim();
      const fecha = new Date().toISOString();
      const articulo = document.title || "articulo-sin-titulo";

      const nuevoComentario = { fecha, nombre, articulo, comentario };

      // Guardar en localStorage (cache inmediato)
      const comentarios = JSON.parse(localStorage.getItem("comentariosPublicados")) || [];
      comentarios.push(nuevoComentario);
      localStorage.setItem("comentariosPublicados", JSON.stringify(comentarios));

      // 🔹 Enviar al backend para crear Issue en GitHub
      try {
        const response = await fetch("/api/nuevo-comentario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, comentario, articulo })
        });

        if (!response.ok) {
          throw new Error("Error al enviar comentario al backend");
        }

        const data = await response.json();
        console.log("Issue creado en GitHub:", data.html_url);
      } catch (error) {
        console.error("Error:", error);
      }

      // Mostrar inmediatamente en la página (cache local)
      mostrarComentariosLocales();

      e.target.reset();
    }
  });
});

// 🔹 Función para traer Issues desde GitHub
async function traerComentariosDeGitHub() {
  try {
    const response = await fetch("https://api.github.com/repos/AWilly0897/Pensamiento-Abierto-Primera-Edicion/issues", {
      headers: {
        "Accept": "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      throw new Error("Error al obtener Issues de GitHub");
    }

    const issues = await response.json();

    return issues.map(issue => {
      const articuloLabel = issue.labels?.[0]?.name || "articulo-sin-titulo";
      const nombreExtraido = issue.body?.match(/Comentario enviado por: (.+)/);
      return {
        fecha: issue.created_at,
        nombre: nombreExtraido ? nombreExtraido[1] : "Anónimo",
        articulo: articuloLabel,
        comentario: issue.title
      };
    });
  } catch (error) {
    console.error("Error al traer comentarios de GitHub:", error);
    return [];
  }
}

// 🔹 Mostrar comentarios oficiales desde GitHub (fuente persistente)
async function mostrarComentariosPublicados() {
  const lista = document.getElementById("lista-publicados");
  if (!lista) return;

  const comentariosGitHub = await traerComentariosDeGitHub();

  const publicados = comentariosGitHub
    .filter(c => c.articulo === document.title)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  lista.innerHTML = "";
  publicados.forEach(c => {
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${c.nombre}</strong> (${new Date(c.fecha).toLocaleString()})<br>
      <p>${c.comentario}</p>
    `;
    lista.appendChild(item);
  });
}

// 🔹 Mostrar comentarios locales (solo cache inmediato)
function mostrarComentariosLocales() {
  const lista = document.getElementById("lista-publicados");
  if (!lista) return;

  const comentariosLocales = JSON.parse(localStorage.getItem("comentariosPublicados")) || [];
  const publicados = comentariosLocales
    .filter(c => c.articulo === document.title)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  publicados.forEach(c => {
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${c.nombre}</strong> (${new Date(c.fecha).toLocaleString()})<br>
      <p>${c.comentario}</p>
    `;
    lista.insertBefore(item, lista.firstChild); // aparece arriba al instante
  });
}