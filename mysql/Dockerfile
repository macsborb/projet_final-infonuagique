FROM mysql:5.7

# Copier le script d'initialisation dans le répertoire qui s'exécute au lancement du container.
COPY init.sql /docker-entrypoint-initdb.d/
