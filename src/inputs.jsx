import { useState } from "react";

export function App() {
  const [responsable, setResponsable] = useState("");
  const [nombre, setNombre] = useState("");
  const [pesoPollo, setPesoPollo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    if (!responsable || !nombre || !pesoPollo) {
      setMessage("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    const dataToSend = {
      responsable: responsable,
      nombre_comp: nombre,
      peso_pol: parseFloat(pesoPollo),
      fecha_regis: new Date().toISOString(),
    };

    try {
      const response = await fetch('/.netlify/functions/insert-pollo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setMessage(`Pollo registrado exitosamente con ID: ${result.id}`);
      
      // Limpiar los campos del formulario
      setResponsable("");
      setNombre("");
      setPesoPollo("");

      // --- CAMBIO AQUÍ: Recargar la página después de un breve retraso ---
      setTimeout(() => {
        window.location.reload(); // Esto recargará toda la página
      }, 1000); // Espera 1 segundo para que el usuario vea el mensaje de éxito

    } catch (err) {
      setMessage(`Error al registrar el pollo: ${err.message}`);
      console.error("Error al enviar datos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col gap-4 p-8 bg-white shadow-lg rounded-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Ingreso de Datos de Pollo</h1>
        <input
          type="text"
          placeholder="Responsable"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={responsable}
          onChange={(e) => setResponsable(e.target.value)}
          disabled={loading}
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
          type="number"
          placeholder="Peso del Pollo (kg)"
          step="0.01"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={pesoPollo}
          onChange={(e) => setPesoPollo(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Registrar Pollo"}
        </button>

        {message && (
          <p className={`text-center mt-2 ${message.includes("Error") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}