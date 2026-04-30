FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml ./
COPY apps ./apps
COPY services ./services
COPY packages ./packages
COPY database ./database

RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @investbourse/database db:generate
RUN pnpm --filter @investbourse/web build

EXPOSE 3000
CMD ["pnpm", "--filter", "@investbourse/web", "start"]
