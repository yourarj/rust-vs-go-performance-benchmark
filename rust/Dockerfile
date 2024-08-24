# Use the official Rust image as the build stage
FROM rust:1.80.1-bullseye as builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Cargo.toml and Cargo.lock files
COPY Cargo.toml Cargo.lock ./

# Build dependencies to cache them
RUN cargo build --release && rm -f target/release/deps/server*

# Copy the source code to the container
COPY ./src ./src

# Build the application
RUN RUSTFLAGS="-C target-cpu=native" cargo build --release

# Use a smaller image for the final stage
FROM debian:buster-slim

# Install necessary libraries
RUN apt-get update && apt-get install -y libssl-dev

# Copy the compiled binary from the build stage
COPY --from=builder /app/target/release/server /usr/local/bin/server

# Expose the port that the app will run on
EXPOSE 8080

# Run the application
CMD ["server"]
