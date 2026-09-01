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

// --- Paiement : crée une session Stripe Checkout puis redirige ---
const buyBtn = document.getElementById('buy-btn');
const buyError = document.getElementById('buy-error');

if (buyBtn) {
  buyBtn.addEventListener('click', async () => {
    buyError.hidden = true;
    const original = buyBtn.textContent;
    buyBtn.disabled = true;
    buyBtn.textContent = 'Redirection vers le paiement…';

    try {
      const res = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: getQty() }),
      });
      if (!res.ok) throw new Error('checkout_failed');
      const data = await res.json();
      if (!data.url) throw new Error('no_url');
      window.location.href = data.url; // -> page de paiement Stripe
    } catch (err) {
      buyBtn.disabled = false;
      buyBtn.textContent = original;
      buyError.hidden = false;
    }
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
