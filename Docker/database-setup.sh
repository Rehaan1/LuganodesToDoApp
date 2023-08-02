#!/bin/bash

if [ "$#" -ne 2]; then
    echo "Usage: $0 <DB_NAME> <USERNAME>"
    exit 1
fi

HOST="localhost"
PORT="5432"
DB_NAME="$1"
USERNAME="$2"

# Create the 'todo' table
psql -h $HOST -p $PORT -U $USERNAME -d $DB_NAME -c "CREATE TABLE IF NOT EXISTS todo(
    task_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    task TEXT NOT NULL,
    marked BOOLEAN NOT NULL DEFAULT false
);"

# Create the 'users' table
psql -h $HOST -p $PORT -U $USERNAME -d $DB_NAME -c "CREATE TABLE IF NOT EXISTS users (
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password TEXT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    address TEXT,
    wallet_address TEXT
);"
