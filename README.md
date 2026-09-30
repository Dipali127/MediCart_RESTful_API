
# MediCart_RESTful_API

MediCart RESTful API is an eCommerce medicine store backend API built with Node.js, Express.js, and MongoDB. It follows the MVC architecture and implements role-based access control for buyers and sellers.
Buyers can browse medicines, manage their carts, place and cancel orders, and make payments through Razorpay. Sellers can add, update, and delete medicines they have created.
The API uses JWT-based authentication and role-based authorization to ensure that users can only perform actions permitted for their role.


## Live Deployment

The MediCart API is deployed on Render:

🔗 Live API URL: https://medicart-restful-api.onrender.com


## Roles and Permissions
### Buyer
* #### Can:
    * Register and log in. 
    * View medicines and add them to their personal cart.
    * View their cart.
    * Decrease medicine quantity by one.
    * Remove a medicine completely from the cart.
    * Place and cancel orders.
    * Initiate Razorpay payments during checkout.


### Seller
* #### Can:
* Register and log in.
* View available medicines.
* Add new medicines to the store.
* Update medicines they created.
* Delete medicines they created.


## Description

* Built a RESTful API in Node.js using the MVC architecture with MongoDB as the database.
* Implemented JWT-based authentication and role-based authorization for buyers and sellers.
* Integrated Razorpay for payment order creation and payment signature verification during checkout.
* Used bcrypt to securely hash user passwords before storing them in the database.


## Tech Stack

* **Server:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT (JSON Web Token), bcrypt
* **File Upload:** Multer, Cloudinary
* **Payment Gateway:** Razorpay (Order Creation & Payment Signature Verification)


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

5. Set up the required environment variables:

    - Create a new file named `.env` in the root directory of the project.
    - Add the following environment variables:

      - `PORT`: Port number on which the application runs. Defaults to `3000` if not provided.
      - `MONGO_URI`: MongoDB connection string.
      - `SECRET_KEY`: Secret key used for JWT authentication.
      - `Cloudinary_Cloud_Name`: Cloudinary cloud name.
      - `Cloudinary_Api_Key`: Cloudinary API key.
      - `Cloudinary_Api_Secret`: Cloudinary API secret.
      - `RAZORPAY_KEY_ID`: Razorpay key ID used for payment integration.
      - `RAZORPAY_KEY_SECRET`: Razorpay secret key used for payment integration.
      
