/* ========= CARROSSEL (autoplay, pause on hover, keyboard) ========= */
const carousel = document.querySelector('.carousel');
const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const indicatorsWrap = document.querySelector('.carousel-indicators');

let idx = 0;
let autoplayInterval = null;
const AUTOPLAY_DELAY = 4200;

/* build indicators */
slides.forEach((_, i) => {
  const btn = document.createElement('button');
  btn.className = i === 0 ? 'active' : '';
  btn.setAttribute('aria-label', `Ir para slide ${i+1}`);
  btn.addEventListener('click', () => goTo(i));
  indicatorsWrap.appendChild(btn);
});

const indicators = Array.from(indicatorsWrap.children);

/* helper to update carousel transform + indicators */
function updateCarousel() {
  carousel.style.transform = `translateX(-${idx * 100}%)`;
  indicators.forEach((b, i) => b.classList.toggle('active', i === idx));
}

/* go to slide */
function goTo(i) {
  idx = (i + slides.length) % slides.length;
  updateCarousel();
}

/* next / prev */
function next() { goTo(idx + 1) }
function prev() { goTo(idx - 1) }

nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });
prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });

/* keyboard navigation */
carousel.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

/* autoplay */
function startAutoplay() {
  stopAutoplay();
  autoplayInterval = setInterval(() => { next(); }, AUTOPLAY_DELAY);
}
function stopAutoplay() { if (autoplayInterval) clearInterval(autoplayInterval); autoplayInterval = null; }
function restartAutoplay(){ stopAutoplay(); startAutoplay(); }

/* pause on hover/focus */
const carouselWrapper = document.querySelector('.carousel-wrapper');
carouselWrapper.addEventListener('mouseenter', stopAutoplay);
carouselWrapper.addEventListener('mouseleave', startAutoplay);
carousel.addEventListener('focusin', stopAutoplay);
carousel.addEventListener('focusout', startAutoplay);

/* init */
updateCarousel();
startAutoplay();

/* ========= FORMULÁRIO (validação e envio) ========= */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const whatsappBtn = document.getElementById('whatsappBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = '';
  const data = {
    nome: form.nome.value.trim(),
    email: form.email.value.trim(),
    telefone: form.telefone.value.trim(),
    horario: form.horario.value.trim(),
    nivel: form.nivel.value,
    mensagem: form.mensagem.value.trim(),
  };

  // validação simples
  if (!data.nome || !data.email || !data.telefone || !data.nivel) {
    status.textContent = 'Preencha os campos obrigatórios (nome, email, telefone e nível).';
    status.style.color = '#b91c1c';
    return;
  }

  // mostrar loading
  status.textContent = 'Enviando...';
  status.style.color = '#6b7280';

  try {
    // === Substitua a URL abaixo pelo seu endpoint real (Formspree, Netlify Forms, Zapier webhook, etc.)
    // Exemplo Formspree: https://formspree.io/f/your-id
    const ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // <-- substitua aqui

    const resp = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!resp.ok) throw new Error('Erro no envio');

    status.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
    status.style.color = '#059669';
    form.reset();
  } catch (err) {
    // fallback: não integrado -> mostra instrução para WhatsApp
    status.innerHTML = 'Não foi possível enviar automaticamente. <strong>Use o botão WhatsApp</strong> ou contate diretamente.';
    status.style.color = '#b45309';
  }
});

/* ========= WHATSAPP: gera mensagem e abre conversa ========= */
whatsappBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const phone = '5583996967150'; // substitua com DDI + DDD + número, ex: 5511999999999
  const nome = encodeURIComponent(form.nome.value || '');
  const tel = encodeURIComponent(form.telefone.value || '');
  const nivel = encodeURIComponent(form.nivel.value || '');
  const horario = encodeURIComponent(form.horario.value || '');
  const msg = encodeURIComponent(form.mensagem.value || '');
  const text = `Olá, sou ${nome || '[Nome]'}%0ATelefone: ${tel}%0A Nível: ${nivel}%0AHorário: ${horario}%0AMensagem: ${msg}%0A%0AGostaria de agendar uma aula experimental.`;
  const url = `https://wa.me/${phone}?text=${text}`;
  window.open(url, '_blank');
});

/* set current year */
document.getElementById('year').textContent = new Date().getFullYear();
