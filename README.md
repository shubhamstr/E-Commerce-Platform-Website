# E-Commerce Platform - Frontend

Welcome to the frontend repository of the E-Commerce Platform! This is a modern, responsive, and feature-rich web application built with **Next.js 15 (App Router)**, **TypeScript**, and **Redux Toolkit** for state management.

---

## 🚀 Tech Stack

Our application leverages the following modern frontend technologies:

*   **Core Framework:** [Next.js 15](https://nextjs.org/) (App Router, React 19) with TypeScript
*   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [React Redux](https://react-redux.js.org/) (handles authentication, user sessions, etc.)
*   **UI Components & Styling:**
    *   [Reactstrap](https://reactstrap.github.io/) & [Bootstrap 5](https://getbootstrap.com/) for fully responsive grid layout and standard UI components
    *   Vanilla CSS Modules for component-specific custom styling
    *   [Material UI Icons](https://mui.com/material-ui/material-icons/) for high-quality, modern icons
*   **API / Network:** [Axios](https://axios-http.com/) (configured with interceptors for attaching authentication tokens dynamically)
*   **Authentication Helper:** [jwt-decode](https://github.com/auth0/jwt-decode) for decoding client-side JSON Web Tokens
*   **Notifications:** [React Toastify](https://fkhadra.github.io/react-toastify/introduction/) for elegant, non-intrusive toast alerts

---

## 📁 Project Structure

Here is a summary of the main directories in this project:

```text
src/
├── app/                  # Next.js App Router folders and page modules
│   ├── account/          # Account page
│   ├── addresses/        # Addresses management page
│   ├── cart/             # Shopping Cart page
│   ├── change-password/  # Change Password page
│   ├── components/       # Reusable UI Components (Header, Footer, Product Cards, forms)
│   ├── contact/          # Contact page
│   ├── login/            # User login page
│   ├── register/         # User registration page
│   ├── shop/             # Product list / Shop page with filters
│   ├── wishlist/         # Saved items / Wishlist page
│   ├── globals.css       # Global styles (including bootstrap integration)
│   ├── layout.tsx        # Main layout wrapper
│   ├── providers.tsx     # Redux store provider configuration
│   └── page.tsx          # Homepage / Landing page
├── services/             # Dynamic API service endpoints
├── store/                # Redux store configurations
│   └── slices/           # Redux state slices (e.g. authSlice)
└── utils/                # Utility modules (Axios client, constants, and toast configs)
```

---

## 🛠️ Getting Started & Setup

Follow these steps to set up and run the frontend application locally:

### 1. Prerequisites
Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (Version **18.x** or higher is recommended)
*   [npm](https://www.npmjs.com/) or another package manager (e.g., yarn, pnpm, bun)

### 2. Installation
Clone the repository and install the dependencies:
```bash
# Navigate to the project root directory
cd E-Commerce-Platform-Website

# Install all dependencies
npm install
```

### 3. API Configuration
The application connects to the backend API.
*   The default API base URL is configured in `src/utils/constants.ts`:
    ```typescript
    export const SERVER_URL = "http://localhost:5000"
    ```
*   Ensure that your local backend server is running at `http://localhost:5000` (or update this constant to point to your deployment).

### 4. Running the Development Server
Run the local dev server using:
```bash
npm run dev
```
By default, the server will start on port **4005**. Open [http://localhost:4005](http://localhost:4005) in your web browser to view the application.

### 5. Production Build
To build and start the production application bundle:
```bash
# Build the application
npm run build

# Start the application in production mode
npm run start
```

### 6. Linting
To check and fix code format/linting violations:
```bash
npm run lint
```
