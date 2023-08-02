param (
    [string]$DB_NAME,
    [string]$USERNAME
)

$HOST = "localhost"
$PORT = "5432"

# Create the 'todo' table
Invoke-SqlCmd -ServerInstance $HOST -Database $DB_NAME -Username $USERNAME -Query "
CREATE TABLE IF NOT EXISTS todo(
    task_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    task TEXT NOT NULL,
    marked BOOLEAN NOT NULL DEFAULT false
);"

# Create the 'users' table
Invoke-SqlCmd -ServerInstance $HOST -Database $DB_NAME -Username $USERNAME -Query "
CREATE TABLE IF NOT EXISTS users (
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password TEXT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    address TEXT,
    wallet_address TEXT
);"
