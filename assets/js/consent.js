/* Index01 - consentimiento de cookies (Consent Mode v2, sin dependencias)
   gtag arranca con todo denegado (ver el bloque inline en el head).
   Aqui: si el visitante acepta, se actualiza el consentimiento y se carga Clarity.
   Si rechaza, no se carga nada mas y no insistimos. */
(function () {
  "use strict";

  var KEY = "i01-consent";
  var EN = (document.documentElement.lang || "es").indexOf("en") === 0;

  var TXT = EN ? {
    msg: "We use measurement cookies (Google Analytics and Microsoft Clarity) to understand how the site is used. Nothing loads until you decide.",
    accept: "Accept",
    reject: "Essentials only",
    legal: "Legal notice",
    legalHref: "/en/legal.html",
    aria: "Cookie preferences"
  } : {
    msg: "Usamos cookies de medición (Google Analytics y Microsoft Clarity) para entender cómo se usa la web. Nada se carga hasta que tú decidas.",
    accept: "Aceptar",
    reject: "Solo lo esencial",
    legal: "Aviso legal",
    legalHref: "/legal.html",
    aria: "Preferencias de cookies"
  };

  function grant() {
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted"
      });
    }
    // Clarity solo existe si hubo consentimiento
    if (!window.clarity) {
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", "xm490prxco");
    }
  }

  function banner() {
    var box = document.createElement("div");
    box.className = "consent";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", TXT.aria);
    box.innerHTML =
      '<p class="consent-msg">' + TXT.msg +
      ' <a href="' + TXT.legalHref + '">' + TXT.legal + "</a></p>" +
      '<div class="consent-actions">' +
      '<button type="button" class="btn btn-primary" data-consent="granted">' + TXT.accept + "</button>" +
      '<button type="button" class="btn btn-ghost" data-consent="denied">' + TXT.reject + "</button>" +
      "</div>";
    box.addEventListener("click", function (e) {
      var v = e.target.getAttribute && e.target.getAttribute("data-consent");
      if (!v) return;
      try { localStorage.setItem(KEY, v); } catch (err) {}
      if (v === "granted") grant();
      box.classList.remove("in");
      setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 350);
    });
    document.body.appendChild(box);
    requestAnimationFrame(function () { box.classList.add("in"); });
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (err) {}

  if (saved === "granted") grant();
  else if (saved !== "denied") banner();

  // enlaces "Cookies" del footer: permiten cambiar de opinion
  var openers = document.querySelectorAll("[data-consent-open]");
  for (var i = 0; i < openers.length; i++) {
    openers[i].addEventListener("click", function (e) {
      e.preventDefault();
      try { localStorage.removeItem(KEY); } catch (err) {}
      if (!document.querySelector(".consent")) banner();
    });
  }
})();
