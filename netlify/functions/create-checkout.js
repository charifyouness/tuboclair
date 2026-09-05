// Netlify Function : crée une session Stripe Checkout INTÉGRÉE (embedded).
// Le paiement reste sur ton site (pas de redirection vers checkout.stripe.com).
// Variable d'environnement requise : STRIPE_SECRET_KEY (sk_test_… puis sk_live_…)

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    let quantity = parseInt(body.quantity, 10) || 1;
    quantity = Math.min(Math.max(quantity, 1), 5);

    const origin =
      event.headers.origin ||
      (event.headers.host ? `https://${event.headers.host}` : '');

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded', // <-- checkout intégré, reste sur ton domaine
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Déboucheur à tambour Tuboclair™',
              description: 'Déboucheur à tambour + câble acier 7,6 m + gants + guide d\'utilisation',
            },
            unit_amount: 4990, // 49,90 €
          },
          quantity,
        },
      ],
      shipping_address_collection: { allowed_countries: ['FR', 'BE', 'LU', 'MC', 'CH'] },
      // Les moyens de paiement affichés sont ceux ACTIVÉS dans ton Dashboard Stripe
      // (Réglages → Moyens de paiement). Désactive Klarna/Bancontact/EPS/Link, garde
      // Carte (+ Apple/Google Pay) et active PayPal. Pas besoin de toucher au code.
      return_url: `${origin}/merci.html?session_id={CHECKOUT_SESSION_ID}`,
      locale: 'fr',
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: session.client_secret }),
    };
  } catch (err) {
    console.error('Stripe error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
