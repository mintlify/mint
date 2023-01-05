# Docker

Docker packages the client so the CLI can run the Next.js app. `dockerfile` defines the image. `docker-compose.yml` defines the container that runs the image. You can have multiple containers per image.

Building the docker image:

`docker build -t mint-dev .`

Running the docker container, change 3020 to the port you want to run on:

`docker run -it --rm -p 3000:3020 mint-dev`

## Security

We can only access files in the same root as `dockerfile` when building the docker image. We keep `dockerfile` at the root of `mint` because we need `client` and file listener code.

## Trying to self-host Mintlify?

Install our CLI: `npm i mintlify`
