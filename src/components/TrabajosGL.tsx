"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { portadaDe, type Proyecto } from "@/content/site";
import { Reveal } from "./Reveal";

// Grilla de trabajos dibujada con WebGL.
//
// La maqueta sigue siendo HTML (enlaces, textos, accesibilidad). Un único canvas
// fijo sobre la pantalla dibuja cada portada justo encima de su caja, y le suma:
//   · una entrada que descubre la portada de abajo hacia arriba, y después
//     la etiqueta y los textos de abajo,
//   · un paralaje: la imagen se desliza un poco dentro de su marco al scrollear,
//   · un zoom suave y el video del proyecto al pasar el mouse,
//   · una "lente de cristal" en los bordes de la pantalla, que curva y separa
//     en colores las portadas al entrar y salir del encuadre.
// Si el navegador no tiene WebGL, se ven las imágenes HTML de siempre.

const BANDA = 0.08; // alto de cada banda de lente, en fracción de la pantalla
const DISPERSION = 0.018; // separación de colores dentro de la lente
const ENTRADA_MS = 850; // duración de la entrada de cada portada
const ESCALON_MS = 80; // separación entre portadas que entran juntas

const TILE_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  // El mundo usa píxeles con y hacia abajo: damos vuelta la v para que la
  // textura no quede invertida (vUv.y = 0 en el borde de abajo de la portada).
  vUv = vec2(uv.x, 1.0 - uv.y);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const TILE_FRAG = /* glsl */ `
uniform sampler2D uFoto;
uniform sampler2D uVideo;
uniform float uMezcla;
uniform float uZoom;
uniform float uRevelar;
uniform float uParalaje;
uniform vec2 uCubrir;
uniform vec3 uFondo;
varying vec2 vUv;
void main() {
  // Entrada: la portada se descubre de abajo hacia arriba (vUv.y = 0 abajo),
  // igual que las otras imágenes del sitio.
  if (vUv.y > uRevelar) {
    gl_FragColor = vec4(uFondo, 1.0);
    return;
  }
  // object-fit: cover, más un zoom que acompaña la entrada y el hover.
  float zoom = uZoom + (1.0 - uRevelar) * 0.12;
  vec2 uv = (vUv - 0.5) * uCubrir / zoom + 0.5;
  // Paralaje: el margen que deja el zoom permite correr la imagen sin ver bordes.
  float margen = 0.5 - 0.5 * uCubrir.y / zoom;
  uv.y += clamp(uParalaje, -1.0, 1.0) * margen * 0.6;
  vec3 foto = texture2D(uFoto, uv).rgb;
  vec3 video = texture2D(uVideo, uv).rgb;
  gl_FragColor = vec4(mix(foto, video, uMezcla), 1.0);
}`;

const LENTE_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const LENTE_FRAG = /* glsl */ `
uniform sampler2D tEscena;
uniform float uBanda;
uniform float uDispersion;
uniform float uArriba; // fracción de pantalla tapada por el encabezado
varying vec2 vUv;

float caida(float t) { return 1.0 - sqrt(max(0.0, 1.0 - t * t)); }

void main() {
  float y = vUv.y; // 0 abajo, 1 arriba
  float tope = 1.0 - uArriba; // la banda de arriba empieza bajo el encabezado
  float t = 0.0;
  float dir = 0.0;
  // t vale 0 en el borde interno de la banda y 1 en el borde de la pantalla.
  if (y < uBanda) { t = 1.0 - y / uBanda; dir = 1.0; }
  else if (y > tope - uBanda && y <= tope) { t = 1.0 - (tope - y) / uBanda; dir = -1.0; }

  if (dir == 0.0) {
    gl_FragColor = texture2D(tEscena, vUv);
    return;
  }

  // Refracción: la muestra se corre hacia el borde interno, como una lente.
  float ys = y + dir * caida(t) * uBanda;

  // Dispersión espectral: rojo, verde y azul se separan a lo largo de y.
  float d = t * uDispersion;
  float wr = smoothstep(0.8, 0.2, t);
  float wg = smoothstep(0.0, 0.5, t) * smoothstep(1.0, 0.5, t);
  float wb = smoothstep(0.2, 0.8, t);
  vec3 acc = vec3(0.0);
  vec3 pesos = vec3(0.0);
  float alfa = 0.0;
  for (int i = 0; i < 16; i++) {
    float f = float(i) / 15.0 - 0.5;
    vec4 c = texture2D(tEscena, vec2(vUv.x, ys + f * d * 2.0));
    // Cada canal pesa más en un extremo distinto de la muestra.
    vec3 w = vec3(
      mix(1.0, 0.5 - f, wr + 0.35),
      mix(1.0, 1.0 - abs(f) * 2.0, wg),
      mix(1.0, 0.5 + f, wb + 0.35)
    );
    w = max(w, vec3(0.0));
    acc += c.rgb * w;
    pesos += w;
    alfa += c.a;
  }
  vec3 col = acc / max(pesos, vec3(0.0001));
  gl_FragColor = vec4(col, alfa / 16.0);
}`;

