"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
  label: string;
  className?: string;
  // Para el respaldo de la grilla WebGL: no se reproduce si el canvas ya está
  // dibujando la portada (evita decodificar el mismo video dos veces).
  soloSinGL?: boolean;
};

// Video corto, sin sonido, en bucle. Solo se reproduce mientras está en pantalla
// y nunca si la persona pidió reducir el movimiento.
export function Clip({ src, poster, label, className = "", soloSinGL = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)");
    const io = new IntersectionObserver(
      ([entry]) => {
        const glDibuja = soloSinGL && document.documentElement.dataset.gl === "on";
        if (entry.isIntersecting && !reducir.matches && !glDibuja) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [soloSinGL]);

  return (
    <video
      ref={ref}
      className={`h-full w-full object-cover ${className}`}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}
