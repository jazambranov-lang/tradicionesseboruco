const siteHeader = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-menu a');
const revealElements = document.querySelectorAll('.reveal');

function updateHeader() {
  if (window.scrollY > 40) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateHeader);
updateHeader();

menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach((element) => observer.observe(element));


const filterButtons = document.querySelectorAll('.filter-btn');
const traditionCards = document.querySelectorAll('.tradition-card');
const traditionModal = document.getElementById('traditionModal');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalDescription = document.getElementById('modalDescription');
const modalRequirements = document.getElementById('modalRequirements');
const modalImportance = document.getElementById('modalImportance');
const modalImage = document.getElementById('modalImage');
let lastFocusedElement = null;

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    traditionCards.forEach((card) => {
      const categories = card.dataset.category || '';
      const shouldShow = selectedFilter === 'todas' || categories.includes(selectedFilter);
      card.classList.toggle('hidden', !shouldShow);
    });
  });
});

function openTraditionModal(card) {
  lastFocusedElement = document.activeElement;
  modalTitle.textContent = card.dataset.title;
  modalDate.textContent = card.dataset.date;
  modalDescription.textContent = card.dataset.description;
  modalRequirements.textContent = card.dataset.requirements;
  modalImportance.textContent = card.dataset.importance;
  if (modalImage) {
    modalImage.src = card.dataset.image || '';
    modalImage.alt = card.dataset.imageAlt || card.dataset.title || 'Imagen de la tradición';
  }
  traditionModal.classList.add('open');
  traditionModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  traditionModal.querySelector('.modal-close').focus();
}

function closeTraditionModal() {
  traditionModal.classList.remove('open');
  traditionModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocusedElement) lastFocusedElement.focus();
}

traditionCards.forEach((card) => {
  const button = card.querySelector('.read-more');
  button.addEventListener('click', () => openTraditionModal(card));
});

traditionModal?.addEventListener('click', (event) => {
  if (event.target.matches('[data-close-modal]')) {
    closeTraditionModal();
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && traditionModal?.classList.contains('open')) {
    closeTraditionModal();
  }
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Gracias por compartir tu mensaje. Puedes conectar este formulario con Formspree, Netlify Forms o el servicio que prefieras.');
    contactForm.reset();
  });
}
