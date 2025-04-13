# Mise en route

## Prérequis

- Docker et Docker Compose
- Node.js (pour le développement local uniquement)
- MySQL (pour le développement local uniquement)
- Un client API comme Bruno, Postman ou curl

## Démarrage avec Docker Compose

1. Démarrez les conteneurs
```bash
docker-compose up -d
```

2. Vérifiez que les conteneurs sont en cours d'exécution
```bash
docker-compose ps
```
Vous devriez voir `auth-service` et `auth-db` avec le statut "Up".
Vous devriez voir `catalog-service` et `catalog-db` avec le statut "Up".
Vous devriez voir `frontend-service` avec le statut "Up".

3. Frontend URL
L'URL du frontend est :

```bash
http://localhost:80/index.html
```

4. Secret Stripe
   
Pour faire fonctionner Stripe inserer la clé Stripe envoyer dans le Discord en message épingler.

Vous pouvez l'inserer directement dans le docker-compose ou alors dans un fichier .env avec comme nom de variable : 

```bash
STRIPE_SECRET_KEY=YourStripeSecretKey
```


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

# Microservice de Catalogue

Le service de catalogue gère l'inventaire des produits, avec des fonctionnalités de recherche et d'administration.

## Structure du micro service

```
catalog/
├── Dockerfile
├── package.json
├── server.js
├── src/
│   ├── controllers/
│   │   └── productController.js
│   ├── models/
│   │   └── productModel.js
│   ├── routes/
│   │   └── productRoutes.js
│   └── config/
│       └── database.js
└── schema.sql
```

## Test des API

Vous pouvez tester les API à l'aide d'un client comme Bruno, Postman ou curl.

### 1. Obtenir tous les produits

**GET** `http://localhost:3002/api/products`

Réponse attendue (200 OK):
```json
[
  {
    "id": 1,
    "name": "Smartphone XYZ",
    "description": "Un smartphone haut de gamme avec écran OLED et appareil photo 48MP",
    "price": 699.99,
    "image_url": "smartphone.jpg",
    "stock": 25,
    "created_at": "2023-04-01T10:00:00.000Z",
    "updated_at": "2023-04-01T10:00:00.000Z"
  },
  ...
]
```

### 2. Obtenir un produit par ID

**GET** `http://localhost:3002/api/products/1`

Réponse attendue (200 OK):
```json
{
  "id": 1,
  "name": "Smartphone XYZ",
  "description": "Un smartphone haut de gamme avec écran OLED et appareil photo 48MP",
  "price": 699.99,
  "image_url": "smartphone.jpg",
  "stock": 25,
  "created_at": "2023-04-01T10:00:00.000Z",
  "updated_at": "2023-04-01T10:00:00.000Z"
}
```

### 3. Rechercher des produits

**GET** `http://localhost:3002/api/products/search?query=smartphone`

Réponse attendue (200 OK):
```json
[
  {
    "id": 1,
    "name": "Smartphone XYZ",
    "description": "Un smartphone haut de gamme avec écran OLED et appareil photo 48MP",
    "price": 699.99,
    "image_url": "smartphone.jpg",
    "stock": 25,
    "created_at": "2023-04-01T10:00:00.000Z",
    "updated_at": "2023-04-01T10:00:00.000Z"
  }
]
```

### 4. Créer un nouveau produit (Admin seulement)

**POST** `http://localhost:3002/api/products`

Headers:
```
Authorization: Bearer votre_token_jwt
```

Corps de la requête (JSON):
```json
{
  "name": "Enceinte Bluetooth",
  "description": "Enceinte portable étanche avec 20h d'autonomie",
  "price": 89.99,
  "image_url": "enceinte.jpg",
  "stock": 50
}
```

Réponse attendue (201 Created):
```json
{
  "message": "Produit créé avec succès",
  "product": {
    "id": 6,
    "name": "Enceinte Bluetooth",
    "description": "Enceinte portable étanche avec 20h d'autonomie",
    "price": 89.99,
    "image_url": "enceinte.jpg",
    "stock": 50
  }
}
```

### 5. Mettre à jour un produit (Admin seulement)

**PUT** `http://localhost:3002/api/products/6`

Headers:
```
Authorization: Bearer votre_token_jwt
```

Corps de la requête (JSON):
```json
{
  "price": 79.99,
  "stock": 45
}
```

Réponse attendue (200 OK):
```json
{
  "message": "Produit mis à jour avec succès",
  "product": {
    "id": 6,
    "name": "Enceinte Bluetooth",
    "description": "Enceinte portable étanche avec 20h d'autonomie",
    "price": 79.99,
    "image_url": "enceinte.jpg",
    "stock": 45,
    "created_at": "2023-04-01T11:00:00.000Z",
    "updated_at": "2023-04-01T11:30:00.000Z"
  }
}
```

### 6. Supprimer un produit (Admin seulement)

**DELETE** `http://localhost:3002/api/products/6`

Headers:
```
Authorization: Bearer votre_token_jwt
```

Réponse attendue (200 OK):
```json
{
  "message": "Produit supprimé avec succès"
}
```

### 7. Vérifier la santé du service

**GET** `http://localhost:3002/health`

Réponse attendue (200 OK):
```json
{
  "status": "ok"
}
```

## Notes sur l'authentification

Pour les opérations d'administration (création, mise à jour et suppression de produits), vous devez être authentifié en tant qu'administrateur. Dans notre implémentation simplifiée, l'utilisateur avec l'ID 1 est considéré comme administrateur.

Pour obtenir un token JWT valide, vous devez d'abord vous inscrire et vous connecter via le service d'authentification (`http://localhost:3001/api/auth/register` et `http://localhost:3001/api/auth/login`).


