#!/bin/bash

set -e  # Arrêter si erreur

echo "🔐 Création du secret Stripe..."
kubectl delete secret stripe-secret --ignore-not-found=true
kubectl create secret generic stripe-secret \
  --from-literal=STRIPE_SECRET_KEY=sk_test_XXX

echo "🔧 Déploiement du service de paiement..."
kubectl apply -f paymentService/K8S/payment-deployment.yaml
kubectl apply -f paymentService/K8S/payment-service.yaml

echo "🚀 Déploiement du frontend..."
kubectl apply -f frontend/K8S/frontend-deployment.yaml
kubectl apply -f frontend/K8S/frontend-service.yaml

echo "Déploiement du service d'authentification..."
kubectl apply -f authentication/K8S/auth-secret.yml
kubectl apply -f authentication/K8S/auth-mysql-deployment.yml
kubectl apply -f authentication/K8S/auth-deployment.yml
kubectl apply -f authentication/K8S/auth-service.yml

echo "Déploiement du service de catalogue..."
kubectl apply -f catalog/K8S/catalog-secrets.yml
kubectl apply -f catalog/K8S/catalog-mysql-deployment.yml
kubectl apply -f catalog/K8S/catalog-deployment.yml
kubectl apply -f catalog/K8S/catalog-service.yml

echo "✅ Déploiement terminé avec succès !"
