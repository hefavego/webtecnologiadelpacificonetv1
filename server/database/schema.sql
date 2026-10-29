-- ============================================================
--  TECNOLOGÍA DEL PACÍFICO S.A.S
--  Esquema MySQL para XAMPP (puerto 3306)
--  Ejecutar en: phpMyAdmin o MySQL CLI
-- ============================================================

-- 1. Crear base de datos
CREATE DATABASE IF NOT EXISTS tecnologia_pacifico
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tecnologia_pacifico;

-- ============================================================
-- 2. Tabla: usuarios administradores
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. Tabla: cotizaciones
-- ============================================================
CREATE TABLE IF NOT EXISTS quotations (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(50)  DEFAULT NULL,
  service     VARCHAR(255) DEFAULT NULL,
  description TEXT         DEFAULT NULL,
  budget      VARCHAR(100) DEFAULT 'Por definir',
  status      ENUM('Pending','In Progress','Completed','Rejected') NOT NULL DEFAULT 'Pending',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_status     (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. Tabla: visitas de página (analytics)
-- ============================================================
CREATE TABLE IF NOT EXISTS page_visits (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  page         VARCHAR(500)  NOT NULL,
  page_title   VARCHAR(255)  DEFAULT NULL,
  browser      VARCHAR(100)  DEFAULT NULL,
  device_type  ENUM('desktop','mobile','tablet') DEFAULT 'desktop',
  referrer     TEXT          DEFAULT NULL,
  screen_width SMALLINT      DEFAULT NULL,
  session_id   VARCHAR(128)  DEFAULT NULL,
  ip_address   VARCHAR(45)   DEFAULT NULL,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_page       (page(100)),
  INDEX idx_session    (session_id),
  INDEX idx_created_at (created_at),
  INDEX idx_device     (device_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. Usuario admin inicial (contraseña: admin123)
--    Cambia este registro antes de desplegar en producción
-- ============================================================
INSERT IGNORE INTO users (email, password)
VALUES ('cliente@tecnologiadelpacifico.net', 'admin123');

-- ============================================================
-- 6. Datos de ejemplo para cotizaciones
-- ============================================================
INSERT IGNORE INTO quotations (name, email, phone, service, description, budget, status)
VALUES
  ('Carlos Rodríguez', 'carlos@empresa.com', '+57 300 111 2233', 'Desarrollo de Software',
   'Necesito un sistema ERP básico para mi empresa de 30 empleados.', '$5000', 'Pending'),
  ('María González',   'maria@mipyme.co',    '+57 315 444 5566', 'Soluciones en la Nube',
   'Migración de servidor físico a AWS o GCP.', '$2500', 'In Progress'),
  ('Juan Pérez',       'juan@negocios.com',  '+57 301 777 8899', 'Ciberseguridad',
   'Auditoría de seguridad para plataforma web con base de datos de clientes.', '$1800', 'Completed');
