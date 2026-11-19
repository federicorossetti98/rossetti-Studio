"use client";

import { useEffect, useRef } from "react";

const SIGNOS = ".:·,;_";
const DURACION = 1800;

// Texto que se arma letra por letra a partir de signos sueltos la primera vez
// que entra en pantalla. El ancho no salta: una copia invisible del texto final
// reserva el lugar, y los lectores de pantalla leen siempre el texto real.
export function Revuelto({ texto, retraso = 0 }: { texto: string; retraso?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letras = [...texto];
    const signo = () => SIGNOS[Math.floor(Math.random() * SIGNOS.length)];
    // Cada letra se resuelve cuando el avance supera su umbral: de izquierda a
    // derecha, con algo de azar para que no se vea mecánico.
    const umbrales = letras.map((_, i) => 0.7 * (i / letras.length) + 0.3 * Math.random());
    const pintar = (avance: number) => {
      el.textContent = letras
        .map((c, i) => (c === " " || avance >= umbrales[i] ? c : signo()))
        .join("");
    };
    pintar(0);

    let raf = 0;
    let inicio = 0;
    let ultimoCambio = 0;
    const cuadro = (ahora: number) => {
      if (!inicio) inicio = ahora + retraso;
      const t = Math.min(1, Math.max(0, (ahora - inicio) / DURACION));
      // Los signos cambian cada ~50 ms, no en cada cuadro.
      if (ahora - ultimoCambio > 50 || t >= 1) {
        ultimoCambio = ahora;
        pintar(1 - (1 - t) * (1 - t)); // power2.out
      }
      if (t < 1) raf = requestAnimationFrame(cuadro);
    };

    const io = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        io.disconnect();
        raf = requestAnimationFrame(cuadro);
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = texto;
    };
  }, [texto, retraso]);

  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="sr-only">{texto}</span>
      <span aria-hidden="true" className="invisible">
        {texto}
      </span>
      <span ref={ref} aria-hidden="true" className="absolute inset-0">
        {texto}
      </span>
    </span>
  );
}
