
FROM node:18 AS builder


RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app


COPY package.json pnpm-lock.yaml ./


RUN pnpm install --frozen-lockfile 


RUN pnpm add -D @types/node


COPY . .


RUN pnpm run build


FROM node:22-alpine

WORKDIR /app


RUN corepack enable && corepack prepare pnpm@latest --activate


COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist


RUN pnpm install --frozen-lockfile --prod


RUN addgroup appgroup && adduser -S appuser -G appgroup
USER appuser


EXPOSE 3000


CMD ["node", "dist/main.js"]
