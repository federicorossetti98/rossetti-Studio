"use client";

import { useState } from "react";
import { proyectos, servicios, type Categoria } from "@/content/site";
import { TrabajosGL } from "./TrabajosGL";

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

      <TrabajosGL proyectos={lista} />
      {lista.length === 0 && <p className="text-muted">Pronto habrá proyectos en esta categoría.</p>}
    </>
  );
}
