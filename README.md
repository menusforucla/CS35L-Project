# Menus for UCLA

## Project Structure

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ auth-proxy (OAuth proxy server) (Not used in this project)
  |   ├─ Nitro server to proxy OAuth requests in preview deployments
  |   └─ Uses Auth.js Core
  ├─ expo (iOS and Android application) (Not used in this project)
  |   ├─ Expo SDK 49
  |   ├─ React Native using React 18
  |   ├─ Navigation using Expo Router
  |   ├─ Tailwind using Nativewind
  |   └─ Typesafe API calls using tRPC
  └─ next.js (Website + API Server & Client)
      ├─ Next.js 14
      ├─ React 18
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  |   └─ tRPC v10 router definition
  ├─ auth
  |   └─ Authentication using next-auth. **NOTE: Only for Next.js app, not Expo**
  ├─ db
  |   └─ Typesafe db calls using Drizzle & Planetscale
  └─ scraper
      └─ Scrapes UCLA dining menus and uploads it to the database
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```
## Quick Start

To get it running, follow the steps below:

### 1. Prerequisites

- [Node.js](https://nodejs.org/en)
- [pnpm](https://pnpm.io)
- [MySQL](https://www.mysql.com/): We used [Planetscale](https://planetscale.com) for this project.
- [uploadthing](https://uploadthing.com/) image uploading service
- [OAuth 2.0 credentials](https://console.developers.google.com/apis/credentials)

### 2. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory that you can use as a template.
cp .env.example .env

# Push the Drizzle schema to the database
pnpm db:push
```

### 3. Running the app/website

#### Use Browser

1. Run `pnpm --filter nextjs dev` at the project root folder. This should run the website on http://localhost:3000.

## References

The stack originates from [create-t3-app](https://github.com/t3-oss/create-t3-app).
This project uses [Radix UI](https://www.radix-ui.com/), [MUI](https://mui.com/), and [Tailwind CSS](https://tailwindcss.com/) for UI. There are also other UI packages which can be found in `apps/nextjs/package.json`. 
This project uses [tRPC](https://trpc.io) for type-safe API calls and [Prisma](https://www.prisma.io/) for type-safe database access.