import { useState } from "react";

export function App() {
  // 1. Declare state variables for each input
  const [responsable, setResponsable] = useState("");
  const [nombre, setNombre] = useState("");
  const [pesoPollo, setPesoPollo] = useState("");

  // 2. Function to handle button click
  const handleSubmit = () => {
    console.log("Datos enviados:");
    console.log("Responsable:", responsable);
    console.log("Nombre:", nombre);
    console.log("Peso del Pollo:", pesoPollo);
    // You could send this data to an API, clear the fields, etc.
  };

  return (
    <section className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col gap-4 p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Ingreso de Datos</h1>
        <input
          type="text"
          placeholder="Pon el responsable aquí"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={responsable} // Bind value to state
          onChange={(e) => setResponsable(e.target.value)} // Update state on change
        />
        <input
          type="text"
          placeholder="Pon tu nombre aquí"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={nombre} // Bind value to state
          onChange={(e) => setNombre(e.target.value)} // Update state on change
        />
        <input
          type="text" // Keep as text initially for flexibility with decimal input
          placeholder="Pon el peso del pollo"
          title="Solo números decimales. Usa un punto como separador decimal."
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={pesoPollo} // Bind value to state
          onChange={(e) => setPesoPollo(e.target.value)} // Update state on change
        />
        <button
          onClick={handleSubmit} // Add click handler
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Enviar Datos
        </button>
      </div>
    </section>
  );
}