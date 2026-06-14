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
    hero: { w: 1600, h: 900, label: "Cinematic Hero", sub: "assets/hero-bg-v2.png" },
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
     Reusable lightbox — one modal serves every carousel.
     Click/tap a screenshot (or the Enlarge hint) to open
     it full-screen with prev/next, zoom, and keyboard
     support. If this fails, carousels keep working.
  --------------------------------------------------- */
  function initLightbox() {
    var carousels = document.querySelectorAll("[data-carousel]");
    if (!carousels.length || !document.body) return;

    var ICON = {
      close: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>',
      prev: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 18l-6-6 6-6"/></svg>',
      next: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6"/></svg>',
      zoomIn: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg>',
      zoomOut: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8 11h6"/></svg>',
      reset: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4"/></svg>',
      mag: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg>'
    };

    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Project screenshot viewer");
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="lightbox__backdrop" data-lightbox-close></div>' +
      '<div class="lightbox__counter mono" data-lightbox-counter></div>' +
      '<div class="lightbox__stage" data-lightbox-stage>' +
        '<img class="lightbox__img" alt="" data-lightbox-img draggable="false" />' +
      "</div>" +
      '<p class="lightbox__caption" data-lightbox-caption></p>' +
      '<button class="lightbox__btn lightbox__close" type="button" data-lightbox-close aria-label="Close viewer (Escape)">' + ICON.close + "</button>" +
      '<button class="lightbox__btn lightbox__nav lightbox__prev" type="button" data-lightbox-prev aria-label="Previous image (Left arrow)">' + ICON.prev + "</button>" +
      '<button class="lightbox__btn lightbox__nav lightbox__next" type="button" data-lightbox-next aria-label="Next image (Right arrow)">' + ICON.next + "</button>" +
      '<div class="lightbox__zoom-bar" role="group" aria-label="Zoom controls">' +
        '<button class="lightbox__btn" type="button" data-lightbox-zoomout aria-label="Zoom out (minus key)">' + ICON.zoomOut + "</button>" +
        '<button class="lightbox__btn" type="button" data-lightbox-zoomreset aria-label="Reset zoom (0 key)">' + ICON.reset + "</button>" +
        '<button class="lightbox__btn" type="button" data-lightbox-zoomin aria-label="Zoom in (plus key)">' + ICON.zoomIn + "</button>" +
      "</div>";
    document.body.appendChild(overlay);

    var imgEl = overlay.querySelector("[data-lightbox-img]");
    var stageEl = overlay.querySelector("[data-lightbox-stage]");
    var captionEl = overlay.querySelector("[data-lightbox-caption]");
    var counterEl = overlay.querySelector("[data-lightbox-counter]");
    var prevBtn = overlay.querySelector("[data-lightbox-prev]");
    var nextBtn = overlay.querySelector("[data-lightbox-next]");
    var closeBtn = overlay.querySelector("[data-lightbox-close]:not(.lightbox__backdrop)") || overlay.querySelector(".lightbox__close");

    var ZMIN = 1, ZMAX = 4, ZSTEP = 0.5;
    var group = [];
    var current = 0;
    var zoom = 1, panX = 0, panY = 0;
    var lastFocus = null;

    function applyTransform() {
      imgEl.style.transform =
        "translate(" + panX + "px," + panY + "px) scale(" + zoom + ")";
      stageEl.classList.toggle("is-zoomed", zoom > 1);
    }
    function setZoom(z) {
      zoom = Math.min(ZMAX, Math.max(ZMIN, Math.round(z * 100) / 100));
      if (zoom === 1) { panX = 0; panY = 0; }
      applyTransform();
    }
    function resetZoom() {
      zoom = 1; panX = 0; panY = 0; applyTransform();
    }

    function render() {
      var item = group[current];
      if (!item) return;
      resetZoom();
      imgEl.src = item.src;
      imgEl.alt = item.alt || "Project screenshot";
      captionEl.textContent = item.alt || "";
      var multi = group.length > 1;
      counterEl.textContent = multi ? current + 1 + " / " + group.length : "";
      prevBtn.hidden = !multi;
      nextBtn.hidden = !multi;
    }

    function next() { if (group.length > 1) { current = (current + 1) % group.length; render(); } }
    function prev() { if (group.length > 1) { current = (current - 1 + group.length) % group.length; render(); } }

    function focusables() {
      var nodes = overlay.querySelectorAll("button");
      return Array.prototype.filter.call(nodes, function (el) {
        return !el.hidden && el.offsetParent !== null;
      });
    }
    function trapFocus(e) {
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
    function onKey(e) {
      switch (e.key) {
        case "Escape": e.preventDefault(); close(); break;
        case "ArrowRight": e.preventDefault(); next(); break;
        case "ArrowLeft": e.preventDefault(); prev(); break;
        case "+": case "=": e.preventDefault(); setZoom(zoom + ZSTEP); break;
        case "-": case "_": e.preventDefault(); setZoom(zoom - ZSTEP); break;
        case "0": e.preventDefault(); resetZoom(); break;
        case "Tab": trapFocus(e); break;
      }
    }

    function open(items, index, trigger) {
      if (!items || !items.length) return;
      group = items;
      current = Math.min(Math.max(index || 0, 0), items.length - 1);
      lastFocus = trigger && typeof trigger.focus === "function" ? trigger : null;
      overlay.hidden = false;
      document.body.classList.add("lightbox-open");
      render();
      if (closeBtn) closeBtn.focus();
      document.addEventListener("keydown", onKey, true);
    }
    function close() {
      overlay.hidden = true;
      document.body.classList.remove("lightbox-open");
      document.removeEventListener("keydown", onKey, true);
      imgEl.removeAttribute("src");
      resetZoom();
      if (lastFocus) lastFocus.focus();
      lastFocus = null;
    }

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);
    overlay.querySelector("[data-lightbox-zoomin]").addEventListener("click", function () { setZoom(zoom + ZSTEP); });
    overlay.querySelector("[data-lightbox-zoomout]").addEventListener("click", function () { setZoom(zoom - ZSTEP); });
    overlay.querySelector("[data-lightbox-zoomreset]").addEventListener("click", resetZoom);

    var closers = overlay.querySelectorAll("[data-lightbox-close]");
    for (var c = 0; c < closers.length; c++) {
      closers[c].addEventListener("click", function (e) {
        e.preventDefault();
        close();
      });
    }

    stageEl.addEventListener("dblclick", function () {
      setZoom(zoom > 1 ? 1 : 2);
    });

    // Drag-to-pan when zoomed in
    var panning = false, startPx = 0, startPy = 0, baseX = 0, baseY = 0;
    stageEl.addEventListener("pointerdown", function (e) {
      if (zoom <= 1) return;
      panning = true;
      startPx = e.clientX; startPy = e.clientY;
      baseX = panX; baseY = panY;
      stageEl.classList.add("is-panning");
      try { stageEl.setPointerCapture(e.pointerId); } catch (err) {}
    });
    stageEl.addEventListener("pointermove", function (e) {
      if (!panning) return;
      panX = baseX + (e.clientX - startPx);
      panY = baseY + (e.clientY - startPy);
      applyTransform();
    });
    function endPan() {
      if (!panning) return;
      panning = false;
      stageEl.classList.remove("is-panning");
    }
    stageEl.addEventListener("pointerup", endPan);
    stageEl.addEventListener("pointercancel", endPan);

    function buildItems(slides) {
      var items = [];
      for (var i = 0; i < slides.length; i++) {
        var img = slides[i].querySelector("img");
        if (!img) continue;
        items.push({
          src: img.currentSrc || img.src,
          alt: img.getAttribute("alt") || ""
        });
      }
      return items;
    }
    function activeIndex(slides) {
      for (var i = 0; i < slides.length; i++) {
        if (slides[i].getAttribute("aria-hidden") !== "true") return i;
      }
      return 0;
    }

    for (var n = 0; n < carousels.length; n++) {
      (function (carousel) {
        var slides = carousel.querySelectorAll(".carousel__slide");
        if (!slides.length) return;

        var trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "carousel__zoom";
        trigger.setAttribute("aria-label", "Enlarge screenshot");
        trigger.innerHTML = ICON.mag + "<span>Enlarge</span>";
        trigger.addEventListener("click", function () {
          open(buildItems(slides), activeIndex(slides), trigger);
        });
        carousel.appendChild(trigger);

        for (var s = 0; s < slides.length; s++) {
          (function (slideIndex) {
            var img = slides[slideIndex].querySelector("img");
            if (!img) return;
            img.classList.add("is-zoomable");
            img.addEventListener("click", function () {
              open(buildItems(slides), slideIndex, trigger);
            });
          })(s);
        }
      })(carousels[n]);
    }
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
    var finalText = String(target) + suffix;
    if (reduceMotion) {
      el.textContent = finalText;
      return;
    }
    // Static HTML already shows the final value for no-JS/ATS readers.
    if (el.textContent.trim() === finalText) return;
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
    initLightbox();
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
