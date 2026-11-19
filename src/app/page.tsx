import Image from "next/image";
import { estudio, servicios } from "@/content/site";
import { Media } from "@/components/Media";
import { Reveal } from "@/components/Reveal";
import { Trabajos } from "@/components/Trabajos";

const nav = [
  { href: "#trabajos", label: "Trabajos" },
  { href: "#servicios", label: "Servicios" },
  { href: "#estudio", label: "Estudio" },
  { href: "#contacto", label: "Contacto" },
];

function Logo() {
  if (estudio.logo) {
    return <Image src={estudio.logo} alt={estudio.nombre} width={1582} height={384} className="h-9 w-auto" priority />;
  }
  return <span className="text-[15px] font-semibold tracking-tight">{estudio.nombre}</span>;
}

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line/70 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-10">
          <a href="#" aria-label="Inicio">
            <Logo />
          </a>
          <nav className="hidden gap-8 text-sm text-muted md:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="transition-colors duration-200 hover:text-ink">
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href={estudio.instagram.url}
            target="_blank"
            rel="noreferrer"
            className="press rounded-full bg-ink px-4 py-2 text-sm text-paper"
          >
            Escribinos
          </a>
        </div>
      </header>

      <main>
        {/* Portada */}
        <section className="mx-auto max-w-[1400px] px-4 pt-16 pb-12 md:px-10 md:pt-28">
          <Reveal>
            <p className="mb-6 text-xs uppercase tracking-[0.18em] text-muted">
              Diseño · Audiovisual · Fotografía · Publicidad — {estudio.ubicacion}
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="max-w-[16ch] text-[clamp(2.6rem,7.5vw,7rem)] leading-[0.95] font-medium tracking-[-0.035em] text-balance">
              Imagen y movimiento para marcas que quieren ser{" "}
              <em className="font-serif font-normal tracking-[-0.01em]">recordadas.</em>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-8 max-w-[46ch] text-lg leading-relaxed text-muted">{estudio.descripcion}</p>
          </Reveal>
        </section>

        <section aria-label="Showreel" className="mx-auto max-w-[1400px] px-4 md:px-10">
          <Reveal media delay={200}>
            <div className="relative aspect-[16/9] overflow-hidden">
              <Media video={estudio.reel} alt={`Showreel de ${estudio.nombre}`} etiqueta="Showreel" prioridad />
            </div>
          </Reveal>
        </section>

        {/* Trabajos */}
        <section id="trabajos" className="mx-auto max-w-[1400px] scroll-mt-20 px-4 pt-32 md:px-10">
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="text-[clamp(2rem,4.5vw,3.75rem)] leading-none font-medium tracking-[-0.03em]">
              Trabajos <em className="font-serif font-normal">seleccionados</em>
            </h2>
          </div>
          <Trabajos />
        </section>

        {/* Servicios */}
        <section id="servicios" className="mx-auto max-w-[1400px] scroll-mt-20 px-4 pt-40 md:px-10">
          <h2 className="mb-12 text-[clamp(2rem,4.5vw,3.75rem)] leading-none font-medium tracking-[-0.03em]">
            Servicios
          </h2>
          <ol className="border-t border-line">
            {servicios.map((s, i) => (
              <li key={s.nombre} className="border-b border-line">
                <Reveal className="grid gap-4 py-8 md:grid-cols-12 md:gap-6 md:py-10">
                  <span className="text-sm text-muted tabular-nums md:col-span-1">0{i + 1}</span>
                  <h3 className="font-serif text-4xl md:col-span-4 md:text-5xl">{s.nombre}</h3>
                  <p className="text-lg leading-relaxed md:col-span-4">{s.detalle}</p>
                  <ul className="text-sm leading-7 text-muted md:col-span-3">
                    {s.incluye.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        {/* Estudio */}
        <section id="estudio" className="mx-auto max-w-[1400px] scroll-mt-20 px-4 pt-40 md:px-10">
          <div className="grid gap-10 md:grid-cols-12">
            <p className="text-xs uppercase tracking-[0.18em] text-muted md:col-span-3">El estudio</p>
            <Reveal className="md:col-span-9">
              <p className="text-[clamp(1.6rem,3.2vw,2.75rem)] leading-[1.15] tracking-[-0.02em] text-balance">
                {estudio.nombre} une diseño, cámara y estrategia en un mismo lugar. Así cada marca recibe una
                identidad, unas fotos y unos videos que hablan{" "}
                <em className="font-serif">el mismo idioma.</em>
              </p>
            </Reveal>
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="mx-auto max-w-[1400px] scroll-mt-20 px-4 pt-40 pb-16 md:px-10">
          <div className="relative overflow-hidden bg-ink px-6 py-16 text-paper md:px-14 md:py-24">
            <Image
              src="/marca/isotipo-claro.png"
              alt=""
              width={900}
              height={792}
              className="pointer-events-none absolute -right-10 -bottom-12 w-56 opacity-10 md:right-10 md:bottom-10 md:w-80"
            />
            <p className="mb-6 text-xs uppercase tracking-[0.18em] text-paper/60">¿Tenés un proyecto?</p>
            <h2 className="max-w-[18ch] text-[clamp(2.2rem,6vw,5.5rem)] leading-[0.95] font-medium tracking-[-0.035em]">
              Hablemos por <em className="font-serif font-normal">Instagram.</em>
            </h2>
            <a
              href={estudio.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="press mt-12 inline-flex items-center gap-3 rounded-full bg-paper px-6 py-3.5 text-ink"
            >
              Enviar mensaje a {estudio.instagram.usuario}
              <span aria-hidden>→</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 pb-10 text-sm text-muted md:flex-row md:justify-between md:px-10">
        <span>
          © 2026 {estudio.nombre} · {estudio.ubicacion}
        </span>
        <div className="flex gap-6">
          <a href={estudio.instagram.url} target="_blank" rel="noreferrer" className="hover:text-ink">
            Instagram
          </a>
          {estudio.otrasRedes.map((r) => (
            <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="hover:text-ink">
              {r.nombre}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}
