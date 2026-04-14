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

# Copy root package files to install production dependencies
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Install production dependencies
# Note: We use --no-frozen-lockfile because we are not copying the individual package.json files of the libs
RUN pnpm install --prod --no-frozen-lockfile

# Copy built assets from builder directly into /app
COPY --from=builder /app/dist/apps/api ./

EXPOSE 3000

# Run main.js from the root
CMD ["node", "main.js"]
