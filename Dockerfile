# base node image
# FROM node:22-bullseye-slim as base
# use the official Bun image
# https://developers.redhat.com/blog/2019/02/21/podman-and-buildah-for-docker-users#how_does_docker_work_
# Security Checklist
# https://spacelift.io/blog/docker-security
# https://spacelift.io/blog/dockerfile
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:canary AS base

LABEL dev.fly.miniature-gnatt-chart-1d51=fullstack
# set for base and all layer that inherit from it
ENV NODE_ENV production


# Install openssl for Prisma
RUN apt-get update  && apt-get install -y --no-install-recommends  openssl sqlite3 curl && apt-get -y autoclean && export NVM_COLORS='cmgRY'
RUN curl --silent -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

RUN echo  "#!/bin/bash\n" \
    "export NVM_DIR="$HOME/.nvm"\n"\
    "[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"\n"\
    "[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"\n"\ 
    "nvm install node && apt-get clean && rm -rf /var/lib/apt/lists/*" > setup-teardown.sh
RUN chmod +x setup-teardown.sh && ./setup-teardown.sh


# Prepare for LiteFS installation
# apt-get install -y ca-certificates fuse3
# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp

COPY package.json bun.lockb .npmrc ./
RUN bun install --bun --smol

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

# Install LiteFS
# COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs
# TURSO 
# COPY --from=deps /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

COPY --from=deps /myapp/node_modules /myapp/node_modules
COPY package.json bun.lockb .npmrc ./
RUN bun --bun install --production

# Build the app
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

COPY prisma .
RUN bunx --bun prisma generate

COPY . .
RUN bun --bun run build

# Finally, build the production image with minimal footprint
FROM base

ENV DATABASE_URL=file:/data/sqlite.db
ENV PORT="8080"
ENV HOST="0.0.0.0"
ENV NODE_ENV="production"

# add shortcut for connecting to database CLI
RUN printf "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /myapp
# RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs
COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/start.sh /myapp/start.sh
COPY --from=build /myapp/prisma /myapp/prisma
# run the app
USER bun
EXPOSE 8080/tcp
# EXPOSE 80/udp
# Health check on docker container.
# HEALTHCHECK --interval=5m --timeout=3s \
#   CMD curl -f http://localhost/ || exit 1
ENTRYPOINT [ "bun" ]
CMD ["run", "./start.sh" ]

