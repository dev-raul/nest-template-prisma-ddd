<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

I created this api to server as a template nest js with DDD.

### Tools:

- Nest
- Prisma
- Swagger

## Installation

```bash
$ yarn install
```

## Running prisma migration

### Add envs in .env file

```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASS=root
DATABASE_NAME=nest_template_prisma
DATABASE_ROOT_PASSWORD=root
DATABASE_URL="postgresql://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"
```

```bash
$ npx prisma dev
```

## Running the app

### Add envs in .env file

```bash
#APP
APP_NAME=nest-template-prisma-ddd
APP_PORT=3333
APP_VERSION=1.0.0

#JWT
JWT_SECRECT=DO-NOT-USE-THIS-VALUE
JWT_REFRESH_TOKEN_SECRECT=DO-NOT-USE-THIS-VALUE
# secunds
JWT_EXPIREIN=60
```

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

### Add envs in .env.test file

```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASS=root
DATABASE_NAME=test_nest_template_prisma
```

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Build

```bash
# product build
$ yarn build
```

## Docker

### Add envs in .env file

```bash
#Docker
DOCKER_ENV=local
```

```bash
# compose
$ docker-compose up

# build dockerfile
$ docker build -t nest_template_api -f .docker/Dockerfile.{DOCKER_ENV} .
```

## Swagger

Acesse o endereço: `http://localhost:{PORT}/api/docs`.

## Structure

```

├─ 📁 prisma
├─ 📁 src
│  ├── 📁 configs
│  ├── 📁 core
│  │   ├─ 📁 domain
│  │   └─ 📁 logic
│  ├── 📁 domain
│  │   ├─ 📁 entities
│  │   ├─ 📁 services
│  │   ├─ 📁 use-cases
│  │   └─ 📁 values-objects
│  └── 📁 infra
│       ├─ 📁 database
│       │  ├─ 📁 prisma
│       │  └─ 📁 repositories
│       ├─ 📁 http
│       │  ├─ 📁 auth
│       │  ├─ 📁 controllers
│       │  ├─ 📁 services
│       │  └─ 📁 view-models
│       └─ 📁 logger
└─ 📁 teste
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Raul Silva](https://www.linkedin.com/in/raul-silva-a9a6991a4/)

## License

Nest is [MIT licensed](LICENSE).
