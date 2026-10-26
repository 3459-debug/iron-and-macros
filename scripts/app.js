/* ==========================================================================
   Iron & Macros - app.js
   Shared site behavior: mobile nav toggle + active link highlighting.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Mobile navigation toggle ---------- */
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("mainNav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      toggle.classList.toggle("open");
    });

    // Close the menu when a link is tapped
    nav.addEventListener("click", function (e) {
      if (e.target.classList.contains("nav-link")) {
        nav.classList.remove("open");
      }
    });
  }

  /* ---------- Highlight current page link ---------- */
  var path = window.location.pathname.split("/").pop() || "index.html";
  var links = document.querySelectorAll(".nav-link");
  links.forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector(".footer-inner p");
  if (yearEl && yearEl.textContent.indexOf("2026") === -1) {
    // keep the static 2026 for the assignment, no-op otherwise
  }
})();
