/* FERMENTO — motor compartido: Barba (telón) + ScrollSmoother (recreado por página) */
(function(){
  "use strict";
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  history.scrollRestoration = "manual";

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  ScrollTrigger.config({ ignoreMobileResize: true });

  function crearSmoother(){
    if (REDUCED) return null;
    return ScrollSmoother.create({ smooth: .9, effects: true, smoothTouch: .1 });
  }

  function marcarNav(ns){
    document.querySelectorAll("#nav .enlaces a").forEach(function(a){
      a.classList.toggle("activa", a.dataset.ns === ns);
    });
  }

  function initPage(container, ns){
    marcarNav(ns);
    if (container.dataset.titulo) document.title = container.dataset.titulo;

    /* srcset para fotos hotlink de Pexels */
    container.querySelectorAll('img[src*="images.pexels.com"]').forEach(function(img){
      if (img.srcset) return;
      img.srcset = [500, 1000, 1600].map(function(w){
        return img.src.replace(/([?&])w=\d+/, "$1w=" + w) + " " + w + "w";
      }).join(", ");
      img.sizes = "(max-width: 799px) 92vw, 46vw";
    });

    /* reveals escopados al container */
    if (!REDUCED){
      gsap.utils.toArray(container.querySelectorAll("[data-reveal]")).forEach(function(el){
        gsap.from(el, {
          y: 44, opacity: 0, duration: 1.05, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 84%", once: true }
        });
      });
    }

    /* videos del container */
    container.querySelectorAll("video").forEach(function(v){
      v.muted = true;
      var p = v.play(); if (p) p.catch(function(){});
    });

    /* alturas cambian al cargar imágenes → refresh */
    container.querySelectorAll("img").forEach(function(img){
      if (!img.complete) img.addEventListener("load", function(){ ScrollTrigger.refresh(); }, { once: true });
    });
    requestAnimationFrame(function(){ ScrollTrigger.refresh(); });
  }

  /* ============ TELÓN ============ */
  var telon = document.getElementById("telon");
  var sello = document.getElementById("telon-sello");

  function cubrir(){
    var tl = gsap.timeline();
    tl.set(telon, { display: "block", yPercent: 100 })
      .to(telon, { yPercent: 0, duration: .55, ease: "power3.inOut" })
      .fromTo(sello, { scale: .6, opacity: 0, rotation: -8 },
        { scale: 1, opacity: 1, rotation: 0, duration: .34, ease: "back.out(2)" }, "-=.12");
    return tl;
  }
  function descubrir(){
    var tl = gsap.timeline();
    tl.to(sello, { opacity: 0, scale: 1.08, duration: .22, ease: "power2.in" })
      .to(telon, { yPercent: -100, duration: .55, ease: "power3.inOut" }, "-=.04")
      .set(telon, { display: "none", yPercent: 100 });
    return tl;
  }

  /* ============ BARBA ============ */
  if (typeof barbaPrefetch !== "undefined") barba.use(barbaPrefetch);

  barba.hooks.after(function(){
    /* el contenedor viejo ya no existe: recalcular posiciones reales */
    requestAnimationFrame(function(){ ScrollTrigger.refresh(); });
  });

  barba.hooks.beforeEnter(function(data){
    /* la receta: matar triggers viejos, matar smoother, resetear scroll, recrear */
    ScrollTrigger.getAll().forEach(function(t){ t.kill(); });
    var sm = ScrollSmoother.get();
    if (sm){ sm.scrollTo(0); sm.kill(); }
    window.scrollTo(0, 0);
    crearSmoother();
    initPage(data.next.container, data.next.namespace);
  });

  barba.init({
    preventRunning: true,
    transitions: [{
      name: "telon-harina",
      once: function(data){
        /* primera carga: beforeEnter global ya corrió (crea smoother e inicializa) */
        if (REDUCED) return;
        return gsap.from(data.next.container, { opacity: 0, duration: .7, ease: "power2.out" });
      },
      leave: function(){
        if (REDUCED) return;
        return cubrir();
      },
      enter: function(){
        if (REDUCED) return;
        return descubrir();
      }
    }]
  });

  /* la primera carga la inicializa el propio hook beforeEnter de Barba
     (verificado: también dispara en el once inicial) */
})();
