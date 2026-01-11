# 🛍️ E-Commerce Frontend Application

![Project Banner](https://via.placeholder.com/1200x400.png?text=E-Commerce+Application+Banner)

> A high-performance, responsive, and feature-rich E-Commerce frontend built with modern web technologies.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](./LICENSE)

## 📖 Table of Contents

- [Overview](#overview)
- [✨ Key Features](#key-features)
- [🛠️ Tech Stack](#tech-stack)
- [📦 Installation](#installation)
- [🚀 Usage](#usage)
- [🔑 Environment Variables](#environment-variables)
- [🤝 Contributing](#contributing)
- [📄 License](#license)

## <a name="overview"></a>Overview

This application serves as the user interface for a robust E-commerce platform. It connects seamlessly with a Node.js/Express backend to provide a complete shopping experience, from product discovery to secure checkout. It is designed with **performance**, **scalability**, and **user experience** in mind.

## <a name="key-features"></a>✨ Key Features

### 🛒 Customer Experience
*   **Dynamic Product Catalog**: Browse products with advanced filtering (Category, Price Range) and sorting options.
*   **Smart Cart System**: 
    *   Persistent cart storage.
    *   **Real-time Coupon Validation**: Apply discount codes with instant feedback and debounced server validation.
    *   Live tax and shipping calculation.
*   **Secure Checkout**: Integrated **Stripe** payment gateway for safe and secure transactions.
*   **User Dashboard**: View order history, track order status, and manage profile settings.
*   **Wishlist**: Save items for later with a single click.

### 🛡️ Admin Dashboard
*   **Visual Analytics**: Interactive charts (Bar, Pie, Line) for Revenue, User Growth, and Sales trends using `Recharts`.
*   **Product Management**: 
    *   **Drag & Drop Image Upload**: Seamlessly upload multiple product images.
    *   Detailed inventory tracking and stock management.
*   **Order Control Center**: Process orders, update statuses (Processing, Shipped, Delivered), and manage shipping info.
*   **Customer Insights**: View detailed user statistics and transaction history.

### 🔐 Admin Demo Access

> **Note on Security & Access Control**
>
> To ensure system integrity and security, the public **Admin Dashboard** operates in a restricted **Read-Only Mode** populated with demonstration data. This allows visitors to fully explore the interface, analytics visualization, and order management workflows without risking production data key integrity.
>
> For **Full Administrative Access** or to request a complete system walkthrough with write privileges, please contact the lead developer directly at **[puneet2862001j@gmail.com](mailto:puneet2862001j@gmail.com)**.

## <a name="tech-stack"></a>🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Core** | React 18 | UI Library |
| **Language** | TypeScript | Static Typing |
| **Build Tool** | Vite | Blazing fast build tool |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Components** | Shadcn UI | Accessible component primitives |
| **State** | Redux Toolkit | Global State Management |
| **Forms** | React Hook Form | Performant form handling |
| **Validation** | Zod | Schema-based validation |
| **Network** | Axios | Promise-based HTTP client |
| **Charts** | Recharts | Composable charting library |

## <a name="installation"></a>📦 Installation

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Puneet28j/Ecommerce-Frontend.git
    cd Frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory.

4.  **Start Development Server**
    ```bash
    npm run dev
    ```

## <a name="usage"></a>🚀 Usage

*   **Development**: `npm run dev` - Starts the dev server at `http://localhost:5173`.
*   **Production Build**: `npm run build` - Compiles TypeScript and builds assets for production.
*   **Preview**: `npm run preview` - Preview the built application locally.
*   **Linting**: `npm run lint` - Analyze code for potential errors.

## <a name="environment-variables"></a>🔑 Environment Variables

The application requires the following environment variables to function correctly:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_SERVER` | URL of the Backend API | `http://localhost:5000/api/v1` |
| `VITE_FIREBASE_KEY` | Firebase API Key | `AIzaSyD...` |
| `VITE_AUTH_DOMAIN` | Firebase Auth Domain | `your-app.firebaseapp.com` |
| `VITE_PROJECT_ID` | Firebase Project ID | `your-app-id` |
| `VITE_STORAGE_BUCKET` | Firebase Storage Bucket | `your-app.appspot.com` |
| `VITE_MESSAGING_SENDER_ID` | Firebase Sender ID | `123456789` |
| `VITE_APP_ID` | Firebase App ID | `1:12345:web:abcd` |
| `VITE_STRIPE_KEY` | Stripe Publishable Key | `pk_test_...` |

## <a name="contributing"></a>🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## <a name="license"></a>📄 License

Distributed under the MIT License. See `LICENSE` for more information.
