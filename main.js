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

// --- Sélecteur de quantité (1 à 5) + prix qui se met à jour ---
const qtyInput = document.getElementById('qty');
const qtyMinus = document.getElementById('qty-minus');
const qtyPlus = document.getElementById('qty-plus');
const priceEl = document.querySelector('.price');
const stickyPriceEl = document.querySelector('.sticky-price');
const UNIT_PRICE = 49.90;
function getQty() { return Math.min(Math.max(parseInt(qtyInput.value, 10) || 1, 1), 5); }
function money(v) { return v.toFixed(2).replace('.', ',') + '\u00a0€'; }
function renderPrice() {
  var total = money(UNIT_PRICE * getQty());
  if (priceEl) priceEl.textContent = total;
  if (stickyPriceEl) stickyPriceEl.textContent = total + ' · livraison offerte';
}
function setQty(v) { qtyInput.value = Math.min(Math.max(v, 1), 5); renderPrice(); }
if (qtyMinus) qtyMinus.addEventListener('click', () => setQty(getQty() - 1));
if (qtyPlus) qtyPlus.addEventListener('click', () => setQty(getQty() + 1));
renderPrice();

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
