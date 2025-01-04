# Task Management API

This project is a backend API built with Node.js, Express, and Prisma to manage users, sessions, teams, and tasks. The application includes user authentication, task management, and role-based authorization.

## 🚀 Features

- User registration and authentication
- Role-based access control (admin, member)
- Team management
- Task management with history tracking

## 📚 Endpoints Overview

### **Users**

- **POST /users** - Create a new user

### **Sessions**

- **POST /sessions** - Authenticate a user and return a JWT token

### **Teams**

- **GET /teams** - Retrieve all teams
- **POST /teams** - Create a new team
- **PATCH /teams/:id** - Update a team
- **DELETE /teams/:id** - Delete a team

### **Tasks**

- **GET /tasks/:team_id** - Retrieve tasks for a specific team
- **POST /tasks/:team_id** - Create a task for a specific team
- **PATCH /tasks/:id** - Update the status of a task
- **DELETE /tasks/:id** - Delete a task and its history

## 🛠️ Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the database**
   Ensure you have a Prisma setup with the appropriate schema.

   ```bash
   npx prisma migrate dev
   ```

4. **Run the application**

   ```bash
   npm run dev
   ```

5. **Run the tests**
   ```bash
   npm run test
   ```

## 📋 Notes

- Make sure your `.env` file contains the correct database configuration.
- Use the provided routes to manage users, sessions, teams, and tasks.
