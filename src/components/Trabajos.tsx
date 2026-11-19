"use client";

import { useState } from "react";
import { proyectos, servicios, type Categoria } from "@/content/site";
import { Media } from "./Media";
import { Reveal } from "./Reveal";

const filtros: ("Todo" | Categoria)[] = ["Todo", ...servicios.map((s) => s.nombre)];

const aspecto = {
  horizontal: "aspect-[4/3]",
  vertical: "aspect-[4/5]",
  cuadrado: "aspect-square",
};

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
          <li key={`${filtro}-${p.titulo}`} className={i % 2 === 1 ? "md:mt-24" : ""}>
            <Reveal media delay={(i % 2) * 80}>
              <div className={`relative overflow-hidden ${aspecto[p.formato ?? "horizontal"]}`}>
                <Media imagen={p.imagen} video={p.video} alt={`${p.titulo} para ${p.cliente}`} etiqueta={p.categoria} />
              </div>
            </Reveal>
            <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3 text-sm">
              <span className="font-medium">{p.titulo}</span>
              <span className="text-muted">
                {p.cliente} · {p.categoria} · {p.año}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {lista.length === 0 && <p className="text-muted">Pronto habrá proyectos en esta categoría.</p>}
    </>
  );
}
