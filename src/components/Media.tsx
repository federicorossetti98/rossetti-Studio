import Image from "next/image";
import type { Pieza } from "@/content/site";
import { Clip } from "./Clip";

type Props = {
  pieza?: Pieza;
  alt: string;
  // "llenar" recorta la pieza para cubrir su contenedor; "natural" respeta su proporción.
  modo?: "llenar" | "natural";
  prioridad?: boolean;
  sizes?: string;
};

export function Media({ pieza, alt, modo = "llenar", prioridad, sizes }: Props) {
  if (!pieza) {
    return <div className="h-full w-full bg-tile" />;
  }
  if (pieza.tipo === "video") {
    if (modo === "natural") {
      return (
        <div style={{ aspectRatio: `${pieza.ancho} / ${pieza.alto}` }}>
          <Clip src={pieza.src} poster={pieza.poster} label={alt} />
        </div>
      );
    }
    return <Clip src={pieza.src} poster={pieza.poster} label={alt} />;
  }
  if (modo === "natural") {
    return (
      <Image
        src={pieza.src}
        alt={alt}
        width={pieza.ancho}
        height={pieza.alto}
        priority={prioridad}
        sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
        className="h-auto w-full"
      />
    );
  }
  return (
    <Image
      src={pieza.src}
      alt={alt}
      fill
      priority={prioridad}
      sizes={sizes ?? "(min-width: 768px) 50vw, 100vw"}
      className="object-cover"
    />
  );
}
