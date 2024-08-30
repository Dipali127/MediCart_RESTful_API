
# MediCart_RESTful_API

MediCart_RESTful_API is an eCommerce medicine store backend API designed with a role-based access model. It allows buyers to manage their cart, place orders, and make payments via Razorpay, while sellers can add medicines to the store. The API ensures that each role can only perform actions appropriate to them.

## Roles and Permissions
### Buyer
* #### Can:
    * Register and log in. 
    * View medicine and add medicines to their personal cart.
    * View and manage their cart (update quantities [either increase or decrease], remove items).
    * Place and cancel orders.
    * Make payments for orders using Razorpay.

### Seller
* #### Can:
    * Register and log in.
    * Add new medicines to the eCommerce medicine store.
    * View, update, and delete their added medicines.


## Description
* Built a RESTful API in Node.js using the MVC approach with MongoDB as the database.
* Implemented JWT (JSON Web Tokens) for authentication and authorization.
* Integrated Razorpay for secure payment processing, allowing users to complete transactions within the platform.

## Basic Requirements
* **Server:** Node.js, Express.js
* **Database:** MongoDB

## Running medicart application

To run the `medicart` application, follow these steps:

1. Ensure that you have Node.js and npm installed on your system.

2. Clone the repository to your local machine:

    ```bash
    https://github.com/Dipali127/MediCart_RESTful_API.git
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
        - `DATABASE_CLUSTER_STRING`: Set the variable to the connection string for your MongoDB database cluster.
        - `secretKey`:  Set the variable to the secret key used for JWT authentication.
        - `cloudinary_credentials`: Set the CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET variables with your individual Cloudinary credentials for uploading files.
        - `razorpay_credentials` : Set the RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET variables with your individual razorpay credentials for payment integration.
        - `RAZORPAY_WEBHOOK_SECRET` : Secret for verifying Razorpay webhooks.

 6. Start the application (run it on development mode):

    ```bash
    npm run dev
    ```

- **Database Setup**: 

    - Install Mongoose, the MongoDB object modeling tool for Node.js, by running the following command in your terminal:

    ```bash
    npm install mongoose
    ```        

## For Testing (Postman)
* Postman extension can be used for testing !

## Dependencies
* For dependencies refer Package.json

## Available API Routes

### User (buyer and seller) Routes

| Routes                      | Description                                |
| --------------------------- | ------------------------------------------ |
| `POST /user/signUp`      | Register a new user (buyer or seller)                      |
| `POST /user/signIn`       | Log in an existing user (buyer or seller)                           |
| `POST /user/address`    | Add a buyer's address       |

#### Note:
Ensure that the POST /user/address route is intended specifically for buyers.

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
| `PATCH /cart/updateCartQuantity/:buyerId`       | Allows a buyer to update the quantity of a medicine in their cart.                     |
| `Delete /cart/deleteMedicine/:buyerId`       | Allows a buyer to remove a medicine from their cart.               |

### Order Routes

| Routes                      | Description                                |
| --------------------------- | ------------------------------------------ |
| `POST /order/placeOrder`      | Allows a buyer to place a new order.                     |
| `PATCH /order/cancelOrder/:buyerId`       |Allows a buyer to cancel an existing order.                           |

### Payment Routes

| Routes                      | Description                                |
| --------------------------- | ------------------------------------------ |
| `POST /payment/capture`      |  Capture payment for an order after the buyer completes the payment process.                |
| `POST /payment/webhook`      |  Handle Razorpay payment webhooks to verify and process payments.                |

#### Clarifications:
* **POST /payment/capture:** This route is used to capture or confirm the payment for an order. After the buyer completes the payment process, the client sends a request to this endpoint to verify the payment details and update the order status and payment status accordingly.

* **POST/payment/webhook:** This route is used to handle Razorpay payment webhooks. Razorpay sends a notification to this endpoint after a payment event occurs, which application backend server can use to verify and process the payment details.

**Note:**  Use ngrok to make your local `localhost:port` accessible to the public internet, as webhooks from Razorpay cannot directly access a local development server.

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
        "password": "$2b$10$quktSEB7ISRfmKjHV8xAsevJ6LW7kzD5cyTlWjujGxkfAKCEmUkSq",
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
        "password": "$2b$10$ix1TkXc2mDn601umyFy4DutaBL6X4sGpNj3p2djiKh/q225m9KROS",
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
Content-Type:: application/json
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
            "state": "Delhi",
            "city": "New Delhi",
            "pincode": 110086,
            "street": "vijay vihar L-502"
        },
        "_id": "66bef613e805408836ca8286",
        "firstName": "Manish",
        "lastName": "Sharma",
        "email": "manish22@gmail.com",
        "password": "$2b$10$B5wHpQRrYS15sqQUu9pprOK05l/SiQCiOdIead0JzzAbj5oCKr28K",
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
Permission: seller
Content-Type: application/json
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
        "currencyId": "INR",
        "currencyFormat": "₹",
        "expiryDate": "2009-11-20T08:00:00.000Z",
        "isDeleted": false,
        "deletedAt": null,
        "_id": "66d023fc08a23ed5f41d32d6",
        "createdAt": "2024-08-29T07:32:13.004Z",
        "updatedAt": "2024-08-29T07:32:13.004Z",
        "__v": 0
    }
}
```
**2) Get Medicine**

