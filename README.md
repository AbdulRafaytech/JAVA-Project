# 🚀 FlowBoard — Premium Full-Stack Kanban Workspace

FlowBoard is a modern, premium, colourful, and highly responsive SaaS-style full-stack Kanban task-management web application. It combines a polished React/TypeScript frontend with a secure, highly performant Java Spring Boot backend and PostgreSQL database storage.

FlowBoard features a custom visual identity utilizing gorgeous color-mesh gradients, elegant glassmorphism panels, dark mode/light mode persistence, and seamless drag-and-drop mechanics.

---

## ✨ Features

### 👤 1. Secure Authentication & Session Persistence
*   User registration with real-time field validation.
*   Secure login generating stateless **JWT tokens** stored in `localStorage`.
*   Password encryption using **BCrypt**.
*   Route protection redirects unauthenticated users to `/login`.
*   Logout clears context and local storage securely.

### 📋 2. Workspace Boards (Multi-Board support)
*   Create new boards with customized premium gradient accents: *Sunset Glow, Purple Haze, Ocean Breeze, Rose Gold, and Aurora Forest*.
*   Update board name and details inline.
*   Delete board with interactive modal confirmation.
*   Access controls guarantee users can only see and manage their own workspaces.

### 🏛️ 3. Kanban Columns
*   Boards automatically initialize with standard Agile columns: **To Do, In Progress, Review, Done**.
*   Create custom columns inside any board.
*   Rename column headers inline or delete columns with complete confirmation warnings.
*   Horizontally scrollable column grid.

### 📝 4. Detailed Task Cards
*   Create task cards inside any column.
*   Modify task titles, descriptions, priorities, deadlines, assignees, and label lists.
*   Delete task cards with modal confirmations.
*   Priority level visual tags: **High (Rose red), Medium (Yellow/Orange), Low (Emerald green)**.
*   Automated relative due-date warnings (overdue tags with animated icons).
*   Add dynamic, custom-coloured label pills.

### 🎚️ 5. Seamless Drag-and-Drop
*   Powered by `@dnd-kit/core` and `@dnd-kit/sortable`.
*   Move tasks between columns or re-order within the same column.
*   Optimistic frontend UI rendering instantly synchronizes with the Spring Boot REST API (`PUT /api/tasks/{id}/move`).

### 🔍 6. Real-time Search and Filters
*   Filter tasks by keyword search instantly.
*   Filter by priority (Low, Medium, High).
*   Filter by custom labels.
*   Filter by relative calendar deadline (All, Overdue, Due Today, Upcoming).
*   Visible column task stacks update dynamically.

### 📊 7. Analytical Dashboard
*   Statistics count panels tracking Total Tasks, In Progress, Completed, and Overdue metrics.
*   Interactive **Doughnut Chart** mapping task distribution across columns (powered by Recharts).
*   Interactive **Bar Chart** analyzing task priorities.
*   List of recently active boards with fast redirect links.
*   Motivational quote generator loading fresh productivity reminders.

---

## 🛠️ Technology Stack

### **Frontend**
*   **React 18** with **TypeScript**
*   **Vite** (Next-generation bundler)
*   **Tailwind CSS** (SaaS layout, variables, and dark theme support)
*   **React Router 6** (Workspace navigation and route protection)
*   **Axios** (REST API calls with authorization interceptors)
*   **@dnd-kit** (Physics-based drag-and-drop tasks)
*   **Lucide React** (Unified aesthetic icons)
*   **Recharts** (Interactive data visualization charts)

### **Backend**
*   **Java 21** & **Spring Boot 3.2**
*   **Spring Security** (Custom filter chain authorization)
*   **JJWT 0.12** (Secure stateless JWT authentication)
*   **Spring Data JPA** & **Hibernate** (Database mapping and cascades)
*   **PostgreSQL** (Production-grade transactional storage)
*   **Lombok** (Boilerplate-free clean models)
*   **Bean Validation** (Input field constraints)
*   **Maven 3.9** (Dependency build system)

---

## 📂 Project Structure

