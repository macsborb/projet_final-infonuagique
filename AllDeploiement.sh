#!/bin/bash

set -e  # Arrêter si erreur

echo "🔧 Déploiement du service de paiement..."
kubectl apply -f paymentService/K8S/payment-deployment.yaml
kubectl apply -f paymentService/K8S/payment-service.yaml

echo "🔐 Création du secret Stripe..."
kubectl delete secret stripe-secret --ignore-not-found=true
kubectl create secret generic stripe-secret \
  --from-literal=STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXX

echo "🚀 Déploiement du frontend..."
kubectl apply -f frontend/K8S/frontend-deployment.yaml
kubectl apply -f frontend/K8S/frontend-service.yaml

echo "✅ Déploiement terminé avec succès !"
