## Clean Code

- run prettier -w . for default formatting
- tsconfig should refer to in-repo always
- import statements to explicitly indicate extension

# Development

`npm i` install package for new pulls

## Dev Server

## Generate a self-signed certificate

`openssl req -nodes -x509 -newkey rsa:4096 -keyout server.key -out server.cert -sha256 -days 365`

This certificate is for testing as it is not signed by any CA.

## Local

2 terminals - one to run the server that serves the bundled js `npm run start` - one to run webpack --watch `npm run client-build-dev`
