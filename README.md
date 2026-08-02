
# MediCart_RESTful_API

MediCart_RESTful_API is an eCommerce medicine store backend API designed with a role-based access model. It allows buyers to manage their cart, place orders, and integrate with Razorpay for order creation, while sellers can add medicines to the store. The API ensures that each role can only perform actions appropriate to them.


## Roles and Permissions
### Buyer
* #### Can:
    * Register and log in. 
    * View medicines and add them to their personal cart.
    * View their cart.
    * Decrease medicine quantity by one.
    * Remove a medicine completely from the cart.
    * Place and cancel orders.
    * Create Razorpay orders for payment.


### Seller
#### Can:
* Register and log in.
* Add new medicines to the eCommerce medicine store.
* View all available medicines.
* Update and delete medicines they created.


## Description

* Built a RESTful API in Node.js using the MVC architecture with MongoDB as the database.
* Implemented JWT-based authentication and role-based authorization for buyers and sellers.
* Integrated Razorpay to create payment orders for customer checkout.
* Used bcrypt to securely hash user passwords before storing them in the database.


## Tech Stack

* **Server:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT (JSON Web Token), bcrypt
* **File Upload:** Multer, Cloudinary
* **Payment Gateway:** Razorpay (Order Creation)


## Running MediCart Application

To run the `MediCart` application, follow these steps:

1. Ensure that you have Node.js and npm installed on your system.

2. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/Dipali127/MediCart_RESTful_API.git
    ```

3. Navigate to the root directory of the project:

    ```bash
   cd MediCart_RESTful_API
    ```

4. Install dependencies:


    ```bash
    npm install 
    ```

5. Set up any necessary environment variables. 
    
    - Create a new file named `.env` in the root directory of the project.
    - Set the following required environment variables in the `.env` file:
        - `PORT`: Set this variable to the desired port number. By default, the application listens on port 3000.
        - `MONGO_URI`: Set the variable to the connection string for your MongoDB database cluster.
        - `SECRET_KEY`:  Set the variable to the secret key used for JWT authentication.
        - `cloudinary_credentials`: Set the CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET variables with your individual Cloudinary credentials for uploading files.
        - `razorpay_credentials` : Set the RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET variables with your individual razorpay credentials for payment integration.


 6. Start the application (run it on development mode):

    ```bash
    npm run dev
    ```     


## API Testing

* The API endpoints can be tested using Postman.


## Dependencies

* All project dependencies are listed in the `package.json` file.


## Available API Routes

### User (buyer and seller) Routes

| Routes                      | Description                                |
| --------------------------- | ------------------------------------------ |
| `POST /user/signUp`      | Register a new user (buyer or seller)                      |
| `POST /user/signIn`       | Log in an existing user (buyer or seller)                           |
| `POST /user/address`    | Add a buyer's address       |

#### Note:
Ensure that the `POST /user/address` route is intended specifically for buyers.

### Medicine Routes

| Routes                      | Description                                |
| --------------------------- | ------------------------------------------ |
| `POST /medicine/add`      | Seller adds a new medicine                      |
| `GET /medicine/getMedicine`       | Buyer and Seller fetch details of medicines                           |
| `PATCH /medicine/update/:medicineId`    | Seller updates a medicine they created     |
| `PATCH /medicine/delete/:medicineId`    | Seller deletes a medicine they created     |

### Cart Routes

| Routes                      | Description                                |
| --------------------------- | ------------------------------------------ |
| `POST /cart/addCart/:buyerId`      | Allows a buyer to add a medicine to their cart.                      |
| `GET /cart/viewCart/:buyerId`       | Allows a buyer to view their cart.                          |
| `PATCH /cart/updateCartQuantity/:buyerId`       | Allows a buyer to decrease the quantity of a medicine in their cart by one. |
| `DELETE /cart/deleteMedicine/:buyerId`       | Allows a buyer to remove a medicine from their cart.               |

### Order Routes

| Routes                      | Description                                |
| --------------------------- | ------------------------------------------ |
| `POST /order/placeOrder`      | Allows a buyer to place a new order.                     |
| `PATCH /order/cancelOrder/:buyerId`       | Allows a buyer to cancel an existing order.                           |


##  User (buyer and seller) Routes
**1) Sign up a new User**

Send a POST request to create a new user account.

````
Method: POST 
URL: /user/signUp
Content-Type: application/json
````

**EXAMPLE**

**Registration for Buyer**
* **Request:** POST /user/signUp
* **Response:**
```json
     {
     "status": true,
    "message": "User registered successfully",
    "data": {
        "firstName": "Simon",
        "lastName": "Mishra",
        "email": "Simon141@gmail.com",
        "mobileNumber": "9297300820",
        "role": "buyer",
        "_id": "66d01d2508a23ed5f41d32cc",
        "createdAt": "2024-08-29T07:03:01.386Z",
        "updatedAt": "2024-08-29T07:03:01.386Z",
        "__v": 0
    }
}
```
**Registration for Seller**
* **Request:** POST /user/signUp
* **Response:**
```json
     {
     "status": true,
    "message": "User registered successfully",
    "data": {
        "firstName": "David",
        "lastName": "Mishra",
        "email": "david141@gmail.com",
        "mobileNumber": "9298300820",
        "role": "seller",
        "_id": "66d01dce08a23ed5f41d32d0",
        "createdAt": "2024-08-29T07:05:50.917Z",
        "updatedAt": "2024-08-29T07:05:50.917Z",
        "__v": 0
    }
}
```
**2) Login User(Buyer and Seller)**

Send a POST request to log in an existing user.

````
Method: POST 
URL: /user/signIn
Content-Type: application/json
````
**EXAMPLE**
* **Request:** POST /user/signIn
* **Response:**
```json
 {
    "status": true,
    "message": "Login successfully",
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmJlZjYxM2U4MDU0MDg4MzZjYTgyODYiLCJyb2xlIjoiYnV5ZXIiLCJpYXQiOjE3MjQ5MTU0MTIsImV4cCI6MTcyNDkxOTAxMn0.MCPWdGI8wqfpgXl8keiwdw6wPSlH8o8PB7YvT-JKidw"
}
```
**3) Add User(Buyer) address**

Send a POST request to add an existing buyer's address.
````
Method: POST 
URL: /user/address
Permission: buyer
Authorization: Bearer {token}
Content-Type: application/json
````
**EXAMPLE**
* **Request:** POST /user/address
* **Response:**
```json
 {
    "status": true,
    "message": "address added",
    "data": {
        "address": {
            "country": "India",
            "state": "Delhi",
            "city": "New Delhi",
        },
        "_id": "66bef613e805408836ca8286",
        "firstName": "Manish",
        "lastName": "Sharma",
        "email": "manish22@gmail.com",
        "mobileNumber": "9399300930",
        "role": "buyer",
        "createdAt": "2024-08-16T06:47:47.800Z",
        "updatedAt": "2024-08-29T07:16:45.412Z",
        "__v": 0
    }
}
```
## Medicine Routes
**1) Add Medicine**

Send a POST request to add a new medicine.

````
Method: POST
URL: /medicine/add
Authorization: Bearer {token}
Permission: seller
Content-Type: multipart/form-data
````
**EXAMPLE**
* **Request:** POST /medicine/add
* **Response:**
```json
 {
    "status": true,
    "message": "Medicine Added Successfully",
    "data": {
        "seller": "66c0441e4c3adccdd462d099",
        "category": "Pain Relief",
        "medicineName": "Naproxen",
        "medicineImage": "http://res.cloudinary.com/dseknlpcn/image/upload/v1724916732/d7ihlsj5shypylyppuny.jpg",
        "description": "relief from pain",
        "form": "tablet",
        "stockQuantity": 90,
        "price": 40,
        "expiryDate": "2009-11-20T08:00:00.000Z",
        "isDeleted": false,
        "_id": "66d023fc08a23ed5f41d32d6",
        "createdAt": "2024-08-29T07:32:13.004Z",
        "updatedAt": "2024-08-29T07:32:13.004Z",
        "__v": 0
    }
}
```
**2) Get Medicine**
Send a GET request to fetch medicines.

#### Note

- This endpoint can be accessed by both **buyers** and **sellers**.
- Medicines can be filtered using the following optional query parameters:
  - `medicineName`
  - `category`
- Pagination is supported using the following optional query parameters:
  - `page` (default: 1)
  - `limit` (default: 2)
  
````
Method: GET
URL: /medicine/getMedicine
Authorization: Bearer {token}
Content-Type: application/json
````
**EXAMPLE**
* **Request:** GET /medicine/getMedicine
* **Response:**
```json
{
    "status": true,
    "message": "Fetched detail successfully",
    "data": [
        {
            "_id": "66c046053f49f9d6a689af9e",
            "seller": "66c0441e4c3adccdd462d099",
            "category": "Pain Relief",
            "medicineName": "paracetamol",
            "medicineImage": "http://res.cloudinary.com/dseknlpcn/image/upload/v1723881095/ghorberhx0xjvycr3a0w.jpg",
            "description": "relief from pain",
            "form": "tablet",
            "stockQuantity": 50,
            "price": 4.99,
            "expiryDate": "2009-11-20T08:00:00.000Z",
            "isDeleted": false,
            "deletedAt": null,
            "createdAt": "2024-08-17T06:41:09.386Z",
            "updatedAt": "2024-08-17T07:58:04.528Z",
            "__v": 0
        },
        {
            "_id": "66c5b9fe4cdfbe117ad3de1e",
            "seller": "66c0441e4c3adccdd462d099",
            "category": "Pain Relief",
            "medicineName": "aspirin",
            "medicineImage": "http://res.cloudinary.com/dseknlpcn/image/upload/v1724234236/jhudyf3ty85ldt4pxzvg.jpg",
            "description": "relief from pain",
            "form": "tablet",
            "stockQuantity": 100,
            "price": 20,
            "expiryDate": "2009-11-20T08:00:00.000Z",
            "isDeleted": false,
            "createdAt": "2024-08-21T09:57:19.265Z",
            "updatedAt": "2024-08-21T09:57:19.265Z",
            "__v": 0
        },
        {
            "_id": "66d023fc08a23ed5f41d32d6",
            "seller": "66c0441e4c3adccdd462d099",
            "category": "Pain Relief",
            "medicineName": "Naproxen",
            "medicineImage": "http://res.cloudinary.com/dseknlpcn/image/upload/v1724916732/d7ihlsj5shypylyppuny.jpg",
            "description": "relief from pain",
            "form": "tablet",
            "stockQuantity": 90,
            "price": 40,
            "expiryDate": "2009-11-20T08:00:00.000Z",
            "isDeleted": false,
            "createdAt": "2024-08-29T07:32:13.004Z",
            "updatedAt": "2024-08-29T07:32:13.004Z",
            "__v": 0
        }
    ]
}
```

**3) Update medicine**

Send a PATCH request to update an existing medicine.

````
Method: PATCH
URL: /medicine/update/:medicineId
Permission: seller
Authorization: Bearer {token}
Content-Type: multipart/form-data
````
**EXAMPLE**
* **Request:** PATCH /medicine/update/66c046053f49f9d6a689af9e
* **Response:**
```json
{
    "status": true,
    "message": "Updated Successfully",
    "data": {
        "_id": "66c046053f49f9d6a689af9e",
        "seller": "66c0441e4c3adccdd462d099",
        "category": "Pain Relief",
        "medicineName": "paracetamol",
        "medicineImage": "http://res.cloudinary.com/dseknlpcn/image/upload/v1723881095/ghorberhx0xjvycr3a0w.jpg",
        "description": "relief from pain",
        "form": "tablet",
        "stockQuantity": 50,
        "price": 45,
        "expiryDate": "2009-11-20T08:00:00.000Z",
        "isDeleted": false,
        "createdAt": "2024-08-17T06:41:09.386Z",
        "updatedAt": "2024-08-29T10:25:43.912Z",
        "__v": 0
    }
}
````
**4) Delete medicine**

