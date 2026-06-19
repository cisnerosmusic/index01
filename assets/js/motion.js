/* ============================================================
   Index01 - capa de movimiento (motion.js)
   Separable y reversible: no hace NADA si <html> no tiene
   el atributo data-motion, ni si el usuario pide menos movimiento.
   Solo toca clases/variables que disparan transform y opacity.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  if (!root.hasAttribute("data-motion")) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var i, j;

  /* ---- 1) Revelados consistentes en todo el sitio + escalonado ----
     Etiquetamos por JS (no en el HTML) los bloques clave que aun no
     tienen .reveal. Si esta capa no corre, nada queda invisible. */
  var SEL = ".hero .eyebrow, .hero h1, .hero .lede, .hero-cta, .hero-meta, " +
            ".section-head, .card, .doorbox, .step, .feat, .plan, .note, .cta-band, .faq details";
  var marks = document.querySelectorAll(SEL);
  for (i = 0; i < marks.length; i++) {
    if (!marks[i].classList.contains("reveal")) marks[i].classList.add("reveal");
  }

  /* Escalonado: --i = posicion entre hermanos .reveal del mismo padre (tope 6) */
  var reveals = document.querySelectorAll(".reveal");
  var parents = [], counts = [];
  for (i = 0; i < reveals.length; i++) {
    var p = reveals[i].parentNode;
    var k = parents.indexOf(p);
    if (k === -1) { parents.push(p); counts.push(0); k = parents.length - 1; }
    var n = counts[k]; counts[k] = n + 1;
    reveals[i].style.setProperty("--i", Math.min(n, 6));
  }

  /* Observador propio: anade .in al entrar en viewport (idempotente
     aunque main.js tambien observe los .reveal ya presentes). */
  function reveal(el) { el.classList.add("in"); }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        if (entries[e].isIntersecting) { reveal(entries[e].target); io.unobserve(entries[e].target); }
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    for (i = 0; i < reveals.length; i++) {
      if (!reveals[i].classList.contains("in")) io.observe(reveals[i]);
    }
  } else {
    for (i = 0; i < reveals.length; i++) reveal(reveals[i]);
  }

  /* ---- 2) Conteo ascendente de las cifras del hero (guia la atencion) ----
     Solo cifras reales: porcentajes/numeros. Los anos (1900-2100) y el
     texto (p.ej. "AEO") no se cuentan; solo se revelan. */
  var counters = document.querySelectorAll(".hero-meta .k");
  if (counters.length && "IntersectionObserver" in window) {
    function countUp(el) {
      var raw = (el.textContent || "").trim();
      var m = raw.match(/^(\D*)(\d[\d.,]*)(\D*)$/);
      if (!m) return;
      var pre = m[1], numStr = m[2].replace(/,/g, ""), suf = m[3];
      var target = parseFloat(numStr);
      if (isNaN(target)) return;
      if (suf === "" && target >= 1900 && target <= 2100) return; /* es un ano */
      var decimals = numStr.indexOf(".") > -1 ? numStr.split(".")[1].length : 0;
      var dur = 900, t0 = null;
      function tick(ts) {
        if (t0 === null) t0 = ts;
        var t = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - t, 3); /* easeOutCubic */
        el.textContent = pre + (target * eased).toFixed(decimals) + suf;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = pre + numStr + suf; /* valor exacto final */
      }
      requestAnimationFrame(tick);
    }
    var meta = document.querySelector(".hero-meta");
    if (meta) {
      var cio = new IntersectionObserver(function (entries) {
        for (var c = 0; c < entries.length; c++) {
          if (entries[c].isIntersecting) {
            for (var q = 0; q < counters.length; q++) countUp(counters[q]);
            cio.disconnect();
          }
        }
      }, { threshold: 0.4 });
      cio.observe(meta);
    }
  }

  /* ---- 3) El nav se asienta al hacer scroll (sin reflow) ---- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var ticking = false;
    function apply() {
      if (window.pageYOffset > 40) nav.classList.add("nav--scrolled");
      else nav.classList.remove("nav--scrolled");
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(apply); ticking = true; }
    }, { passive: true });
    apply();
  }
})();
