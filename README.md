# Immo Gestion

Application web de gestion immobiliere (Quebec) construite avec Next.js, TypeScript et Tailwind CSS. Toutes les donnees sont stockees cote serveur (PostgreSQL) derriere une authentification obligatoire. Concue pour un deploiement serverless (Vercel).

## Fonctionnalites

- **Tableau de bord** : revenu mensuel, taux d'occupation, paiements en retard, demandes de maintenance ouvertes, graphique des revenus, renouvellements de baux a venir.
- **Immeubles** : gestion des immeubles et de leurs unites (ajout, modification, suppression).
- **Locataires** : fiches locataires avec coordonnees, historique des baux et des paiements.
- **Baux** : creation et suivi des baux (dates, loyer, depot, statut).
- **Paiements** : suivi des loyers dus/percus, marquage rapide comme paye.
- **Maintenance** : tableau des demandes d'entretien par statut (ouverte / en cours / resolue).
- **Blog** : billets prives (brouillon / publie) propres a chaque compte.
- **Multi-utilisateurs** : inscription libre (`/signup`) — chaque compte a son propre espace de donnees, totalement isole des autres.
- **Pages legales** : politique de confidentialite, conditions d'utilisation, politique de remboursement et politique de temoins (cookies), accessibles publiquement et liees depuis les pages de connexion/inscription.
- **Consentement explicite** : case a cocher obligatoire (validee cote serveur) a l'inscription pour accepter les conditions et la politique de confidentialite.

## Demarrage

```bash
npm install
cp .env.example .env.local   # renseignez POSTGRES_URL (voir ci-dessous) ; ADMIN_EMAIL/ADMIN_PASSWORD sont optionnels
npm run dev
```

L'application requiert une base **PostgreSQL** (variable `POSTGRES_URL`). Les tables sont creees automatiquement au demarrage (`src/lib/db.ts`, migrations idempotentes) — aucune commande de migration a lancer a la main.

- **En local** : pointez `POSTGRES_URL` vers une instance Postgres locale ou de developpement.
- **Sur Vercel** : connectez une base **Vercel Postgres** depuis l'onglet *Storage* du projet — la variable `POSTGRES_URL` est alors injectee automatiquement, rien a configurer manuellement.

L'application est disponible sur [http://localhost:3000](http://localhost:3000). Vous serez redirige vers `/login`, avec un lien pour creer un compte (`/signup`).

Si `ADMIN_EMAIL`/`ADMIN_PASSWORD` sont definis et qu'aucun utilisateur n'existe encore, le serveur cree au premier demarrage un compte de demonstration pre-rempli avec des donnees fictives (mot de passe hache avec bcrypt avant stockage). Ce n'est qu'une commodite pour explorer l'application : n'importe qui peut aussi simplement creer son propre compte via `/signup`, qui demarre avec un espace de donnees vide et prive.

## Deployer sur Vercel

1. Importez ce depot dans [Vercel](https://vercel.com/new).
2. Dans l'onglet **Storage** du projet, ajoutez une base **Postgres** (Neon, integree a Vercel) et connectez-la au projet — la variable `POSTGRES_URL` est injectee automatiquement, aucune configuration manuelle requise.
3. (Optionnel) Ajoutez `ADMIN_EMAIL`/`ADMIN_PASSWORD` dans les variables d'environnement du projet pour obtenir un compte de demonstration pre-rempli des le premier demarrage.
4. Deployez. Les tables sont creees automatiquement au premier appel du serveur (aucune commande de migration a executer).

## Securite

- **Authentification obligatoire** sur toutes les pages de l'application (verifiee cote serveur, pas seulement dans le navigateur) — voir `src/app/(app)/layout.tsx`.
- **Isolation stricte par compte** : chaque table de donnees (immeubles, unites, locataires, baux, paiements, maintenance, blog) porte une colonne `owner_id`, filtree et verifiee independamment sur chaque lecture et chaque ecriture — un compte ne peut ni voir ni modifier les donnees d'un autre, meme en devinant un identifiant (protection IDOR), verifie par des tests d'isolation entre deux comptes distincts.
- **Mots de passe** haches avec bcrypt (cout 12, minimum 12 caracteres a l'inscription), jamais stockes en clair.
- **Sessions** : jeton aleatoire de 256 bits, seul son hachage SHA-256 est conserve en base ; cookie `httpOnly`, `SameSite=Lax`, `Secure` en production, expiration a 7 jours.
- **Protection contre le brute-force** : verrouillage du compte pendant 15 minutes apres 5 echecs de connexion consecutifs.
- **Toutes les mutations** passent par des Server Actions Next.js qui revalident l'authentification et valident chaque champ avec [Zod](https://zod.dev/) avant d'ecrire en base (requetes SQL parametrees uniquement, aucune concatenation de chaines).
- **En-tetes de securite** (`src/proxy.ts`) : Content-Security-Policy stricte avec nonce par requete, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.
- **Donnees jamais exposees au client** : la base Postgres n'est accedee que depuis des modules marques `server-only`.

## Accessibilite

- **Contraste des couleurs** : tous les textes et controles interactifs respectent les seuils WCAG 2.1 AA (4.5:1 pour le texte, 3:1 pour les composants d'interface).
- **Navigation au clavier** : indicateurs de focus visibles partout, piege de focus dans les fenetres modales (Tab reste dans la modale, Echap la ferme, le focus revient a l'element declencheur), boutons d'action a icone seule pourvus d'un libelle `aria-label` explicite (incluant le contexte, ex. « Supprimer l'unite 101 »).
- **Lecteurs d'ecran** : landmarks (`main`, `nav`), hierarchie de titres coherente, icones decoratives masquees (`aria-hidden`), erreurs de formulaire annoncees (`role="alert"`), champs de recherche et menus deroulants nommes explicitement.
- **Images** : aucune image matricielle dans l'application (uniquement des icones vectorielles decoratives) — rien ne necessite de texte alternatif.
- Verifie par une analyse automatisee (axe-core) sur toutes les pages, vides et remplies de donnees : aucune violation detectee.

## Temoins (cookies) et suivi

- **Aucun suivi** : aucun script d'analytique, publicitaire ou de reseau social; aucune requete vers un tiers; les polices sont integrees au site (pas de requete a Google au moment de la visite).
- **Un seul temoin**, strictement necessaire (session de connexion `immo_session`) — voir `src/lib/auth.ts` et la [politique de temoins](/politique-de-temoins). Aucun bandeau « accepter/refuser » n'est requis (article 8.1 de la Loi 25 du Quebec exempte les temoins necessaires a la fourniture du service demande), mais un avis informatif non bloquant est affiche sur les pages de connexion/inscription pour la transparence.
- **Consentement explicite** a l'inscription (case a cocher validee cote serveur) pour la collecte de renseignements personnels, conformement a la Loi 25.

## Stack technique

- [Next.js](https://nextjs.org/) (App Router, Server Actions)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/) via [node-postgres (`pg`)](https://node-postgres.com/) (base de donnees serveur, compatible Vercel Postgres)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) (hachage des mots de passe)
- [Zod](https://zod.dev/) (validation des entrees)
- [Recharts](https://recharts.org/) (graphiques)
- [Lucide](https://lucide.dev/) (icones)
