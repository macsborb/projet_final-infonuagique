FROM node:20-alpine

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers de configuration et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du code
COPY . .

EXPOSE 3003
CMD ["npm", "start"]
