# Docker

Docker packages the client so the CLI can run the Next.js app. `Dockerfile` defines the image.

## Prerequisites

Install docker: [https://docs.docker.com/desktop/install/mac-install/](https://docs.docker.com/desktop/install/mac-install/)

## Building the Mint image

Building the docker image:

`docker build -t mint .`

## Running the Mint Image

Use this command to create and run a docker container with our image. The `--rm` flag deletes the container when we are done. Docker keeps all containers even after you disconnect if you don't add the `--rm` flag. Change 3020 to the port you want to run on:

`docker run -it --rm -p 3000:3020 mint`

You need to add `` -v `pwd`:/app/user-working-directory `` if you are running in development mode and will listen to file changes.

You can also add `--entrypoint /bin/bash` to the command to run in an interactive bash session.

When testing, this full command is recommended: `` docker run -it --rm -p 3000:3020 -v `pwd`:/app/user-working-directory --entrypoint /bin/bash mint ``

## Security

We can only access files in the same root as `Dockerfile` when building the docker image. We keep `Dockerfile` at the root of `mint` because we need `client` and file listener code.

The Docker container does not allow network calls besides exposing port 3000 for Next.js.

We mount the user's directory during local development so documentation changes are rendered in real-time.

## Trying to self-host Mintlify?

Install our CLI: `npm i mintlify`
