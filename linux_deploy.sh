#!/bin/bash

# Arrêter si erreur
set -e

# Vérifier si le fichier .env existe et le générer si nécessaire
if [ ! -f ./.env ]; then
  echo "🔧 Génération du fichier .env..."
  node setup-env.js
fi

# Charger les variables d'environnement depuis le fichier .env
export $(grep -v '^#' .env | xargs)

# Tuer les anciens déploiements pour garantir un état propre
echo "🧹 Nettoyage des anciens déploiements..."
kubectl delete -f projet-ingress.yml --ignore-not-found=true
kubectl delete deployment frontend-deployment --ignore-not-found=true
kubectl delete statefulset catalog-mysql --ignore-not-found=true
kubectl delete statefulset auth-mysql --ignore-not-found=true
kubectl delete deployment catalog-deployment --ignore-not-found=true
kubectl delete deployment auth-deployment --ignore-not-found=true
kubectl delete deployment payment-deployment --ignore-not-found=true
kubectl delete deployment support-deployment --ignore-not-found=true

# Appliquer le ConfigMap centralisé
echo "🔧 Application du ConfigMap pour les variables d'environnement..."
kubectl apply -f k8s/env-configmap.yml

echo "🔐 Création du secret Stripe..."
kubectl delete secret stripe-secret --ignore-not-found=true
kubectl create secret generic stripe-secret \
  --from-literal=STRIPE_SECRET_KEY="${PAYMENT_STRIPE_KEY}"

echo "🔐 Création du secret JWT..."
kubectl delete secret jwt-secret --ignore-not-found=true
kubectl create secret generic jwt-secret \
  --from-literal=secret="${AUTH_JWT_SECRET}"

echo "🔐 Création des secrets MySQL..."
kubectl delete secret mysql-auth-secret --ignore-not-found=true
kubectl create secret generic mysql-auth-secret \
  --from-literal=mysql-root-password="${AUTH_DB_PASSWORD}"

kubectl delete secret mysql-catalog-secret --ignore-not-found=true
kubectl create secret generic mysql-catalog-secret \
  --from-literal=mysql-root-password="${CATALOG_DB_PASSWORD}"

echo "🔧 Déploiement du service de paiement..."
kubectl apply -f paymentService/K8S/payment-deployment.yaml
kubectl apply -f paymentService/K8S/payment-service.yaml

echo "🚀 Déploiement du frontend..."
kubectl apply -f frontend/K8S/frontend-deployment.yaml
kubectl apply -f frontend/K8S/frontend-service.yaml

echo "Déploiement du service d'authentification..."
kubectl apply -f authentication/K8S/auth-mysql-initdb.yml
kubectl apply -f authentication/K8S/auth-mysql-deployment.yml
kubectl apply -f authentication/K8S/auth-deployment.yml
kubectl apply -f authentication/K8S/auth-service.yml

echo "Déploiement du service de catalogue..."
kubectl apply -f catalog/K8S/catalog-mysql-initdb.yml
kubectl apply -f catalog/K8S/catalog-mysql-deployment.yml
kubectl apply -f catalog/K8S/catalog-deployment.yml
kubectl apply -f catalog/K8S/catalog-service.yml

# Vérifier si les fichiers du service support existent
if [ -f "support/K8S/support-mysql-initdb.yml" ]; then
    echo "Déploiement du service de support..."
    kubectl apply -f support/K8S/support-mysql-initdb.yml
    kubectl apply -f support/K8S/support-mysql-deployment.yml
    kubectl apply -f support/K8S/support-deployment.yml
    kubectl apply -f support/K8S/support-service.yml
else
    echo "⚠️ Les fichiers du service de support n'ont pas été trouvés. Le déploiement du service de support est ignoré."
fi

# Avant d'installer l'Ingress
echo "📦 Installation de l'Ingress Controller..."
minikube addons enable ingress

# Attendre que l'Ingress Controller soit prêt
sleep 10

# Puis installer votre Ingress
echo "🔄 Installation de l'Ingress..."
kubectl apply -f projet-ingress.yml

echo "✅ Déploiement terminé avec succès !"