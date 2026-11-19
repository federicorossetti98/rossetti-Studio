"""Optimiza fotos y videos originales para la web.

Uso: python3 scripts/procesar-medios.py <carpeta-con-originales>

Lee la selección de abajo, genera WebP (fotos) y MP4 cortos sin sonido + póster (videos)
en public/trabajos/<proyecto>/ y escribe src/content/piezas.json con los tamaños.
Requiere Pillow y ffmpeg.
"""

import json
import os
import subprocess
import sys
import unicodedata

from PIL import Image, ImageOps

Image.MAX_IMAGE_PIXELS = None

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGEN = sys.argv[1]
MM = "Muñoz Marchesi Motos"
CSG = "Clinica San Gabriel"

# proyecto -> lista de rutas relativas a ORIGEN (en orden; la primera es la portada)
SELECCION = {
    "munoz-marchesi-audiovisual": [
        f"{MM}/Redes Sociales/Videos/ROCKET 3 R .mp4",
        f"{MM}/Redes Sociales/Videos/NUEVA 450MT SPOT PUBLICITARIO .mp4",
        f"{MM}/Redes Sociales/Videos/ZX6R.mp4",
        f"{MM}/Redes Sociales/Videos/ALE H2 - 4K.mp4",
        f"{MM}/Redes Sociales/Videos/YAMIL TEASER ENERO.mp4",
        f"{MM}/Redes Sociales/Videos/jorge martin - preguntas rapidas.mp4",
        f"{MM}/Redes Sociales/Videos/800MT-X - JULIO.mp4",
        f"{MM}/Redes Sociales/Videos/pachu kymco .mp4",
        f"{MM}/Redes Sociales/Videos/STREET TRIPLE 765 - JULIO.mp4",
    ],
    "munoz-marchesi-fotografia": [
        f"{MM}/fotos/WhatsApp Image 2026-09-02 at 19.15.30 (1).jpeg",
        f"{MM}/fotos/Pachu Peña - Muñoz MArchesi - SEQ-067.jpg",
        f"{MM}/fotos/WhatsApp Image 2026-09-02 at 19.15.28 (1).jpeg",
        f"{MM}/fotos/WhatsApp Image 2026-11-18 at 22.46.12 (1).jpeg",
        f"{MM}/fotos/20260602_082645.jpg",
        f"{MM}/fotos/Pachu Peña - Muñoz MArchesi - SEQ-058.jpg",
        f"{MM}/fotos/WhatsApp Image 2026-09-02 at 19.15.26.jpeg",
        f"{MM}/fotos/WhatsApp Image 2026-11-18 at 22.46.15 (3).jpeg",
        f"{MM}/fotos/1000551650.jpg.jpeg",
        f"{MM}/fotos/WhatsApp Image 2026-09-02 at 19.15.29 (3).jpeg",
        f"{MM}/fotos/Pachu Peña - Muñoz MArchesi - SEQ-076.jpg",
        f"{MM}/fotos/WhatsApp Image 2026-11-18 at 22.46.14 (3).jpeg",
        f"{MM}/fotos/WhatsApp Image 2026-03-10 at 10.29.37.jpeg",
        f"{MM}/fotos/WhatsApp Image 2026-09-02 at 19.15.28 (2).jpeg",
        f"{MM}/fotos/20260801_181200.jpg",
        f"{MM}/fotos/WhatsApp Image 2026-11-18 at 22.46.16.jpeg",
    ],
    "munoz-marchesi-identidad": [
        f"{MM}/Logo/PNG AZUL/v-01.png",
        f"{MM}/Papeleria/papeleria-02.jpg",
        f"{MM}/Papeleria/papeleria-05.jpg",
        f"{MM}/Logo/PNG CLAIM/siempre a tu lado-07.png",
        f"{MM}/Papeleria/papeleria_anotador.jpg",
        f"{MM}/Ploteos/CAMION GUSTAVO version azul.png",
        f"{MM}/Redes Sociales/Web/contacto wsp.jpg",
    ],
    "munoz-marchesi-campanas": [
        f"{MM}/Adaptaciones/450MT ctes - SEMIVERTICAL.jpg",
        f"{MM}/Adaptaciones/SPEED 400 - CUADRADO.jpg",
        f"{MM}/Adaptaciones/250sr RCIA - SEMIVERTICAL CTES.jpg",
        f"{MM}/Adaptaciones/SCRAMBLER 400 XC - CUADRADO.jpg",
        f"{MM}/Adaptaciones/450 MT_ctes_1920x1080.jpg",
        f"{MM}/Adaptaciones/250NK CTES - SEMIVERVERTICAL  CTES.jpg",
        f"{MM}/Adaptaciones/THRUXTON 400 - CUADRADO.jpg",
        f"{MM}/Adaptaciones/250 DUAL RCIA - SEMIVERTICAL CTES.jpg",
        f"{MM}/Adaptaciones/TRACKER 400 - CUADRADO.jpg",
        f"{MM}/Adaptaciones/450 MT_rcia.jpg",
        f"{MM}/Adaptaciones/THRUXTON 400 - HORIZONTAL.jpg",
    ],
    "clinica-san-gabriel-identidad": [
        f"{CSG}/Logos/HOSPITAL DE DIA/LOGO HOSPITAL DE DIA/logo fondo verde con textura.jpg",
        f"{CSG}/Logos/CSG/JPG/REDES SOCIALES - VERDE.jpg",
        f"{CSG}/Logos/HOSPITAL DE DIA/LOGO HOSPITAL DE DIA/LOGO HOSPITAL DE DIA-03.png",
        f"{CSG}/Logos/HOGAR/logos hogar-01.png",
        f"{CSG}/Logos/HOSPITAL DE DIA/LOGO HOSPITAL DE DIA/logo fondo blanco.jpg",
    ],
    "clinica-san-gabriel-campanas": [
        f"{CSG}/Redes sociales/Placas/MES AMARILLO-02.png",
        f"{CSG}/Redes sociales/Placas/SERVICIOS HOSPITAL DE DIA.jpg",
        f"{CSG}/Redes sociales/Placas/MES AMARILLO_Mesa de trabajo 1-01.png",
        f"{CSG}/Redes sociales/Placas/dia de la psiquiatria.jpg",
        f"{CSG}/Redes sociales/Placas/MES AMARILLO-04.png",
        f"{CSG}/Redes sociales/Placas/buscamos enfermero.jpg",
        f"{CSG}/Redes sociales/Placas/Invitacion fiesta fin de año CSG - 2026.jpg",
        f"{CSG}/Redes sociales/Placas/MES AMARILLO-06.png",
        f"{CSG}/Redes sociales/Placas/25 de mayo.jpg",
    ],
    "clinica-san-gabriel-audiovisual": [
        f"{CSG}/Redes sociales/Videos/PORQUE CUIDAR TU SALUD MENTAL.mp4",
        f"{CSG}/Redes sociales/Videos/HOSPITAL DE DIA - VIDEO 1 .mp4",
        f"{CSG}/Redes sociales/Videos/CLINICA SAN GABRIEL - FAMILIA.mp4",
        f"{CSG}/Redes sociales/Videos/SALUD MENTAL - LARA.mp4",
        f"{CSG}/Redes sociales/Videos/CANES .mp4",
        f"{CSG}/Redes sociales/Videos/FELIZ DIA PROFES Y PSICOSPEDAGOGS.mp4",
    ],
    "mauro-passarino": [
        "Mauro Passarino/video 1 - Youtube.mp4",
    ],
}

