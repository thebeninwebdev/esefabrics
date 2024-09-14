Here’s a **README** file that outlines the features of your project and provides instructions for setup, usage, and customization:

---

# Fullstack Starter Project

This project serves as a fullstack starter template for building web applications using Next.js with the App Router, Mongoose for MongoDB, and NextAuth for authentication. It includes essential features such as user authentication, email verification, role-based route protection, and password reset functionality.

## Features

- **User Authentication**: Handles user login, registration, and secure password hashing.
- **Email Verification**: Users are required to verify their email address before logging in.
- **Role-Based Access Control (RBAC)**: Protected routes are accessible based on user roles (e.g., user, admin).
- **Password Reset**: Allows users to reset their password via a token sent to their email.
- **Built with TypeScript**: Ensures type safety and code clarity.
- **Uses Mongoose**: Handles database interaction with MongoDB.
- **Tailwind CSS**: For rapid UI development and styling.
- **Sonner**: Displays toast notifications to users for feedback.

## Technologies

- **Next.js** (App Router)
- **NextAuth.js** (Authentication)
- **Mongoose** (MongoDB ODM)
- **Resend.js** (Email handling)
- **Tailwind CSS** (Styling)
- **Sonner** (Toast notifications)
- **TypeScript** (Type safety)

## Project Setup

### Prerequisites

- Node.js (>= 16.x)
- MongoDB
- [Resend](https://resend.com/) account (for email functionality)
- [NextAuth](https://next-auth.js.org/) configuration for authentication.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/authentication-demo.git
   cd authentication-demo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following environment variables:

   ```env
   MONGODB_URI=<your-mongodb-uri>
   NEXTAUTH_SECRET=<your-nextauth-secret>
   RESEND_API_KEY=<your-resend-api-key>
   USER_ROLE=<your-user-role-id>
   ADMIN_ROLE=<your-admin-role-id>
   ```

   Replace `<your-mongodb-uri>`, `<your-nextauth-secret>`, `<your-resend-api-key>`, and the role IDs with your own values.

4. Run the development server:

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` in your browser.

```

## Key Functionality

### User Registration and Email Verification

- **Registration**: When users register, they receive a verification email with a token.
- **Email Verification**: Clicking the verification link updates the user's `verified` status to `true`, allowing them to log in.

### Authentication and Session Management

- NextAuth.js handles user sessions and ensures secure authentication.
- Unverified users cannot log in until they verify their email.

### Protected Routes and Role-Based Access Control

- **Middleware** in `middleware.ts` checks user roles and restricts access to routes like `/dashboard` based on the user's role (`USER`, `ADMIN`).

### Password Reset Flow

1. User requests a password reset link by entering their email.
2. A reset token is sent to their email.
3. The user follows the link to reset their password.
4. The token is verified, and the user can enter a new password.

## Customization

### Adding New Routes

1. **Create a new folder** in the `app` directory.
2. Add the necessary page and API routes.
3. If needed, update the role-based access control in `middleware.ts`.

### Adding New Models

1. **Create a new Mongoose model** in the `models` directory.
2. Use the model in your API routes to manage new collections.

## Commands

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the project for production.
- `npm run start`: Runs the production build.

## Contributing

Feel free to contribute by submitting issues or pull requests to improve the functionality and scalability of this starter project.

---

This README file is meant to guide developers in using my project as a starting point for building fullstack applications. You can adjust specific URLs, roles, or environment variables as needed based on your actual setup.
```
