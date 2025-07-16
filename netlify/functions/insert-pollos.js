// .netlify/functions/insert-pollo.js

const { Pool } = require('pg');

// Configuración de la conexión a Neon (igual que tus otras funciones)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Asegúrate de tener DATABASE_URL en tus variables de entorno de Netlify
  ssl: {
    rejectUnauthorized: false, // Necesario para Neon con sslmode=require
  },
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') { // Esperamos una petición POST para insertar
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  let client;
  try {
    const data = JSON.parse(event.body); // Parsear el cuerpo JSON de la petición
    // Asegúrate de que los nombres de las claves aquí coincidan con lo que envías desde el frontend
    const { responsable, nombre_comp, peso_pol, fecha_regis } = data;

    // Validación básica de datos
    if (!responsable || !nombre_comp || peso_pol === undefined || !fecha_regis) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    client = await pool.connect();

    // Consulta SQL para INSERTAR un nuevo registro
    // Asegúrate de que los nombres de las columnas coincidan con tu base de datos en Neon
    // El 'id' se asume que es SERIAL o UUID y se genera automáticamente en la DB.
    const result = await client.query(
      `INSERT INTO pollos (responsable, nombre_comp, peso_pol, fecha_regis)
       VALUES ($1, $2, $3, $4)
       RETURNING id;`, // RETURNING id para obtener el ID del nuevo registro
      [responsable, nombre_comp, peso_pol, fecha_regis]
    );

    // Devuelve el ID del nuevo registro
    return {
      statusCode: 200,
      body: JSON.stringify({ id: result.rows[0].id, message: 'Pollo insertado exitosamente' }),
    };
  } catch (error) {
    console.error('Error inserting pollo:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to insert pollo', error: error.message }),
    };
  } finally {
    if (client) {
      client.release();
    }
  }
};