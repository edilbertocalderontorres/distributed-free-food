FROM node:22-alpine AS builder

USER root

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install 

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa final para producción
FROM node:22-alpine

ENV NODE_ENV production

USER root

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar solo dependencias de producción
RUN npm install --omit=dev

# Copiar la compilación desde la etapa builder
COPY --from=builder /app/dist ./dist

EXPOSE 8081

CMD ["node", "dist/src/main.js"]
