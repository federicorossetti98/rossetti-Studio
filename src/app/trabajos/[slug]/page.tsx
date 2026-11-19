import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Media } from "@/components/Media";
import { Reveal } from "@/components/Reveal";
import { estudio, piezasDe, portadaDe, proyectos } from "@/content/site";

export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/trabajos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = proyectos.find((x) => x.slug === slug);
  if (!p) return {};
  const portada = portadaDe(slug);
  const imagen = portada?.tipo === "video" ? portada.poster : portada?.src;
  return {
    title: `${p.cliente} — ${p.titulo} | ${estudio.nombre}`,
    description: p.resumen,
    openGraph: { title: `${p.cliente} — ${p.titulo}`, description: p.resumen, images: imagen ? [imagen] : [] },
  };
}

export default async function ProyectoPage({ params }: PageProps<"/trabajos/[slug]">) {
  const { slug } = await params;
  const i = proyectos.findIndex((x) => x.slug === slug);
  if (i === -1) notFound();
  const p = proyectos[i];
  const siguiente = proyectos[(i + 1) % proyectos.length];
  const piezas = piezasDe(slug);

  return (
    <main className="mx-auto max-w-[1400px] px-4 md:px-10">
      <section className="pt-12 pb-16 md:pt-20 md:pb-24">
        <Link href="/#trabajos" className="text-sm text-muted transition-colors duration-200 hover:text-ink">
          ← Todos los trabajos
        </Link>
        <Reveal>
          <p className="mt-12 mb-5 text-xs uppercase tracking-[0.18em] text-muted">
            {p.categoria}
            {p.año ? ` · ${p.año}` : ""}
          </p>
        </Reveal>
        <Reveal delay={60}>
          <h1 className="max-w-[18ch] text-[clamp(2.4rem,6.5vw,6rem)] leading-[0.95] font-medium tracking-[-0.035em] text-balance">
            {p.cliente} <em className="font-serif font-normal tracking-[-0.01em]">{p.titulo}</em>
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-muted">{p.resumen}</p>
        </Reveal>
      </section>

      <ul className="columns-1 gap-4 md:columns-2 md:gap-6 lg:columns-3">
        {piezas.map((pieza, n) => (
          <li key={pieza.src} className="mb-4 break-inside-avoid md:mb-6">
            <Reveal media delay={(n % 3) * 70}>
              <div className="overflow-hidden bg-tile">
                <Media
                  pieza={pieza}
                  modo="natural"
                  prioridad={n < 2}
                  alt={`${p.cliente}: ${p.titulo}, pieza ${n + 1}`}
                />
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <section className="mt-24 border-t border-line pt-8 md:mt-32">
        <Link href={`/trabajos/${siguiente.slug}`} className="group flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">Siguiente proyecto</span>
          <span className="text-[clamp(1.8rem,4vw,3.5rem)] leading-none font-medium tracking-[-0.03em]">
            {siguiente.cliente}{" "}
            <em className="font-serif font-normal">{siguiente.titulo}</em>{" "}
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-2"
            >
              →
            </span>
          </span>
        </Link>
      </section>
    </main>
  );
}
