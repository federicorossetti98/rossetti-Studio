// Todo el contenido de la web vive en este archivo.
// Para cambiar textos, proyectos o enlaces, edita solo aquí.

export type Categoria = "Diseño" | "Audiovisual" | "Fotografía" | "Publicidad";

export type Proyecto = {
  titulo: string;
  cliente: string;
  año: string;
  categoria: Categoria;
  // Ruta dentro de /public, por ejemplo "/trabajos/marca-x.jpg".
  // Si se deja vacío, se muestra un recuadro "pendiente".
  imagen?: string;
  // Opcional: video corto en /public (mp4) que reemplaza a la imagen.
  video?: string;
  // Formato del recuadro en la grilla.
  formato?: "horizontal" | "vertical" | "cuadrado";
};

export const estudio = {
  nombre: "Rossetti Studio",
  lema: "Diseño, imagen y movimiento para marcas que quieren ser recordadas.",
  descripcion:
    "Estudio creativo de diseño, audiovisual, fotografía y publicidad. Cada proyecto empieza por entender la marca y termina en piezas que se ven, se sienten y funcionan.",
  ubicacion: "Resistencia, Chaco · Argentina",
  // Archivo en /public. Si no existe todavía, se muestra el nombre en texto.
  logo: "/marca/logotipo.png",
  // Video de presentación (showreel) en /public, por ejemplo "/reel.mp4".
  reel: "",
  instagram: {
    usuario: "@rossetti.studio",
    url: "https://www.instagram.com/rossetti.studio/",
  },
  otrasRedes: [] as { nombre: string; url: string }[],
};

export const servicios: { nombre: Categoria; detalle: string; incluye: string[] }[] = [
  {
    nombre: "Diseño",
    detalle: "Identidad visual y piezas gráficas con criterio y coherencia.",
    incluye: ["Identidad de marca", "Logotipos", "Packaging", "Piezas editoriales"],
  },
  {
    nombre: "Audiovisual",
    detalle: "Historias en movimiento, desde la idea hasta la edición final.",
    incluye: ["Spots y reels", "Videos institucionales", "Edición y color", "Motion graphics"],
  },
  {
    nombre: "Fotografía",
    detalle: "Imágenes que muestran el producto, el espacio y las personas.",
    incluye: ["Producto", "Retrato y equipo", "Gastronomía", "Eventos"],
  },
  {
    nombre: "Publicidad",
    detalle: "Campañas pensadas para comunicar y para convertir.",
    incluye: ["Concepto creativo", "Campañas en redes", "Contenido para anuncios", "Dirección de arte"],
  },
];

// Reemplaza estos recuadros con tus proyectos reales.
export const proyectos: Proyecto[] = [
  { titulo: "Proyecto 01", cliente: "Cliente", año: "2026", categoria: "Diseño", formato: "horizontal" },
  { titulo: "Proyecto 02", cliente: "Cliente", año: "2026", categoria: "Fotografía", formato: "vertical" },
  { titulo: "Proyecto 03", cliente: "Cliente", año: "2026", categoria: "Audiovisual", formato: "cuadrado" },
  { titulo: "Proyecto 04", cliente: "Cliente", año: "2025", categoria: "Publicidad", formato: "vertical" },
  { titulo: "Proyecto 05", cliente: "Cliente", año: "2025", categoria: "Diseño", formato: "cuadrado" },
  { titulo: "Proyecto 06", cliente: "Cliente", año: "2025", categoria: "Fotografía", formato: "horizontal" },
];
