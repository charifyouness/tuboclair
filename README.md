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

---

## 🆕 Cette version (nouvelles pages & fonctions)

- **Favicon** : `favicon.svg` (carré orange + « T »), déjà référencé sur toutes les pages.
- **E-mail** : `contact@tuboclair.com` remplace partout l'ancien placeholder.
- **Checkout à friction minimale** : le bouton « Commander maintenant » envoie directement vers **Stripe Checkout** (page de paiement hébergée, sécurisée). On ne demande que l'**e-mail + l'adresse de livraison** (le nom en fait partie) — **aucun compte** à créer, plus de champ téléphone. Wallets express (Apple/Google Pay) à activer dans ton Dashboard Stripe.
  - ⚠️ Pour un produit **physique**, l'adresse de livraison reste obligatoire (impossible d'expédier avec juste nom + e-mail). C'est le strict minimum.
  - Pour que ça encaisse pour de vrai : passe la clé Stripe en **`sk_live_…`** dans Netlify.

### 📦 Page « Suivre mon colis » (`suivre-commande.html`)
Le client saisit son numéro de suivi → le suivi **étape par étape** s'ouvre via **17TRACK** (multi-transporteurs : Colissimo, Mondial Relay, Chronopost…). **Fonctionne immédiatement, sans inscription.**
- *Option (plus tard)* : pour un suivi **100 % sur ton site** (sans onglet externe), inscris-toi gratuitement sur 17track.net, récupère le widget « Buyer » et colle son snippet dans la page.

### ⭐ Page « Avis clients » (`avis.html`)
Formulaire pour laisser un avis **avec photo, sans compte**, mais **numéro de commande obligatoire**. Géré par **Netlify Forms** (aucun serveur à coder) :
1. Après déploiement, va dans Netlify → onglet **« Forms »** : tu y verras chaque avis reçu (avec la photo).
2. Configure une **notification e-mail** vers `contact@tuboclair.com`.
3. Tu **modères** : tu vérifies le numéro de commande (contre tes paiements Stripe), puis tu publies l'avis en l'ajoutant à la main dans la liste (`<article class="review-card">`) de `avis.html`.
- Cette vérification manuelle est ce qui rend le « n° de commande obligatoire » utile, et garde tes avis **authentiques** (obligation légale en France).
- *Option (plus tard)* : affichage 100 % automatique des avis via une base (Supabase) — à faire quand le volume le justifie.

### ⚖️ Pages légales (`legal.html`)
Version complète (mentions légales, CGV, rétractation 14 j + formulaire type, RGPD, cookies). **À compléter** : remplace tous les `[crochets]` par tes infos (SASU, SIREN, RCS, TVA…) et **désigne un médiateur de la consommation** (obligatoire). Je ne suis pas juriste : fais relire les CGV.
