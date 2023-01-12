# Docker

Docker packages the client so the CLI can run the Next.js app. `Dockerfile` defines the image.

## Prerequisites

Install docker: [https://docs.docker.com/desktop/install/mac-install/](https://docs.docker.com/desktop/install/mac-install/)

## Building the Mint image

Building the docker image:

`docker build -t mint .`

## Running the Mint Image

Use the command below command to create and run a docker container with our image in development mode. The `--rm` flag deletes the container when we are done. Docker keeps all containers even after you disconnect if you don't add the `--rm` flag. The `-v` flag mounts the folder where you run the command to `/app/user-working-directory` so Docker can read files as you edit them. Change 3333 to the port you want to run on.

`` docker run -it --rm -p 3333:3000 -v `pwd`:/app/user-working-directory mint ``

You can also add `--entrypoint /bin/bash` to the command to run in an interactive bash session.

## Security

We can only access files in the same root as `Dockerfile` when building the docker image. We keep `Dockerfile` at the root of `mint` because we need `client` and file listener code.

The Docker container does not allow network calls besides exposing port 3000 for Next.js.

We mount the user's directory during local development so documentation changes are rendered in real-time.

## Trying to self-host Mintlify?

Install our CLI: `npm i mintlify`
