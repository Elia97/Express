-- Schema per la tabella users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INTEGER CHECK (age >= 0 AND age <= 150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indice per ricerche rapide sull'email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Funzione per aggiornare automaticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per aggiornare automaticamente updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Dati di esempio
INSERT INTO users (name, email, age) VALUES 
    ('Mario Rossi', 'mario.rossi@example.com', 30),
    ('Lucia Bianchi', 'lucia.bianchi@example.com', 25),
    ('Giuseppe Verdi', 'giuseppe.verdi@example.com', 45)
ON CONFLICT (email) DO NOTHING;