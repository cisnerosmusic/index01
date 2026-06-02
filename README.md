# Index01 - sitio web

Sitio oficial de Index01 (Web Design, SEO y AEO desde Miami). HTML estatico, rapido, sin frameworks. Pensado para GitHub Pages con dominio propio `index01.net`.

## Estructura

```
index01/
  index.html              HOME
  services.html           SERVICES
  process.html            PROCESS
  maintenance.html        MAINTENANCE
  contact.html            CONTACT
  sitemap.xml             mapa del sitio (5 URLs)
  robots.txt              permite todos los crawlers, incluidos los de IA
  llms.txt                resumen del sitio para asistentes de IA (clave para AEO)
  humans.txt              creditos
  site.webmanifest        PWA / iconos
  favicon.ico             favicon multi-tamano
  CNAME                   dominio: index01.net
  .nojekyll               evita el procesado Jekyll de GitHub Pages
  assets/
    css/styles.css        sistema de diseno completo
    js/main.js            menu movil, ano automatico, animacion al hacer scroll
    img/                  favicon (svg + png), apple-touch, icon-512, og-image
```

## Antes de publicar: cosas que debes cambiar

1. **Formulario de contacto.** En `contact.html`, el formulario apunta a un placeholder:
   `action="https://formspree.io/f/REEMPLAZA_ID"`.
   GitHub Pages es estatico y no procesa formularios, asi que necesitas un backend.
   - Crea una cuenta gratis en https://formspree.io, agrega un formulario y copia tu ID.
   - Reemplaza `REEMPLAZA_ID` por ese ID (queda algo como `https://formspree.io/f/abcdwxyz`).
   - Alternativas: Web3Forms, Getform, o Cloudflare (Workers/Pages Functions) si prefieres no depender de terceros.
   - El correo `ernestocisnerosmusic@gmail.com` ya funciona como respaldo manual (enlace mailto).

2. **Correo.** Si tu correo no sera `ernestocisnerosmusic@gmail.com`, busca y reemplaza esa direccion en todos los archivos (`contact.html`, footers, `llms.txt`, `humans.txt`, JSON-LD).

3. **Precios de mantenimiento.** En `maintenance.html` las cifras (90, 180) son de referencia. Ajustalas a lo que vas a cobrar de verdad.

4. **Imagen para redes (Open Graph).** `assets/img/og-image.png` ya esta generada. Si cambias marca o mensaje, regenerala con el mismo tamano (1200x630).

## Publicar en GitHub Pages

1. Crea un repositorio (por ejemplo `index01-site`) y sube **todo el contenido de esta carpeta** a la raiz del repo (que `index.html` quede en la raiz, no dentro de una subcarpeta).
2. En el repo: Settings -> Pages -> Source: `Deploy from a branch`, rama `main`, carpeta `/ (root)`.
3. El archivo `CNAME` ya contiene `index01.net`, asi que GitHub configurara el dominio solo. En tu proveedor de DNS apunta el dominio a GitHub Pages:
   - Registros A del apex `index01.net` a las IP de GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - Registro CNAME de `www` a `TU_USUARIO.github.io`.
4. En Settings -> Pages, activa **Enforce HTTPS** cuando el certificado este listo.

## Velocidad y independencia de plataforma (opcional pero recomendado)

Las tipografias se cargan ahora desde Google Fonts (CDN). Para un sitio mas rapido y que no dependa de terceros, puedes autoalojar las fuentes:

1. Descarga los archivos de Archivo y Martian Mono (woff2).
2. Ponlos en `assets/fonts/`.
3. Sustituye el `<link>` de Google Fonts (en el `<head>` de cada pagina) por `@font-face` en `styles.css`.

Esto es coherente con la filosofia del propio sitio: menos dependencias, mas control, mas velocidad.

## Detalles tecnicos

- Sin librerias ni build. Se edita y se sube, nada que compilar.
- Cada pagina lleva su JSON-LD (datos estructurados): `ProfessionalService` y `WebSite` en home, `Service` en servicios, `HowTo` en proceso, `FAQPage` en mantenimiento, `ContactPage` en contacto.
- `robots.txt` permite explicitamente a los crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.).
- `llms.txt` resume el sitio para los asistentes de IA. Mantenlo al dia cuando cambien servicios o paginas.
- Regla de estilo del proyecto: no se usa la raya larga en el texto. Si editas contenido, manten esa norma.

## Mantener vivo el sitio

Cuando edites contenido, actualiza la fecha `lastmod` en `sitemap.xml`. La frescura ayuda a que los buscadores y las IA te sigan citando.
