# A docker file to run the client.

# Use the official node image
# https://hub.docker.com/_/node
FROM node:19

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy local code to the container image.
COPY ./client ./client/

# Install production dependencies.
RUN yarn --cwd client install

# Expose the app's port. The user can map this to a different port
# when running by adding 3000:3020 to the docker run command where
# 3020 is the port to map to.
EXPOSE 3000
ENV PORT 3000

# By default, run the web service on container startup.
# This command can be overriden by changing it in the docker run command.
CMD ["sh", "-c", "yarn --cwd client run dev"]