type Tile = {
  mesh: THREE.Mesh;
  mat: THREE.ShaderMaterial;
  foto?: THREE.Texture;
  lista: boolean;
  videoSrc?: string;
  video?: HTMLVideoElement;
  videoTex?: THREE.VideoTexture;
  mezcla: number;
  encima: number;
  revelar: number;
  desde: number; // momento en que empezó a verse (para escalonar la entrada)
};

function urlFoto(slug: string) {
  const p = portadaDe(slug);
  if (!p) return undefined;
  return p.tipo === "video" ? p.poster : p.src;
}

function urlVideo(slug: string) {
  const p = portadaDe(slug);
  return p?.tipo === "video" ? p.src : undefined;
}

// Curva de salida (expo.out).
const expoOut = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));

export function TrabajosGL({ proyectos }: { proyectos: Proyecto[] }) {
  const capaRef = useRef<HTMLDivElement>(null);
  // Cajas HTML de cada portada, por slug. El canvas las mide en cada cuadro.
  const cajas = useRef(new Map<string, HTMLDivElement>());
  const hover = useRef<string | null>(null);

  useEffect(() => {
    const capa = capaRef.current;
    if (!capa) return;

    // En pantallas táctiles no se usa WebGL: el scroll nativo del celular corre
    // por su cuenta y el canvas lo sigue con un cuadro de atraso, lo que se ve
    // como un temblor borroso; además la lente difumina casi toda la portada.
    // Ahí quedan las imágenes HTML, con la misma entrada que el resto del sitio.
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    // Un canvas nuevo en cada montaje: en desarrollo React monta dos veces, y un
    // canvas cuyo contexto ya se liberó no vuelve a dibujar.
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";

    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    } catch {
      renderer = null; // Sin WebGL: quedan las imágenes HTML.
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Se mide la capa (no window.innerWidth) para no contar la barra de scroll.
    let W = capa.clientWidth;
    let H = capa.clientHeight;

    const escena = new THREE.Scene();
    // Una unidad del mundo es un píxel CSS, y = 0 arriba.
    const camara = new THREE.OrthographicCamera(0, W, 0, H, -10, 10);
    const plano = new THREE.PlaneGeometry(1, 1);
    const destino = new THREE.WebGLRenderTarget(W * dpr, H * dpr, { samples: 4 });

    // Pase de pantalla completa con la lente.
    const lenteMat = new THREE.ShaderMaterial({
      uniforms: {
        tEscena: { value: destino.texture },
        uBanda: { value: BANDA },
        uDispersion: { value: DISPERSION },
        uArriba: { value: 0 },
      },
      vertexShader: LENTE_VERT,
      fragmentShader: LENTE_FRAG,
      depthTest: false,
      depthWrite: false,
    });
    const lenteEscena = new THREE.Scene();
    lenteEscena.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), lenteMat));
    const lenteCamara = new THREE.Camera();

    // Color de fondo de las cajas (--color-tile) para la entrada.
    // (Vector3 y no Color, para que three no lo convierta a espacio lineal.)
    const fondo = new THREE.Vector3(230 / 255, 226 / 255, 218 / 255);
    const vacio = new THREE.DataTexture(new Uint8Array([230, 226, 218, 255]), 1, 1);
    vacio.needsUpdate = true;

    const cargador = new THREE.TextureLoader();
    const tiles = new Map<string, Tile>();

    if (renderer) {
      capa.appendChild(canvas);
      renderer.setPixelRatio(dpr);
      renderer.setSize(W, H, false);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
      // Las imágenes HTML de respaldo se ocultan: ahora dibuja el canvas.
      document.documentElement.dataset.gl = "on";
    }

    function crearTile(slug: string, ahora: number): Tile {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uFoto: { value: vacio },
          uVideo: { value: vacio },
          uMezcla: { value: 0 },
          uZoom: { value: 1 },
          uRevelar: { value: reducir ? 1 : 0 },
          uParalaje: { value: 0 },
          uCubrir: { value: new THREE.Vector2(1, 1) },
          uFondo: { value: fondo },
        },
        vertexShader: TILE_VERT,
        fragmentShader: TILE_FRAG,
        depthTest: false,
        depthWrite: false,
        // La cámara tiene el eje y invertido, así que los triángulos quedan
        // "de espaldas": sin DoubleSide no se dibujaría nada.
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(plano, mat);
      mesh.frustumCulled = false;
      mesh.visible = false;
      escena.add(mesh);
      const tile: Tile = {
        mesh,
        mat,
        lista: false,
        videoSrc: urlVideo(slug),
        mezcla: 0,
        encima: 0,
        revelar: reducir ? 1 : 0,
        desde: ahora,
      };
      const src = urlFoto(slug);
      if (src) {
        cargador.load(src, (tex) => {
          tex.colorSpace = THREE.NoColorSpace;
          tile.foto = tex;
          tile.lista = true;
          mat.uniforms.uFoto.value = tex;
          if (!tile.videoTex) mat.uniforms.uVideo.value = tex;
        });
      }
      return tile;
    }

    function arrancarVideo(tile: Tile) {
      if (!tile.videoSrc || tile.video) return;
      const v = document.createElement("video");
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.preload = "auto";
      v.src = tile.videoSrc;
      tile.video = v;
      tile.videoTex = new THREE.VideoTexture(v);
      tile.videoTex.colorSpace = THREE.NoColorSpace;
      tile.mat.uniforms.uVideo.value = tile.videoTex;
    }

    const alRedimensionar = () => {
      W = capa.clientWidth;
      H = capa.clientHeight;
      if (!renderer) return;
      renderer.setSize(W, H, false);
      destino.setSize(W * dpr, H * dpr);
      camara.right = W;
      camara.bottom = H;
      camara.updateProjectionMatrix();
    };
    const observador = new ResizeObserver(alRedimensionar);
    observador.observe(capa);

    const encabezado = document.querySelector("header");
    let raf = 0;
    let ultimo = performance.now();
    // Cuántas portadas empezaron a entrar en este cuadro (para escalonarlas).
    let entradasEnCuadro = 0;

    const cuadro = (ahora: number) => {
      raf = requestAnimationFrame(cuadro);
      const dt = Math.min(0.05, (ahora - ultimo) / 1000);
      ultimo = ahora;
      const suave = (k: number) => 1 - Math.exp(-dt * k);

      if (!renderer) return;

      // Las portadas que ya no están en la lista (por el filtro) se ocultan
      // y vuelven a entrar con animación si se muestran de nuevo.
      for (const [slug, tile] of tiles) {
        if (!cajas.current.has(slug)) {
          tile.mesh.visible = false;
          tile.video?.pause();
          if (!reducir) tile.revelar = 0;
          tile.desde = -1;
        }
      }

      entradasEnCuadro = 0;
      let hayAlgo = false;
      for (const [slug, caja] of cajas.current) {
        const r = caja.getBoundingClientRect();
        // Se empiezan a cargar un poco antes de entrar en pantalla.
        const cerca = r.bottom > -H * 0.6 && r.top < H * 2.6 && r.width > 0;
        let tile = tiles.get(slug);
        if (!tile) {
          if (!cerca) continue;
          tile = crearTile(slug, -1);
          tiles.set(slug, tile);
        }

        const enPantalla = r.bottom > 0 && r.top < H && r.width > 0;
        tile.mesh.visible = enPantalla;
        if (!enPantalla) {
          tile.video?.pause();
          continue;
        }
        hayAlgo = true;

        tile.mesh.position.set(r.left + r.width / 2, r.top + r.height / 2, 0);
        tile.mesh.scale.set(r.width, r.height, 1);

        // Entrada: arranca cuando la foto está lista y la caja asoma un 15%.
        if (tile.lista && tile.desde < 0 && r.top < H * 0.85) {
          const retraso = entradasEnCuadro * ESCALON_MS;
          tile.desde = ahora + retraso;
          entradasEnCuadro++;
          // La etiqueta y los textos entran por CSS, sincronizados con la portada.
          const li = caja.closest("li");
          if (li) {
            li.style.setProperty("--retraso", `${retraso}ms`);
            li.dataset.entrada = "on";
          }
        }
        if (tile.desde >= 0 && tile.revelar < 1) {
          tile.revelar = expoOut(Math.max(0, (ahora - tile.desde) / ENTRADA_MS));
        }
        tile.mat.uniforms.uRevelar.value = tile.lista ? tile.revelar : 0;

        // object-fit: cover según la proporción de la foto.
        const img = tile.foto?.image as HTMLImageElement | undefined;
        if (img && img.width) {
          const ta = img.width / img.height;
          const pa = r.width / r.height;
          (tile.mat.uniforms.uCubrir.value as THREE.Vector2).set(ta > pa ? pa / ta : 1, ta > pa ? 1 : ta / pa);
        }

        // Hover: zoom suave y, si el proyecto tiene video, el video.
        const esta = hover.current === slug;
        tile.encima += ((esta ? 1 : 0) - tile.encima) * suave(6);
        // Zoom base de 1.06 para dejar margen al paralaje.
        tile.mat.uniforms.uZoom.value = reducir ? 1 : 1.06 + tile.encima * 0.06;

        // Paralaje: -1 cuando la portada está arriba de todo, 1 abajo de todo.
        const centro = r.top + r.height / 2;
        tile.mat.uniforms.uParalaje.value = reducir ? 0 : (centro - H / 2) / (H / 2 + r.height / 2);

        const conVideo = esta && !reducir && !!tile.videoSrc;
        if (conVideo) {
          arrancarVideo(tile);
          if (tile.video?.paused) tile.video.play().catch(() => {});
        } else if (tile.video && !tile.video.paused && tile.mezcla < 0.02) {
          tile.video.pause();
        }
        const listo = !!tile.video && tile.video.readyState >= 2;
        const objetivo = conVideo && listo ? 1 : 0;
        // Fundido entre foto y video (más bajo = más lento).
        tile.mezcla += (objetivo - tile.mezcla) * suave(4.5);
        tile.mat.uniforms.uMezcla.value = tile.mezcla;
      }

      // La banda de arriba de la lente empieza justo debajo del encabezado.
      const bajoEncabezado = encabezado ? Math.max(0, encabezado.getBoundingClientRect().bottom) : 0;
      lenteMat.uniforms.uArriba.value = bajoEncabezado / H;

      renderer.setRenderTarget(destino);
      renderer.clear();
      if (hayAlgo) renderer.render(escena, camara);
      renderer.setRenderTarget(null);
      renderer.clear();
      if (hayAlgo) renderer.render(lenteEscena, lenteCamara);
    };
    raf = requestAnimationFrame(cuadro);

    return () => {
      cancelAnimationFrame(raf);
      observador.disconnect();
      delete document.documentElement.dataset.gl;
      for (const tile of tiles.values()) {
        tile.mat.dispose();
        tile.foto?.dispose();
        tile.videoTex?.dispose();
        if (tile.video) {
          tile.video.pause();
          tile.video.removeAttribute("src");
          tile.video.load();
        }
      }
      plano.dispose();
      vacio.dispose();
      lenteMat.dispose();
      destino.dispose();
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
      canvas.remove();
    };
  }, []);

  return (
    <>
      <div ref={capaRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1]" />
      <ul className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2">
        {proyectos.map((p, i) => {
          const foto = urlFoto(p.slug);
          return (
            <li key={p.slug} className={i % 2 === 1 ? "md:mt-24" : ""}>
              <Link
                href={`/trabajos/${p.slug}`}
                className="group block"
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") hover.current = p.slug;
                }}
                onPointerLeave={() => {
                  if (hover.current === p.slug) hover.current = null;
                }}
                onFocus={() => (hover.current = p.slug)}
                onBlur={() => {
                  if (hover.current === p.slug) hover.current = null;
                }}
              >
                <div
                  ref={(el) => {
                    if (el) cajas.current.set(p.slug, el);
                    else cajas.current.delete(p.slug);
                  }}
                  className="relative aspect-[4/5] overflow-hidden bg-tile"
                >
                  {/* Respaldo HTML (celulares y navegadores sin WebGL), con la
                      misma entrada de abajo hacia arriba que el resto del sitio. */}
                  {foto && (
                    <Reveal media delay={(i % 2) * 80} className="gl-respaldo absolute inset-0">
                      <Image
                        src={foto}
                        alt={`${p.titulo} para ${p.cliente}`}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </Reveal>
                  )}
                  {/* Etiqueta: va por encima del canvas, con fondo sólido (sin desenfoque). */}
                  <span className="entrada entrada-etiqueta absolute top-2 left-2 z-[2] flex gap-3 rounded-[4px] bg-ink/75 px-2 pt-1.5 pb-1 text-xs font-medium text-paper">
                    <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span>{p.categoria}</span>
                  </span>
                </div>
                <div className="entrada entrada-pie mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3 text-sm">
                  <span className="font-medium">
                    {p.cliente} <span className="text-muted">— {p.titulo}</span>
                    {/* Flecha que asoma al pasar el mouse. */}
                    <span
                      aria-hidden="true"
                      className="ml-1.5 inline-block -translate-x-1.5 opacity-0 transition-[opacity,translate] duration-300 ease-[var(--ease-out)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                    >
                      →
                    </span>
                  </span>
                  <span className="shrink-0 text-muted">
                    {p.categoria}
                    {p.año ? ` · ${p.año}` : ""}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
