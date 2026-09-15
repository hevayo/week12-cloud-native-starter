# Week 12: containerise the temperature converter
# Small base image with the Node runtime
FROM node:24-alpine
# Working directory inside the image
WORKDIR /app
# No npm install: the server uses only Node built-ins (Jest is a dev dependency, not shipped)
COPY package.json ./
# The Week 11 static site and the small HTTP server
COPY site ./site
COPY server.js ./
ENV PORT=3000
# Do not run as root inside the container
USER node
EXPOSE 3000
# The one process this container runs
CMD ["node", "server.js"]
