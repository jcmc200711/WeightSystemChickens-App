import { useState } from "react";

export function App() {
  // 1. Declare state variables for each input
  const [responsable, setResponsable] = useState("");
  const [nombre, setNombre] = useState(""); // Esto será nombre_comprador
  const [pesoPollo, setPesoPollo] = useState("");
  const [loading, setLoading] = useState(false); // Para indicar si se está enviando
  const [message, setMessage] = useState(""); // Para mensajes de éxito/error

  // 2. Function to handle button click
  const handleSubmit = async () => {
    setLoading(true);
    setMessage(""); // Limpiar mensajes anteriores

    // Validar que los campos no estén vacíos (básico)
    if (!responsable || !nombre || !pesoPollo) {
      setMessage("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    // Preparar los datos para enviar
    const dataToSend = {
      responsable: responsable,
      nombre_comp: nombre, // Asegúrate de que este nombre de clave coincida con tu DB
      peso_pol: parseFloat(pesoPollo), // Convertir a número flotante
      fecha_regis: new Date().toISOString(), // Fecha actual en formato ISO
    };

    try {
      // Realizar la solicitud POST a tu nueva Netlify Function
      const response = await fetch('/.netlify/functions/insert-pollos', { // <-- Nueva función
        method: 'POST', // Usamos POST para crear nuevos recursos
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Enviar los datos como JSON
      });

      if (!response.ok) {
        const errorData = await response.json(); // Intentar leer el error del cuerpo
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setMessage(`Pollo registrado exitosamente con ID: ${result.id}`);
      // Limpiar los campos del formulario después del éxito
      setResponsable("");
      setNombre("");
      setPesoPollo("");


    } catch (err) {
      setMessage(`Error al registrar el pollo: ${err.message}`);
      console.error("Error al enviar datos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center h-3/6 bg-gray-100">
      <div className="flex flex-row gap-4 p-8 bg-white shadow-lg rounded-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Ingreso de Datos de Pollo</h1>
        <input
          type="text"
          placeholder="Responsable"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={responsable}
          onChange={(e) => setResponsable(e.target.value)}
          disabled={loading} // Deshabilitar inputs mientras se envía
        />
        <input
          type="text"
          placeholder="Nombre del Comprador"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={loading}
        />
        <input
          type="number" // Cambiado a type="number" para mejor validación de entrada
          placeholder="Peso del Pollo (kg)"
          step="0.01" // Permite decimales
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={pesoPollo}
          onChange={(e) => setPesoPollo(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={loading} // Deshabilitar botón mientras se envía
        >
          {loading ? "Enviando..." : "Registrar Pollo"}
        </button>

        {/* Mensajes de estado */}
        {message && (
          <p className={`text-center mt-2 ${message.includes("Error") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}