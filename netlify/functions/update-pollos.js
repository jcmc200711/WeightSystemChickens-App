// .netlify/functions/update-pollo.js

const { Pool } = require('pg');

// Configuración de la conexión a Neon (igual que tu get-pollos.js)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Asegúrate de tener DATABASE_URL en tus variables de entorno de Netlify
  ssl: {
    rejectUnauthorized: false, // Necesario para Neon con sslmode=require
  },
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'PUT') { // Esperamos una petición PUT para actualizar
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  let client;
  try {
    const data = JSON.parse(event.body); // Parsear el cuerpo JSON de la petición
    const { id, responsable, nombre_comp, peso_pol, fecha_regis } = data;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing pollo ID for update' }),
      };
    }

    client = await pool.connect();
    // Consulta SQL para ACTUALIZAR un registro existente
    // Asegúrate de que los nombres de las columnas coincidan con tu base de datos en Neon
    const result = await client.query(
      `UPDATE pollos
       SET responsable = $1, nombre_comp = $2, peso_pol = $3, fecha_regis = $4
       WHERE id = $5
       RETURNING id, responsable, nombre_comp, peso_pol, fecha_regis;`, // RETURNING para devolver el registro actualizado
      [responsable, nombre_comp, peso_pol, fecha_regis, id]
    );

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Pollo not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0]), // Devuelve el registro actualizado
    };
  } catch (error) {
    console.error('Error updating pollo:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update pollo', error: error.message }),
    };
  } finally {
    if (client) {
      client.release();
    }
  }
};