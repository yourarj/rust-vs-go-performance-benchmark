# Use the official Go image as the build stage
FROM golang:1.23 as builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Go module files
COPY go.mod ./

# Copy the source code to the container
COPY server.go server.go

# Build the application
RUN go build server.go

# Use a smaller image for the final stage
FROM debian:buster-slim

# Copy the compiled binary from the build stage
COPY --from=builder /app/server /usr/local/bin/server

# Expose the port that the app will run on
EXPOSE 8080

# Run the application
CMD ["server"]
