FROM node:20-alpine
RUN apk add --no-cache bash jq
WORKDIR /app

# Dependencies
COPY package.json ./
RUN npm install --production

# Add source
COPY src/ ./src/
COPY ui/ ./ui/
COPY entrypoint.sh ./
COPY config.json ./

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
