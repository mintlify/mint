# Docker

Docker packages the client so the CLI can run the Next.js app. `dockerfile` defines the image. `docker-compose.yml` defines the container that runs the image. You can have multiple containers per image.

Building the docker image:

`docker build -t mint-dev .`

Running the docker container, change 3020 to the port you want to run on:

`docker run -it --rm -p 3000:3020 mint-dev`
