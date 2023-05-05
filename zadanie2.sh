#!/bin/bash

docker compose build --no-cache
docker compose up -d

sleep 2

curl -X POST localhost:80/messages -H 'Content-Type: application/json' -d '{"message": "wiadomosc 1"}'
curl -X POST localhost:80/messages -H 'Content-Type: application/json' -d '{"message": "wiadomosc 2"}'
curl -X POST localhost:80/messages -H 'Content-Type: application/json' -d '{"message": "wiadomosc 3"}'

curl -X POST localhost:80/users -H 'Content-Type: application/json' -d '{"name": "user1", "age": 22}'
curl -X POST localhost:80/users -H 'Content-Type: application/json' -d '{"name": "user2", "age": 25}'
curl -X POST localhost:80/users -H 'Content-Type: application/json' -d '{"name": "user3", "age": 32}'
