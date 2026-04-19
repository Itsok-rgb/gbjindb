(function () {
  "use strict";

  /* Mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Active nav for in-page sections */
  var sectionIds = ["home", "timeline", "memories", "confession", "surprises"];
  var navSectionLinks = document.querySelectorAll(".nav-section-link");
  function setActiveSection(id) {
    navSectionLinks.forEach(function (a) {
      var href = a.getAttribute("href") || "";
      a.classList.toggle("active", href === "#" + id);
    });
  }
  var headerEl = document.querySelector(".site-header");
  function updateActiveFromScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var offset = (headerEl && headerEl.offsetHeight) || 72;
    var pad = 24;
    var current = "home";
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el.offsetTop <= y + offset + pad) {
        current = id;
      }
    });
    setActiveSection(current);
  }
  var scrollTick = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!scrollTick) {
        window.requestAnimationFrame(function () {
          updateActiveFromScroll();
          scrollTick = false;
        });
        scrollTick = true;
      }
    },
    { passive: true }
  );
  window.addEventListener("hashchange", updateActiveFromScroll);
  window.addEventListener("load", updateActiveFromScroll);
  updateActiveFromScroll();

  /* Scroll reveal */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Secret orb — home */
  var orb = document.querySelector(".secret-orb");
  var pop = document.getElementById("secretHome");
  if (orb && pop) {
    orb.addEventListener("click", function () {
      var hidden = pop.hasAttribute("hidden");
      if (hidden) {
        pop.removeAttribute("hidden");
      } else {
        pop.setAttribute("hidden", "");
      }
    });
  }

  /* Tap sparkles (footer hint) */
  document.body.addEventListener(
    "click",
    function (ev) {
      if (ev.target.closest("a, button, input, textarea, select, summary, .scratch-canvas, .drawer-knob")) {
        return;
      }
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        spawnSparkle(ev.clientX, ev.clientY);
      }
    },
    { passive: true }
  );

  function spawnSparkle(x, y) {
    var s = document.createElement("span");
    s.className = "sparkle";
    s.textContent = "✦";
    s.style.left = x - 4 + "px";
    s.style.top = y - 4 + "px";
    s.style.color = Math.random() > 0.5 ? "#ff8fab" : "#f4d58d";
    document.body.appendChild(s);
    setTimeout(function () {
      s.remove();
    }, 900);
  }

  /* Timeline accordion */
  document.querySelectorAll(".timeline-marker").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("aria-controls");
      var panel = id ? document.getElementById(id) : null;
      if (!panel) return;
      var expanded = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".timeline-marker").forEach(function (b) {
        var pid = b.getAttribute("aria-controls");
        var p = pid ? document.getElementById(pid) : null;
        if (p && b !== btn) {
          b.setAttribute("aria-expanded", "false");
          p.setAttribute("hidden", "");
        }
      });
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (expanded) {
        panel.setAttribute("hidden", "");
      } else {
        panel.removeAttribute("hidden");
      }
    });
  });

  /* Long-press whisper */
  document.querySelectorAll(".timeline-secret").forEach(function (el) {
    var whisper = el.parentElement && el.parentElement.querySelector(".timeline-whisper");
    if (!whisper) return;
    var timer = null;
    function show() {
      whisper.removeAttribute("hidden");
    }
    function hide() {
      whisper.setAttribute("hidden", "");
    }
    el.addEventListener("touchstart", function (e) {
      e.preventDefault();
      timer = setTimeout(show, 550);
    });
    el.addEventListener("touchend", function () {
      clearTimeout(timer);
      setTimeout(hide, 2000);
    });
    el.addEventListener("mousedown", function () {
      timer = setTimeout(show, 550);
    });
    el.addEventListener("mouseup", function () {
      clearTimeout(timer);
      setTimeout(hide, 2500);
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        whisper.toggleAttribute("hidden");
      }
    });
  });

  document.querySelectorAll(".mini-reveal").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var t = btn.parentElement && btn.parentElement.querySelector(".mini-reveal-text");
      if (t) {
        t.toggleAttribute("hidden");
      }
    });
  });
})();
