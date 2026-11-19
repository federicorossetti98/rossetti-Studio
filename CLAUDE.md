# Rossetti Studio

Portfolio web de Rossetti Studio (Diseño, Audiovisual, Fotografía, Publicidad), en Resistencia, Chaco, Argentina.

## Idioma

- Responder **siempre en español**, también en mensajes cortos, avisos y explicaciones técnicas.
- Los textos de la web van en español rioplatense (voseo: "escribinos", "¿tenés un proyecto?").
- Mensajes de commit y comentarios en el código, también en español.

## Proyecto

- Next.js (App Router) + Tailwind CSS. Antes de escribir código, leer `AGENTS.md`.
- Todo el contenido (textos, proyectos, redes) está en `src/content/site.ts`.
- Logos en `public/marca/`. Estilo: editorial minimalista.
- Skills de diseño de Emil Kowalski en `.claude/skills/`. No borrarlas.

@AGENTS.md

## Cómo trabajamos

- Publicar = subir a `main`. Vercel (equipo y proyecto `rossetti-studio`) despliega solo en https://rossetti-studio.vercel.app.
- Fotos y videos nuevos: se procesan con `scripts/procesar-medios.py` (WebP de 1600 px, clips MP4 de 6 s sin sonido) y quedan listados en `src/content/piezas.json`. La primera pieza de cada proyecto es la portada.
- Las carpetas compartidas de Google Drive se pueden listar con `https://drive.google.com/embeddedfolderview?id=<ID>` y bajar con `https://drive.usercontent.google.com/download?id=<ID>&export=download`.
- Imagen para compartir: `src/app/opengraph-image.jpg` y `twitter-image.jpg` (1200×630). Si se conecta un dominio propio, cambiar `metadataBase` en `src/app/layout.tsx`.
- Títulos de servicios en Inter Tight Bold; los acentos en cursiva (`<em>`) usan Instrument Serif.
