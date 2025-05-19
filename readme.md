# 🧵 Personal Clothes Shop – Backend API

This is the backend API for the **Personal Clothes Shop** e-commerce platform. Built using **Node.js**, **Express**, **TypeScript**, and **Prisma ORM**, it provides RESTful endpoints for authentication, product management, orders, and more.

## 🌐 Live Demo

Check out the UI live demo of the application here: [Personal Clothes Shop Demo](https://lively-wave-02e456000.6.azurestaticapps.net/)
Check out the API: [API](shop-dev-dh-a9hme6h5eketedgp.southeastasia-01.azurewebsites.net)


## 🚀 Tech Stack

| Purpose              | Technology       |
|----------------------|------------------|
| Server Framework     | Node.js, Express |
| Language             | TypeScript       |
| ORM                  | Prisma           |
| Authentication       | JWT (JSON Web Token) |
| Database             | PostgreSQL (NeonDB)  |
| Deployment           | Azure App Service  |

## 📦 Features

- 🔐 **Authentication & Authorization**  
  - Register, login, access/refresh token handling
  - Role-based access (admin vs customer)

- 👕 **Product Management (Admin)**  
  - Create, read, update, delete products

- 🛒 **Order Handling**  
  - Cart management
  - Create and view orders

- 📊 **Admin Dashboard Data**  
  - Basic analytics, order stats


## 📑 API Design

All endpoints are prefixed with `/api`.

### 🔐 Auth

| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| POST   | `/auth/signup`        | Register a new user       |
| POST   | `/auth/login`         | Login and receive tokens  |
| POST   | `/auth/refresh-token` | Refresh access token      |
| POST   | `/auth/logout`        | Logout and revoke tokens  |
| GET    | `/auth/me`            | Get user infor            |

### 📦 Categories
### 📦 Categories

| Method | Endpoint                  | Access   | Description                        |
|--------|---------------------------|----------|------------------------------------|
| GET    | `/categories`             | Public   | Get all categories with products   |
| POST   | `/categories`             | Admin    | Create a new category              |
| GET    | `/categories/:categoryId` | Public   | Get category details by ID         |


| Method | Endpoint                    | Access   | Description                        |
|--------|-----------------------------|----------|------------------------------------|
| GET    | `/products`                 | Public   | Get all products                   |
| GET    | `/products/search`          | Public   | Search products by name            |
| GET    | `/products/dashboard`       | Admin    | Admin dashboard statistics         |
| GET    | `/products/:id`             | Public   | Get single product by ID           |
| GET    | `/products/cart/:ids`       | Public   | Get multiple products (by IDs)     |
| POST   | `/products`                 | Admin    | Create product (with image upload) |
| POST   | `/products/:id`             | Admin    | Update product (with image upload) |
| DELETE | `/products/:id`             | Admin    | Delete product                     |


### 📦 Orders

| Method | Endpoint                  | Access      | Description                     |
|--------|---------------------------|-------------|---------------------------------|
| POST   | `/orders/`                | Public/Auth | Create a new order              |
| GET    | `/orders/`                | Auth        | Get all orders (admin)          |
| GET    | `/orders/orderbyuser`     | Auth        | Get current user's orders       |
| PUT    | `/orders/:id`             | Auth        | Update order (e.g. status)      |
| GET    | `/orders/revenue`         | Admin       | View order revenue stats        |



## 🛠️ Installation

### Prerequisites

- Node.js (v18+)
- PostgreSQL 
- Prisma CLI (`npm install -g prisma`)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/personal-clothes-shop-backend.git
cd personal-clothes-shop-backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Update database URL and secret keys in .env
