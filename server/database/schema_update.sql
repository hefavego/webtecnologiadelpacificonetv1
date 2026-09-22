-- ============================================================
--  TECNOLOGÍA DEL PACÍFICO S.A.S
--  Esquema de actualización para administración de contenido
-- ============================================================

USE tecnologia_pacifico;

-- 1. Tabla: productos personalizables con capturas y enlaces
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  image_url   LONGTEXT DEFAULT NULL, -- Guarda URL o Base64
  price       INT NOT NULL DEFAULT 0,
  features    TEXT DEFAULT NULL,     -- Guardado como JSON (arreglo de strings)
  screenshots LONGTEXT DEFAULT NULL, -- Guardado como JSON (arreglo de base64/URLs)
  links       TEXT DEFAULT NULL,     -- Guardado como JSON (arreglo de {label, url})
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla: contenido general del sitio (clave - valor)
CREATE TABLE IF NOT EXISTS site_content (
  key_name   VARCHAR(100) PRIMARY KEY,
  key_value  LONGTEXT DEFAULT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
