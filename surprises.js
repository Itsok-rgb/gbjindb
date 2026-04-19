(function () {
  "use strict";

  /* Wish stars: order 1, 2, 3 by data-size */
  var wishRow = document.getElementById("wishRow");
  var wishMsg = document.getElementById("wishMsg");
  var sequence = [];
  var target = [1, 2, 3];

  if (wishRow && wishMsg) {
    wishRow.querySelectorAll(".wish-star").forEach(function (star) {
      star.addEventListener("click", function () {
        var size = parseInt(star.getAttribute("data-size") || "0", 10);
        sequence.push(size);
        star.classList.add("is-correct");
        setTimeout(function () {
          star.classList.remove("is-correct");
        }, 400);
        if (sequence.length === 3) {
          var ok =
            sequence[0] === target[0] && sequence[1] === target[1] && sequence[2] === target[2];
          wishMsg.textContent = ok
            ? "Your three wishes are granted — starting with endless love."
            : "Close! Try again: left to right — small, then medium, then the biggest sparkle.";
          sequence = [];
        }
      });
    });
  }

  /* Drawer slider */
  var drawer = document.getElementById("drawer");
  var knob = drawer && drawer.querySelector(".drawer-knob");
  var track = drawer && drawer.querySelector(".drawer-track");
  var drawerSecret = document.getElementById("drawerSecret");

  if (knob && track && drawerSecret) {
    var dragging = false;
    var startX = 0;
    var startLeft = 0;

    function maxLeft() {
      return track.getBoundingClientRect().width - knob.offsetWidth - 8;
    }

    function setKnob(left) {
      var max = maxLeft();
      var x = Math.max(4, Math.min(max, left));
      knob.style.left = x + "px";
      knob.setAttribute("aria-valuenow", String(Math.round((x / max) * 100)));
      if (x >= max - 6) {
        drawerSecret.removeAttribute("hidden");
      }
    }

    function onPointerDown(ev) {
      dragging = true;
      startX = ev.clientX || (ev.touches && ev.touches[0].clientX) || 0;
      startLeft = knob.offsetLeft;
      knob.setPointerCapture && ev.pointerId != null && knob.setPointerCapture(ev.pointerId);
    }

    function onPointerMove(ev) {
      if (!dragging) return;
      var cx = ev.clientX || (ev.touches && ev.touches[0] && ev.touches[0].clientX) || 0;
      setKnob(startLeft + (cx - startX));
    }

    function onPointerUp() {
      dragging = false;
    }

    knob.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    knob.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
  }

  /* Love meter hold */
  var meterBtn = document.getElementById("meterBtn");
  var meterFill = document.getElementById("meterFill");
  var meterDone = document.getElementById("meterDone");
  var holdTimer = null;
  var holdVal = 0;

  function clearHold() {
    if (holdTimer) {
      cancelAnimationFrame(holdTimer);
      holdTimer = null;
    }
  }

  function tick() {
    holdVal += 2;
    if (meterFill) {
      meterFill.style.width = Math.min(holdVal, 100) + "%";
    }
    if (holdVal >= 100) {
      clearHold();
      if (meterDone) {
        meterDone.removeAttribute("hidden");
      }
      holdVal = 0;
      return;
    }
    holdTimer = requestAnimationFrame(tick);
  }

  if (meterBtn && meterFill) {
    function startHold() {
      holdVal = 0;
      meterFill.style.width = "0%";
      if (meterDone) {
        meterDone.setAttribute("hidden", "");
      }
      clearHold();
      holdTimer = requestAnimationFrame(tick);
    }
    function endHold() {
      clearHold();
      if (holdVal < 100) {
        meterFill.style.width = "0%";
      }
      holdVal = 0;
    }
    meterBtn.addEventListener("mousedown", startHold);
    meterBtn.addEventListener("mouseup", endHold);
    meterBtn.addEventListener("mouseleave", endHold);
    meterBtn.addEventListener("touchstart", startHold, { passive: true });
    meterBtn.addEventListener("touchend", endHold);
    meterBtn.addEventListener("touchcancel", endHold);
  }

  /* Type "jaan" easter egg */
  var buffer = "";
  var eggMsg = document.getElementById("eggMsg");
  window.addEventListener("keydown", function (e) {
    if (e.key && e.key.length === 1) {
      buffer = (buffer + e.key.toLowerCase()).slice(-8);
      if (buffer.endsWith("jaan") && eggMsg) {
        eggMsg.textContent = "You spelled magic. I love you, Jaan — now and always.";
        buffer = "";
      }
    }
  });

  /* Confetti + finale */
  var celebrateBtn = document.getElementById("celebrateBtn");
  var finaleText = document.getElementById("finaleText");
  var confettiCanvas = document.getElementById("confetti");

  function burstConfetti() {
    if (!confettiCanvas) return;
    var ctx = confettiCanvas.getContext("2d");
    if (!ctx) return;
    var w = (confettiCanvas.width = window.innerWidth);
    var h = (confettiCanvas.height = window.innerHeight);
    var pieces = [];
    var colors = ["#ff8fab", "#e8b4ff", "#f4d58d", "#fff5f8"];
    for (var i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * w,
        y: Math.random() * -h,
        vy: 2 + Math.random() * 4,
        vx: -2 + Math.random() * 4,
        r: 3 + Math.random() * 5,
        c: colors[(Math.random() * colors.length) | 0],
        rot: Math.random() * Math.PI,
        vr: -0.2 + Math.random() * 0.4,
      });
    }
    var start = performance.now();
    function frame(now) {
      var t = now - start;
      ctx.clearRect(0, 0, w, h);
      pieces.forEach(function (p) {
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 1.2);
        ctx.restore();
      });
      if (t < 3500) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    }
    requestAnimationFrame(frame);
  }

  if (celebrateBtn && finaleText) {
    celebrateBtn.addEventListener("click", function () {
      finaleText.removeAttribute("hidden");
      burstConfetti();
    });
  }
})();
