# Utilisez une image Node.js officielle comme image de baseu
FROM node:14

# Définissez le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copiez les fichiers package.json et package-lock.json
COPY package*.json ./

# Installez les dépendances de votre application
RUN npm install express
RUN npm install bcrypt
RUN npm install jsonwebtoken
RUN npm install mongodb
RUN npm install uuid
RUN npm install mssql
RUN npm install nodemon

# Copiez le reste des fichiers de votre application dans le conteneur
COPY . .

# Exposez le port que votre application utilise
EXPOSE 3000

# Définissez la commande pour exécuter votre application
CMD [ "node", "auth.js" ]
