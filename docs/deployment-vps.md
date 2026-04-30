# Investbourse — Déploiement VPS production

## 1. Objectif

Ce document décrit une procédure de déploiement VPS pour la plateforme Investbourse :

- frontend Next.js ;
- API Gateway ;
- microservices Fastify ;
- PostgreSQL ;
- Prisma ;
- Nginx reverse proxy ;
- HTTPS Let's Encrypt ;
- cockpit administrateur ;
- authentification et rôles ;
- exports et audit.

## 2. Préparation du VPS

Mettre à jour le serveur :

```bash
sudo apt update && sudo apt upgrade -y
```

Installer Git, Docker et Docker Compose :

```bash
sudo apt install -y git ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Ajouter l’utilisateur courant au groupe Docker :

```bash
sudo usermod -aG docker $USER
```

Se reconnecter ensuite au serveur.

## 3. Récupérer le projet

```bash
git clone https://github.com/Patricked-code/Investbourse.git
cd Investbourse
```

## 4. Créer le fichier d’environnement production

```bash
cp .env.production.example .env.production
nano .env.production
```

À remplacer impérativement :

```txt
POSTGRES_PASSWORD
DATABASE_URL
AUTH_SECRET
JWT_SECRET
SEED_ADMIN_EMAIL
SEED_ADMIN_PASSWORD
NEXT_PUBLIC_SITE_URL
CORS_ORIGIN
```

## 5. Adapter le domaine Nginx

Éditer :

```bash
nano docker/nginx/investbourse.conf
```

Remplacer :

```txt
investbourse.example.com
```

par le domaine réel.

## 6. Premier démarrage sans HTTPS final

Pour le premier lancement, il est possible de commenter temporairement le bloc SSL dans Nginx si les certificats ne sont pas encore présents.

Lancer la stack :

```bash
docker compose -f docker/docker-compose.production.yml --env-file .env.production up -d --build
```

## 7. Migrations Prisma

Exécuter depuis le VPS :

```bash
docker compose -f docker/docker-compose.production.yml --env-file .env.production exec api-gateway pnpm --filter @investbourse/database db:deploy
```

Seed initial :

```bash
docker compose -f docker/docker-compose.production.yml --env-file .env.production exec api-gateway pnpm --filter @investbourse/database db:seed
```

Créer le superadmin :

```bash
docker compose -f docker/docker-compose.production.yml --env-file .env.production exec api-gateway pnpm --filter @investbourse/database db:seed-admin
```

## 8. HTTPS Let's Encrypt

Créer les dossiers :

```bash
mkdir -p docker/certbot/www docker/certbot/conf
```

Installer temporairement certbot sur l’hôte ou utiliser une image certbot Docker.

Exemple avec Docker :

```bash
docker run --rm \
  -v $(pwd)/docker/certbot/www:/var/www/certbot \
  -v $(pwd)/docker/certbot/conf:/etc/letsencrypt \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email contact@votredomaine.com \
  --agree-tos \
  --no-eff-email \
  -d investbourse.example.com \
  -d www.investbourse.example.com
```

Remplacer les domaines avant exécution.

Redémarrer Nginx :

```bash
docker compose -f docker/docker-compose.production.yml --env-file .env.production restart nginx
```

## 9. Vérifications production

Vérifier :

```txt
https://votredomaine.com
https://votredomaine.com/auth/login
https://votredomaine.com/admin
https://votredomaine.com/admin/audit
https://votredomaine.com/admin/utilisateurs
https://votredomaine.com/admin/exports
https://votredomaine.com/admin/contenu-seo
```

Vérifier les services internes depuis le VPS :

```bash
docker compose -f docker/docker-compose.production.yml --env-file .env.production ps
```

Logs :

```bash
docker compose -f docker/docker-compose.production.yml --env-file .env.production logs -f api-gateway
docker compose -f docker/docker-compose.production.yml --env-file .env.production logs -f auth-service
docker compose -f docker/docker-compose.production.yml --env-file .env.production logs -f web
```

## 10. Sauvegarde PostgreSQL

Créer un dossier backups :

```bash
mkdir -p backups
```

Sauvegarde manuelle :

```bash
docker compose -f docker/docker-compose.production.yml --env-file .env.production exec postgres pg_dump -U investbourse investbourse > backups/investbourse-$(date +%F).sql
```

À automatiser via cron.

## 11. Mise à jour applicative

```bash
git pull origin main
docker compose -f docker/docker-compose.production.yml --env-file .env.production up -d --build
docker compose -f docker/docker-compose.production.yml --env-file .env.production exec api-gateway pnpm --filter @investbourse/database db:deploy
```

## 12. Sécurité production

À respecter strictement :

- utiliser des secrets longs et uniques ;
- désactiver le bypass local ;
- limiter l’accès SSH par clé ;
- activer un firewall ;
- ne pas exposer PostgreSQL publiquement ;
- ne pas exposer les microservices publiquement ;
- vérifier les logs ;
- sauvegarder la base ;
- renouveler les certificats ;
- ne pas utiliser les mots de passe de démonstration.
