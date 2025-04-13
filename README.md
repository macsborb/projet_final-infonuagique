# Microservice d'authentification

Le service d'authentification gère l'inscription, la connexion des utilisateurs et la génération des tokens JWT.

## Structure du micro service

```
authentication/
├── Dockerfile
├── package.json
├── server.js
├── src/
│   ├── controllers/
│   │   └── authController.js
│   ├── models/
│   │   └── userModel.js
│   ├── routes/
│   │   └── authRoutes.js
│   └── config/
│       └── database.js
└── schema.sql
```

## Prérequis

- Docker et Docker Compose
- Node.js (pour le développement local uniquement)
- MySQL (pour le développement local uniquement)
- Un client API comme Bruno, Postman ou curl

## Mise en route

### Démarrage avec Docker Compose

1. Démarrez les conteneurs
```bash
docker-compose up -d
```

2. Vérifiez que les conteneurs sont en cours d'exécution
```bash
docker-compose ps
```

Vous devriez voir `auth-service` et `auth-db` avec le statut "Up".

## Test des API

Vous pouvez tester les API à l'aide d'un client comme Bruno, Postman ou curl.

### 1. Créer un nouvel utilisateur (inscription)

**POST** `http://localhost:3001/api/auth/register`

Corps de la requête (JSON):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

Réponse attendue (200 OK):
```json
{
  "message": "Utilisateur créé avec succès",
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### 2. Connecter un utilisateur existant

**POST** `http://localhost:3001/api/auth/login`

Corps de la requête (JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

Réponse attendue (200 OK):
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### 3. Récupérer les informations de l'utilisateur connecté

**GET** `http://localhost:3001/api/auth/me`

Headers:
```
Authorization: Bearer votre_token_jwt
```

Réponse attendue (200 OK):
```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### 4. Vérifier la santé du service

**GET** `http://localhost:3001/health`

Réponse attendue (200 OK):
```json
{
  "status": "ok"
}
```