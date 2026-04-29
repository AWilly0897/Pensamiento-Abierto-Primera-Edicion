// api/nuevo-comentario.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { nombre, comentario, articulo } = req.body;

  if (!comentario) {
    return res.status(400).json({ error: "Comentario vacío" });
  }

  try {
    // 🔹 Log temporal para verificar si el token existe
    console.log("Token recibido:", process.env.GITHUB_TOKEN ? "OK" : "NO DEFINIDO");

    const response = await fetch(
      "https://api.github.com/repos/AWilly0897/Pensamiento-Abierto-Primera-Edicion/issues",
      {
        method: "POST",
        headers: {
          "Authorization": `token ${process.env.GITHUB_TOKEN}`,
          "Accept": "application/vnd.github+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: comentario, // el texto principal como título del Issue
          body: `Comentario enviado por: ${nombre}\nArtículo: ${articulo}`,
          labels: [articulo] // 🔹 etiqueta con el título del artículo
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Error de API de GitHub: ${response.status}`);
    }

    const issue = await response.json();
    return res.status(200).json(issue);
  } catch (error) {
    console.error("Error al crear comentario:", error);
    return res.status(500).json({ error: "Error interno" });
  }
}

