const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const revealElements = document.querySelectorAll('.reveal');

function updateHeader() {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateHeader);
updateHeader();

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(element => observer.observe(element));

const form = document.querySelector('.contact-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  alert('Gracias por compartir tu mensaje. Puedes conectar este formulario a un servicio real más adelante.');
});
