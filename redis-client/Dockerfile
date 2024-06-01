# Establecer la imagen base
FROM node:14-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Instalar un servidor web para servir los archivos estáticos
RUN npm install -g serve

# Exponer el puerto 3000
EXPOSE 3000

# Comando para correr la aplicación
CMD ["serve", "-s", "build"]
