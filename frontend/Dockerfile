FROM nginx:alpine
# Copier tous les fichiers statiques dans le dossier de Nginx
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
