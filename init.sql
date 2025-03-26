DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'almuerzos_db') THEN
        CREATE DATABASE almuerzos_db;
    END IF;
END $$;

\c almuerzos_db;

CREATE TABLE IF NOT EXISTS public.receta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ingrediente (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS public.receta_ingrediente (
    recetaid UUID REFERENCES receta(id) ON DELETE CASCADE,
    ingredienteid UUID REFERENCES ingrediente(id) ON DELETE CASCADE,
    cantidad INT NOT NULL, 
    PRIMARY KEY (recetaid, ingredienteid)
);



CREATE TABLE IF NOT EXISTS public.bodega (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ingredienteid UUID REFERENCES ingrediente(id),
    cantidaddisponible INT DEFAULT 5
);



CREATE TABLE IF NOT EXISTS public.orden (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiarioid VARCHAR(100),
    recetaid UUID REFERENCES receta(id),
    recetanombre VARCHAR(255),
    estado VARCHAR(20) CHECK (estado IN ('PENDIENTE','EN REPARACION', 'FINALIZADA')) NOT NULL,
    fechacreacion TIMESTAMP DEFAULT now(),
    fechaactualizacion TIMESTAMP DEFAULT now()
);




CREATE TABLE IF NOT EXISTS public.compra (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ingredienteid UUID REFERENCES ingrediente(id),
    cantidadcomprada INT NOT NULL,
    fechacompra TIMESTAMP DEFAULT now()
);



DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
        CREATE USER app_user WITH PASSWORD 'app_password';
    END IF;
END $$;

GRANT ALL PRIVILEGES ON SCHEMA public TO app_user;


INSERT INTO public.ingrediente (id, nombre) VALUES
    (gen_random_uuid(), 'Tomate'),
    (gen_random_uuid(), 'Limon'),
    (gen_random_uuid(), 'Papa'),
    (gen_random_uuid(), 'Arroz'),
    (gen_random_uuid(), 'Ketchup'),
    (gen_random_uuid(), 'Lechuga'),
    (gen_random_uuid(), 'Cebolla'),
    (gen_random_uuid(), 'Queso'),
    (gen_random_uuid(), 'Carne'),
    (gen_random_uuid(), 'Pollo');

INSERT INTO public.bodega (id, ingredienteid, cantidaddisponible) 
SELECT gen_random_uuid(), id, 5 FROM public.ingrediente;


INSERT INTO receta (id, nombre, descripcion) VALUES
(gen_random_uuid(), 'Ensalada César', 'Ensalada fresca con lechuga, pollo, queso y limón.'),
(gen_random_uuid(), 'Arroz con Pollo sudado', 'Plato tradicional de arroz con pollo, guisado con tomate, cebbolla y un toque de limón.'),
(gen_random_uuid(), 'Hamburguesa Clásica', 'Jugosa hamburguesa con carne, lechuga, tomate, aros de cebolla,queso y ketchup.'),
(gen_random_uuid(), 'Puré de Papa mix', 'Puré cremoso de papa con queso derretido, trozos de pollo y carne a la plancha, acompañado de un toque de cebolla caramelizada.'),  
(gen_random_uuid(), 'Pollo a la Parrilla con Arroz y Limón', 'Pechuga de pollo a la parrilla, servida con arroz y un toque de limón.'),  
(gen_random_uuid(), 'Guisado de Carne con Papas', 'Guiso de carne cocido a fuego lento con papas, tomate y cebolla, sazonado con especias.'); 



DO $$ 
DECLARE 
    receta_id UUID;
    ingrediente_id UUID;
BEGIN
    -- Ensalada César
    SELECT id INTO receta_id FROM public.receta WHERE nombre = 'Ensalada César';
    FOR ingrediente_id IN 
        SELECT id FROM public.ingrediente WHERE nombre IN ('Lechuga', 'Pollo', 'Queso', 'Limon') 
    LOOP
        INSERT INTO public.receta_ingrediente (recetaid, ingredienteid,cantidad) VALUES (receta_id, ingrediente_id,1);
    END LOOP;

    -- Arroz con Pollo sudado
    SELECT id INTO receta_id FROM public.receta WHERE nombre = 'Arroz con Pollo sudado';
    FOR ingrediente_id IN 
        SELECT id FROM public.ingrediente WHERE nombre IN ('Arroz', 'Pollo', 'Tomate', 'Cebolla', 'Limon') 
    LOOP
        INSERT INTO public.receta_ingrediente (recetaId, ingredienteId,cantidad) VALUES (receta_id, ingrediente_id,1);
    END LOOP;

    -- Hamburguesa Clásica
    SELECT id INTO receta_id FROM public.receta WHERE nombre = 'Hamburguesa Clásica';
    FOR ingrediente_id IN 
        SELECT id FROM public.ingrediente WHERE nombre IN ('Carne', 'Lechuga', 'Tomate', 'Cebolla', 'Queso', 'Ketchup') 
    LOOP
        INSERT INTO public.receta_ingrediente (recetaid, ingredienteid,cantidad) VALUES (receta_id, ingrediente_id,1);
    END LOOP;

    -- Puré de Papa mix
    SELECT id INTO receta_id FROM public.receta WHERE nombre = 'Puré de Papa mix';
    FOR ingrediente_id IN 
        SELECT id FROM public.ingrediente WHERE nombre IN ('Papa', 'Queso', 'Pollo', 'Carne', 'Cebolla') 
    LOOP
        INSERT INTO public.receta_ingrediente (recetaid, ingredienteid,cantidad) VALUES (receta_id, ingrediente_id,1);
    END LOOP;

    -- Pollo a la Parrilla con Arroz y Limón
    SELECT id INTO receta_id FROM public.receta WHERE nombre = 'Pollo a la Parrilla con Arroz y Limón';
    FOR ingrediente_id IN 
        SELECT id FROM public.ingrediente WHERE nombre IN ('Pollo', 'Arroz', 'Limon') 
    LOOP
        INSERT INTO public.receta_ingrediente (recetaId, ingredienteId,cantidad) VALUES (receta_id, ingrediente_id,1);
    END LOOP;

    -- Guisado de Carne con Papas
    SELECT id INTO receta_id FROM receta WHERE nombre = 'Guisado de Carne con Papas';
    FOR ingrediente_id IN 
        SELECT id FROM ingrediente WHERE nombre IN ('Carne', 'Papa', 'Tomate', 'Cebolla') 
    LOOP
        INSERT INTO receta_ingrediente (recetaId, ingredienteId,cantidad) VALUES (receta_id, ingrediente_id,1);
    END LOOP;
END $$;
