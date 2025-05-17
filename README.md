
```
# SosyalBoost - Social Media Services Platform

SosyalBoost is a full-stack e-commerce application designed to provide users with a platform to purchase social media boosting services. Users can browse various packages for different social media platforms, add them to their cart, manage favorites, and complete purchases securely. The platform also includes an admin dashboard for managing users, products (service packages), and orders.

## Features

### User Features
*   **Browse Services:** Discover and filter social media service packages (e.g., followers, likes, views) for various platforms (Instagram, TikTok, YouTube, etc.).
*   **Product Details:** View detailed information about each service package.
*   **Shopping Cart:** Add desired packages to the cart. For each item, users can provide a specific social media link (profile/post).
*   **Favorites:** Add/remove preferred packages to a favorites list for quick access.
*   **Secure Checkout:** Complete purchases using the Iyzico payment gateway.
*   **User Authentication:** Secure registration and login for personalized experience.
*   **Order Placement:** Place orders with necessary details (name, email, phone).
*   **Session Management:** Guest users can use cart and favorites functionalities via session IDs.

### Admin Features
*   **Admin Dashboard:** Centralized panel for platform management.
*   **User Management:** View, add, update, and delete user accounts. Assign admin roles.
*   **Product Management:** Create, read, update, and delete service packages. Includes image uploads for package logos/icons.
*   **Order Management:** View all orders, update order statuses (e.g., pending, success, loading, red), and delete orders.
*   **Payment Overview:** (Potentially) View payment transaction history.

## Tech Stack

**Frontend:**
*   **Framework/Library:** React.js
*   **Build Tool:** Vite
*   **Language:** JavaScript (JSX)
*   **Styling:** Tailwind CSS, Custom CSS
*   **Routing:** React Router DOM
*   **HTTP Client:** Axios
*   **State Management:** React Hooks (useState, useEffect, useContext)

**Backend:**
*   **Framework:** Node.js, Express.js
*   **Database:** MongoDB
*   **ODM:** Mongoose
*   **Authentication:** JSON Web Tokens (JWT), bcrypt.js
*   **File Uploads:** Multer
*   **Payment Gateway:** Iyzico (Sandbox for testing)
*   **Environment Variables:** dotenv

## Project Structure
```

content_copydownload

