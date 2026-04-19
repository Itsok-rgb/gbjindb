(function () {
  "use strict";

  /* Flip cards */
  document.querySelectorAll(".flip-trigger").forEach(function (btn) {
    var card = btn.closest(".memory-card");
    if (!card) return;
    btn.addEventListener("click", function () {
      var flipped = card.classList.toggle("is-flipped");
      btn.setAttribute("aria-expanded", flipped ? "true" : "false");
    });
  });

  /* Heart messages */
  document.querySelectorAll(".heart-btn").forEach(function (h) {
    h.addEventListener("click", function () {
      var toast = document.querySelector(".heart-toast");
      var msg = h.getAttribute("data-msg") || "";
      if (toast) {
        toast.textContent = msg;
      }
      h.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
        { duration: 400, easing: "ease-out" }
      );
    });
  });

  /* Scratch canvas */
  document.querySelectorAll(".scratch-canvas").forEach(function (canvas) {
    var wrap = canvas.closest(".scratch-area");
    if (!wrap) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    function sizeCanvas() {
      var rect = wrap.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#c9a8d8";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      for (var i = 0; i < 40; i++) {
        ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 3, 3);
      }
    }

    function sizeSoon() {
      requestAnimationFrame(function () {
        sizeCanvas();
      });
    }
    sizeSoon();
    window.addEventListener("resize", sizeSoon);

    var scratching = false;

    function scratchAt(clientX, clientY) {
      var rect = canvas.getBoundingClientRect();
      var x = clientX - rect.left;
      var y = clientY - rect.top;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    function onMove(ev) {
      if (!scratching) return;
      var cx = ev.clientX;
      var cy = ev.clientY;
      if (ev.touches && ev.touches[0]) {
        cx = ev.touches[0].clientX;
        cy = ev.touches[0].clientY;
      }
      scratchAt(cx, cy);
    }

    canvas.addEventListener("mousedown", function (e) {
      scratching = true;
      scratchAt(e.clientX, e.clientY);
    });
    window.addEventListener("mouseup", function () {
      scratching = false;
    });
    canvas.addEventListener("touchstart", function (e) {
      scratching = true;
      if (e.touches[0]) {
        scratchAt(e.touches[0].clientX, e.touches[0].clientY);
      }
    });
    canvas.addEventListener(
      "touchmove",
      function (e) {
        e.preventDefault();
        onMove(e);
      },
      { passive: false }
    );
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchend", function () {
      scratching = false;
    });
  });
})();
