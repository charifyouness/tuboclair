// ===== Tuboclair — logique front =====

// Année du footer
document.getElementById('year').textContent = new Date().getFullYear();

// --- Galerie : cliquer une miniature change l'image principale ---
const mainImg = document.getElementById('main-img');
document.querySelectorAll('.thumb').forEach((thumb) => {
  thumb.addEventListener('click', () => {
    const src = thumb.getAttribute('data-src');
    if (!src || !mainImg) return;
    mainImg.src = src;
    document.querySelectorAll('.thumb').forEach((t) => t.classList.remove('is-active'));
    thumb.classList.add('is-active');
  });
});

// --- Sélecteur de quantité (1 à 5) ---
const qtyInput = document.getElementById('qty');
const qtyMinus = document.getElementById('qty-minus');
const qtyPlus = document.getElementById('qty-plus');
function getQty() { return Math.min(Math.max(parseInt(qtyInput.value, 10) || 1, 1), 5); }
function setQty(v) { qtyInput.value = Math.min(Math.max(v, 1), 5); }
if (qtyMinus) qtyMinus.addEventListener('click', () => setQty(getQty() - 1));
if (qtyPlus) qtyPlus.addEventListener('click', () => setQty(getQty() + 1));

// --- Bouton commander : va vers le checkout intégré (sur le site) ---
const buyBtn = document.getElementById('buy-btn');
if (buyBtn) {
  buyBtn.addEventListener('click', function () {
    window.location.href = 'checkout.html?qty=' + getQty();
  });
}

// --- CTA sticky mobile : apparaît quand l'encart d'achat n'est plus visible ---
const sticky = document.getElementById('sticky-cta');
if (sticky && window.matchMedia('(max-width:819px)').matches) {
  const buybox = document.querySelector('.buybox');
  if (buybox) {
    const io = new IntersectionObserver(
      (entries) => { sticky.hidden = entries[0].isIntersecting; },
      { threshold: 0 }
    );
    io.observe(buybox);
  }
}
