import "./style.css";
import "./js/animations.js";
import "./js/mobile-nav.js";
import "./js/stats-counter.js";

document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});