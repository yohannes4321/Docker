# Dockerized Full-Stack Application

This project is a full-stack application consisting of a React frontend and a Flask backend. The services are containerized using Docker and managed using Docker Compose.

## Features
- **Frontend**: Built with React, running on Node.js.
- **Backend**: Built with Flask, using Scikit-Learn for machine learning.
- **Dockerized**: Both services run in isolated containers.
- **Networking**: Uses a Docker network for seamless communication between services.
- **Environment Variables**: Configurable API URL for frontend communication.

---

## Getting Started
### Prerequisites
Ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Clone the Repository
```sh
git clone https://github.com/Docker.git
cd Docker
cd project
```

### Build and Run the Application
Run the following command to build and start the containers:
```sh
docker-compose up --build
```
This will start both the frontend (React) and backend (Flask) services.

### Accessing the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check Endpoint**: http://localhost:5000/health

### Stopping the Application
To stop the running containers, use:
```sh
docker-compose down
```

---

## Project Structure
```
📂 project-root/
 ├── 📂 backend/              # Flask backend
 │   ├── Dockerfile.backend   # Backend Dockerfile
 │   ├── app.py              # Flask application
 │   ├── requirements.txt    # Python dependencies
 ├── 📂 frontend/             # React frontend
 │   ├── Dockerfile.frontend  # Frontend Dockerfile
 │   ├── package.json        # Node.js dependencies
 ├── docker-compose.yml       # Docker Compose configuration
 ├── .dockerignore            # Docker ignore file
```

---

## Docker Configuration
### Purpose of Dockerization
Docker allows us to package our application and its dependencies into isolated environments (containers). This ensures consistency across different development and production setups. By using Docker, we eliminate the "works on my machine" problem and simplify deployment.

### Frontend Dockerfile Explanation
```dockerfile
FROM node:20-slim  # Use a lightweight Node.js 20 base image
WORKDIR /app  # Set the working directory inside the container
COPY package*.json ./  # Copy package files for dependency installation
RUN npm install  # Install dependencies
COPY . .  # Copy the rest of the application files
EXPOSE 3000  # Expose port 3000 for frontend access
CMD ["npm", "run", "dev", "--", "--host"]  # Start the development server
```
This setup ensures that the frontend runs in a controlled environment and is ready to be accessed via port 5173 (as mapped in Docker Compose).

### Backend Dockerfile Explanation
```dockerfile
FROM python:3.11-slim  # Use a lightweight Python 3.11 base image
WORKDIR /app  # Set the working directory inside the container
COPY requirements.txt .  # Copy the dependency file
RUN pip install --no-cache-dir -r requirements.txt  # Install dependencies efficiently
COPY . .  # Copy the rest of the application files
EXPOSE 5000  # Expose port 5000 for backend access
CMD ["python", "app.py"]  # Start the Flask application
```
This ensures that our Python-based backend runs consistently in an isolated environment.

### Docker Compose File Explanation
```yaml
version: "3.8"
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend  # Build the frontend container
    ports:
      - "5173:5173"  # Map the container port to localhost
    environment:
      - VITE_API_URL=http://backend:5000  # Backend API URL for communication
    volumes:
      - .:/app  # Mount the current directory for live updates
      - /app/node_modules  # Avoid overwriting node_modules
    networks:
      - app-network  # Connect to the internal network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.backend  # Build the backend container
    ports:
      - "5000:5000"  # Map the container port to localhost
    volumes:
      - ./backend:/app  # Mount the backend directory for live updates
      - /app/venv  # Avoid overwriting the virtual environment
    networks:
      - app-network  # Connect to the internal network

networks:
  app-network:
    driver: bridge  # Create an internal bridge network for communication
```
This setup:
- Defines two services: `frontend` and `backend`.
- Uses a custom bridge network to enable communication between services.
- Mounts project directories for real-time updates without rebuilding.
- Maps ports from containers to the host machine for accessibility.

---

## Backend API Endpoints
### 1. Health Check
- **Endpoint:** `/health`
- **Method:** `GET`
- **Response:**
```json
{
  "status": "healthy",
  "model_info": {
    "coefficient": 2.5,
    "intercept": 1.2
  }
}
```

### 2. Predict
- **Endpoint:** `/predict`
- **Method:** `POST`
- **Request Body:**
```json
{
  "X_test": [2, 5, 8]
}
```
- **Response:**
```json
{
  "predictions": [5.3, 12.1, 18.7],
  "model_info": {
    "coefficient": 2.5,
    "intercept": 1.2
  }
}
```

---

## .dockerignore
To optimize Docker builds, unnecessary files are ignored:
```
node_modules
venv
__pycache__
.env
```

---

## Conclusion
This project provides a simple setup for a Dockerized full-stack application. The frontend communicates with the backend via a REST API, and both services run in isolated containers using Docker Compose. By using Docker, we ensure consistency, portability, and an easy-to-deploy environment.

