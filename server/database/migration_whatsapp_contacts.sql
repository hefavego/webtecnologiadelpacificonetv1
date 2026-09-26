-- ============================================================
--  TECNOLOGÍA DEL PACÍFICO S.A.S
--  Migración: CRM del bot de WhatsApp (captación y seguimiento
--  comercial de contactos y conversaciones)
--
--  ⚠️ Revisar antes de ejecutar. Ejecución manual, por ejemplo:
--     mysql -u root -p tecnologia_pacifico < migration_whatsapp_contacts.sql
--  o pegar el contenido en phpMyAdmin.
--
--  - Es segura de re-ejecutar (CREATE TABLE IF NOT EXISTS).
--  - No modifica ninguna tabla existente (solo referencia
--    quotations.id desde la tabla nueva).
-- ============================================================

USE tecnologia_pacifico;

-- ============================================================
-- 1. Contactos que escriben al bot (prospectos / clientes)
-- ============================================================
CREATE TABLE IF NOT EXISTS whatsapp_contacts (
  id                INT AUTO_INCREMENT PRIMARY KEY,

  -- Identificación
  phone             VARCHAR(32)  NOT NULL,                  -- Número de WhatsApp (wa_id de Meta, ej. 573001234567)
  profile_name      VARCHAR(255) DEFAULT NULL,              -- Nombre del perfil de WhatsApp
  full_name         VARCHAR(255) DEFAULT NULL,              -- Nombre real (lo da en el flujo de cotización)
  email             VARCHAR(255) DEFAULT NULL,              -- Correo (lo da en el flujo de cotización)

  -- Oportunidad comercial
  interest_service  VARCHAR(255) DEFAULT NULL,              -- Servicio de interés
  budget_range      VARCHAR(100) DEFAULT NULL,              -- Presupuesto estimado indicado en la cotización
  last_quotation_id INT          DEFAULT NULL,              -- Última cotización creada desde el bot
  lead_source       VARCHAR(50)  NOT NULL DEFAULT 'whatsapp_bot',

  -- Seguimiento
  follow_up_status  ENUM('nuevo', 'contactado', 'interesado', 'cotizado', 'cliente', 'descartado')
                    NOT NULL DEFAULT 'nuevo',               -- Etapa del embudo comercial
  assigned_to       VARCHAR(255) DEFAULT NULL,              -- Asesor responsable
  next_follow_up_at DATETIME     DEFAULT NULL,              -- Próxima fecha de seguimiento agendada
  notes             TEXT         DEFAULT NULL,              -- Notas del asesor

  -- Autorización para mensajes comerciales (plantillas de Meta / Ley 1581)
  marketing_opt_in  TINYINT(1)   NOT NULL DEFAULT 0,
  opt_in_at         DATETIME     DEFAULT NULL,

  -- Fechas
  first_contact_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Primer mensaje del contacto
  last_contact_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Último mensaje DEL CONTACTO (define la ventana de 24 h de Meta)
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_wa_contacts_phone      (phone),
  INDEX      idx_wa_contacts_status    (follow_up_status),
  INDEX      idx_wa_contacts_last      (last_contact_at),
  INDEX      idx_wa_contacts_follow_up (next_follow_up_at),
  CONSTRAINT fk_wa_contacts_quotation FOREIGN KEY (last_quotation_id)
    REFERENCES quotations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. Conversaciones: historial de mensajes entrantes y salientes
-- ============================================================
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  contact_id    INT          NOT NULL,
  direction     ENUM('in', 'out') NOT NULL,                 -- in = contacto → bot, out = bot → contacto
  message_type  VARCHAR(30)  NOT NULL DEFAULT 'text',       -- text, interactive, image, audio, location...
  body          TEXT         DEFAULT NULL,
  wa_message_id VARCHAR(191) DEFAULT NULL,                  -- ID de Meta (evita duplicados por reintentos)
  status        ENUM('received', 'sent', 'failed') NOT NULL DEFAULT 'received',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_wa_messages_wa_id   (wa_message_id),
  INDEX      idx_wa_messages_contact (contact_id, created_at),
  CONSTRAINT fk_wa_messages_contact FOREIGN KEY (contact_id)
    REFERENCES whatsapp_contacts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
