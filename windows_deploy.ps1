# Arrêter si erreur
$ErrorActionPreference = "Stop"

# Vérifier si le fichier .env existe et le générer si nécessaire
if (-not (Test-Path .\.env)) {
  Write-Output "🔧 Génération du fichier .env..."
  node setup-env.js
}

# Charger les variables d'environnement depuis le fichier .env
Get-Content .\.env | ForEach-Object {
  if ($_ -match "^([^#=]+)=(.*)$") {
    $name = $matches[1].Trim()
    $value = $matches[2].Trim()
    Set-Variable -Name $name -Value $value
  }
}

# Tuer les anciens déploiements pour garantir un état propre
Write-Output "🧹 Nettoyage des anciens déploiements..."
kubectl delete -f projet-ingress.yml --ignore-not-found=true
kubectl delete deployment frontend-deployment --ignore-not-found=true
kubectl delete statefulset catalog-mysql --ignore-not-found=true
kubectl delete statefulset auth-mysql --ignore-not-found=true
kubectl delete deployment catalog-deployment --ignore-not-found=true
kubectl delete deployment auth-deployment --ignore-not-found=true
kubectl delete deployment payment-deployment --ignore-not-found=true
kubectl delete deployment support-deployment --ignore-not-found=true

# Appliquer le ConfigMap centralisé
Write-Output "🔧 Application du ConfigMap pour les variables d'environnement..."
kubectl apply -f k8s/env-configmap.yml

Write-Output "🔐 Création du secret Stripe..."
kubectl delete secret stripe-secret --ignore-not-found=true
kubectl create secret generic stripe-secret `
  --from-literal=STRIPE_SECRET_KEY=$PAYMENT_STRIPE_KEY

Write-Output "🔐 Création du secret JWT..."
kubectl delete secret jwt-secret --ignore-not-found=true
kubectl create secret generic jwt-secret `
  --from-literal=secret=$AUTH_JWT_SECRET

Write-Output "🔐 Création des secrets MySQL..."
kubectl delete secret mysql-auth-secret --ignore-not-found=true
kubectl create secret generic mysql-auth-secret `
  --from-literal=mysql-root-password=$AUTH_DB_PASSWORD

kubectl delete secret mysql-catalog-secret --ignore-not-found=true
kubectl create secret generic mysql-catalog-secret `
  --from-literal=mysql-root-password=$CATALOG_DB_PASSWORD

Write-Output "🔧 Déploiement du service de paiement..."
kubectl apply -f paymentService/K8S/payment-deployment.yaml
kubectl apply -f paymentService/K8S/payment-service.yaml

Write-Output "🚀 Déploiement du frontend..."
kubectl apply -f frontend/K8S/frontend-deployment.yaml
kubectl apply -f frontend/K8S/frontend-service.yaml

Write-Output "Déploiement du service d'authentification..."
kubectl apply -f authentication/K8S/auth-mysql-initdb.yml
kubectl apply -f authentication/K8S/auth-mysql-deployment.yml
kubectl apply -f authentication/K8S/auth-deployment.yml
kubectl apply -f authentication/K8S/auth-service.yml

Write-Output "Déploiement du service de catalogue..."
kubectl apply -f catalog/K8S/catalog-mysql-initdb.yml
kubectl apply -f catalog/K8S/catalog-mysql-deployment.yml
kubectl apply -f catalog/K8S/catalog-deployment.yml
kubectl apply -f catalog/K8S/catalog-service.yml

# Vérifier si les fichiers du service support existent
if (Test-Path support/K8S/support-mysql-initdb.yml) {
    Write-Output "Déploiement du service de support..."
    kubectl apply -f support/K8S/support-mysql-initdb.yml
    kubectl apply -f support/K8S/support-mysql-deployment.yml
    kubectl apply -f support/K8S/support-deployment.yml
    kubectl apply -f support/K8S/support-service.yml
} else {
    Write-Output "⚠️ Les fichiers du service de support n'ont pas été trouvés. Le déploiement du service de support est ignoré."
}

# Avant d'installer l'Ingress
Write-Output "📦 Installation de l'Ingress Controller..."
minikube addons enable ingress

# Attendre que l'Ingress Controller soit prêt
Start-Sleep -Seconds 10

# Puis installer votre Ingress
Write-Output "🔄 Installation de l'Ingress..."
kubectl apply -f projet-ingress.yml

Write-Output "✅ Déploiement terminé avec succès !"