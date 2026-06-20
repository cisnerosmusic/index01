/* ============================================================
   Index01 - Aurora (WebGL crudo, sin librerias). Aditiva y reversible.
   Nada ocurre si <html> no tiene data-aurora, ni en reduced-motion,
   ni en movil, ni sin WebGL. El canvas lo inyecta este JS: si algo
   falla, el bloque queda intacto.
   Cada host = elemento con [data-aurora-host] y config por atributos:
     data-trigger="load"|"view"   (load: reloj desde init diferido;
                                    view: disparo unico al entrar, reloj propio)
     data-l="ini,fin"  bloom de la izquierda (orgánico)
     data-r="ini,fin"  bloom de la derecha (grilla)
   Se pausa fuera de pantalla y con pestana oculta. Brillo a 0.64.
   ============================================================ */
(function () {
  "use strict";
  var root = document.documentElement;
  if (!root.hasAttribute("data-aurora")) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if ((window.matchMedia && matchMedia("(pointer:coarse)").matches) || window.innerWidth < 768) return;
  var hosts = [].slice.call(document.querySelectorAll("[data-aurora-host]"));
  if (!hosts.length) return;

  var VSRC = "attribute vec2 pos;void main(){gl_Position=vec4(pos,0.0,1.0);}";
  var FSRC = [
    "precision highp float;",
    "uniform vec2 uRes;uniform float uTime;uniform float uL;uniform float uR;",
    "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}",
    "float vn(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);",
    "float a=hash(i),b=hash(i+vec2(1.0,0.0)),c=hash(i+vec2(0.0,1.0)),d=hash(i+vec2(1.0,1.0));",
    "return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}",
    "float fbm(vec2 p){float s=0.0,a=0.5;for(int k=0;k<4;k++){s+=a*vn(p);p*=2.0;a*=0.5;}return s;}",
    "float aur(vec2 uv,float t){vec2 p=uv;",
    "float n=fbm(vec2(p.x*3.0-t*0.05,p.x*9.0+2.0));",
    "float ctr=0.50+0.16*n;float w=0.14+0.10*fbm(vec2(p.x*5.0,t*0.05));",
    "float dy=(p.y-ctr)/w;float band=exp(-dy*dy);",
    "float st=0.5+0.5*fbm(vec2(p.x*34.0,p.y*4.0-t*0.16));",
    "float veil=smoothstep(0.0,0.55,p.y)*0.22*fbm(vec2(p.x*2.0+t*0.03,p.y*2.0));",
    "return band*st+veil;}",
    "void main(){vec2 uv=gl_FragCoord.xy/uRes;",
    "float morph=smoothstep(0.20,0.82,uv.x+0.20*sin(uTime*0.20));",
    "vec2 cell=vec2(1.0/44.0,1.0/24.0);vec2 cc=(floor(uv/cell)+0.5)*cell;",
    "vec2 auv=mix(uv,cc,morph);float a=aur(auv,uTime);",
    "vec2 g=abs(fract(uv/cell)-0.5)*2.0;float bd=1.0-smoothstep(0.74,0.90,max(g.x,g.y));",
    "a*=mix(1.0,bd,morph);",
    "a*=mix(0.58,1.0,smoothstep(0.0,0.54,uv.x));",
    "float reveal=mix(uL,uR,smoothstep(0.30,0.80,uv.x));",
    "a*=reveal;a=clamp(a,0.0,1.4);",
    "vec3 bg=vec3(0.016,0.027,0.039);vec3 deep=vec3(0.03,0.12,0.32);",
    "vec3 teal=vec3(0.06,0.45,0.40);vec3 lime=vec3(0.796,0.984,0.271);",
    "vec3 c=mix(deep,teal,smoothstep(0.0,0.4,a));c=mix(c,lime,smoothstep(0.4,0.95,a));",
    "vec3 col=bg+c*a*1.35;float vig=smoothstep(1.20,0.25,length(uv-0.5));",
    "col*=mix(0.60,1.0,vig);col*=0.64;gl_FragColor=vec4(col,1.0);}"
  ].join("\n");

  function smooth(a, b, x) { x = Math.min(Math.max((x - a) / (b - a), 0), 1); return x * x * (3 - 2 * x); }
  function pair(str, da, db) { var m = (str || "").split(","); var a = parseFloat(m[0]), b = parseFloat(m[1]); return [isNaN(a) ? da : a, isNaN(b) ? db : b]; }

  function build(host) {
    var cv = document.createElement("canvas");
    var gl = cv.getContext("webgl") || cv.getContext("experimental-webgl");
    if (!gl) return;
    var prog = gl.createProgram();
    function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VSRC));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FSRC));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

    var trigger = host.getAttribute("data-trigger") || "load";
    var L = pair(host.getAttribute("data-l"), 4, 9);
    var R = pair(host.getAttribute("data-r"), 7, 14);

    var glowWrap = null;
    if (host.classList.contains("cta-band")) {
      glowWrap = document.createElement("div");
      glowWrap.className = "cta-glow";
      host.parentNode.insertBefore(glowWrap, host);
      glowWrap.appendChild(host);
    }
    cv.className = "aurora"; cv.setAttribute("aria-hidden", "true");
    host.insertBefore(cv, host.firstChild);
    var scrim = document.createElement("div"); scrim.className = "aurora-scrim"; scrim.setAttribute("aria-hidden", "true");
    host.insertBefore(scrim, cv.nextSibling);
    root.setAttribute("data-aurora-on", "");

    gl.useProgram(prog);
    var bf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "pos"); gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uRes = gl.getUniformLocation(prog, "uRes"), uTime = gl.getUniformLocation(prog, "uTime"),
        uL = gl.getUniformLocation(prog, "uL"), uR = gl.getUniformLocation(prog, "uR");

    function resize() {
      var r = host.getBoundingClientRect();
      var bw = Math.max(2, Math.floor(r.width * 0.5)), bh = Math.max(2, Math.floor(r.height * 0.5));
      if (cv.width !== bw || cv.height !== bh) { cv.width = bw; cv.height = bh; }
      gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(uRes, cv.width, cv.height);
    }
    resize(); window.addEventListener("resize", resize, { passive: true });

    var t0 = (trigger === "load") ? performance.now() : null;
    if (trigger === "load") { host.classList.add("aurora-lit"); if (glowWrap) glowWrap.classList.add("lit"); }
    var visible = false;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible && trigger === "view" && t0 === null) { t0 = performance.now(); host.classList.add("aurora-lit"); if (glowWrap) glowWrap.classList.add("lit"); }
      }, { threshold: 0.25 }).observe(host);
    } else { visible = true; if (t0 === null) t0 = performance.now(); }

    var last = performance.now(), carry = 0, MINDT = 1 / 30;
    function loop(now) {
      requestAnimationFrame(loop);
      if (!visible || document.hidden || t0 === null) return;
      var dt = Math.min((now - last) / 1000, 0.05); last = now; carry += dt;
      if (carry < MINDT) return; carry = 0;
      var el = (now - t0) / 1000;
      host.style.setProperty("--halo", (1 - smooth(L[0], L[0] + 8, el)).toFixed(3));
      gl.uniform1f(uTime, el);
      gl.uniform1f(uL, smooth(L[0], L[1], el));
      gl.uniform1f(uR, smooth(R[0], R[1], el));
      resize(); gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    requestAnimationFrame(loop);
  }

  function init() { for (var i = 0; i < hosts.length; i++) build(hosts[i]); }
  function defer() { if ("requestIdleCallback" in window) requestIdleCallback(init, { timeout: 2000 }); else setTimeout(init, 800); }
  if (document.readyState === "complete") defer(); else window.addEventListener("load", defer);
})();
