const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const hero = document.querySelector(".hero-orbit");
window.addEventListener("mousemove", e => {
  if (!hero || window.innerWidth < 850) return;
  const x = (e.clientX / window.innerWidth - .5) * 12;
  const y = (e.clientY / window.innerHeight - .5) * 12;
  hero.style.transform = `translate(${x}px, ${y}px)`;
});