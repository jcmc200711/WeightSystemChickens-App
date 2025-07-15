import React, { useState, useEffect } from 'react';

export function Regis() {
  const [pollos, setPollos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPollos() {
      try {
        // La URL para tu Netlify Function.
        // Cuando la app esté desplegada en Netlify, esta ruta es relativa a la raíz.
        const response = await fetch('/.netlify/functions/get-pollos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPollos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPollos();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  if (loading) return <div>Cargando pollos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="">
      <h1>Registro de Pollos</h1>
      {pollos.length === 0 ? (
        <p>No hay pollos registrados aún.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Responsable</th>
              <th>Comprador</th>
              <th>Peso (kg)</th>
              <th>Fecha de Registro</th>
            </tr>
          </thead>
          <tbody>
            {pollos.map((pollo) => (
              <tr key={pollo.id}>
                <td>{pollo.id}</td>
                <td>{pollo.responsable}</td>
                <td>{pollo.nombre_comprador}</td>
                <td>{pollo.peso_pollo} kg</td>
                <td>{new Date(pollo.fecha_registro).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Regis;