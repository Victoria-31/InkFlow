# Conventions du projet InkFlow

Ce fichier décrit les règles suivies dans le code. En cas de doute, on suit l'existant.

## Langue

| Où                                                                      | Langue                                                                       |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Code, noms, commentaires, messages de commit, URL de l'API et des pages | Anglais                                                                      |
| Textes affichés à l'utilisateur                                         | Français, dans `client/src/i18n/fr.json` (jamais en dur dans les composants) |
| README, tickets Jira, descriptions de PR                                | Français                                                                     |

## Git

### Branches

```
main  ← version stable, déployée
dev   ← intégration du sprint
<type>/IN-<n>   ← une branche par ticket Jira, créée depuis dev
```

| Type    | Usage                                 | Exemple       |
| ------- | ------------------------------------- | ------------- |
| `feat`  | Nouvelle fonctionnalité (user story)  | `feat/IN-30`  |
| `fix`   | Correction de bug                     | `fix/IN-61`   |
| `chore` | Outillage, dépendances, configuration | `chore/IN-18` |
| `ci`    | Intégration continue, déploiement     | `ci/IN-20`    |
| `docs`  | Documentation, diagrammes             | `docs/IN-26`  |

- `main` et `dev` sont protégées : pas de push direct, une PR et une CI verte sont obligatoires.
- Une story peut mêler front et back dans la même branche et la même PR.
- Fin de sprint : PR `dev` → `main`.

### Commits

Format : `IN-<n> - <message en anglais, à l'impératif, sans majuscule ni point final>`

```
IN-30 - add project request schema and API with tests
IN-30 - generate the Prisma client on install
```

Un commit = un changement cohérent. Le message dit **ce que** le commit fait, pas comment.

### Pull requests

- Titre : `IN-<n> - <titre de la story>`.
- Description en français : ce qui change (API, front, outillage), les tests, et ce qui est hors périmètre avec le ticket correspondant.
- Fusion en « merge commit » uniquement.

## Structure

```
client/   React (Vite)
server/   API Express
shared/   Code commun au client et au serveur : schémas Zod, types, constantes métier
```

## Nommage des fichiers

Le nom d'un fichier suit ce qu'il exporte :

| Le fichier contient… | Format            | Exemple                          |
| -------------------- | ----------------- | -------------------------------- |
| Un composant React   | `PascalCase.tsx`  | `Button.tsx`, `StepLayout.tsx`   |
| Un hook              | `useCamelCase.ts` | `useArtist.ts`                   |
| Tout le reste        | `kebab-case.ts`   | `artists.ts`, `error-handler.ts` |

Un composant ajouté avec le générateur de shadcn (`button.tsx`) est renommé en `PascalCase`. Comme macOS ne distingue pas la casse et que la CI (Linux) la distingue, on renomme avec `git mv` et on vérifie que l'import correspond exactement au nom du fichier.

### Client (`client/src`)

| Contenu                     | Convention                                 | Exemple                   |
| --------------------------- | ------------------------------------------ | ------------------------- |
| Composant React             | `PascalCase.tsx`                           | `AvailabilityGrid.tsx`    |
| Page                        | `PascalCase` + `Page.tsx`                  | `ProjectRequestPage.tsx`  |
| Étape d'un formulaire       | `PascalCase` + `Step.tsx`                  | `ContactStep.tsx`         |
| Hook                        | `useCamelCase.ts`                          | `useArtist.ts`            |
| Appels à l'API (`request/`) | `kebab-case.ts`, une ressource par fichier | `artists.ts`              |
| Logique sans JSX            | `kebab-case.ts`                            | `project-request-form.ts` |
| Types locaux                | `types.ts`                                 | `steps/types.ts`          |

Organisation par domaine :

```
src/
  components/ui/      composants génériques réutilisables partout
  hooks/              hooks génériques
  request/            client HTTP et appels à l'API
  i18n/               traductions
  modules/<domaine>/  ce qui est propre à un domaine (public, atelier, client…)
    components/  hooks/  pages/  steps/
```

### Serveur (`server/src`)

Fichiers en `kebab-case`, avec un suffixe qui indique la couche :

| Couche                         | Rôle                                                        | Exemple                      |
| ------------------------------ | ----------------------------------------------------------- | ---------------------------- |
| `routes/*.routes.ts`           | URL, méthode, middlewares de validation                     | `artist.routes.ts`           |
| `controllers/*.controller.ts`  | Lit la requête, appelle le service, renvoie la réponse HTTP | `artist.controller.ts`       |
| `services/*.service.ts`        | Règles métier, erreurs métier (`HttpError`)                 | `project-request.service.ts` |
| `repositories/*.repository.ts` | Accès à la base avec Prisma, et lui seul                    | `project.repository.ts`      |
| `middlewares/*.ts`             | Traitements communs aux routes                              | `error-handler.ts`           |
| `errors/`, `db/`               | Classe d'erreur, client Prisma unique                       | `http-error.ts`, `prisma.ts` |

- Une couche n'appelle que la couche juste en dessous : route → controller → service → repository.
- Les imports relatifs gardent l'extension `.js` (modules ES) : `import { app } from './app.js';`.

### Shared (`shared/src`)

`kebab-case.ts`. Un schéma Zod se termine par `.schema.ts` : `project-request.schema.ts`.

### Tests

À côté du fichier testé, avec le suffixe `.test.ts` : `artist.routes.test.ts`, `app.test.ts`.

## Nommage dans le code

