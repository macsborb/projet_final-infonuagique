# Projet E-Commerce Microservices

Ce projet est une application e-commerce basée sur une architecture de microservices, développée dans le cadre du cours d'infonuagique à l'UQAC. Il offre une plateforme complète avec authentification, catalogue de produits, paiement via Stripe et système de support client.

# Architecture
Le projet est composé des microservices suivants, tous conteneurisés avec Docker et orchestrés par Kubernetes :

- **Frontend** : Interface utilisateur en HTML/CSS/JavaScript
- **Service d'authentification** : Gestion des comptes utilisateurs et des connexions
- **Service de catalogue** : Gestion des produits disponibles
- **Service de paiement** : Intégration avec Stripe pour les paiements
- **Service de support** : Système de tickets d'assistance

# Prérequis

- Docker
- kubectl
- Minikube
- Node.js
- Clé API Stripe (version test)

# Installation et Configuration

## 1. Cloner le dépôt
```bash
git clone https://github.com/yourusername/projet_final-infonuagique.git
cd projet_final-infonuagique
```

## 2. Configurer le fichier hosts

Ajoutez l'entrée suivante à votre fichier hosts :

```bash
127.0.0.1 e-commerce.local
```

Sur Windows, le fichier se trouve généralement à `C:\Windows\System32\drivers\etc\hosts`.
Sur Linux et Mac, il se trouve à `/etc/hosts`.

## 3. Installer les dépendances et configurer les variables d'environnement

```bash
# Installer les dépendances Node.js
npm install

# Générer le fichier .env avec des valeurs par défaut
npm run setup
```

## 4. Modifier la clé API Stripe

Ouvrez le fichier .env à la racine du projet et remplacez :

```bash
STRIPE_SECRET_KEY=your_stripe_secret_key
```
par votre clé API Stripe.

# Lancement du Projet
## 1. Démarrer Minikube

```bash
minikube start
```

## 2. Déployer l'application

Sur Windows :
```bash
.\windows_deploy.ps1
```

Sur Linux/macOS :
```bash
chmod +x ./linux_deploy.sh
./linux_deploy.sh
```

## 3. Configurer l'accès
```bash
# Créer un tunnel pour exposer les services
minikube tunnel
```

Gardez cette commande en cours d'exécution dans un terminal séparé.

# Accéder à l'Application
Une fois déployée, ouvrez votre navigateur et accédez à :

```
http://e-commerce.local
```

# Arrêt du Projet
Pour arrêter le projet, exécutez la commande suivante :

```bash
# Arrêter minikube tunnel (Ctrl+C dans le terminal concerné)

# Arrêter minikube
minikube stop

# Pour supprimer complètement le cluster
minikube delete
```

--- 

Développé dans le cadre du cours d'infonuagique à l'Université du Québec à Chicoutimi (UQAC).


# Contributeurs
- Victor QIAN
- Robbie BLANC
- Clément MARY