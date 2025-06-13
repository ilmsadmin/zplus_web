-- Initialize the database with basic tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample data
INSERT INTO users (username, email, password_hash) 
VALUES 
    ('admin', 'admin@zplus.com', '$2a$10$example.hash.here'),
    ('user1', 'user1@zplus.com', '$2a$10$example.hash.here')
ON CONFLICT (email) DO NOTHING;