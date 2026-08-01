-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  avatar TEXT,
  preferences TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email_history table
CREATE TABLE IF NOT EXISTS email_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  subject TEXT NOT NULL,
  recipient TEXT,
  tone VARCHAR(50),
  language VARCHAR(50),
  length VARCHAR(20),
  generated_email TEXT NOT NULL,
  feature VARCHAR(50) DEFAULT 'generator',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert a default template just to have something
INSERT INTO templates (category, title, content) 
VALUES ('Thank You', 'Thank You for Support', 'I wanted to express my sincere thanks for your support on {project}. Your guidance and feedback made a real difference.')
ON CONFLICT DO NOTHING;

-- Disable Row Level Security (RLS) so the Next.js backend can read/write data using the Anon Key
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;
