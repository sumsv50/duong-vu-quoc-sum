-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster search by name
CREATE INDEX idx_resources_name ON resources(name);