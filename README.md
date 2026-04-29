# Investbourse — Conseil en investissements boursiers institutionnels UEMOA

Investbourse est une plateforme web professionnelle destinée à présenter et opérer une activité de conseil en investissements boursiers pour les investisseurs institutionnels de la zone UEMOA.

Le projet est conçu dès le départ comme un vrai site/application :

- frontend SEO en Next.js App Router ;
- architecture Atomic Design ;
- pages à slugs dédiés ;
- balisage sémantique H1 à H5 ;
- données structurées schema.org en JSON-LD ;
- cockpit administrateur ;
- espace utilisateur ;
- authentification par email/mot de passe et OAuth Google, Facebook, Microsoft ;
- API REST ;
- logique microservices ;
- séparation claire entre site public, authentification, messages, contenu SEO et administration.

## Positionnement métier

Le site conserve l’esprit validé dans la maquette :

- conseil en investissements boursiers institutionnels ;
- analyse récurrente des marchés UEMOA ;
- sélection de fonds OPCVM et sociétés de gestion ;
- structuration d’appels d’offres ;
- due diligence de sociétés de gestion ;
- gouvernance, conformité, traçabilité des décisions ;
- mise en relation encadrée ;
- absence de réception de fonds ou de conservation de titres client.

## Architecture cible

```txt
apps/
  web/                       # Frontend Next.js SEO + espace utilisateur/admin UI
services/
  api-gateway/               # Point d’entrée REST commun
  auth-service/              # Auth email/password + OAuth
  contact-service/           # Réception et gestion des messages
  content-service/           # Pages SEO, slugs, schema.org
  admin-service/             # Cockpit administrateur, stats, audit logs
packages/
  config/                    # Config partagée
  ui/                        # Composants UI mutualisables
  types/                     # Types TypeScript partagés
```

## Pages publiques prévues

- `/`
- `/conseil-investissement-institutionnel`
- `/analyse-marches-uemoa`
- `/selection-fonds-opcvm`
- `/appels-offres-institutionnels`
- `/due-diligence-societes-gestion`
- `/gouvernance-conformite`
- `/contact`

## Espaces applicatifs prévus

- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`
- `/espace-client`
- `/admin`
- `/admin/messages`
- `/admin/users`
- `/admin/seo`
- `/admin/audit-logs`

## Démarrage local prévu

```bash
pnpm install
pnpm dev
```

## Note réglementaire

Les prestations de conseil en investissements boursiers, d’apport d’affaires ou de mise en relation sur le marché financier régional doivent être exercées dans le respect des habilitations requises par l’AMF-UMOA. Le cabinet ne reçoit ni fonds ni titres de la clientèle.

Ce dépôt est le socle de travail. Les prochaines mises à jour doivent rester progressives, non destructives et compatibles avec l’architecture microservices REST.
