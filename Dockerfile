FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ENV NEXT_PUBLIC_SERVER_URL=__NEXT_PUBLIC_SERVER_URL__
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4005
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/public            ./public
COPY --from=builder /app/.next/standalone  ./
COPY --from=builder /app/.next/static      ./.next/static
EXPOSE 4005
CMD ["node", "server.js"]