* **Fetch Medicine Details by seller**

Send a GET request without filter query to Fetch a medicine details.

````
Method: GET
URL: /medicine/getMedicine
Permission: seller
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
            "currencyId": "INR",
            "currencyFormat": "₹",
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
            "currencyId": "INR",
            "currencyFormat": "₹",
            "expiryDate": "2009-11-20T08:00:00.000Z",
            "isDeleted": false,
            "deletedAt": null,
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
            "currencyId": "INR",
            "currencyFormat": "₹",
            "expiryDate": "2009-11-20T08:00:00.000Z",
            "isDeleted": false,
            "deletedAt": null,
            "createdAt": "2024-08-29T07:32:13.004Z",
            "updatedAt": "2024-08-29T07:32:13.004Z",
            "__v": 0
        }
    ]
}
```
* **Fetch Medicine Details by seller**

Send a GET request with filter query to Fetch a medicine.

Below here, seller make a GET request to fetch medicine details based on medicineName as filter query.

````
Method: GET
URL: /medicine/getMedicine
Permission: seller
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
            "currencyId": "INR",
            "currencyFormat": "₹",
            "expiryDate": "2009-11-20T08:00:00.000Z",
            "isDeleted": false,
            "deletedAt": null,
            "createdAt": "2024-08-17T06:41:09.386Z",
            "updatedAt": "2024-08-17T07:58:04.528Z",
            "__v": 0
        }
    ]
}
```
* **Fetch Medicine Details by Buyer**

Send a GET request without filter query to Fetch a medicine details.

````
Method: GET
URL: /medicine/getMedicine
Permission: Buyer
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
            "currencyId": "INR",
            "currencyFormat": "₹",
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
            "currencyId": "INR",
            "currencyFormat": "₹",
            "expiryDate": "2009-11-20T08:00:00.000Z",
            "isDeleted": false,
            "deletedAt": null,
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
            "currencyId": "INR",
            "currencyFormat": "₹",
            "expiryDate": "2009-11-20T08:00:00.000Z",
            "isDeleted": false,
            "deletedAt": null,
            "createdAt": "2024-08-29T07:32:13.004Z",
            "updatedAt": "2024-08-29T07:32:13.004Z",
            "__v": 0
        }
    ]
}
```
* **Fetch Medicine Details by Buyer**

Send a GET request with filter query to Fetch a medicine details.

Below here, buyer make a GET request to fetch medicine details based on category as a filter query.
````
Method: GET
URL: /medicine/getMedicine
Permission: Buyer
Produces: application/json
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
            "currencyId": "INR",
            "currencyFormat": "₹",
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
            "currencyId": "INR",
            "currencyFormat": "₹",
            "expiryDate": "2009-11-20T08:00:00.000Z",
            "isDeleted": false,
            "deletedAt": null,
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
            "currencyId": "INR",
            "currencyFormat": "₹",
            "expiryDate": "2009-11-20T08:00:00.000Z",
            "isDeleted": false,
            "deletedAt": null,
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
Content-Type: application/json
````
**EXAMPLE**
* **Request:** PATCH /update/66c046053f49f9d6a689af9e
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
        "currencyId": "INR",
        "currencyFormat": "₹",
        "expiryDate": "2009-11-20T08:00:00.000Z",
        "isDeleted": false,
        "deletedAt": null,
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
* **Request:** PATCH /delete/66c046053f49f9d6a689af9e
* **Response:**
```json
{
    "status": true,
    "message": "Medicine deleted successfully"
}
````
## Cart Routes
**1) Add Medicine into cart**

