CREATE DATABASE almuerzos_db;

\c almuerzos_db;



CREATE TABLE receta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL
);

CREATE TABLE ingrediente (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE bodega (
    ingredienteId UUID PRIMARY KEY REFERENCES ingrediente(id),
    cantidadDisponible INT DEFAULT 5
);

CREATE TABLE plato (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recetaId UUID REFERENCES recetas(id),
    ingredienteId UUID REFERENCES ingrediente(id),
    cantidad INT NOT NULL
);

CREATE TABLE orden (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiarioId VARCHAR(100),
    platoId UUID REFERENCES plato(id),
    estado VARCHAR(20) CHECK (estado IN ('PENDIENTE','EN REPARACION', 'FINALIZADA')) NOT NULL,
    fechaCreacion TIMESTAMP DEFAULT now(),
    fechaActualizacion TIMESTAMP DEFAULT now()
);

CREATE TABLE compra (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ingredienteId UUID REFERENCES ingrediente(id),
    cantidadComprada INT NOT NULL,
    fechaCompra TIMESTAMP DEFAULT now()
);

CREATE USER app_user WITH PASSWORD 'app_password';
GRANT ALL PRIVILEGES ON DATABASE restaurant_db TO app_user;