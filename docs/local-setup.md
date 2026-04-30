# Investbourse — Installation locale complète

## 1. Prérequis

- Node.js 22+
- pnpm via Corepack
- Docker Desktop ou Docker Engine
- Git

Activer Corepack :

```bash
corepack enable
```

## 2. Cloner le dépôt

```bash
git clone https://github.com/Patricked-code/Investbourse.git
cd Investbourse
```

## 3. Installer les dépendances

```bash
pnpm install
```

## 4. Préparer l’environnement

```bash
cp .env.example .env
```

Sous PowerShell :

```powershell
copy .env.example .env
```

Pour tester le cockpit sans authentification finale, le bypass local existe encore mais doit rester désactivé par défaut :

```env
NEXT_PUBLIC_ENABLE_LOCAL_ADMIN_BYPASS=false
```

La méthode recommandée est d’utiliser le superadmin seedé.

## 5. Démarrer PostgreSQL local

```bash
docker compose -f docker/docker-compose.yml up -d postgres
```

## 6. Générer Prisma et appliquer les migrations

```bash
pnpm --filter @investbourse/database db:generate
pnpm --filter @investbourse/database db:migrate -- --name init
pnpm --filter @investbourse/database db:seed
pnpm --filter @investbourse/database db:seed-admin
```

Identifiants locaux par défaut :

```txt
admin@investbourse.local
ChangeMe_Admin_2026!
```

## 7. Lancer les services en développement

Ouvrir plusieurs terminaux.

### Terminal 1 — contact-service

```bash
pnpm --filter @investbourse/contact-service dev
```

### Terminal 2 — content-service

```bash
pnpm --filter @investbourse/content-service dev
```

### Terminal 3 — auth-service

```bash
pnpm --filter @investbourse/auth-service dev
```

### Terminal 4 — office-service

```bash
pnpm --filter @investbourse/office-service dev
```

### Terminal 5 — API Gateway

```bash
pnpm --filter @investbourse/api-gateway dev
```

### Terminal 6 — Frontend Next.js

```bash
pnpm --filter @investbourse/web dev
```

## 8. URLs locales

```txt
Frontend:       http://localhost:3000
API Gateway:    http://localhost:4000/health
Contact:        http://localhost:4010/health
Content:        http://localhost:4020/health
Auth:           http://localhost:4030/health
Office:         http://localhost:4040/health
```

## 9. Parcours de test recommandé

1. Ouvrir `http://localhost:3000`.
2. Aller sur `/auth/login`.
3. Se connecter avec le superadmin.
4. Ouvrir `/admin`.
5. Aller sur `/contact` dans un autre onglet.
6. Créer une demande institutionnelle.
7. Revenir sur `/admin`.
8. Ouvrir la demande.
9. Créer un suivi back-office.
10. Vérifier l’historique et l’audit.
11. Ouvrir `/admin/utilisateurs`.
12. Modifier un rôle ou un statut.
13. Ouvrir `/admin/audit`.
14. Ouvrir `/admin/exports` et télécharger les CSV.
15. Ouvrir `/admin/contenu-seo` et tester la sauvegarde d’une page SEO.

## 10. Démarrage Docker complet local

```bash
docker compose -f docker/docker-compose.yml up --build
```

Puis, dans un autre terminal :

```bash
pnpm --filter @investbourse/database db:deploy
pnpm --filter @investbourse/database db:seed
pnpm --filter @investbourse/database db:seed-admin
```

## 11. Notes importantes

- Ne jamais utiliser les secrets par défaut en production.
- Ne jamais activer le bypass local en production.
- Les rôles admin sont `ADMIN` et `SUPERADMIN`.
- L’espace utilisateur accepte les sessions `USER`, `ADMIN` et `SUPERADMIN`.
- Les exports et pages admin sont réservés aux rôles admin.