Send a PATCH request to mark a medicine as deleted.

````
Method: PATCH
URL: /medicine/delete/:medicineId
Permission: seller
Authorization: Bearer {token}
Content-Type: application/json
````
**EXAMPLE**
* **Request:** PATCH /medicine/delete/66c046053f49f9d6a689af9e
* **Response:**
```json
{
    "status": true,
    "message": "Medicine deleted successfully"
}
````
## Cart Routes
**1) Add Medicine into cart**

Send a POST request to add a medicine to the buyer's cart.

#### Note

- Only the authenticated buyer can add medicines to their own cart.
- If the buyer does not have a cart, a new cart is created automatically.
- If the medicine already exists in the cart, its quantity is increased by 1.

````
Method: POST 
URL: /cart/addCart/:buyerId
Authorization: Bearer {token}
Permission: buyer
Content-Type: application/json
````
**EXAMPLE**
* **Request:** POST /cart/addCart/66bef613e805408836ca8286
* **Response:**
```json
 {
    "status": true,
    "message": "New medicine added to cart",
    "data": {
        "_id": "66c838818c29e5310e6aa52d",
        "buyerId": "66bef613e805408836ca8286",
        "items": [
            {
                "medicineId": "66d023fc08a23ed5f41d32d6",
                "quantity": 1,
                "_id": "66d052483348397c1d290f2d"
            }
        ],
        "totalPrice": 40,
        "createdAt": "2024-08-23T07:21:37.607Z",
        "updatedAt": "2024-08-29T10:49:44.272Z",
        "__v": 0
    }
}
```
**2) View Cart**

Send a GET request to view the buyer's cart.

#### Note

- Only the authenticated buyer can view their own cart.


````
Method: GET
URL: /cart/viewCart/:buyerId
Authorization: Bearer {token}
Permission: buyer
Content-Type: application/json
````

**EXAMPLE**

* **Request:** GET /cart/viewCart/66bef613e805408836ca8286

* **Response:**
```json
{
    "status": true,
    "message": "Successfully fetched cart data",
    "data": {
        "_id": "66c838818c29e5310e6aa52d",
        "buyerId": "66bef613e805408836ca8286",
        "items": [
            {
                "medicineId": {
                    "_id": "66d023fc08a23ed5f41d32d6",
                    "seller": "66c0441e4c3adccdd462d099",
                    "category": "Pain Relief",
                    "medicineName": "Naproxen",
                    "medicineImage": "http://res.cloudinary.com/dseknlpcn/image/upload/v1724916732/d7ihlsj5shypylyppuny.jpg",
                    "description": "relief from pain",
                    "form": "tablet",
                    "stockQuantity": 90,
                    "price": 40,
                    "expiryDate": "2009-11-20T08:00:00.000Z",
                    "isDeleted": false,
                    "createdAt": "2024-08-29T07:32:13.004Z",
                    "updatedAt": "2024-08-29T07:32:13.004Z",
                    "__v": 0
                },
                "quantity": 1,
                "_id": "66d052483348397c1d290f2d"
            }
        ],
        "totalPrice": 40,
        "createdAt": "2024-08-23T07:21:37.607Z",
        "updatedAt": "2024-08-29T10:49:44.272Z",
        "__v": 0
    }
}
```

**3) Update cart quantity**

Send a PATCH request to decrease the quantity of a medicine in the buyer's cart.

#### Note

- Only the authenticated buyer can update the quantity in their own cart.
- If the medicine quantity becomes **1**, the medicine is removed from the cart automatically.

````
Method: PATCH
URL: /cart/updateCartQuantity/:buyerId
Authorization: Bearer {token}
Permission: buyer
Content-Type: application/json
````
**EXAMPLE**
* **Request:** PATCH /cart/updateCartQuantity/66bef613e805408836ca8286
* **Response:**
```json
 {
    "status": true,
    "message": "Medicine quantity decreased by 1",
    "data": {
        "_id": "66c838818c29e5310e6aa52d",
        "buyerId": "66bef613e805408836ca8286",
        "items": [
            {
                "medicineId": "66d023fc08a23ed5f41d32d6",
                "quantity": 2,
                "_id": "66d0556e3348397c1d290f3e"
            }
        ],
        "totalPrice": 80,
        "createdAt": "2024-08-23T07:21:37.607Z",
        "updatedAt": "2024-08-29T11:04:38.784Z",
        "__v": 0
    }
}
```
**4) Delete medicine from cart**

Send a DELETE request to delete a single medicine from cart.

````
Method: DELETE
URL: /cart/deleteMedicine/:buyerId
Authorization: Bearer {token}
Permission: buyer
Content-Type: application/json
````
**EXAMPLE**
* **Request:** DELETE /cart/deleteMedicine/66bef613e805408836ca8286
* **Response:**
```json
 {
    "status": true,
    "message": "Single medicine removed from cart"
}
```
## Order Routes

**1) Place an Order**

Send a POST request to place an order from the buyer's cart.

#### Note

- Only the authenticated buyer can place an order from their own cart.
- The request body must include the buyer's `cartId`.
- Razorpay requires the amount in **paise** (1 INR = 100 paise).


````
Method: POST
URL: /order/placeOrder
Authorization: Bearer {token}
Permission: buyer
Content-Type: application/json
````
**EXAMPLE**
* **Request:** POST /order/placeOrder
* **Response:**
```json
{
  "status": true,
  "message": "Order placed successfully",
  "data": {
    "_id": "66d170bb0aed527ac8b9f738",
    "buyerId": "66bef613e805408836ca8286",
    "items": [
      {
        "medicineId": "66d023fc08a23ed5f41d32d6",
        "quantity": 1,
        "_id": "66d170b30aed527ac8b9f733"
      }
    ],
    "orderStatus": "pending",
    "totalItems": 1,
    "totalPrice": 40,
    "cancellable": true,
    "razorpayOrderId": "order_Or1XKbA3wN8XAp",
    "createdAt": "...",
    "updatedAt": "...",
    "__v": 0
  }
}
```

**2) Cancel an order**

Send a PATCH request to cancel an order placed by the buyer.

````
Method: PATCH
URL: /order/cancelOrder/:buyerId
Permission: buyer
Authorization: Bearer {token}
Content-Type: application/json
````
**EXAMPLE**
* **Request:** PATCH /order/cancelOrder/66bef613e805408836ca8286
* **Response:**
```json
{
  "status": true,
  "message": "Order Cancelled",
  "data": {
    "_id": "66d170bb0aed527ac8b9f738",
    "buyerId": "66bef613e805408836ca8286",
    "items": [
      {
        "medicineId": "66d023fc08a23ed5f41d32d6",
        "quantity": 1,
        "_id": "66d170b30aed527ac8b9f733"
      }
    ],
    "orderStatus": "cancelled",
    "totalItems": 1,
    "totalPrice": 40,
    "cancellable": false,
    "createdAt": "2024-08-30T07:11:55.414Z",
    "updatedAt": "2024-08-30T07:18:58.047Z",
    "__v": 0,
    "razorpayOrderId": "order_Or1XKbA3wN8XAp"
  }
}
```



