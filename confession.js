(function () {
  "use strict";

  var sealBtn = document.getElementById("sealBtn");
  var sealReveal = document.getElementById("sealReveal");
  if (sealBtn && sealReveal) {
    sealBtn.addEventListener("click", function () {
      var open = sealBtn.getAttribute("aria-expanded") === "true";
      sealBtn.setAttribute("aria-expanded", open ? "false" : "true");
      if (open) {
        sealReveal.setAttribute("hidden", "");
      } else {
        sealReveal.removeAttribute("hidden");
      }
    });
  }
})();
