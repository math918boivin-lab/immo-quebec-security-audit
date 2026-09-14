# Immo Gestion

Application web de gestion immobiliere (Quebec) construite avec Next.js, TypeScript et Tailwind CSS.

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
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

Les donnees sont initialisees avec un jeu de donnees fictif et persistees dans le `localStorage` du navigateur.

## Stack technique

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand) (gestion d'etat + persistance locale)
- [Recharts](https://recharts.org/) (graphiques)
- [Lucide](https://lucide.dev/) (icones)