```
flowboard/
├── backend/                   # Spring Boot Java Application
│   ├── src/main/java/com/flowboard/
│   │   ├── config/            # Security and CORS configurations
│   │   ├── controller/        # REST Controllers (Auth, Boards, Columns, Tasks, Dashboard)
│   │   ├── dto/               # Data Transfer Objects (Request/Response schemas)
│   │   ├── entity/            # JPA Entities (User, Board, Column, Task, Label)
│   │   ├── exception/         # Custom exceptions and GlobalExceptionHandler
│   │   ├── repository/        # Spring Data JPA Repository interfaces
│   │   ├── security/          # JWT Filters, UserDetails implementation, Utilities
│   │   ├── service/           # Service interfaces and implementations
│   │   └── FlowBoardApplication.java
│   ├── src/main/resources/application.properties
│   └── pom.xml
│
├── frontend/                  # React Vite Single Page App
│   ├── src/
│   │   ├── api/               # Axios instance and API service routes
│   │   ├── components/        # Reusable UI widgets
│   │   │   ├── board/         # Kanban ColumnView elements
│   │   │   ├── layout/        # Sidebar, Navbar, protected workspace layouts
│   │   │   └── task/          # TaskCard, TaskModal, TaskFilters
│   │   ├── context/           # Theme, Auth and Toast Providers
│   │   ├── hooks/             # Custom useAuth, useTheme, useToast hooks
│   │   ├── pages/             # Login, Signup, Dashboard, Board, Profile, 404 pages
│   │   ├── types/             # Fully typed TypeScript interfaces
│   │   ├── App.tsx            # Routes mounting configuration
│   │   └── main.tsx           # React bootstrap entry point
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Running FlowBoard Locally

### **Prerequisites**
Make sure you have the following installed on your machine:
*   **Java Development Kit (JDK) 21** or later
*   **Node.js 18** or later (with `npm` or `yarn`)
*   **PostgreSQL** running locally on port `5432`
*   **Maven 3.9** or later

---

### **1. Database Setup**
Log into your PostgreSQL console and create the required user and database:
```sql
-- Connect to postgres and execute:
CREATE USER flowboard WITH PASSWORD 'flowboard' SUPERUSER;
CREATE DATABASE flowboard OWNER flowboard;
```
*(If you want to use custom database credentials, you can adjust them inside `backend/src/main/resources/application.properties` before launching).*

---

### **2. Running the Spring Boot Backend**
Open a new terminal window inside the root project directory:
```bash
cd backend

# Compile and package application
mvn clean install

# Launch the Spring Boot server
mvn spring-boot:run
```
The server will start up successfully and listen for requests on **`http://localhost:8080`**.

---

### **3. Running the React Frontend**
Open a second terminal window inside the root project directory:
```bash
cd frontend

# Install Node modules dependencies
npm install

# Start Vite hot-reloading development server
npm run dev
```
The client app will launch instantly on **`http://localhost:5173`**. Open this address inside your browser to access FlowBoard!

---

## 🌐 API Overview

### **Auth Endpoints**
*   `POST /api/auth/register` — Create a new account.
*   `POST /api/auth/login` — Log in and retrieve JWT token.

### **Boards**
*   `GET /api/boards` — Fetch all boards owned by the logged-in user.
*   `POST /api/boards` — Create a board (pre-populated with default columns).
*   `GET /api/boards/{id}` — Load single board layout.
*   `PUT /api/boards/{id}` — Modify board title or description.
*   `DELETE /api/boards/{id}` — Delete board and all its columns, tasks, labels.

### **Columns**
*   `POST /api/boards/{boardId}/columns` — Create custom column.
*   `PUT /api/columns/{id}` — Rename column.
*   `DELETE /api/columns/{id}` — Remove column.

### **Tasks**
*   `POST /api/columns/{columnId}/tasks` — Add task card.
*   `GET /api/tasks/{id}` — Load task card.
*   `PUT /api/tasks/{id}` — Update details, deadlines, priority and labels.
*   `DELETE /api/tasks/{id}` — Remove task card.
*   `PUT /api/tasks/{id}/move` — Drag-and-drop move endpoint.

### **Dashboard**
*   `GET /api/dashboard/summary` — Load analytical task metrics.

---

## 🔮 Future Enhancements
1.  **Multiple Board Members**: Add invite triggers to share boards with other users and select assignees from a dropdown list of board members.
2.  **Activity Logs**: Record a timeline history of edits, completions, and column movements.
3.  **Subtask Checklist**: Add progress bars to task cards detailing checklists of smaller subtasks.
4.  **CSV Export**: Add a spreadsheet export option to download all tasks for offline processing.
