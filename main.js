(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  var $ = function(sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function(sel, scope) { return Array.from((scope || document).querySelectorAll(sel)); };
  var escHTML = function(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  };

  function safe(fn, name) {
    try { fn(); } catch(e) { console.warn("[" + name + "]", e); }
  }

  /* ---- SPLASH ---- */
  function initSplash() {
    var splash = $("#splash");
    if (!splash) return;
    setTimeout(function() {
      splash.style.opacity = "0";
      splash.style.transition = "opacity 0.6s";
      setTimeout(function() {
        splash.style.display = "none";
        splash.setAttribute("aria-hidden", "true");
      }, 700);
    }, 2000);
  }

  /* ---- NAV ---- */
  function initNav() {
    var nav = $("#nav");
    var toggle = $(".nav-toggle");
    var links = $(".nav-links");
    if (!nav) return;

    // Scroll solidify
    window.addEventListener("scroll", function() {
      if (window.scrollY > 40) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    }, { passive: true });

    // Mobile toggle
    if (toggle && links) {
      toggle.addEventListener("click", function() {
        var open = links.classList.toggle("mobile-open");
        toggle.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      // Cerrar al hacer click en link
      links.querySelectorAll("a").forEach(function(a) {
        a.addEventListener("click", function() {
          links.classList.remove("mobile-open");
          toggle.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    // Smooth scroll para anclas
    document.addEventListener("click", function(e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  }

  /* ---- REVEALS (IntersectionObserver) ---- */
  function initReveals() {
    var items = $$(".reveal");
    if (!items.length) return;

    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });

    items.forEach(function(el, i) {
      el.style.transitionDelay = (i % 4) * 0.08 + "s";
      io.observe(el);
    });

    // Safety net: 6s
    setTimeout(function() {
      items.forEach(function(el) { el.classList.add("is-visible"); });
    }, 6000);
  }

  /* ---- MOUNT CULTURA ---- */
  function mountCultura() {
    var target = $("[data-cultura]");
    if (!target || target.children.length > 0 || !data.cultura) return;
    target.innerHTML = data.cultura.map(function(item, i) {
      return '<div class="cultura-card" style="transition-delay:' + (i * 0.12) + 's">' +
        '<span class="cultura-icono">' + escHTML(item.icono) + '</span>' +
        '<h3 class="cultura-titulo">' + escHTML(item.titulo) + '</h3>' +
        '<p class="cultura-texto">' + escHTML(item.texto) + '</p>' +
        '</div>';
    }).join("");

    // Observar las cards
    var cards = target.querySelectorAll(".cultura-card");
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    cards.forEach(function(c) { io.observe(c); });
    setTimeout(function() {
      cards.forEach(function(c) { c.classList.add("is-visible"); });
    }, 6000);
  }

  /* ---- MOUNT TRADICIONES ---- */
  function mountTradiciones() {
    var target = $("[data-tradiciones]");
    if (!target || target.children.length > 0 || !data.tradiciones) return;
    target.innerHTML = data.tradiciones.map(function(t, i) {
      return '<div class="tradicion-item" style="transition-delay:' + (i * 0.06) + 's">' +
        '<div class="tradicion-num">' + escHTML(t.num) + '</div>' +
        '<div class="tradicion-body">' +
          '<div class="tradicion-header">' +
            '<h3 class="tradicion-nombre">' + escHTML(t.nombre) + '</h3>' +
            '<span class="tradicion-fecha">' + escHTML(t.fecha) + '</span>' +
          '</div>' +
          '<p class="tradicion-desc">' + escHTML(t.descripcion) + '</p>' +
        '</div>' +
        '</div>';
    }).join("");

    var items = target.querySelectorAll(".tradicion-item");
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.03 });
    items.forEach(function(el) { io.observe(el); });
    setTimeout(function() {
      items.forEach(function(el) { el.classList.add("is-visible"); });
    }, 6000);
  }

  /* ---- GSAP HERO PARALLAX ---- */
  function initHeroParallax() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".hero-gradient", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to(".hero-content", {
      yPercent: 15,
      opacity: 0.3,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "30% top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  /* ---- GSAP STAGGER SECTIONS ---- */
  function initGsapReveals() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    $$(".section-header").forEach(function(header) {
      var children = header.querySelectorAll(".section-kicker, .section-title, .section-desc");
      if (!children.length) return;
      gsap.from(children, {
        opacity: 0, y: 40, stagger: 0.1, duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          once: true
        }
      });
      children.forEach(function(el) { el.style.opacity = ""; el.style.transform = ""; });
    });
  }

  /* ---- TILT en cards (solo desktop) ---- */
  function initTilt() {
    if (!fineHover) return;
    $$(".historia-card, .cultura-card").forEach(function(card) {
      card.addEventListener("mouseover", function(e) {
        if (card.contains(e.relatedTarget)) return;
        card.style.transition = "transform .1s, box-shadow .3s, border-color .3s";
      });
      card.addEventListener("mouseout", function(e) {
        if (card.contains(e.relatedTarget)) return;
        card.style.transform = "";
        card.style.transition = "transform .5s var(--ease-out), box-shadow .4s, border-color .3s";
      });
      card.addEventListener("mousemove", function(e) {
        var rect = card.getBoundingClientRect();
        var cx = (e.clientX - rect.left) / rect.width - 0.5;
        var cy = (e.clientY - rect.top) / rect.height - 0.5;
        var tx = cx * 10;
        var ty = cy * -10;
        card.style.transform = "perspective(800px) rotateY(" + tx + "deg) rotateX(" + ty + "deg) translateY(-6px)";
      });
    });
  }

  /* ---- HERO TITLE DELAY ---- */
  function initHeroTitleDelays() {
    $$(".hero-title .reveal").forEach(function(el, i) {
      el.style.transitionDelay = (0.3 + i * 0.12) + "s";
    });
  }

  /* ---- BOOT ---- */
  function boot() {
    safe(mountCultura, "mountCultura");
    safe(mountTradiciones, "mountTradiciones");
    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initHeroTitleDelays, "initHeroTitleDelays");
    safe(initReveals, "initReveals");
    safe(initTilt, "initTilt");

    if (window.gsap && window.ScrollTrigger) {
      safe(initHeroParallax, "initHeroParallax");
      safe(initGsapReveals, "initGsapReveals");
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
