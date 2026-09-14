# Immo Gestion

Application web de gestion immobiliere (Quebec) construite avec Next.js, TypeScript et Tailwind CSS. Toutes les donnees sont stockees cote serveur (SQLite) derriere une authentification obligatoire.

## Fonctionnalites

- **Tableau de bord** : revenu mensuel, taux d'occupation, paiements en retard, demandes de maintenance ouvertes, graphique des revenus, renouvellements de baux a venir.
- **Immeubles** : gestion des immeubles et de leurs unites (ajout, modification, suppression).
- **Locataires** : fiches locataires avec coordonnees, historique des baux et des paiements.
- **Baux** : creation et suivi des baux (dates, loyer, depot, statut).
- **Paiements** : suivi des loyers dus/percus, marquage rapide comme paye.
- **Maintenance** : tableau des demandes d'entretien par statut (ouverte / en cours / resolue).

## Demarrage

```bash
npm install
cp .env.example .env.local   # puis remplissez ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000). Vous serez redirige vers `/login`.

Au tout premier demarrage, si aucun utilisateur n'existe encore en base, le serveur cree automatiquement un compte administrateur a partir de `ADMIN_EMAIL` et `ADMIN_PASSWORD` (mot de passe hache avec bcrypt avant stockage — jamais garde en clair). Ces variables ne sont utiles qu'une seule fois; vous pouvez les retirer de `.env.local` ensuite.

Les donnees vivent dans une base SQLite locale (`data/app.db`, ignoree par git — ne jamais la committer).

## Securite

- **Authentification obligatoire** sur toutes les pages de l'application (verifiee cote serveur, pas seulement dans le navigateur) — voir `src/app/(app)/layout.tsx`.
- **Mots de passe** haches avec bcrypt (cout 12), jamais stockes en clair.
- **Sessions** : jeton aleatoire de 256 bits, seul son hachage SHA-256 est conserve en base ; cookie `httpOnly`, `SameSite=Lax`, `Secure` en production, expiration a 7 jours.
- **Protection contre le brute-force** : verrouillage du compte pendant 15 minutes apres 5 echecs de connexion consecutifs.
- **Toutes les mutations** passent par des Server Actions Next.js qui revalident l'authentification et valident chaque champ avec [Zod](https://zod.dev/) avant d'ecrire en base (requetes SQL parametrees uniquement, aucune concatenation de chaines).
- **En-tetes de securite** (`src/proxy.ts`) : Content-Security-Policy stricte avec nonce par requete, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.
- **Donnees jamais exposees au client** : la base SQLite n'est accedee que depuis des modules marques `server-only`.

## Stack technique

- [Next.js](https://nextjs.org/) (App Router, Server Actions)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (base de donnees serveur)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) (hachage des mots de passe)
- [Zod](https://zod.dev/) (validation des entrees)
- [Recharts](https://recharts.org/) (graphiques)
- [Lucide](https://lucide.dev/) (icones)
