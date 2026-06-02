/* Index01 - interacciones minimas (carga rapida, sin dependencias) */
(function () {
  "use strict";

  // navegacion movil
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // anio dinamico en el footer
  var y = document.querySelectorAll("[data-year]");
  for (var i = 0; i < y.length; i++) y[i].textContent = new Date().getFullYear();

  // reveal on scroll
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && els.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("in"); });
  }

  // power-off del CTA del nav: desvanece la palabra, luego apaga el boton, luego navega
  var navCta = document.querySelector(".nav-cta .btn");
  if (navCta) {
    navCta.addEventListener("click", function (e) {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var href = navCta.getAttribute("href");
      if (!href) return;
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      e.preventDefault();
      navCta.classList.add("btn--poweroff");
      navCta.setAttribute("aria-disabled", "true");
      var navigated = false;
      var go = function () { if (!navigated) { navigated = true; window.location.href = href; } };
      navCta.addEventListener("transitionend", function (ev) { if (ev.propertyName === "opacity") go(); });
      setTimeout(go, 1000);
    });
  }
})();
