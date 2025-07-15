// netlify/functions/get-pollos.js
const { Client } = require('pg'); // Importa la librería pg para PostgreSQL

// Esta es la función principal que se ejecuta cuando se llama a tu Netlify Function
exports.handler = async (event, context) => {
    // Crea una nueva instancia de cliente PostgreSQL
    const client = new Client({
        connectionString: process.env.DATABASE_URL, // Accede a la cadena de conexión de forma segura desde las variables de entorno de Netlify
        ssl: {
            rejectUnauthorized: false // Importante para la conexión con Neon en ciertos entornos de desarrollo/despliegue.
                                     // En un entorno de producción con certificados SSL específicos, esto podría requerir una configuración más robusta.
        }
    });

    try {
        await client.connect(); // Intenta conectar a la base de datos

        // Ejecuta la consulta SQL para obtener todos los pollos
        // Seleccionamos las columnas explícitamente y ordenamos por fecha de registro descendente
        const res = await client.query('SELECT id, responsable, nombre_comprador, peso_pollo, fecha_registro FROM pollos ORDER BY fecha_registro DESC');

        // Retorna una respuesta HTTP 200 (OK) con los datos de los pollos en formato JSON
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json", // Indica que el contenido es JSON
                "Access-Control-Allow-Origin": "*", // Permite que cualquier origen (tu frontend) acceda a esta función
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Métodos HTTP permitidos
                "Access-Control-Allow-Headers": "Content-Type" // Cabeceras permitidas
            },
            body: JSON.stringify(res.rows), // Convierte los resultados de la consulta (filas) a una cadena JSON
        };
    } catch (error) {
        // Si ocurre un error, loguea el error y retorna una respuesta HTTP 500 (Error Interno del Servidor)
        console.error('Error al obtener pollos de la base de datos:', error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ error: 'Error al obtener los datos de los pollos.' }), // Mensaje de error para el cliente
        };
    } finally {
        // Asegúrate de cerrar la conexión a la base de datos, independientemente de si hubo un error o no
        await client.end();
    }
};