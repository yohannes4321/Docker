Docker Setup
To make it easier to set up the environment, we’ve provided a Dockerfile and a docker-compose.yml file. By running docker-compose up, the application will automatically build and start within Docker containers.

Step-by-Step Docker Setup
Build and Start the Containers: To launch the application, simply run:

bash
Copy
Edit
docker-compose up
This command will:

Build the Docker image based on the Dockerfile
Start the Flask backend container
Expose the app on http://localhost:5000
Stopping the Containers: To stop the application, run:

bash
Copy
Edit
docker-compose down
Dockerfile
Here is the Dockerfile that defines how the backend should be built:

Dockerfile
Copy
Edit
# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside the container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=app.py

# Run the Flask application
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
Docker Compose Configuration
The docker-compose.yml file is used to define and run multi-container Docker applications. For this project, we’re only using one container for the backend, but Docker Compose helps manage this efficiently.

Here’s the docker-compose.yml:

yaml
Copy
Edit
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"  # Map container's port 5000 to host's port 5000
    environment:
      FLASK_APP: app.py
    volumes:
      - .:/app  # Mount the current directory to /app in the container
    networks:
      - backend_network

networks:
  backend_network:
    driver: bridge
How It Works:
build: This builds the image using the Dockerfile in the current directory.
ports: Maps port 5000 inside the container to port 5000 on your host machine.
volumes: Mounts the current directory into the container, so you can edit files without rebuilding the container.
networks: Specifies a network for the service to connect to, making it easier to scale and manage multiple containers in the future.
API Endpoints
POST /predict
Makes a prediction using the linear regression model.

Request body:

json
Copy
Edit
{
  "X_test": [5.0]
}
Response:

json
Copy
Edit
{
  "predictions": [12.5],
  "model_info": {
    "coefficient": 2.5,
    "intercept": 0.0
  }
}
GET /health
Health check endpoint that also returns model information.

Response:

json
Copy
Edit
{
  "status": "healthy",
  "model_info": {
    "coefficient": 2.5,
    "intercept": 0.0
  }
}
Conclusion
By using Docker and Docker Compose, you can easily run the Linear Regression Predictor Flask application with just a single command: docker-compose up. This will automate the process of building the image, running the application, and exposing the server to the host machine.

