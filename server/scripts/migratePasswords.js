
/**
 * SCRIPT DE MIGRACIÓN DE SEGURIDAD
 * Hashea todas las contraseñas en texto plano de la tabla users
 *
 * Ejecutar UNA SOLA VEZ:
 *   node server/scripts/migratePasswords.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const bcrypt = require('bcryptjs');
const mysql  = require('mysql2/promise');

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

async function migrate() {
  console.log('\n🔐 Iniciando migración de contraseñas...\n');

  const db = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'tecnologia_pacifico',
  });

  try {
    // Obtener todos los usuarios
    const [users] = await db.query('SELECT id, email, password FROM users');

    if (users.length === 0) {
      console.log('⚠️  No hay usuarios en la base de datos.');
      return;
    }

    let migrated = 0;
    let skipped  = 0;

    for (const user of users) {
      // Detectar si ya está hasheado con bcrypt (empieza con $2b$ o $2a$)
      if (/^\$2[ab]\$\d+\$/.test(user.password)) {
        console.log(`  ✅ [${user.email}] ya tiene contraseña hasheada. Omitido.`);
        skipped++;
        continue;
      }

      // Hashear la contraseña en texto plano
      const hashed = await bcrypt.hash(user.password, ROUNDS);
      await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, user.id]);
      console.log(`  🔒 [${user.email}] contraseña migrada correctamente.`);
      migrated++;
    }

    console.log(`\n✔ Migración completada:`);
    console.log(`  → ${migrated} contraseñas hasheadas`);
    console.log(`  → ${skipped} ya estaban hasheadas`);
    console.log('\n⚠️  IMPORTANTE: Informa a los admins que su contraseña sigue siendo la misma,');
    console.log('   solo está almacenada de forma segura ahora.\n');

  } finally {
    await db.end();
  }
}

migrate().catch((err) => {
  console.error('❌ Error en la migración:', err.message);
  process.exit(1);
});
