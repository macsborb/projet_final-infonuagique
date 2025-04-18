# Arrêter si erreur
$ErrorActionPreference = "Stop"

# Tuer les anciens déploiements pour garantir un état propre
Write-Output "🧹 Nettoyage des anciens déploiements..."
kubectl delete -f projet-ingress.yml --ignore-not-found=true
kubectl delete deployment frontend-deployment --ignore-not-found=true
kubectl delete statefulset catalog-mysql --ignore-not-found=true
kubectl delete statefulset auth-mysql --ignore-not-found=true
kubectl delete deployment catalog-deployment --ignore-not-found=true
kubectl delete deployment auth-deployment --ignore-not-found=true
kubectl delete deployment payment-deployment --ignore-not-found=true

Write-Output "🔐 Création du secret Stripe..."
kubectl delete secret stripe-secret --ignore-not-found=true
kubectl create secret generic stripe-secret `
  --from-literal=STRIPE_SECRET_KEY=sk_test_51RDRciRDak0StwbZX3fioKVNldr4bqzVMXZO3rjXCsX4TrNAvUwx9EWtsfo3eBnvsNmnfoPSIEeNWkht0zHZpBLJ00I5Q1wfO8

Write-Output "🔧 Déploiement du service de paiement..."
kubectl apply -f paymentService/K8S/payment-deployment.yaml
kubectl apply -f paymentService/K8S/payment-service.yaml

Write-Output "🚀 Déploiement du frontend..."
kubectl apply -f frontend/K8S/frontend-deployment.yaml
kubectl apply -f frontend/K8S/frontend-service.yaml

Write-Output "Déploiement du service d'authentification..."
kubectl apply -f authentication/K8S/auth-secret.yml
kubectl apply -f authentication/K8S/auth-mysql-initdb.yml
kubectl apply -f authentication/K8S/auth-mysql-deployment.yml
kubectl apply -f authentication/K8S/auth-deployment.yml
kubectl apply -f authentication/K8S/auth-service.yml

Write-Output "Déploiement du service de catalogue..."
kubectl apply -f catalog/K8S/catalog-secrets.yml
kubectl apply -f catalog/K8S/catalog-mysql-initdb.yml
kubectl apply -f catalog/K8S/catalog-mysql-deployment.yml
kubectl apply -f catalog/K8S/catalog-deployment.yml
kubectl apply -f catalog/K8S/catalog-service.yml

# Avant d'installer l'Ingress
Write-Output "📦 Installation de l'Ingress Controller..."
minikube addons enable ingress

# Attendre que l'Ingress Controller soit prêt
Start-Sleep -Seconds 10

# Puis installer votre Ingress
Write-Output "🔄 Installation de l'Ingress..."
kubectl apply -f projet-ingress.yml

Write-Output "✅ Déploiement terminé avec succès !"
