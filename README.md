# URL Shortener architectural-reliable POC
Design System Interview V1 (Book) practical hands-on use-case exercise.

## Framework & Libraries
- [Nest JS](https://github.com/nestjs/nest): framework TypeScript starter repository.

## Project setup

**Duplicate `.env.example` file and rename it as `.env.development` or the env that you need to configure.**

**Fill all the mandatory environment variables:**

```dotenv
DATABASE_NAME='urls database name'
DATABASE_HOST='urls database host'
DATABASE_PORT='urls database port'
DATABASE_USERNAME='urls database username'
DATABASE_PASSWORD='urls database password'
DATABASE_LOGGING_ENABLED='should the logging be enabled?'

REDIS_HOST='redis cache host'
REDIS_PORT='redis cache port'

THROTTLE_TTL='number of milliseconds that each request will last in storage'
THROTTLE_LIMIT='maximum number of requests within the TTL limit'

URL_ENCODER_ALPHABET='encoder alphabet'
URL_ENCODER_LENGTH='encoder url minimum length'

PORT='application port'
```

**Pull & Mount docker dev-dependencies**: It will download the required MySQL & Redis architecture dependencies
```bash
docker compose up -d
```

**Install application:**
```bash
$ yarn install
```

**Run TypeORM database migrations:**
```bash
yarn run migration:run
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
