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

read -p "Create a comment"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"title":"hello world", "message": "testing comment", "product": 1}'\
    http://localhost:3000/comment
echo ""

# read -p "Get all comments for product=1"
# curl -H "Content-Type: application/json" \
# 	-X -GET http://localhost:3000/comment/product/1
# echo ""

read -p "Create a category"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"name":"Clothing"}'\
    http://localhost:3000/category
echo ""

read -p "Create a subcategory"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"name":"Shirts", "parent_category":"Clothing"}'\
    http://localhost:3000/category
echo ""