A comprehensive task management system built for PanScience Innovations as part of a full-stack developer assessment. This application demonstrates modern web development practices with a React frontend, Node.js/Express backend, JWT authentication, file upload capabilities, and containerized deployment.

## Introduction

This project is a complete task management solution that allows users to efficiently manage tasks with advanced features including user authentication, role-based access control, document attachments, and real-time filtering. Built following industry best practices, it showcases a scalable architecture suitable for enterprise-level applications.

### Key Highlights
- **JWT-based Authentication**: Secure user registration and login system
- **Role-based Authorization**: Admin and regular user roles with appropriate permissions
- **Document Management**: Upload up to 3 PDF documents per task with cloud/local storage
- **Advanced Task Operations**: CRUD operations with filtering, sorting, and pagination
- **Responsive Design**: Modern UI built with component-based architecture
- **Containerized Deployment**: Docker configuration for easy setup and deployment
- **Comprehensive Testing**: Unit and integration tests with high coverage
- **API Documentation**: Well-documented RESTful APIs

## Project Structure
<img width="4656" height="2724" alt="diagram (1)" src="https://github.com/user-attachments/assets/cf3e6bc2-7249-4825-a965-1ffffb9adda4" />

### Frontend (UI Layer)
The frontend is organized into several key areas:

- **Routing & State Management**: Core routing functionality with state management services
- **Pages**: Main application pages including:
  - `HomePage.jsx` - Landing page component
  - `LoginPage.jsx` - User authentication page
  - `RegisterPage.jsx` - User registration page
  - `TaskDetailsPage.jsx` - Individual task management page
- **Layouts & UI Components**: 
  - `MainLayout.jsx` - Primary layout wrapper
  - `UI Primitives` - Reusable UI components
  - `Task Components` - Task-specific UI elements
  - `UserForm.jsx` - User input forms
- **Services**: Frontend service layer for API communication and business logic
- **Utils**: Utility functions and helpers

### Backend (API Layer)
The backend follows a layered architecture:

- **Express API**: RESTful API built with Express.js
- **Middleware & Utils**: Request processing and utility functions
- **Service Layer**: Business logic and data processing
- **Models**: Data models and schema definitions
- **Routes & Controllers**: API endpoints and request handlers including:
  - `userRoutes.js` - User management endpoints
  - `taskRoutes.js` - Task management endpoints
  - `taskController.js` - Task business logic
  - `userController.js` - User business logic
  - `authController.js` - Authentication logic

### Infrastructure & Data
- **Database Layer**: MongoDB integration with user and task collections
- **External Services**: Third-party service integrations
- **DevOps**: Docker Compose configuration for containerized deployment

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. **Environment Configuration**
   Create `.env` files for both frontend and backend with necessary environment variables:
   - Database connection strings
   - JWT secrets
   - API endpoints
   - External service keys

4. **Database Setup**
   Ensure MongoDB is running and configure your database connection in the environment variables.

### Running the Application

#### Development Mode
```bash
# Start backend server
npm run dev

# Start frontend (in a new terminal)
cd frontend
npm start
```

#### Production Deployment
```bash
# Build frontend
cd frontend
npm run build

# Start production server
npm start
```

#### Docker Deployment
```bash
docker-compose up
```

## Architecture Overview

This application follows a modern full-stack architecture:

- **Frontend**: React-based SPA with component-based architecture
- **Backend**: Express.js REST API with layered service architecture  
- **Database**: MongoDB for data persistence
- **Authentication**: JWT-based authentication system
- **State Management**: Centralized state management for frontend
- **Containerization**: Docker support for easy deployment

## Key Features

- User authentication and authorization
- Task management system
- Responsive UI with modern design
- RESTful API architecture
- Database integration with MongoDB
- Containerized deployment support
- Modular and scalable codebase

## API Documentation

The backend provides RESTful endpoints for:
- User management (registration, login, profile)
- Task operations (CRUD operations)
- Authentication and authorization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write or update tests as needed
5. Submit a pull request

## Technology Stack

- **Frontend**: React.js, JavaScript/JSX
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Containerization**: Docker
- **Development**: Hot reload, environment configuration

## License

[Add your license information here]

## Support

For support and questions, please [add contact information or issue tracking details].



