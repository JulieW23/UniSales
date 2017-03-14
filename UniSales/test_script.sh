#!/bin/bash
read -p "Create a user"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"email":"newuser@hotmail.com", "password": "123"}'\
    http://localhost:3000/user
echo ""

read -p "Test to get the user with userid=0"
curl -H "Content-Type: application/json"   \
    -X GET http://localhost:3000/user?id=0
echo ""

read -p "Test: Login with the new user just created"
curl -H "Content-Type: application/json"   \
    -X POST -d '{"email":"newuser@hotmail.com", "password": "123"}'   \
    http://localhost:3000/login   --cookie-jar user1.cookie
echo ""