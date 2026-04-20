#  Sistema de Comentarios y Arquitectura del Proyecto

Este repositorio implementa un sistema de comentarios transparente y auditable para los artículos de **Pensamiento Abierto – Primera Edición**, integrando frontend, lógica cliente y backend con GitHub Issues.

---

##  Estructura del proyecto

```
├── api/
│   └── nuevo-comentario.js   # Backend: endpoint para crear Issues en GitHub
│
├── articulos/
│   ├── articulo1.html         
│   ├── articulo2.html
│   ├── ...                   # Hasta 10 artículos
│   └── estilo.css            # Estilos específicos para los artículos
│
├── componentes/
│   ├── footer.html           # Footer 
│   └── formulario-comentario.html # Formulario de comentarios reutilizable
│
├── css/
│   ├── estilos.css           # Estilos generales del sitio
│   └── formulario.css        # Estilos específicos del        formulario de comentarios
│   └──comentarios-publicados,css
│
├── img/
│   └── ...                   # Todas las imágenes utilizadas en los redea sociales
│
├── js/
│   └── comentarios.js        # Lógica cliente: captura, validación y envío de comentarios
│
├── favicon.ico               # Ícono del sitio
├── index.html                # Página principal
├── README.md                 # Documentación del proyecto
└── script.js                 # Script general del sitio
```

---

##  Flujo de comentarios

1. **Frontend (`formulario-comentario.html`)**
   - Formulario accesible al final de cada artículo.
   - Campos: `nombre`, `comentario`.
   - Se carga dinámicamente en cada página.

2. **Cliente (`comentarios.js`)**
   - Captura el evento `submit`.
   - Valida y guarda comentarios en `localStorage`.
   - Envía datos al backend (`/api/nuevo-comentario`).
   - Renderiza lista de comentarios en `#comentarios-publicados`.
  - comentarios-publicados.css
  - Define el estilo visual de la sección de comentarios       publicados


3. **Backend (`api/nuevo-comentario.js`)**
   - Recibe solicitudes `POST`.
   - Valida método y contenido.
   - Usa `process.env.GITHUB_TOKEN` para autenticarse.
   - Crea un nuevo Issue en GitHub con:
     - **Título** = comentario.
     - **Cuerpo** = nombre del remitente.
   - Devuelve el Issue creado en JSON.

4. **GitHub Issues**
   - Cada comentario se registra como Issue público.
   - Moderación comunitaria: se pueden cerrar, etiquetar o eliminar Issues.

---

##  Requisitos

- **Token de GitHub**  
  Configurar en el entorno:
  ```
  GITHUB_TOKEN=tu_token_personal
  ```
  El token debe tener permisos para crear Issues en el repositorio.

- **Repositorio GitHub**  
  Los comentarios se crean en:
  ```
  https://github.com/AWilly0897/Pensamiento-Abierto-Primera-Edicion
  ```

---

## 🌐 Transparencia

- Todos los comentarios son **visibles y auditables** en GitHub.  
- El sistema evita dependencias externas opacas: se apoya en **GitHub Pages + Issues**.  
- Moderación manual y pública: cada Issue puede ser gestionado con etiquetas, cierres o eliminación.

---
## Nota sobre el despliegue

Este proyecto está **desplegado en Vercel** para facilitar la ejecución del backend (`api/nuevo-comentario.js`).  
El sistema, sin embargo, está diseñado para funcionar de manera **independiente de Vercel**, utilizando **GitHub Pages** como hosting oficial y **GitHub Issues** como base de comentarios públicos.  

El **token de GitHub** (`GITHUB_TOKEN`) se guarda en las variables de entorno del servidor.  
Para ejecutar en otro entorno Node.js, basta con definir esa variable en el sistema operativo o en un archivo `.env`.
 

