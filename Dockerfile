# A docker file to run the client.

FROM node:alpine

# Create and change to the app directory.
WORKDIR /app

# Copy local code to the container image.
COPY ./client ./client/
COPY ./packages/file-listening ./file-listening

# Install production dependencies.
RUN yarn --cwd client install
RUN yarn --cwd file-listening install

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Expose the app's port.
EXPOSE 3000
ENV PORT 3000

# The single & will run both commands in parallel.The double && is used for sequential execution.
# We pipe the output of the client to /dev/null to prevent it from filling up the docker logs.
CMD ["sh", "-c", "yarn --cwd client preconfigure /app/user-working-directory && (yarn --cwd file-listening listen-for-changes & yarn --cwd client dev-watch > /dev/null)"]