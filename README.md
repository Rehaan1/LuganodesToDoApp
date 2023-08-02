# Luganodes Web3 Authenticated Todo System
### Microservice Architecture

## Backend Documentation For the Amigos :cowboy_hat_face:: https://documenter.getpostman.com/view/14038453/2s9XxvTF9n

## Steps to Start System
1. Go to the Docker Folder

2. Create an Environment File .env

3. In the file add the following variables and assign values to it 
- POSTGRES_ADMIN_USER
- POSTGRES_ADMIN_PASSWORD
- POSTGRES_DB
- POSTGRES_PORT (Keep it 5432)
- POSTGRES_HOST
- JWT_SECRET
- JWT_EXPIRY
- EMAIL
- EMAIL_PASSWORD (for password recovery mailing)

3. Run 

``` ./setup.sh or ./setup.ps1 ```

If unable to execute, give necessary executable permission. eg. ``` chmod +x setup.sh ```

4. On Another Terminal run the following to setup database

```./database-setup.sh <DATABASE NAME> <DB USER> ```
OR
```./database.ps1 -DB_NAME <DB_NAME> -USERNAME <USERNAME> ```

If unable to execute, give necessary executable permission. eg. ``` chmod +x database-setup.sh ```

5. Now you can do ```docker-compose down``` and then use ```docker-compose up``` to stop and start

5. Voila! Alls Setup. Now you can access Frontend in the localhost or ip of hosting machine at port 3000. To access Backend Directly refer backend documentation.


## Possible Improvements

1. Moving to Docker Swarm for ease of scaling and slowly migrate to Kubernetes as required

2. Adding Logging through providers like LogTail for capturing detailed Logs for Error Detection and Debugging

3. Doing Horizontal Partitioning on the database to reduce index search time during high scale operations

4. Using different Database users for read, create, update to ensure further security

5. Using Nignx further as a Load Balancer for the microservices


## Tasks
#### Luganodes Major Requirements
- [X] Start a Postgress Container using Docker Compose

- [X] Design Database for Todo

- [X] Create Basic ToDo Functionality (Microservice)

- [X] Need to Find the Unique Identifier between various Authentication Methods

- [X] Design Database for Authentication

- [X] Create Authentication Mode (Microservice)

- [X] Create Frontend and Link with Backend

- [X] Docker Compose Wrap Everything Together

#### Luganodes ToDo Requirements

- [X] Add Todo

- [X] Remove Todo

- [X] List All Todo

- [X] Mark Todo as Complete

- [X] Update Todo

#### API Endpoint Requirements:

- [X] Email Authentication Endpoint

- [X] Web 3 Authentication Endpoint

- [ ] Google OAuth Authentication Endpoint


- [X] Add Todo Endpoint

- [X] Remove Todo by ID endpoint

- [X] List All Todo Endpoint

- [X] Mark Todo by ID endpoint

- [X] Update Todo by ID


- [X] Account Setting/User Detail Change Endpoint

- [X] Reset Password Email Based Authentication
