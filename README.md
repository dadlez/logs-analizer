# Vite+ Monorepo Starter

This app uses a vite-plus library for running the monorepo.

# Runing the app

Prerequsits: Node 22, pnpm package manager

## Set environment

Copy `apps/api/.env.example` into a `apps/api/.env` file and fill database url.

## Install dependencies

```npm
pnpm install
```

## Start dev servers with a file watch

```npm
pnpm run dev:api
pnpm run dev:website
```

## Build and start local servers

```npm
pnpm run build
pnpm run start:api
pnpm run start:website
```

## Run unit tests

```npm
pnpm run test
```

## Run e2e tests

Install headless browser for playwright

```npm
e2e:install-browsers
```

Then run tests headless or with the playwright UI

```npm
pnpm run test:e2e-ui
```
