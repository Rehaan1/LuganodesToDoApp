# Luganodes Web3 Authenticated Todo System

## Backend Documentation: https://documenter.getpostman.com/view/14038453/2s9XxvTF9n

## Steps to Start System
1. Go to Docker Folder

2. Create Enviroment Files for each service as <service_name>.env.list. Eg- todo.env.list and auth.env.list

3. Create another Environment File .env

4. In all the 3 files add the following values POSTGRES_ADMIN_USER, POSTGRES_ADMIN_PASSWORD, POSTGRES_DB, POSTGRES_PORT, POSTGRES_HOST, JWT_SECRET, JWT_EXPIRY

5. use psql and access the postgress database
``` psql -h localhost -U <USERNAME> -d <DATABASE NAME> ```

6. Create two tables in that database 'todo'  and 'users' with the following:

``` CREATE TABLE todo_list ( task_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, user_id UUID NOT NULL, task TEXT NOT NULL, marked BOOLEAN NOT NULL DEFAULT false); ```

```CREATE TABLE users ( user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, email VARCHAR(255) UNIQUE, password TEXT, first_name VARCHAR(100), last_name VARCHAR(100), address TEXT, wallet_address TEXT);```

6. Run 

``` .\setup.sh or .\setup.ps1 ```

If unable to execute, give necessary executable permission. eg. ``` chmod +x setup.sh ```

7. Access Frontend in the localhost or ip of hosting machine at port 3000

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

- [ ] Reset Password Email Based Authentication