LADO_FOTO = 1600  # lado mayor en px
LADO_VIDEO = 1080  # lado mayor en px
SEGUNDOS = 6


def nfc(t):
    return unicodedata.normalize("NFC", t)


# Índice de archivos por nombre normalizado (los nombres con tildes pueden venir en NFD).
INDICE = {}
for raiz, _, nombres in os.walk(ORIGEN):
    for nombre in nombres:
        completo = os.path.join(raiz, nombre)
        INDICE[nfc(os.path.relpath(completo, ORIGEN))] = completo


def duracion(ruta):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", ruta],
        capture_output=True, text=True, check=True,
    ).stdout
    return float(out.strip())


def foto(src, dst):
    im = ImageOps.exif_transpose(Image.open(src))
    im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
    if im.mode == "RGBA":
        fondo = Image.new("RGB", im.size, (255, 255, 255))
        fondo.paste(im, mask=im.getchannel("A"))
        im = fondo
    im.thumbnail((LADO_FOTO, LADO_FOTO), Image.LANCZOS)
    im.save(dst, "WEBP", quality=80, method=6)
    return im.size


def video(src, dst, poster):
    d = duracion(src)
    inicio = 0 if d <= SEGUNDOS + 1 else min(d * 0.2, d - SEGUNDOS)
    escala = f"scale='if(gt(iw,ih),{LADO_VIDEO},-2)':'if(gt(iw,ih),-2,{LADO_VIDEO})'"
    subprocess.run(
        ["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", f"{inicio:.2f}", "-t", str(SEGUNDOS),
         "-i", src, "-an", "-vf", f"{escala},fps=30", "-c:v", "libx264", "-profile:v", "high",
         "-pix_fmt", "yuv420p", "-crf", "26", "-preset", "slow", "-movflags", "+faststart", dst],
        check=True,
    )
    subprocess.run(
        ["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", dst, "-frames:v", "1", "-q:v", "4", poster + ".jpg"],
        check=True,
    )
    im = Image.open(poster + ".jpg")
    im.save(poster, "WEBP", quality=75)
    os.remove(poster + ".jpg")
    return im.size


manifiesto = {}
for proyecto, archivos in SELECCION.items():
    carpeta = os.path.join(RAIZ, "public", "trabajos", proyecto)
    os.makedirs(carpeta, exist_ok=True)
    piezas = []
    for n, rel in enumerate(archivos, 1):
        src = INDICE[nfc(rel)]
        base = f"{n:02d}"
        if rel.lower().endswith(".mp4"):
            w, h = video(src, os.path.join(carpeta, base + ".mp4"), os.path.join(carpeta, base + ".webp"))
            piezas.append({"tipo": "video", "src": f"/trabajos/{proyecto}/{base}.mp4",
                           "poster": f"/trabajos/{proyecto}/{base}.webp", "ancho": w, "alto": h})
        else:
            w, h = foto(src, os.path.join(carpeta, base + ".webp"))
            piezas.append({"tipo": "imagen", "src": f"/trabajos/{proyecto}/{base}.webp", "ancho": w, "alto": h})
        print(proyecto, base, rel.rsplit("/", 1)[-1], f"{w}x{h}", flush=True)
    manifiesto[proyecto] = piezas

with open(os.path.join(RAIZ, "src", "content", "piezas.json"), "w") as f:
    json.dump(manifiesto, f, ensure_ascii=False, indent=2)
print("listo")