6. Start the application in development mode:

    ```bash
    npm start
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
| `PATCH /cart/decreaseCartQuantity/:buyerId`       | Allows a buyer to decrease the quantity of a medicine in their cart by one. |
| `DELETE /cart/deleteMedicine/:buyerId`       | Allows a buyer to remove a medicine from their cart.               |

### Order Routes

| Routes                      | Description                                |
| --------------------------- | ------------------------------------------ |
| `POST /order/placeOrder`      | Allows a buyer to place a new order.                  |
| `POST /order/verifyPayment` | Verifies the Razorpay payment signature after checkout. |
| `PATCH /order/cancelOrder/:buyerId` | Allows a buyer to cancel an existing  order.                           |


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
            "city": "New Delhi"
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
        "price": 40,
        "expiryDate": "2027-11-20T08:00:00.000Z",
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
            "price": 4.99,
            "expiryDate": "2027-11-20T08:00:00.000Z",
            "isDeleted": false,
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
            "price": 20,
            "expiryDate": "2027-11-20T08:00:00.000Z",
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
            "price": 40,
            "expiryDate": "2027-11-20T08:00:00.000Z",
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
        "price": 45,
        "expiryDate": "2027-11-20T08:00:00.000Z",
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
                    "price": 40,
                    "expiryDate": "2027-11-20T08:00:00.000Z",
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
- Each request decreases the selected medicine's quantity by 1.
- If the medicine quantity is 2, clicking the - button once decreases it to 1.
- If the medicine quantity is 1, clicking the - button again removes that medicine completely from the buyer's cart.
- This follows the typical eCommerce cart behavior where the - button decreases the quantity and removes the item when the quantity reaches zero.

````
Method: PATCH
URL: /cart/decreaseCartQuantity/:buyerId
Authorization: Bearer {token}
Permission: buyer
Content-Type: application/json
````
**EXAMPLE**
* **Request:** PATCH /cart/decreaseCartQuantity/66bef613e805408836ca8286
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

#### Note

- Delete Medicine removes the selected medicine completely from the buyer's cart, regardless of its current quantity.

````
Method: DELETE
URL: /cart/deleteMedicine/:buyerId  
Authorization: Bearer {token}
Permission: buyer
Content-Type: application/json
````
**EXAMPLE**
* **Request:** DELETE /cart/deleteMedicinefromCart/66bef613e805408836ca8286
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
- A Razorpay order is created using the cart's total amount, and the generated Razorpay order ID is stored with the order in the database.

````
Method: POST
URL: /order/placeOrder
Authorization: Bearer {token}
Permission: buyer
Content-Type: application/json
````
**EXAMPLE**
* **Request:** POST /order/placeOrder
* **Request Body:** 
```
{
  "cartId": "66c838818c29e5310e6aa52d"
}
```
* **Response:**
```json
{
  "status": true,
  "message": "Order created successfully",
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
    "paymentStatus": "pending",
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
* **Request Body:**
{
  "orderId": "66d170bb0aed527ac8b9f738"
}
```
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
    "paymentStatus": "pending",
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

**3) Verify Payment**

Send a POST request to verify the payment after the Razorpay checkout is completed.

#### Note

Only the authenticated buyer can verify their payment.
The request body must include the razorpayOrderId, paymentId, and razorpaySignature received after the Razorpay checkout.
The backend generates an expected signature using the Razorpay order ID, payment ID, and the Razorpay secret key.
The generated signature is compared with the signature received from Razorpay.
If the signatures match, the payment is marked as successful and the order status is updated to completed.
After successful payment verification, the buyer's cart is cleared.

````
Method: POST
URL: /order/verifyPayment
Permission: buyer
Authorization: Bearer {token}
Content-Type: application/json
````
**EXAMPLE**
* **Request:** POST /order/verifyPayment
* **Request Body:**
{
  "razorpayOrderId": "order_Or1XKbA3wN8XAp",
  "paymentId": "pay_P9xYz123456789",
  "razorpaySignature": "a1b2c3d4e5f6..."
}
```
* **Response:**
```json
{
  "status": true,
  "message": "Payment verified successfully",
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
    "orderStatus": "completed",
    "paymentStatus": "success",
    "cancellable": false,
    "totalItems": 1,
    "totalPrice": 40,
    "razorpayOrderId": "order_Or1XKbA3wN8XAp",
    "createdAt": "2024-08-30T07:11:55.414Z",
    "updatedAt": "2024-08-30T07:20:00.000Z",
    "__v": 0
  }
}
```

## Razorpay Payment Flow

The following workflow demonstrates how the frontend, backend, and Razorpay interact during the payment process.

### Razorpay Payment Workflow

- Buyer adds medicines to the cart and clicks **Place Order** from the frontend.
- Frontend sends the `cartId` to the `POST /order/placeOrder` API.
- Backend validates the cart and authenticated buyer, then creates an order in MongoDB with `orderStatus: "pending"` and `paymentStatus: "pending"`.
- Backend creates a Razorpay Order using the cart's total amount converted from INR to paise.
- Razorpay returns a unique `razorpayOrderId`. The backend stores this ID with the order and sends it back to the frontend.
- Frontend uses the `razorpayOrderId` to open the Razorpay Checkout.
- Buyer completes the payment through Razorpay.
- After the payment, Razorpay returns the `paymentId`, `razorpayOrderId`, and `razorpaySignature` to the frontend.
- Frontend sends these payment details to the `POST /order/verifyPayment` API.
- Backend generates the expected signature using the Razorpay order ID, payment ID, and Razorpay secret key.
- Backend compares the generated signature with the signature received from Razorpay to verify the payment.
- If the signatures match, the backend updates `paymentStatus` to `"success"` and `orderStatus` to `"completed"`, and makes the order non-cancellable.
- After successful payment verification, the buyer's cart is cleared.

## Razorpay Checkout Screenshots

### The following screenshots demonstrate the Razorpay Checkout and successful payment flow implemented using a simple frontend for testing the payment integration.

**Razorpay Checkout**

![Razorpay Checkout](./Screenshots/razorpay-checkout.png)

**Payment Success**

![Payment Success](./Screenshots/payment-success.png)