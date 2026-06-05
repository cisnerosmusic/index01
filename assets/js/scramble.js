/* ============================================================
   INDEX01 - Text Scramble Effect (estilo pizarra Solari)
   Velocidad media: cada caracter "busca" entre 0.2s y 0.6s
   Uso: añadir data-scramble a los elementos a animar.
   - El header (dentro del viewport) anima al cargar y en hover.
   - El footer anima una sola vez al entrar en pantalla (scroll).
   El HTML original se restaura al terminar: SEO/AEO intactos.
   ============================================================ */
(function () {
  'use strict';

  var CHARS = '!<>-_\\/[]{}=+*^?#01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var FPS = 60;
  var START_MAX = 0.25 * FPS;            /* retardo inicial aleatorio: 0 a 0.25s */
  var SEARCH_MIN = 0.20 * FPS;           /* busqueda minima: 0.2s */
  var SEARCH_MAX = 0.60 * FPS;           /* busqueda maxima: 0.6s */

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  function scramble(el) {
    if (reducedMotion || el.dataset.scrambling === '1') return;
    el.dataset.scrambling = '1';

    var originalHTML = el.dataset.originalHtml;
    var text = el.dataset.originalText;
    var queue = [];

    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === ' ' || ch === '\n') {
        queue.push({ ch: ch, start: 0, end: 0 });
      } else {
        var start = Math.floor(Math.random() * START_MAX);
        var end = start + SEARCH_MIN +
          Math.floor(Math.random() * (SEARCH_MAX - SEARCH_MIN));
        queue.push({ ch: ch, start: start, end: end });
      }
    }

    var frame = 0;
    function update() {
      var out = '';
      var done = 0;
      for (var j = 0; j < queue.length; j++) {
        var q = queue[j];
        if (frame >= q.end) {
          out += q.ch;
          done++;
        } else if (frame >= q.start) {
          out += '<span class="scramble-char">' + randomChar() + '</span>';
        } else {
          out += '&#8201;';
        }
      }
      el.innerHTML = out;
      if (done < queue.length) {
        frame++;
        requestAnimationFrame(update);
      } else {
        el.innerHTML = originalHTML;   /* restaura negritas y marcado original */
        el.dataset.scrambling = '0';
      }
    }
    update();
  }

  function init() {
    var targets = document.querySelectorAll('[data-scramble]');

    targets.forEach(function (el) {
      el.dataset.originalHtml = el.innerHTML;
      el.dataset.originalText = el.textContent;
      el.setAttribute('aria-label', el.textContent);

      var rect = el.getBoundingClientRect();
      var visible = rect.top < window.innerHeight && rect.bottom > 0;

      if (visible) {
        /* Header u otros elementos visibles: anima al cargar */
        setTimeout(function () { scramble(el); }, 250);
      } else {
        /* Footer: anima una vez al entrar en pantalla */
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              scramble(entry.target);
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.35 });
        observer.observe(el);
      }

      /* Hover re-dispara solo en elementos cortos (logos), no en parrafos */
      if (el.dataset.originalText.length <= 20) {
        el.addEventListener('mouseenter', function () { scramble(el); });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
