// Todo el contenido de la web vive en este archivo.
// Para cambiar textos, proyectos o enlaces, editá solo acá.
//
// Las fotos y videos de cada proyecto se generan con scripts/procesar-medios.py
// y quedan listados en src/content/piezas.json (no hace falta editarlo a mano).

import piezasJson from "./piezas.json";

export type Categoria = "Diseño" | "Audiovisual" | "Fotografía" | "Publicidad";

export type Pieza = {
  tipo: "imagen" | "video";
  src: string;
  poster?: string;
  ancho: number;
  alto: number;
};

export type Proyecto = {
  // Nombre de la carpeta en public/trabajos y de la dirección web (/trabajos/<slug>).
  slug: string;
  titulo: string;
  cliente: string;
  año?: string;
  categoria: Categoria;
  resumen: string;
  // Número de la pieza que se usa como portada (1 = la primera). Por defecto, 1.
  portada?: number;
};

export const estudio = {
  nombre: "Rossetti Studio",
  lema: "Diseño, imagen y movimiento para marcas que quieren ser recordadas.",
  descripcion:
    "Estudio creativo de diseño, audiovisual, fotografía y publicidad. Cada proyecto empieza por entender la marca y termina en piezas que se ven, se sienten y funcionan.",
  ubicacion: "Resistencia, Chaco · Argentina",
  logo: "/marca/logotipo.png",
  // Clips verticales de la portada (se muestran tres, uno al lado del otro).
  reel: [
    "/trabajos/munoz-marchesi-audiovisual/01.mp4",
    "/trabajos/clinica-san-gabriel-audiovisual/03.mp4",
    "/trabajos/munoz-marchesi-audiovisual/03.mp4",
  ],
  // Clip horizontal que va debajo de los tres verticales, a todo el ancho.
  reelHorizontal: "/trabajos/mauro-passarino/01.mp4",
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
    incluye: ["Identidad de marca", "Logotipos", "Papelería", "Ploteos y señalética"],
  },
  {
    nombre: "Audiovisual",
    detalle: "Historias en movimiento, desde la idea hasta la edición final.",
    incluye: ["Spots publicitarios", "Reels para redes", "Videos institucionales", "Edición y color"],
  },
  {
    nombre: "Fotografía",
    detalle: "Imágenes que muestran el producto, el espacio y las personas.",
    incluye: ["Producto", "Retrato", "Eventos", "Locales y espacios"],
  },
  {
    nombre: "Publicidad",
    detalle: "Campañas pensadas para comunicar y para vender.",
    incluye: ["Campañas en redes", "Placas y promociones", "Concepto creativo", "Banners web"],
  },
];

// El orden de esta lista es el orden en la web.
export const proyectos: Proyecto[] = [
  {
    slug: "munoz-marchesi-audiovisual",
    titulo: "Reels y spots",
    cliente: "Muñoz Marchesi Motos",
    año: "2026",
    categoria: "Audiovisual",
    resumen:
      "Contenido audiovisual para redes de la concesionaria: spots de lanzamiento, presentaciones de modelos y entrevistas con pilotos.",
  },
  {
    slug: "clinica-san-gabriel-identidad",
    titulo: "Sistema de marcas",
    cliente: "Clínica San Gabriel",
    año: "2026",
    categoria: "Diseño",
    resumen:
      "Identidad para la clínica y sus unidades, como Hospital de Día y el Centro de Día y Hogar Crecer, con un lenguaje común.",
  },
  {
    slug: "munoz-marchesi-fotografia",
    titulo: "Fotografía de producto y eventos",
    cliente: "Muñoz Marchesi Motos",
    año: "2026",
    categoria: "Fotografía",
    resumen:
      "Fotos de motos, detalles, retratos en estudio, el local y las jornadas de manejo con clientes.",
  },
  {
    slug: "clinica-san-gabriel-audiovisual",
    titulo: "Videos sobre salud mental",
    portada: 4,
    cliente: "Clínica San Gabriel",
    año: "2026",
    categoria: "Audiovisual",
    resumen:
      "Videos para redes que muestran el día a día de la clínica y acercan temas de salud mental con un tono cálido.",
  },
  {
    slug: "munoz-marchesi-campanas",
    titulo: "Campañas en redes",
    cliente: "Muñoz Marchesi Motos",
    año: "2026",
    categoria: "Publicidad",
    resumen:
      "Placas de financiación para CFMoto y Triumph, adaptadas a cada formato con un sistema gráfico reconocible.",
  },
  {
    slug: "munoz-marchesi-identidad",
    titulo: "Identidad visual",
    cliente: "Muñoz Marchesi Motos",
    año: "2026",
    categoria: "Diseño",
    resumen: "Logotipo, claim «Siempre a tu lado», papelería, ploteo de vehículos y piezas digitales.",
  },
  {
    slug: "clinica-san-gabriel-campanas",
    titulo: "Comunicación en redes",
    cliente: "Clínica San Gabriel",
    año: "2026",
    categoria: "Publicidad",
    resumen:
      "Campañas de concientización como Septiembre Amarillo, fechas patrias, búsquedas laborales e invitaciones.",
  },
  {
    slug: "mauro-passarino",
    titulo: "Video para YouTube",
    cliente: "Mauro Passarino",
    categoria: "Audiovisual",
    resumen: "Rodaje y edición de un video para su canal de YouTube.",
  },
];

const piezas = piezasJson as Record<string, Pieza[]>;

export function piezasDe(slug: string): Pieza[] {
  return piezas[slug] ?? [];
}

export function portadaDe(slug: string): Pieza | undefined {
  const n = proyectos.find((p) => p.slug === slug)?.portada ?? 1;
  return piezas[slug]?.[n - 1] ?? piezas[slug]?.[0];
}
