# Ping Me

**Pings you using OS-native mechanism when a url starts returning a `2XX` status code and then exits.**

## Usage

1. ~~Install: `npm i -g ping-me`~~ [Build and install locally](#local-installation)
2. Use: `ping-me http://localhost:8080`

### Native Binary

Native binary's based on `pkg` are a work in progress.

I could use `electron`, but I think the Internet would rage-quit ... or something.

## Motivation

I got tired of repeatedly refreshing my `localhost` pages in the browser to see if `docker` environment had finished (re)starting...

## Contributing

### Local Development

Local development is typical for a `node` application:

1. `npm install`
2. `npm develop`

### Local Installation

To install your local working copy:

1. `npm pack`
2. `npm i -g ping-me-1.0.0.tgz`

## Credits

- Icon CC [sonar by Yo! Baba from the Noun Project](https://thenounproject.com/search/?q=sonar&i=924176)
