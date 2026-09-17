CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nombre, email) VALUES
    ('Mariana Uribe', 'mariana.uribe@sena.edu.co'),
    ('Carlos Ramirez', 'carlos.ramirez@sena.edu.co'),
    ('Laura Gomez', 'laura.gomez@sena.edu.co');