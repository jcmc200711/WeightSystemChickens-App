// .netlify/functions/delete-pollo.js

const { Pool } = require('pg');

// Configuración de la conexión a Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  let client;
  try {
    // ➡️ CORRECCIÓN: Analizar el cuerpo del evento para obtener el ID
    const { id } = JSON.parse(event.body);

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing pollo ID for deletion' }),
      };
    }

    client = await pool.connect();
    // Consulta SQL para ELIMINAR un registro por su ID
    const result = await client.query(
      `DELETE FROM pollos
       WHERE id = $1
       RETURNING id;`,
      [id]
    );

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Pollo not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Pollo deleted successfully',
        id_deleted: result.rows[0].id
      }),
    };
  } catch (error) {
    console.error('Error deleting pollo:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to delete pollo', error: error.message }),
    };
  } finally {
    if (client) {
      client.release();
    }
  }
};