| Élément                | Convention             | Exemple                        |
| ---------------------- | ---------------------- | ------------------------------ |
| Variable, fonction     | `camelCase`            | `createProjectRequest`         |
| Booléen                | `is`, `has`, `can`…    | `isLastStep`, `hasServerError` |
| Composant React, type  | `PascalCase`           | `StepLayout`, `PublicArtist`   |
| Constante de référence | `UPPER_SNAKE_CASE`     | `AVAILABILITIES`, `STEPS`      |
| Schéma Zod             | `camelCase` + `Schema` | `projectRequestSchema`         |
| Router Express         | `camelCase` + `Router` | `artistRouter`                 |

- `type` plutôt que `interface`.
- Exports nommés (`export function …`), pas d'export par défaut. Exceptions : `App.tsx` et `i18n/index.ts`.
- Pas de `any`. `unknown` seulement pour une donnée vraiment non vérifiée.
- Paramètres d'une fonction sur une seule ligne, sauf s'ils sont vraiment nombreux.
- Pas de `return` dans un `return`, pas de ternaire imbriqué : on préfère une variable intermédiaire.

## API

- **URL** en anglais, au pluriel, en `kebab-case` : `GET /api/artists/:username`, `POST /api/artists/:username/projects`.
- **Codes HTTP** : 200 lecture, 201 création, 400 requête invalide, 401 non connecté, 403 interdit, 404 introuvable, 409 conflit, 413 corps trop gros, 500 erreur serveur.
- **Erreurs** au format Problem Details (RFC 9457), type `application/problem+json` :

  ```json
  {
    "type": "about:blank",
    "title": "Bad Request",
    "status": 400,
    "code": "validation_error",
    "errors": { "email": "invalid_email" }
  }
  ```

  `code` et les valeurs de `errors` sont en `snake_case`. Le client les traduit avec la clé `errors.<code>` de `fr.json`.

- **Réponses** : liste explicite des champs renvoyés (liste blanche), jamais un objet Prisma brut.
- **Validation** : un schéma Zod dans `shared`, appliqué par `validateBody(schema)` sur la route et réutilisé par le formulaire côté client.

## Base de données (Prisma)

| Élément          | Convention                               | Exemple                       |
| ---------------- | ---------------------------------------- | ----------------------------- |
| Modèle           | `PascalCase`, au singulier               | `Project`                     |
| Table            | `snake_case`, via `@@map`                | `project`                     |
| Champ            | `camelCase`                              | `prospectEmail`               |
| Colonne          | `snake_case`, via `@map`                 | `prospect_email`              |
| Valeur d'enum    | `UPPER_SNAKE_CASE`                       | `REQUEST`, `TUE_PM`           |
| Migration        | `prisma migrate dev --name <snake_case>` | `project_request_constraints` |
| Contrainte CHECK | `<table>_<colonne>_<règle>`              | `project_client_budget_order` |

- Le schéma Prisma suit le MPD : toute évolution passe d'abord par le MCD/MLD/MPD.
- Les règles qui protègent la donnée (longueurs, NOT NULL, CHECK) sont aussi en base, pas seulement dans Zod.
- Les CHECK s'ajoutent à la main dans une migration créée avec `--create-only`.

## Front-end

### Styles

- Tailwind par défaut. Du CSS natif dans `index.css` pour les jetons de la charte (`:root`, `@theme`), les motifs répétés (`@utility`) et ce que Tailwind exprime mal. Pas de `@apply`, pas de SCSS.
- **Trois tailles de texte** : `text-small` (12 px), `text-body` (16 px sur mobile, 14 px dès 640 px), `text-title` / `text-title-lg` pour les titres. L'échelle par défaut de Tailwind est désactivée.
- **Deux polices** : Instrument Serif pour les titres, Inter pour le reste.
- **Grille de 8 px** pour les espacements et les hauteurs. Exceptions : `h-11` (44 px, cible tactile minimale), les tailles de texte, les traits fins.
- Couleurs uniquement par les jetons (`bg-primary`, `text-muted-foreground`…), jamais de code couleur dans un composant.

### Accessibilité (RGAA / WCAG AA)

- HTML sémantique : `button` pour une action, `a` pour une navigation, `fieldset` et `legend` pour un groupe de champs, `table` pour un tableau. Pas de balise inutile.
- Chaque champ a un `label` visible. Les erreurs sont reliées au champ par `aria-describedby`, avec `aria-invalid`.
- Contraste de 4,5:1 pour le texte et de 3:1 pour les bordures des contrôles et les états.
- `aria-hidden` seulement sur un contenu visible qui ferait doublon (icône, numéro déjà annoncé), jamais sur un élément focusable.
- À chaque nouvel écran : retour en haut de page et focus sur le titre (`useNewScreen`).

### Données et textes

- Appels à l'API dans `request/`, utilisés par un hook TanStack Query dans le module : `useArtist`, `useCreateProjectRequest`.
- Clé de cache : `[ressource, paramètre]`, par exemple `['artist', username]`.
- Clés de traduction en `camelCase`, groupées par écran puis par section : `request.contact.title`.

## Qualité

- **Prettier** : 130 caractères par ligne, guillemets simples, points-virgules, virgule finale. Vérifié en CI.
- **ESLint** côté client.
- **CI** sur chaque PR : migrations, formatage, lint, build, tests. Elle doit être verte pour fusionner.
- **Commentaires** : ils expliquent le _pourquoi_, pas ce que le code dit déjà.
- **Simplicité** avant tout : le code doit pouvoir être lu et maintenu par quelqu'un d'autre.

## Commandes utiles

| Commande                                | Effet                            |
| --------------------------------------- | -------------------------------- |
| `pnpm dev`                              | Lance le client et le serveur    |
| `pnpm test`                             | Lance les tests                  |
| `pnpm format`                           | Formate le code                  |
| `pnpm migrate`                          | Crée et applique une migration   |
| `pnpm studio`                           | Ouvre Prisma Studio              |
| `pnpm --filter @inkflow/server db:seed` | Remplit la base de démonstration |
