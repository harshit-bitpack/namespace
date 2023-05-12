# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM node:alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat python3 build-base
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:alpine AS installer
RUN apk add --no-cache libc6-compat python3 build-base
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
# COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN apk add git
RUN yarn install

# Build the project
COPY --from=builder /app/out/full/ .
# COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

ARG BICONOMY_API_KEY
ENV BICONOMY_API_KEY=$BICONOMY_API_KEY

ARG ALCHEMY_API_KEY_URL_ETHEREUM
ENV ALCHEMY_API_KEY_URL_ETHEREUM=$ALCHEMY_API_KEY_URL_ETHEREUM

ARG ALCHEMY_API_KEY_URL_POLYGON
ENV ALCHEMY_API_KEY_URL_POLYGON=$ALCHEMY_API_KEY_URL_POLYGON

ARG ALCHEMY_API_KEY_URL_ZKEVM
ENV ALCHEMY_API_KEY_URL_ZKEVM=$ALCHEMY_API_KEY_URL_ZKEVM


ARG NEXT_PUBLIC_DEV_CONTRACT_ADDRESS
ENV NEXT_PUBLIC_DEV_CONTRACT_ADDRESS=$NEXT_PUBLIC_DEV_CONTRACT_ADDRESS


ARG NEXT_PUBLIC_APP_CONTRACT_ADDRESS
ENV NEXT_PUBLIC_APP_CONTRACT_ADDRESS=$NEXT_PUBLIC_APP_CONTRACT_ADDRESS


RUN yarn turbo run build --filter=web...

FROM node:alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

ENV NODE_ENV production
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
