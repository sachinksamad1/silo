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

# Build the api
RUN npx nx build api --configuration=production

# STAGE 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.33.0

ENV NODE_ENV=production

# Copy built assets from builder
COPY --from=builder /app/dist/apps/api ./
# Copy workspace dependencies (if nx-js:copy-workspace-modules was used)
# Note: Nx build usually bundles everything if using webpack/esbuild for Node
# In this project, apps/api/project.json shows webpack-cli build.

# Install production dependencies only
# We need to make sure we have the pruned lockfile/package.json
# Nx's prune-lockfile target helps here, but for simplicity we can just install from what's in dist/apps/api
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["node", "main.js"]
