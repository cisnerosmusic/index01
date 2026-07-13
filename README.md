# index01.net

Sitio oficial de **Index01** (Web Design, SEO y AEO en remoto, con base en Miami).
HTML estatico, rapido, sin frameworks ni paso de build. Bilingue (espanol e ingles).
Desplegado en GitHub Pages con dominio propio, `index01.net`.

## Estructura

```
index01/
  index.html  services.html  process.html  maintenance.html  contact.html   Paginas (ES)
  legal.html  gracias.html  404.html                                         Legal, gracias, 404
  en/                     Mirror en ingles (index, services, process, maintenance, contact, legal, thanks)
  assets/
    css/styles.css        Sistema de diseno base
    css/motion.css        Capa de movimiento (separable, ver abajo)
    css/aurora.css        Capa "aurora" del hero (separable, ver abajo)
    js/main.js            Menu movil, ano automatico, revelado al hacer scroll
    js/scramble.js        Efecto tipo Solari en el logo y el footer
    js/motion.js          Capa de movimiento (separable)
    js/aurora.js          Capa aurora (separable)
    img/                  Favicons, apple-touch, icon-512, og-image (1200x630)
  sitemap.xml             12 URLs (ES + EN) con hreflang
  robots.txt              Abre a todos los crawlers, incluidos los de IA
  llms.txt                Resumen del sitio para asistentes de IA (clave para AEO)
  humans.txt              Creditos
  site.webmanifest        PWA / iconos
  CNAME                   index01.net
  .nojekyll               Evita el procesado Jekyll de GitHub Pages
```

## Como esta hecho

- **Sin build.** Se edita el HTML y se sube. Nada que compilar.
- **Bilingue.** La raiz es el sitio en espanol; `en/` es el mirror en ingles, enlazado con `hreflang`.
- **SEO / AEO.** Cada pagina lleva su JSON-LD (`ProfessionalService` y `WebSite` en la home,
  `Service`, `HowTo`, `FAQPage`, `ContactPage`...). `robots.txt` permite a los crawlers de IA
  (GPTBot, ClaudeBot, PerplexityBot, Google-Extended...) y `llms.txt` resume el sitio para ellos.
- **Fuentes** desde Google Fonts (Archivo y Martian Mono).
- **Deploy:** GitHub Pages, rama `main`, dominio `index01.net` via `CNAME`.

## Capas de efectos (separables y reversibles)

El sitio funciona perfecto sin ninguna capa de animacion. Las capas solo anaden pulido, animan
solo `transform` y `opacity` (60fps, sin reflow) y respetan `prefers-reduced-motion`.

- **Motion** (`assets/css/motion.css` + `assets/js/motion.js`): revelados escalonados al entrar en
  viewport, "press" en botones, subrayado del nav, conteo de cifras del hero, nav que se asienta al
  hacer scroll.
- **Aurora** (`assets/css/aurora.css` + `assets/js/aurora.js`): el halo animado del hero.
- **Scramble** (`assets/js/scramble.js`): efecto tipo tablero Solari en el logo y el footer.

**Interruptor de una linea:** cada capa se activa con un atributo en la etiqueta `<html>`:
`data-motion` y `data-aurora`. Las reglas CSS viven bajo esos selectores y el JS no hace nada sin el
atributo. Quita el atributo (o los `<link>`/`<script>`) y el sitio queda igual, legible y funcional.
Los revelados se etiquetan por JS, no en el HTML, asi que si una capa no corre, ningun contenido
queda oculto.

## Formulario de contacto

El formulario (`contact.html` y `en/contact.html`) esta **en vivo** con **FormSubmit.co**, un backend
gratuito para sitios estaticos. Cada envio llega a **dos** direcciones:

- `ernestocisnerosmusic@gmail.com` (destinatario del `action`).
- `support@index01.net` (copia, campo oculto `_cc`).

Configuracion: redirige a la pagina de gracias (`_next`), sin captcha (`_captcha=false`) y con
honeypot antispam (`_honey`). Para cambiar destinatarios, edita el `action` (principal) y/o el `_cc`
(copias). Nota: FormSubmit envia un correo de **activacion** la primera vez que se usa una direccion
nueva; hay que confirmarlo en esa bandeja para que empiece a entregar.

Correo publico del sitio: **support@index01.net** (footers, mailto, `llms.txt`, `humans.txt`, JSON-LD).

## Editar y mantener

- **Bilingue:** si cambias una pagina en la raiz (ES), replica el cambio en su equivalente de `en/`.
- **Imagen social (Open Graph):** si cambias marca o mensaje, regenera `assets/img/og-image.png` con
  el mismo tamano, `1200x630`.
- **llms.txt:** mantenlo al dia cuando cambien servicios o paginas (es lo que leen las IA).
