# Pokemon API

## Intro

This not just a fix for issues inside handlers.ts it's overall refactoring

## Fixes and Refactoring

### Variable Declaration

- Use ES6 variable declaration i.e instead of `var`, we use `let` and `const` ( `var` is not scope safe)

### Better readability

- smaller functions inside handle.ts
- use of types
- getting rid of CPS (callbacks) and use async/await (promisify http request calls)

### Better Performance

- Use `promise.AllSettled()` to provide parallel http calls in `computeResource()`.

### Separation of concerns

Here i wanted to introduce the screaming architecture, just like `nestjs`, you can see
that my folder structure and my code exposes the business objective not the layers of
the architecture.

- `handle.ts` has to have single concern, so a redesign needed:
  - add generic http request method to handle http calls in `utils` directory
  - group all pokemon related concerns inside the pokemon module directory
  - the `getPokemonByName` endpoint should only return on response in my opinion, so i split it into two routes
  - use fastify middleware to validate incoming requests

### API Documentation

- Added `swagger`
- `zod` to provide the schemas

### Chores

- Makefile to facilitate interacting with project
- Multi-stage (faster build time) Dockerfile to kill environment dependency pain and

## How To Run

make sure you have node.js version 16 installed please

### Using Docker (preferred)

- run:

  - ```shell
    m dkr-build
    m dkr-run
    ```

- open swagger docs at `http://localhost:3000/docs`

### Or

- install packages `m install`
- run `m dev`
- open swagger docs at `http://localhost:3000/docs`

### Run Tests

- `m test`
