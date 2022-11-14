FROM node:latest

RUN npm install -g pnpm@7.9.0

WORKDIR /app
COPY pnpm-lock.yaml ./
RUN pnpm fetch

ADD . ./
RUN pnpm install --offline

CMD ["pnpm", "server:start"]