Use code  [with caution](https://support.google.com/legal/answer/13505487).Markdown

sosyalboost-www/  
├── backend/  
│ ├── config/ # Database configuration (db.js)  
│ ├── controllers/ # Request handlers (auth, product, cart, order, etc.)  
│ ├── middleware/ # Custom middleware (e.g., authMiddleware.js)  
│ ├── models/ # Mongoose schemas (Auth, Product, Cart, Order, etc.)  
│ ├── routes/ # API route definitions  
│ ├── uploads/ # Storage for uploaded product images  
│ └── server.js # Backend entry point  
└── frontend/  
├── public/ # Static assets (e.g., vite.svg)  
├── src/  
│ ├── assets/ # Static assets like SVGs  
│ ├── components/ # Reusable React components  
│ ├── css/ # Global CSS files  
│ ├── images/ # UI Image assets  
│ ├── pages/ # Page-level components  
│ ├── App.jsx # Main application component  
│ └── main.jsx # Frontend entry point  
├── eslint.config.js # ESLint configuration  
├── index.html # Main HTML file for Vite  
└── vite.config.js # Vite configuration

```
## Prerequisites

*   Node.js (v18.x or later recommended)
*   npm or yarn
*   MongoDB (local instance or a cloud-hosted service like MongoDB Atlas)
*   Iyzico Sandbox Account (for testing payments)

## Setup and Installation

### Backend
1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Create a `.env` file** in the `backend` directory with the following variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    SECRET_TOKEN=your_strong_jwt_secret_key
    PORT=8000 # Or any port you prefer
    IYZICO_API_KEY=your_iyzico_sandbox_api_key
    IYZICO_SECRET_KEY=your_iyzico_sandbox_secret_key
    ```
4.  **Ensure the `uploads/` directory exists** in the `backend` folder or the server will create it. This is where product images will be stored.
5.  **Start the backend server:**
    ```bash
    npm start
    # or (if no start script is defined in package.json)
    node server.js
    ```
    The backend server should now be running (e.g., on `http://localhost:8000`).

### Frontend
1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **(Optional but Recommended) Create a `.env` file** in the `frontend` directory to specify the backend API URL:
    ```env
    VITE_API_BASE_URL=http://localhost:8000
    ```
    If you do this, you'll need to update API calls in your components (e.g., in `axios` configurations or directly in service files) to use `import.meta.env.VITE_API_BASE_URL`. Currently, API calls in the provided files seem to use a hardcoded URL (`http://localhost:8000`).
4.  **Start the frontend development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend application should now be accessible (usually on `http://localhost:5173`).

## Environment Variables

### Backend (`backend/.env`)
*   `MONGO_URI`: Your MongoDB connection string.
*   `SECRET_TOKEN`: A strong secret key for signing JWTs.
*   `PORT`: The port on which the backend server will run (e.g., 8000).
*   `IYZICO_API_KEY`: Your API key from your Iyzico Sandbox account.
*   `IYZICO_SECRET_KEY`: Your secret key from your Iyzico Sandbox account.

### Frontend (`frontend/.env`) (Recommended)
*   `VITE_API_BASE_URL`: The base URL for your backend API (e.g., `http://localhost:8000`).

## API Endpoints Overview

The backend exposes the following main groups of API endpoints:

*   **Authentication:**
    *   `POST /api/register` - Register a new user.
    *   `POST /api/login` - Log in an existing user.
    *   `GET /api/users` - Get all users (Admin only).
    *   `GET /api/user/:id` - Get a specific user by ID (Admin or self).
    *   `POST /api/user/add` - Create a new user (Admin only).
    *   `PATCH /api/user/:id` - Update a user (Admin or self).
    *   `DELETE /api/user/:id` - Delete a user (Admin only).
*   **Products (Service Packages):**
    *   `GET /api/products` - Get all products.
    *   `GET /api/product/:id` - Get a specific product by ID.
    *   `POST /api/product/add` - Add a new product (Admin only, requires image upload).
    *   `PATCH /api/product/update/:id` - Update a product (Admin only, supports image upload).
    *   `DELETE /api/product/delete/:id` - Delete a product (Admin only).
*   **Cart:**
    *   `GET /api/cart` - Get cart items (for authenticated user or session).
    *   `POST /api/cart/add` - Add an item to the cart.
    *   `DELETE /api/cart/remove/:productId` - Remove an item (or decrease quantity) from the cart.
    *   `DELETE /api/cart/clear` - Clear all items from the cart.
*   **Favorites:**
    *   `GET /api/favorites` - Get user's favorite items.
    *   `POST /api/favorites/add` - Add a product to favorites.
    *   `DELETE /api/favorites/remove/:productId` - Remove a product from favorites.
    *   `GET /api/favorites/check/:productId` - Check if a product is in favorites.
*   **Orders:**
    *   `GET /api/orders` - Get all orders (Admin only).
    *   `POST /api/orders/add` - Create a new order.
    *   `PATCH /api/orders/update/:id` - Update an order (Admin only).
    *   `DELETE /api/orders/delete/:id` - Delete an order (Admin only).
*   **Payments (Iyzico Integration):**
    *   `POST /api/payment/process` - Process a payment request with Iyzico.
    *   `GET /api/payments` - Get all payment records (Admin only).
    *   `GET /api/payment/kullanici` - Get payment records for the authenticated user.

## Notes
*   The `backend/uploads/` directory is used for storing product images. Ensure it is writable by the Node.js process.
*   The application supports both guest users (using `sessionId` for cart and favorites) and authenticated users (using `userId`).
*   Payment integration is set up with Iyzico. For development and testing, ensure you are using Iyzico's sandbox environment and corresponding API keys.
```
