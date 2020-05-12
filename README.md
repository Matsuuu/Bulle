# Bulle

Bulle is a modern solution for mocking HTTP API's.

Bulle can be utilized to create mock API endpoints for development purposes or for general testing.

### Usage

Bulle hasn't been packaged to a npm package yet, but will be usage with these commands in the future

```bash
npm install -g bulle
```

```js
bulle -p 3000
-r ping 200 '{"message": "pong"}' \
-r getUsers GET 200 '[{"id": 1, "name": "Foo"}, {"id": 2, "name": "Bar"}]' \
-r addUser POST 201 '{"success": true"}'
```

Bulle will start a [fastify](https://www.fastify.io/) HTTP server to serve the endpoints, and provide a CLI interface for monitoring requests.

![Usage gif](usage.gif)
