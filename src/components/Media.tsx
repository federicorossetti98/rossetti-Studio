import Image from "next/image";

type Props = {
  imagen?: string;
  video?: string;
  alt: string;
  etiqueta: string;
  className?: string;
  prioridad?: boolean;
  sizes?: string;
};

// Imagen o video de un proyecto. Sin archivo, muestra un recuadro pendiente.
export function Media({ imagen, video, alt, etiqueta, className = "", prioridad, sizes }: Props) {
  if (video) {
    return (
      <video
        className={`h-full w-full object-cover ${className}`}
        src={video}
        poster={imagen || undefined}
        autoPlay
        muted
        loop
        playsInline
        aria-label={alt}
      />
    );
  }
  if (imagen) {
    return (
      <Image
        src={imagen}
        alt={alt}
        fill
        priority={prioridad}
        sizes={sizes ?? "(min-width: 768px) 50vw, 100vw"}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div className={`flex h-full w-full items-end bg-tile p-4 ${className}`}>
      <span className="text-xs uppercase tracking-[0.14em] text-muted">{etiqueta} · pendiente</span>
    </div>
  );
}
