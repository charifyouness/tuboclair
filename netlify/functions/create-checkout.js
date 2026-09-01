// Netlify Function : crée une session Stripe Checkout.
// La clé secrète Stripe vit UNIQUEMENT ici (côté serveur), jamais dans le front.
// Variable d'environnement requise sur Netlify : STRIPE_SECRET_KEY

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    let quantity = parseInt(body.quantity, 10) || 1;
    quantity = Math.min(Math.max(quantity, 1), 5); // sécurité : 1 à 5

    const origin =
      event.headers.origin ||
      (event.headers.host ? `https://${event.headers.host}` : '');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // Astuce : laissez Stripe afficher CB + wallets selon l'appareil.
      // (Activez Apple Pay / Google Pay dans votre Dashboard Stripe.)
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Déboucheur à tambour Tuboclair™',
              description:
                'Déboucheur à tambour + câble acier 7,6 m + gants + guide d\'utilisation',
            },
            unit_amount: 5490, // 54,90 € en centimes — changez ici pour ajuster le prix
          },
          quantity,
        },
      ],
      // On collecte l'adresse (indispensable pour expédier) + le téléphone.
      shipping_address_collection: { allowed_countries: ['FR', 'BE', 'LU', 'MC'] },
      phone_number_collection: { enabled: true },
      // Livraison offerte : on ne met pas de frais de port.
      success_url: `${origin}/merci.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#offre`,
      locale: 'fr',
      // E-mail de reçu automatique envoyé par Stripe (activez-le dans le Dashboard).
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Stripe error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
