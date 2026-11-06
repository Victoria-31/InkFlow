# InkFlow

[![CI](https://github.com/Victoria-31/InkFlow/actions/workflows/ci.yml/badge.svg?branch=dev)](https://github.com/Victoria-31/InkFlow/actions/workflows/ci.yml)

> **« De la demande client à la réalisation — un seul outil. »**

Plateforme SaaS de gestion de projets tatouage, dédiée aux tatoueurs indépendants et petits salons. InkFlow centralise l'ensemble du workflow créatif : de la demande client initiale jusqu'au suivi post-cicatrisation, en passant par la validation des dessins, la planification des rendez-vous et la gestion des paiements.

---

## Contexte

**Problème identifié :** Les tatoueurs gèrent leur activité avec des outils qui n'ont pas été conçus pour eux — Instagram pour les demandes, Google Agenda pour les RDV, notes éparpillées pour les inspirations. Cette fragmentation entraîne une perte d'informations, une désorganisation chronique et un temps précieux détourné de la création.

**Solution :** Une plateforme centrée sur le workflow créatif du tatouage.

---

## Cible utilisateur

| Profil                        | Description                                      | Priorité  |
| ----------------------------- | ------------------------------------------------ | --------- |
| **Tatoueur indépendant**      | Gère seul sa clientèle, sans structure autour    | ⭐ MVP V1 |
| **Tatoueur en salon**         | Autonome sur ses projets au sein d'une structure | V1        |
| **Location de poste (guest)** | Très mobile, jongle entre plusieurs studios      | V1        |
| **Gérant de salon**           | Supervise plusieurs tatoueurs                    | V2        |

---

## Fonctionnalités

### Fonctionnalité principale — Optimisation de l'agenda

Planification des RDV avec estimation de durée selon le projet, détection des conflits d'agenda, créneaux suggérés et rappels automatiques.

### Fonctionnalités secondaires

- **Pipeline de projet** — Suivi Kanban de la demande à la réalisation (9 étapes)
- **Moodboard d'inspirations** — Centralisation des références visuelles par projet avec tags
- **Validation de dessin** — Soumission d'esquisses versionnées, validation ou révision par le client
- **Espace client** — Portail dédié pour suivre son projet et valider les étapes
- **Gestion des devis** — Envoi, signature numérique et suivi des acomptes
- **Suivi cicatrisation automatisé** — Fiches conseils envoyées automatiquement
- **Notifications** — Alertes RDV, dessin en attente, retouche à planifier

### Fonctionnalités V2 (roadmap)

- Suggestion de tags par IA sur les inspirations
- Banque d'inspiration partagée (communauté + perso)
- Intégrations : Stripe · WhatsApp · Instagram DM

---

## Workflow MVP (9 étapes)

```
01 Demande reçue
   └─ Formulaire structuré (style, zone, budget)

02 Devis envoyé
   └─ Proposition tarifée, signature numérique

03 Acceptation

04 RDV programmé
   └─ Créneau suggéré, acompte encaissé

05 Dessin → Validation
   └─ Esquisse partagée, allers-retours client

── MVP V1 ──────────────────────────────────
06 Séance & paiement
07 Conseils cicatrisation
08 Suivi photo cica (J+30)       ← V2
09 Retouche / Archive            ← V2
```

## Wireframe / zooning

Les maquettes exploratoires sont disponibles sur Figma :

| Écran                 | Description                                       |
| --------------------- | ------------------------------------------------- |
| **Dashboard artiste** | Vue Kanban — Demandes · Devis · Création · Validé |
| **Espace client**     | Statut projet · Dessin · RDV · Conseils           |
| **Détail projet**     | Informations · Propositions · Moodboard           |

> 🔗 **Fichier Figma complet :** *https://www.figma.com/design/ehDohqkbB5Eh2lsrHNEC0O/InkFlow?node-id=0-1&t=CpYmOpnMoSWAgvwe-1*

---

## Stack technique

Monorepo **pnpm** (workspaces) en **TypeScript** : `client/`, `server/` et `shared/` (types, schémas de validation et transitions de statut communs au front et à l'API).

### Frontend

| Technologie     | Rôle                                                   |
| --------------- | ------------------------------------------------------ |
| React 19 + Vite | SPA, serveur de dev avec proxy vers l'API              |
| Tailwind CSS 4  | Charte graphique déclarée dans `@theme`                |
| React Router    | Navigation par modules (public, auth, client, atelier) |
| Axios           | Requêtes HTTP (`client/src/request/`)                  |
| react-i18next   | Textes de l'interface (`client/src/i18n/fr.json`)      |

### Backend

| Technologie                    | Rôle                                                                 |
| ------------------------------ | -------------------------------------------------------------------- |
| Node.js 22 + Express 5         | API REST en couches : routes → controllers → services → repositories |
| Zod                            | Validation des données, schémas partagés avec le front               |
| JWT (cookie httpOnly) + Argon2 | Authentification et rôles tatoueur / client                          |
| sharp                          | Aperçus d'esquisse basse définition avec filigrane                   |
| Nodemailer (Brevo)             | Emails : invitation, devis, conseils                                 |

### Base de données

| Technologie   | Rôle                                       |
| ------------- | ------------------------------------------ |
| PostgreSQL 17 | Base relationnelle, issue du modèle Merise |
| Prisma 6      | Schéma, migrations versionnées, seed       |

### Qualité

| Technologie        | Rôle                                            |
| ------------------ | ----------------------------------------------- |
| Vitest + Supertest | Tests de l'API                                  |
| ESLint             | Lint du front                                   |
| GitHub Actions     | CI : lint, build et tests à chaque pull request |

### Déploiement (prévu)

| Technologie       | Rôle                             |
| ----------------- | -------------------------------- |
| Vercel            | Front                            |
| Render            | API                              |
| PostgreSQL managé | Base de production               |
| Docker            | Base PostgreSQL en développement |

---

## Démarrer le projet

Prérequis : Node.js 22, pnpm, Docker.

```bash
pnpm install
docker compose up -d                                  # PostgreSQL local
cp server/.env.sample server/.env                     # variables d'environnement
pnpm --filter @inkflow/server prisma:migrate          # applique les migrations
pnpm --filter @inkflow/server db:seed                 # données de démonstration
pnpm dev                                              # front (5173), API (3000), shared
```

| Commande     | Rôle                                                |
| ------------ | --------------------------------------------------- |
| `pnpm dev`   | Lance le front, l'API et la compilation de `shared` |
| `pnpm lint`  | Lint de tous les packages                           |
| `pnpm build` | Build de tous les packages                          |
| `pnpm test`  | Tests de tous les packages                          |

---

## Branches et intégration continue

```
feat/IN-xx ──PR──▶ dev ──PR (fin de sprint)──▶ main
              CI           recette              production
```

- `main` : version en production.
- `dev` : version de recette, branche par défaut.
- Une branche par ticket Jira : `<type>/IN-xx` (`feat`, `fix`, `chore`, `docs`, `test`, `ci`).
- Messages de commit : `IN-xx: description`.
- La CI (lint, build, tests sur une base PostgreSQL) doit passer avant toute fusion.

---

## Modèle de données

Le modèle a été conçu avec Merise (MCD → MLD → MPD), puis traduit en schéma Prisma : [`server/prisma/schema.prisma`](server/prisma/schema.prisma).

Entités : Account, Artist, Studio, Project, Quote, Appointment, Sketch, Reference, RequestComment, SketchComment, Tag, ProjectTag, ArtistTag.

> 🔗 **Documents Merise :** *https://drive.google.com/file/d/12tRRZDOyjPlgYnX6oTir2XLjYHGTTIct/view?usp=sharing*

---

## Rôles utilisateurs

```
PROSPECT    → Envoyer une demande depuis le lien public du tatoueur
CLIENT      → Suivre son projet · Accepter un devis · Valider une esquisse · Consulter ses conseils
TATOUEUR    → Gérer les demandes et les projets · Envoyer les devis · Planifier les séances · Déposer les esquisses
```

---

## Structure du projet

```
inkflow/
├── client/                   # Front React
│   └── src/
│       ├── modules/          # public, auth, client, atelier
│       ├── components/ui/    # Composants du kit graphique
│       ├── request/          # Appels API (Axios)
│       └── i18n/             # Textes de l'interface
├── server/                   # API Express
│   ├── prisma/               # Schéma, migrations, seed
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── services/         # Logique métier
│       ├── repositories/     # Accès aux données (Prisma)
│       └── middlewares/      # Auth, validation, erreurs
├── shared/                   # Code commun front / API
├── .github/workflows/ci.yml
└── docker-compose.yaml
```

Les conventions de nommage, de Git, d'API et de code sont décrites dans [CONVENTIONS.md](CONVENTIONS.md).

---

## Informations projet

|               |                                       |
| ------------- | ------------------------------------- |
| **Projet**    | CDA 2025 / 2027 — Simplon             |
| **Auteure**   | Victoria Fonteny                      |
| **Formation** | Concepteur Développeur d'Applications |
| **Statut**    | En cours de développement             |
