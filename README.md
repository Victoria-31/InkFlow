# InkFlow

> **« De la demande client à la réalisation — un seul outil. »**

Plateforme SaaS de gestion de projets tatouage, dédiée aux tatoueurs indépendants et petits salons. InkFlow centralise l'ensemble du workflow créatif : de la demande client initiale jusqu'au suivi post-cicatrisation, en passant par la validation des dessins, la planification des rendez-vous et la gestion des paiements.

---

## Contexte

**Problème identifié :** Les tatoueurs gèrent leur activité avec des outils qui n'ont pas été conçus pour eux — Instagram pour les demandes, Google Agenda pour les RDV, notes éparpillées pour les inspirations. Cette fragmentation entraîne une perte d'informations, une désorganisation chronique et un temps précieux détourné de la création.

**Solution :** Une plateforme centrée sur le workflow créatif du tatouage.

---

## Cible utilisateur

| Profil | Description | Priorité |
|---|---|---|
| **Tatoueur indépendant** | Gère seul sa clientèle, sans structure autour | ⭐ MVP V1 |
| **Tatoueur en salon** | Autonome sur ses projets au sein d'une structure | V1 |
| **Location de poste (guest)** | Très mobile, jongle entre plusieurs studios | V1 |
| **Gérant de salon** | Supervise plusieurs tatoueurs | V2 |

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
 
| Écran | Description |
|---|---|
| **Dashboard artiste** | Vue Kanban — Demandes · Devis · Création · Validé |
| **Espace client** | Statut projet · Dessin · RDV · Conseils |
| **Détail projet** | Informations · Propositions · Moodboard |
 
> 🔗 **Fichier Figma complet :** *https://www.figma.com/design/ehDohqkbB5Eh2lsrHNEC0O/InkFlow?node-id=0-1&t=CpYmOpnMoSWAgvwe-1*

---

## Stack technique

### Frontend
| Technologie | Rôle |
|---|---|
| React + TypeScript | Composants réutilisables, typage fort |
| Tailwind CSS | Design system cohérent, responsive |
| React Router | Navigation SPA multi-vues |
| Axios | Requêtes HTTP, intercepteurs JWT |

### Backend
| Technologie | Rôle |
|---|---|
| Node.js + Express | API REST, logique métier |
| JWT + Bcrypt | Authentification, gestion des rôles |
| Multer | Upload fichiers (dessins, inspirations) |
| Nodemailer + node-cron | Envoi automatique des fiches cicatrisation |

### Base de données
| Technologie | Rôle |
|---|---|
| PostgreSQL | Base relationnelle, cohérente avec le MCD Merise |
| Prisma ORM | Migrations typées, schéma auto-généré |

### Tests
| Technologie | Rôle |
|---|---|
| Vitest | Tests unitaires composants React |
| Supertest | Tests d'intégration routes API |

### Déploiement
| Technologie | Rôle |
|---|---|
| Railway / Render | Hébergement Node.js + PostgreSQL |
| Vercel | Frontend React, CDN global |
| Docker | Conteneurisation dev/prod |
| Git + GitHub | Versionnage, CI/CD |

---

## Modèle de données (MCD — Merise)

5 entités principales :

```
USER ──── SENDS ──── DEMAND
  │                    │
  │               GENERATES
  │                    │
MANAGES ──────── PROJECT ──── CONTAINS ──── DRAWING
                    │
                SCHEDULES
                    │
               APPOINTMENT
```

**Entités :**
- `USER` — id · email · password_hash · first_name · last_name · phone · role · is_active · created_at
- `DEMAND` — id · body_area · style · description · budget_min · budget_max · statut · created_at
- `PROJECT` — id · title · statut · notes · created_at · updated_at
- `APPOINTMENT` — id · date_time · duration_min · type · statut · deposit_paid · created_at
- `DRAWING` — id · version · file_url · comment · statut · created_at

---

## Rôles utilisateurs

```
CLIENT      → Envoyer une demande · Consulter son projet · Valider un dessin · Confirmer un RDV
TATOUEUR    → Gérer les demandes · Gérer les projets · Planifier les RDV · Soumettre des dessins · consulter l'agenda
GÉRANT      → Accès global · Statistiques salon · Consulter l'agenda · Gestion des comptes
```

---

## Structure du projet (prévisionnel)

```
inkflow/
├── client/                   # Frontend React
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   ├── pages/            # Vues (Dashboard, Projet, Client)
│   │   ├── services/         # Appels API (Axios)
│   │   └── types/            # Types TypeScript
│   └── ...
├── server/                   # Backend Node.js
│   ├── src/
│   │   ├── routes/           # Routes Express
│   │   ├── controllers/      # Logique métier
│   │   ├── middlewares/      # Auth JWT, upload, validation
│   │   ├── services/         # Nodemailer, Cron
│   │   └── prisma/           # Schéma + migrations
│   └── ...
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Informations projet

| | |
|---|---|
| **Projet** | CDA 2025 / 2027 — Simplon |
| **Auteure** | Victoria Fonteny |
| **Formation** | Concepteur Développeur d'Applications |
| **Statut** | En cours de développement |