Send a POST request to add a medicine into the cart.

````
Method: POST 
URL: cart/addCart/:buyerId
Permission: buyer
Authorization: Bearer {token}
Content-Type: application/json
````
**EXAMPLE**
* **Request:** POST cart/addCart/66bef613e805408836ca8286
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
**2) View cart**

Send a GET request to view the cart of buyer.

````
Method: GET 
URL: cart/viewCart/:buyerId
Permission: buyer
Content-Type: application/json
````
**EXAMPLE**
* **Request:** GET cart/viewCart/66bef613e805408836ca8286
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
                    "currencyId": "INR",
                    "currencyFormat": "₹",
                    "expiryDate": "2009-11-20T08:00:00.000Z",
                    "isDeleted": false,
                    "deletedAt": null,
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

Send a PATCH request to decrement the quantity of a medicine in the cart.

````
Method: PATCH 
URL: cart/updateCartQuantity/:buyerId
Permission: buyer
Authorization: Bearer {token}
Content-Type: application/json
````
**EXAMPLE**
* **Request:** PATCH cart/updateCartQuantity/66bef613e805408836ca8286
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
URL: cart/deleteMedicine/:buyerId
Permission: buyer
Authorization: Bearer {token}
Content-Type: application/json
````
**EXAMPLE**
* **Request:** PATCH cart/deleteMedicine/66bef613e805408836ca8286
* **Response:**
```json
 {
    "status": true,
    "message": "Single medicine removed from cart"
}
```
## Order Routes
**1) Place an order**

Send a POST request to place an order based on the items in their cart.
The server responds to frontend with the necessary details for payment processing via Razorpay.

````
Method: POST 
URL: order/placeOrder
Permission: buyer
Content-Type: application/json
````
**EXAMPLE**
* **Request:** POST order/placeOrder
* **Response:**
```json
{
    "razorpayOrderId": "order_Or1XKbA3wN8XAp",
    "amount": 4000,
    "buyerId": "66bef613e805408836ca8286"
}
```
* **Note:**  Razorpay processes the order amount in paise (1 INR = 100 paise). Therefore, the amount must be provided in paise when creating the order.
**2) Cancel an order**

Send a POST request to cancel an order they have placed.

````
Method: POST 
URL: order/cancelOrder/66bef613e805408836ca8286
Permission: buyer
Authorization: Bearer {token}
Content-Type: application/json
````
**EXAMPLE**
* **Request:** POST order/cancelOrder/
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
## Payment Integration Using Razorpay 
This will allows users(buyer) to place an order by creating it on the server(nodejs) and integrating with Razorpay for payment processing.

Create a small user interface(frontend)to show Payment Integration

**Request**
![Screenshot (17)](https://github.com/user-attachments/assets/c9a30301-e899-46f9-82a9-8c2a335d6a86)
![Screenshot (18)](https://github.com/user-attachments/assets/fea34dfd-5f1d-4ac7-825c-00b28bccbf3d)
![Screenshot (19)](https://github.com/user-attachments/assets/2705a8ac-fb7c-4cea-9b29-da2d42ddb87b)
![Screenshot (20)](https://github.com/user-attachments/assets/6de38923-d948-4a6d-b980-03dac97e8d7e)
![Screenshot (21)](https://github.com/user-attachments/assets/f191f59f-3eec-40e0-9c4a-c4e094110c78)

### Workflow:

1. **Client Side:**
* The user(buyer) selects the medicine they want to purchase, which are added to their cart and clicks on `proceed to pay` button.
* The frontend then sends a POST request to the `order/placeOrder` endpoint, including the cartId in the request body.
* The backend responds with the `razorpayOrderId`, amount, and buyerId to the frontend.
* The frontend uses the received `razorpayOrderId` to render the Razorpay payment form for the user to complete the payment.

2. **Backend Side:**
* The backend receives the request with the cartId.
* It verifies the cart contents and calculates the total amount which the user(buyer) have to pay.
* Backend call the razorpay server to create an `razorpayOrderId` for payment integration.
* Razorpay responds with `razorpay_credentials` to backend. 

3. **Payment Process:**
* After the user(buyer) completes the payment, Razorpay sends the payment details to configured webhook endpoint on the backend.
* The backend then verifies the payment details and updates the orderStatus and paymentStatus based on the payment success or failure.



