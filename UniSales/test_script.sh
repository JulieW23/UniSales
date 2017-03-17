#!/bin/bash
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



read -p "Create a user"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"email":"newuser@hotmail.com", "password": "123"}'\
    http://localhost:3000/user
echo ""

read -p "Test to get the user with userid=0"
curl -H "Content-Type: application/json"   \
    -X GET http://localhost:3000/user?id=0
echo ""

read -p "Test to change the user password with userid=0"
curl -H "Content-Type: application/json"   \
    -X PUT -d '{"password": "123456"}'  \
     http://localhost:3000/user?uid=0
echo ""

read -p "Test: Login with the new user just created"
curl -H "Content-Type: application/json"   \
    -X POST -d '{"email":"newuser@hotmail.com", "password": "123456"}'   \
    http://localhost:3000/login   --cookie-jar user1.cookie
echo ""




read -p "Create a few products"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"productname":"apple", "price": 5, "category":"Shirts", "description":"Great tasting!"}'\
    http://localhost:3000/user/0/products --cookie user1.cookie
echo ""


curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"productname":"banana", "price": 8, "category":"Clothing", "description":"nice and yellow"}'\
    http://localhost:3000/user/0/products  --cookie user1.cookie
echo ""

curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"productname":"Best shirt", "price": 20, "category":"Shirts", "description":"Its comfy!"}'\
    http://localhost:3000/user/0/products  --cookie user1.cookie
echo ""

curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"productname":"Pants", "price": 15, "category":"Clothing", "description":"YUGE"}'\
    http://localhost:3000/user/0/products  --cookie user1.cookie
echo ""


## Search for a few products
read -p "Search few products"
curl -v   -H "Content-Type: application/json" \
    -X GET -d '{"price": 15}'\
    http://localhost:3000/products
echo ""

curl -v   -H "Content-Type: application/json" \
    -X GET -d '{"price": 8, "category":"Clothing"}'\
    http://localhost:3000/products
echo ""

curl -v   -H "Content-Type: application/json" \
    -X GET -d '{"category":"Clothing"}'\
    http://localhost:3000/products
echo ""

curl -v   -H "Content-Type: application/json" \
    -X GET -d '{"category":"Shirts", "price": 8}'\
    http://localhost:3000/products
echo""


read -p "Test to get the user products with userid=0"
curl -H "Content-Type: application/json"   \
    -X GET http://localhost:3000/user/0/products
echo ""

read -p "Test to delete one user products with userid=0"
curl -H "Content-Type: application/json"   \
    -X DELETE http://localhost:3000/user/0/products
echo ""



# This time we should fail to find the user's product since the product has been deleted.
read -p "Test to get the user products with userid=0, (Should fail since it has just been deleted)"
curl -H "Content-Type: application/json"   \
    -X GET http://localhost:3000/user/0/products
echo ""


read -p "Create a comment"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"title":"hello world", "message": "testing comment", "product": 1}'\
    http://localhost:3000/comment
echo ""

