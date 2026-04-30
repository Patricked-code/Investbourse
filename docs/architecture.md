# Investbourse — Architecture cible

## 1. Objectif du projet

Investbourse est une plateforme professionnelle de conseil en investissements boursiers pour investisseurs institutionnels UEMOA.

Le projet doit couvrir :

- site public SEO ;
- pages éditoriales avec slugs ;
- données structurées schema.org ;
- formulaire de contact institutionnel ;
- cockpit back-office ;
- espace utilisateur institutionnel ;
- architecture API REST ;
- microservices séparés ;
- PostgreSQL et Prisma ;
- déploiement futur sur VPS.

## 2. Principes d’architecture

Le projet suit une logique progressive et non destructive.

Les principes sont :

- frontend séparé ;
- backend en microservices ;
- API Gateway comme point d’entrée ;
- contrats REST clairs ;
- validation partagée ;
- types partagés ;
- configuration centralisée ;
- données persistées dans PostgreSQL ;
- aucune réception de fonds ni de titres dans l’application ;
- séparation stricte entre site public, espace utilisateur et cockpit back-office.

## 3. Monorepo

Structure principale :

```txt
apps/
  web/

services/
  api-gateway/
  contact-service/
  content-service/
  office-service/
  auth-service/

packages/
  types/
  validators/
  config/
  db/

database/
  prisma/

docker/
```

## 4. Frontend

Le frontend est dans :

```txt
apps/web
```

Technologie :

- Next.js App Router ;
- TypeScript ;
- Tailwind CSS ;
- Atomic Design ;
- pages SEO statiques et dynamiques ;
- routes API proxy vers API Gateway.

## 5. Microservices

### api-gateway

Point d’entrée REST.

Responsabilités :

- réception des appels frontend ;
- validation initiale ;
- relais vers les services internes ;
- gestion des erreurs interservices ;
- healthcheck global.

### contact-service

Responsabilités :

- création des demandes depuis le formulaire ;
- consultation des demandes ;
- préparation de la persistance PostgreSQL ;
- intégration future avec le back-office.

### content-service

Responsabilités :

- gestion des pages SEO ;
- slugs ;
- titres ;
- meta descriptions ;
- H1 à H5 ;
- statut publié / brouillon ;
- préparation de l’administration du contenu.

### office-service

Responsabilités :

- suivi back-office ;
- dashboard ;
- qualification des messages ;
- priorités ;
- notes internes ;
- préparation de l’assignation.

### auth-service

Responsabilités futures :

- comptes utilisateurs ;
- rôles ;
- connexion email ;
- OAuth Google, Facebook, Microsoft ;
- récupération d’accès ;
- journalisation des connexions.

## 6. Packages partagés

### @investbourse/types

Types métier partagés.

### @investbourse/validators

Schémas Zod partagés pour valider les entrées.

### @investbourse/config

Chargement et validation des variables d’environnement.

### @investbourse/db

Accès partagé au client Prisma.

## 7. Base de données

La base cible est PostgreSQL.

Le schéma Prisma contient :

- User ;
- ContactRequest ;
- SeoPage ;
- AdminNote ;
- AuditLog.

## 8. Flux de demande contact

```txt
Utilisateur public
  -> formulaire contact
    -> route API Next.js
      -> API Gateway
        -> Contact Service
          -> PostgreSQL
          -> Office Service futur
```

## 9. Flux back-office

```txt
Administrateur
  -> /admin
    -> route API Next.js
      -> API Gateway
        -> Office Service
          -> Contact Service / PostgreSQL
```

## 10. Déploiement VPS cible

Déploiement prévu :

- Docker Compose ;
- PostgreSQL ;
- reverse proxy Nginx ou Traefik ;
- HTTPS Let’s Encrypt ;
- logs par service ;
- sauvegarde PostgreSQL ;
- variables d’environnement séparées production/staging.
