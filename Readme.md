# Foxy bot

A discord bot for sending a random fox image in discord channel using https://randomfox.ca. 

## Requirements

- [Docker](https://docs.docker.com/get-docker/)
- A [discord bot](https://discordapp.com/developers/applications/) token
- [Node.js](https://nodejs.org/en/download) (for development)

## Running from Docker Compose
    ---
    version: "3"
    services:
      foxy:
        container_name: foxy
        build:
          context: https://github.com/bobbywan-kenoby/Foxy.git
          dockerfile: Dockerfile
        environment:
          - token=Disord_Bot_Token_Here
        restart: unless-stopped

## Building & Running from source in Docker container

    $ git clone https://github.com/bobbywan-kenoby/Foxy.git
    $ cd Foxy
    $ docker build -t foxy .
    $ docker run --name foxy -e "token=Disord_Bot_Token_Here" foxy:latest

## Just launch the bot with node

    $ git clone https://github.com/bobbywan-kenoby/Foxy.git
    $ cd Foxy
    $ token="Disord_Bot_Token_Here" node index.js