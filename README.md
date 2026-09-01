# TuboClair™ — Boutique one-product (furet débouche-canalisation)

Boutique légère et rapide pour **tester un produit en pub** : front statique + Stripe Checkout via une Netlify Function. Pas de Shopify, pas de DSers — **fulfillment manuel** au début (parfait pour un test).

## 📁 Structure

```
.
├── index.html            ← la fiche produit (galerie + encart d'achat)
├── styles.css            ← le style (identité orange/noir, mobile-first)
├── main.js               ← galerie + quantité + achat + CTA sticky
├── merci.html            ← page de confirmation post-paiement
├── legal.html            ← mentions légales / CGV / RGPD (À COMPLÉTER)
├── netlify.toml          ← config Netlify
├── package.json          ← dépendance stripe (pour la fonction)
├── img/                  ← les 5 visuels produit (déjà optimisés pour le web)
│   └── produit-1.jpg … produit-5.jpg
└── netlify/functions/
    └── create-checkout.js ← crée la session Stripe Checkout (clé secrète ici)
```

## 🔑 1. Stripe (paiement)

1. Crée un compte sur [stripe.com](https://stripe.com) et va dans le **Dashboard**.
2. Récupère ta **clé secrète** (commence par `sk_test_...` en mode test, `sk_live_...` en réel) dans *Développeurs → Clés API*.
3. Dans le Dashboard, active **Apple Pay / Google Pay** (*Réglages → Modes de paiement*) et l'**e-mail de reçu** automatique.
4. Le prix se règle dans `netlify/functions/create-checkout.js` → `unit_amount: 5490` (= 54,90 €, en centimes).

> Tu peux tester avec la carte **4242 4242 4242 4242**, date future, CVC au hasard.

## 🚀 2. Déploiement sur Netlify

1. Pousse ce dossier sur un repo Git (GitHub/GitLab).
2. Sur [Netlify](https://netlify.com) : *Add new site → Import an existing project* → choisis le repo.
3. Build : laisse vide (site statique). Publish directory : `.`
4. **Variable d'environnement** (*Site settings → Environment variables*) :
   - `STRIPE_SECRET_KEY` = ta clé `sk_test_...` (puis `sk_live_...` en production)
5. Déploie. Netlify installe `stripe` et met la fonction en ligne automatiquement.

### Dev en local (optionnel)
```bash
npm install
npm install -g netlify-cli
netlify env:set STRIPE_SECRET_KEY sk_test_xxx
netlify dev        # sert le site + la fonction sur localhost
```

## 📦 3. Traiter une commande (fulfillment manuel)

1. Une vente = un paiement visible dans **Stripe → Paiements**. Tu y vois le **nom, l'adresse de livraison et le téléphone** du client.
2. Va sur la fiche AliExpress de ton fournisseur (variante expédiée de France), commande **1 unité**, et **colle l'adresse du client** comme adresse de livraison.
3. Le fournisseur expédie ; récupère le **numéro de suivi** et envoie-le au client par e-mail.

> À faible volume c'est l'affaire de 2 minutes par commande. Tu automatiseras (DSers via WooCommerce, ou migration) seulement quand le produit sera validé et le volume au rendez-vous.

## 🎨 4. À personnaliser avant de lancer

- **E-mail de contact** : remplace `contact@VOTRE-DOMAINE.fr` partout (index.html, merci.html, legal.html).
- **Visuels** : les 5 images sont déjà dans `img/` (optimisées). Pour en changer, remplace les fichiers `produit-1.jpg` … `produit-5.jpg` en gardant les mêmes noms.
- **Avis** : remplace les cartes `.placeholder-review` par de **vrais avis de tes clients** (voir avertissement légal ci-dessous). Mets à jour la note moyenne une fois qu'ils sont réels.
- **Prix** : `unit_amount` dans la fonction (`5490` = 54,90 €) + le prix affiché dans `index.html`.
- **Domaine** : connecte ton nom de domaine dans Netlify.

### À prévoir plus tard (phase 2, après validation du produit)
- **Comptes clients** et **dépôt d'avis après achat** : ce sont des fonctions *backend* (authentification + base de données). Elles ajoutent de la friction au checkout et ne sont pas nécessaires pour valider le produit — mieux vaut lancer en **paiement invité** d'abord. Pour les ajouter ensuite : **Netlify Identity** ou **Supabase** (auth) + une table `avis`.

## ⚖️ 5. Obligations légales (à ne PAS zapper)

Pour vendre en France, tu dois **compléter `legal.html`** :
- **Mentions légales** (identité vendeur : SASU, SIREN, RCS, siège, TVA, hébergeur).
- **CGV** complètes + **médiateur de la consommation** (obligatoire).
- **Droit de rétractation 14 jours** + formulaire type.
- **RGPD** + **bandeau de consentement cookies** si tu installes le pixel Meta/TikTok.

⚠️ **Marketing honnête = obligation légale, pas seulement de l'éthique.** En France, les **faux avis**, les **faux comptes à rebours** et les **faux prix barrés** (prix de référence bidon) sont des **pratiques commerciales trompeuses** sanctionnables par la DGCCRF. Ne les reproduis pas. Et **honore réellement** la garantie 30 jours affichée.

## 🔜 6. Pour aller plus loin (après validation)

- **Webhook Stripe** (`checkout.session.completed`) → une 2e Netlify Function pour recevoir un e-mail à chaque commande (via Resend/SendGrid) au lieu de surveiller le Dashboard.
- **Pixel Meta / TikTok** + événement `Purchase` déclenché sur `merci.html` (avec consentement cookies).
- **Automatisation fulfillment** : passe sur WooCommerce (headless possible) pour brancher DSers, ou migre le tout.
