# STAGE 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.33.0

# Copy workspace config files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy all projects
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the web app
RUN npx nx build web --configuration=production

# STAGE 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy standalone build
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

# When using standalone, Next.js starts with 'node server.js'
CMD ["node", "apps/web/server.js"]
