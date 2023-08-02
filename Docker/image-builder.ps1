# Build Docker image for todo service
docker build -t luganodestodo/todo-service ../todo

# Build Docker image for auth service
docker build -t luganodestodo/auth-service ../auth

# Build Docker image for frontend service
docker build -t luganodestodo/frontend-service ../frontend