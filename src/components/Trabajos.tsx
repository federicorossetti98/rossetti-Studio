"use client";

import Link from "next/link";
import { useState } from "react";
import { portadaDe, proyectos, servicios, type Categoria } from "@/content/site";
import { Media } from "./Media";
import { Reveal } from "./Reveal";

const filtros: ("Todo" | Categoria)[] = ["Todo", ...servicios.map((s) => s.nombre)];

export function Trabajos() {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>("Todo");
  const lista = filtro === "Todo" ? proyectos : proyectos.filter((p) => p.categoria === filtro);

  return (
    <>
      <div role="tablist" aria-label="Filtrar trabajos" className="-mx-1 mb-10 flex flex-wrap gap-1">
        {filtros.map((f) => {
          const activo = f === filtro;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={activo}
              onClick={() => setFiltro(f)}
              className={`press rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                activo ? "bg-ink text-paper" : "text-muted hover:text-ink"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <ul className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2">
        {lista.map((p, i) => (
          <li key={`${filtro}-${p.slug}`} className={i % 2 === 1 ? "md:mt-24" : ""}>
            <Link href={`/trabajos/${p.slug}`} className="group block">
              <Reveal media delay={(i % 2) * 80}>
                <div className="relative aspect-[4/5] overflow-hidden bg-tile">
                  <div className="h-full w-full transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]">
                    <Media pieza={portadaDe(p.slug)} alt={`${p.titulo} para ${p.cliente}`} />
                  </div>
                </div>
              </Reveal>
              <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3 text-sm">
                <span className="font-medium">
                  {p.cliente} <span className="text-muted">— {p.titulo}</span>
                </span>
                <span className="shrink-0 text-muted">
                  {p.categoria}
                  {p.año ? ` · ${p.año}` : ""}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {lista.length === 0 && <p className="text-muted">Pronto habrá proyectos en esta categoría.</p>}
    </>
  );
}
