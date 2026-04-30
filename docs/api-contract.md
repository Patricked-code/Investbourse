# Investbourse — Contrat API REST

## 1. Convention générale

Toutes les réponses REST doivent suivre une structure simple :

```json
{
  "ok": true,
  "data": {}
}
```

ou :

```json
{
  "ok": false,
  "error": "ERROR_CODE",
  "details": {}
}
```

## 2. API Gateway

Base locale :

```txt
http://localhost:4000
```

### GET /health

Retourne l’état du gateway et les URL des services internes.

### POST /api/contact-requests

Crée une demande institutionnelle.

Body :

```json
{
  "fullName": "Nom Prénom",
  "organization": "Institution",
  "email": "contact@example.com",
  "requestType": "appel-offres",
  "message": "Description du besoin institutionnel"
}
```

### GET /api/seo-pages

Retourne les pages SEO disponibles depuis content-service.

### GET /api/office/dashboard

Retourne les agrégats back-office.

### GET /api/office/messages

Retourne les messages de suivi back-office.

### POST /api/office/messages

Crée un enregistrement back-office lié à une demande.

Body :

```json
{
  "contactRequestId": "REQ-123",
  "status": "OPEN",
  "priority": "NORMAL",
  "assignedTo": "user-id-or-name",
  "note": "Première qualification"
}
```

## 3. Contact Service

Base locale :

```txt
http://localhost:4010
```

### GET /health

Santé du service.

### GET /contact-requests

Liste des demandes.

### GET /contact-requests/:id

Détail d’une demande.

### POST /contact-requests

Création d’une demande.

## 4. Content Service

Base locale :

```txt
http://localhost:4020
```

### GET /health

Santé du service.

### GET /seo-pages

Liste des pages SEO.

### GET /seo-pages/:slug

Détail d’une page SEO.

### POST /seo-pages

Création ou mise à jour d’une page SEO.

## 5. Office Service

Base locale :

```txt
http://localhost:4040
```

### GET /health

Santé du service.

### GET /office/dashboard

Agrégats back-office.

### GET /office/messages

Liste des suivis back-office.

### POST /office/messages

Création d’un suivi back-office.

## 6. Auth Service futur

Base prévue :

```txt
http://localhost:4030
```

Routes futures :

- POST /auth/register ;
- POST /auth/login ;
- POST /auth/access-recovery ;
- GET /auth/session ;
- POST /auth/logout ;
- OAuth Google ;
- OAuth Facebook ;
- OAuth Microsoft.

## 7. Sécurité future

À implémenter :

- authentification ;
- rôles USER / ADMIN / SUPERADMIN ;
- cookies sécurisés ;
- CSRF pour formulaires sensibles ;
- rate limiting ;
- audit log ;
- validation Zod partagée ;
- filtrage CORS par domaine ;
- en-têtes de sécurité.
