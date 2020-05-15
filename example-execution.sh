#!/bin/sh

ts-node index.ts \
-r ping 200 '{"message": "pong"}' \
-r '{"message": "pong"}' 200 pong \
-r users GET 200 '[{"id": 1, "name": "Foo"}, {"id": 2, "name": "Bar"}]' \
-r users/1 GET 200 '{"id": 1, "name": "Foo"}' \
-r users/add POST 201 '{"success": true"}'
