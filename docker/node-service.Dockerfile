FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

ARG SERVICE_PATH
ENV SERVICE_PATH=${SERVICE_PATH}

COPY package.json pnpm-workspace.yaml ./
COPY apps ./apps
COPY services ./services
COPY packages ./packages
COPY database ./database

RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter "./${SERVICE_PATH}" build

CMD pnpm --filter "./${SERVICE_PATH}" start
