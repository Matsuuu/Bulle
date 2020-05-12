#!/bin/sh

ts-node index.ts \
-r ping 200 '{"message": "pong"}' \
-r getUsers GET 200 '[{"id": 1, "name": "Foo"}, {"id": 2, "name": "Bar"}]' \
-r addUser POST 201 '{"success": true"}'
