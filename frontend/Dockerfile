# Étape 1: Utiliser une image de Node.js officielle
FROM node:16

# Étape 2: Définir le répertoire de travail
WORKDIR /app

# Étape 3: Copier les fichiers de l'application dans le container
COPY package*.json ./

# Étape 4: Installer les dépendances de l'application
RUN npm install

# Étape 5: Copier tout le reste du code dans le container
COPY . .

# Étape 6: Exposer le port 3000 (port utilisé par défaut pour Node.js)
EXPOSE 3000

# Étape 7: Démarrer l'application (assurez-vous que votre app s'exécute sur le bon port)
CMD ["npm", "start"]
