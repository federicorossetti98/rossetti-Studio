import Image from "next/image";
import Link from "next/link";
import { estudio } from "@/content/site";

const nav = [
  { href: "/#trabajos", label: "Trabajos" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#estudio", label: "Estudio" },
  { href: "/#contacto", label: "Contacto" },
];

export function Encabezado() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-paper">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-10">
        <Link href="/" aria-label="Inicio">
          <Image src={estudio.logo} alt={estudio.nombre} width={1582} height={384} className="h-9 w-auto" priority />
        </Link>
        <nav className="hidden gap-8 text-sm text-muted md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="transition-colors duration-200 hover:text-ink">
              {n.label}
            </Link>
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
  );
}

export function Pie() {
  return (
    <footer className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 pt-16 pb-10 text-sm text-muted md:flex-row md:justify-between md:px-10">
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
  );
}
