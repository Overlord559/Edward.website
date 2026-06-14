/* =====================================================
   Edward Stone — "Operator Dossier"
   Vanilla JS. No dependencies, no build step.
   ===================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------
     Footer year
  --------------------------------------------------- */
  function setYear() {
    var nodes = document.querySelectorAll("[data-year]");
    var year = String(new Date().getFullYear());
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = year;
  }

  /* ---------------------------------------------------
     Themed placeholder images (graceful fallback)
     Any <img data-fallback="..."> that fails to load
     swaps to an on-brand labeled placeholder. Drop a
     real file at the same path later and it just works.
  --------------------------------------------------- */
  var PLACEHOLDER = {
    hero: { w: 1600, h: 900, label: "Cinematic Hero", sub: "assets/hero-bg.png" },
    portrait: { w: 800, h: 1000, label: "Portrait", sub: "assets/edward-portrait.png" },
    service: { w: 1200, h: 800, label: "Service Photo", sub: "assets/edward-military.png" },
    shot: { w: 1600, h: 1000, label: "Screenshot", sub: "Visual pending" }
  };

  function placeholderDataUri(kind, altLabel) {
    var cfg = PLACEHOLDER[kind] || PLACEHOLDER.shot;
    var w = cfg.w, h = cfg.h;
    var title = (altLabel || cfg.label).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    if (title.length > 46) title = title.slice(0, 44) + "…";
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#18243b"/><stop offset="1" stop-color="#0f1828"/>' +
      "</linearGradient></defs>" +
      '<rect width="' + w + '" height="' + h + '" fill="url(#g)"/>' +
      gridLines(w, h) +
      reticleCorners(w, h) +
      '<circle cx="' + w / 2 + '" cy="' + (h / 2 - 26) + '" r="34" fill="none" stroke="#ff7a3d" stroke-width="2"/>' +
      '<line x1="' + (w / 2 - 50) + '" y1="' + (h / 2 - 26) + '" x2="' + (w / 2 + 50) + '" y2="' + (h / 2 - 26) + '" stroke="#ff7a3d" stroke-width="1.5"/>' +
      '<line x1="' + w / 2 + '" y1="' + (h / 2 - 76) + '" x2="' + w / 2 + '" y2="' + (h / 2 + 24) + '" stroke="#ff7a3d" stroke-width="1.5"/>' +
      '<text x="' + w / 2 + '" y="' + (h / 2 + 48) + '" font-family="Space Grotesk, Arial, sans-serif" font-size="30" font-weight="600" fill="#eef2f8" text-anchor="middle">' + title + "</text>" +
      '<text x="' + w / 2 + '" y="' + (h / 2 + 84) + '" font-family="IBM Plex Mono, monospace" font-size="16" letter-spacing="2" fill="#8a99b5" text-anchor="middle">' + cfg.sub.toUpperCase() + "</text>" +
      "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function gridLines(w, h) {
    var s = "", step = 64, i;
    for (i = step; i < w; i += step)
      s += '<line x1="' + i + '" y1="0" x2="' + i + '" y2="' + h + '" stroke="#8a99b5" stroke-opacity="0.06" stroke-width="1"/>';
    for (i = step; i < h; i += step)
      s += '<line x1="0" y1="' + i + '" x2="' + w + '" y2="' + i + '" stroke="#8a99b5" stroke-opacity="0.06" stroke-width="1"/>';
    return s;
  }

  function reticleCorners(w, h) {
    var m = 22, L = 34, c = "#ff7a3d", sw = 3;
    function corner(x, y, dx, dy) {
      return (
        '<path d="M' + x + " " + (y + dy * L) + " L" + x + " " + y + " L" + (x + dx * L) + " " + y + '" fill="none" stroke="' + c + '" stroke-width="' + sw + '"/>'
      );
    }
    return (
      corner(m, m, 1, 1) +
      corner(w - m, m, -1, 1) +
      corner(m, h - m, 1, -1) +
      corner(w - m, h - m, -1, -1)
    );
  }

  function wireImageFallbacks() {
    var imgs = document.querySelectorAll("img[data-fallback]");
    for (var i = 0; i < imgs.length; i++) {
      (function (img) {
        function fail() {
          if (img.dataset.fallbackApplied) return;
          img.dataset.fallbackApplied = "1";
          var kind = img.getAttribute("data-fallback");
          var slide = img.closest(".carousel__slide");
          if (slide) slide.classList.add("is-placeholder");
          // Hero background: leave the CSS gradient, just drop the broken img.
          if (kind === "hero") {
            img.style.display = "none";
            return;
          }
          var alt = img.getAttribute("alt");
          img.src = placeholderDataUri(kind, alt && alt.length > 4 ? alt : null);
        }
        img.addEventListener("error", fail);
        if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) fail();
      })(imgs[i]);
    }
  }

  /* ---------------------------------------------------
     Reusable carousel — one pass wires every [data-carousel]
  --------------------------------------------------- */
  function initCarousel(root) {
    var track = root.querySelector("[data-carousel-track]");
    var slides = track ? Array.prototype.slice.call(track.children) : [];
    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    var dotsWrap = root.querySelector("[data-carousel-dots]");
    if (!track || slides.length === 0) return;

    var index = 0;
    var count = slides.length;
    var dots = [];

    if (dotsWrap) {
      for (var i = 0; i < count; i++) {
        (function (i) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "carousel__dot";
          dot.setAttribute("role", "tab");
          dot.setAttribute("aria-label", "Go to slide " + (i + 1) + " of " + count);
          dot.addEventListener("click", function () {
            goTo(i);
          });
          dotsWrap.appendChild(dot);
          dots.push(dot);
        })(i);
      }
    }

    for (var s = 0; s < count; s++) {
      slides[s].setAttribute("aria-label", s + 1 + " of " + count);
    }

    function update() {
      track.style.transform = "translateX(" + -index * 100 + "%)";
      for (var d = 0; d < dots.length; d++) {
        var active = d === index;
        dots[d].classList.toggle("is-active", active);
        dots[d].setAttribute("aria-selected", active ? "true" : "false");
      }
      for (var v = 0; v < count; v++) {
        slides[v].setAttribute("aria-hidden", v === index ? "false" : "true");
      }
    }

    function goTo(i) {
      index = (i + count) % count;
      update();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    });

    // Touch swipe
    var startX = 0, deltaX = 0, swiping = false;
    var viewport = root.querySelector(".carousel__viewport") || root;
    viewport.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX; deltaX = 0; swiping = true;
    }, { passive: true });
    viewport.addEventListener("touchmove", function (e) {
      if (swiping) deltaX = e.touches[0].clientX - startX;
    }, { passive: true });
    viewport.addEventListener("touchend", function () {
      if (!swiping) return;
      swiping = false;
      if (Math.abs(deltaX) > 45) { if (deltaX < 0) next(); else prev(); }
    });

    update();
  }

  function initAllCarousels() {
    var carousels = document.querySelectorAll("[data-carousel]");
    for (var i = 0; i < carousels.length; i++) initCarousel(carousels[i]);
  }

  /* ---------------------------------------------------
     Mobile nav
  --------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector(".nav__toggle");
    var menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    function close() {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    var links = menu.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) links[i].addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---------------------------------------------------
     Sticky header + scroll progress
  --------------------------------------------------- */
  function initScrollUI() {
    var header = document.querySelector(".site-header");
    var progress = document.querySelector("[data-progress]");
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.scrollY || document.documentElement.scrollTop;
        if (header) header.classList.toggle("is-scrolled", y > 8);
        if (progress) {
          var docH = document.documentElement.scrollHeight - window.innerHeight;
          var pct = docH > 0 ? (y / docH) * 100 : 0;
          progress.style.width = pct.toFixed(2) + "%";
        }
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  /* ---------------------------------------------------
     Count-up for stats
  --------------------------------------------------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target)) return;
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }
    var dur = 1100, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + (p === 1 ? suffix : "");
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  /* ---------------------------------------------------
     Scroll reveal + stat trigger
  --------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    var stats = document.querySelectorAll("[data-count]");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add("is-visible");
      for (var s = 0; s < stats.length; s++) countUp(stats[s]);
      return;
    }

    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    for (var j = 0; j < items.length; j++) revObs.observe(items[j]);

    var statObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          statObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    for (var k = 0; k < stats.length; k++) statObs.observe(stats[k]);
  }

  /* ---------------------------------------------------
     Boot
  --------------------------------------------------- */
  function init() {
    setYear();
    wireImageFallbacks();
    initAllCarousels();
    initNav();
    initScrollUI();
    initReveal();
    // Trigger hero load choreography on next frame.
    window.requestAnimationFrame(function () {
      document.body.classList.add("is-ready");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
