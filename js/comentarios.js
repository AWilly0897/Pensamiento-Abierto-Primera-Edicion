document.addEventListener("DOMContentLoaded", () => {
  mostrarComentariosPublicados();

  // Delegar evento cuando el formulario se cargue dinámicamente
  document.addEventListener("submit", function (e) {
    if (e.target && e.target.id === "formulario-comentario") {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim() || "Anónimo";
      const comentario = document.getElementById("comentario").value.trim();
      const fecha = new Date().toISOString();
      const articulo = document.title || "articulo-sin-titulo";

      const nuevoComentario = { fecha, nombre, articulo, comentario };

      // Guardar en localStorage
      const comentarios = JSON.parse(localStorage.getItem("comentariosPublicados")) || [];
      comentarios.push(nuevoComentario);
      localStorage.setItem("comentariosPublicados", JSON.stringify(comentarios));

      // Mostrar inmediatamente
      mostrarComentariosPublicados();

      e.target.reset();
    }
  });
});

function mostrarComentariosPublicados() {
  const lista = document.getElementById("lista-publicados");
  if (!lista) return;

  const comentarios = JSON.parse(localStorage.getItem("comentariosPublicados")) || [];
  const publicados = comentarios.filter(c => c.articulo === document.title);

  // Orden descendente (último primero)
  publicados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

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
