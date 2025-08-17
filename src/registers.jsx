import React, { useState, useEffect } from 'react';

export function Regis() {
  const [pollos, setPollos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPolloId, setEditingPolloId] = useState(null);
  const [editedPollo, setEditedPollo] = useState({});

  // Función para obtener los pollos
  useEffect(() => {
    async function fetchPollos() {
      try {
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
  }, []);

  // Manejadores para la edición
  const handleEditClick = (pollo) => {
    setEditingPolloId(pollo.id);
    setEditedPollo({ ...pollo });
  };

  const handleCancelEdit = () => {
    setEditingPolloId(null);
    setEditedPollo({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPollo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/update-pollo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPollo),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      setPollos(prevPollos => prevPollos.map(p =>
        p.id === editedPollo.id ? editedPollo : p
      ));
      setEditingPolloId(null);
      setEditedPollo({});
      alert('Pollo actualizado exitosamente!');
    } catch (err) {
      setError(`Error al guardar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Nueva función para eliminar
  const handleDeleteClick = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/delete-pollo', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      // Filtra el array para remover el pollo eliminado
      setPollos(prevPollos => prevPollos.filter(p => p.id !== id));
      alert('Pollo eliminado exitosamente!');
    } catch (err) {
      setError(`Error al eliminar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-xl text-gray-700 mt-8">Cargando pollos...</div>;
  if (error) return <div className="text-center text-xl text-red-600 mt-8">Error: {error}</div>;

  return (
    <section className='flex justify-center items-center p-4 min-h-screen bg-gray-100'>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Registro de Pollos</h1>
        {pollos.length === 0 ? (
          <p className="text-center text-gray-600">No hay pollos registrados aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
              <thead>
                <tr>
                  <th className="py-3 px-4 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">ID</th>
                  <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Responsable</th>
                  <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Comprador</th>
                  <th className="py-3 px-4 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Peso (kg)</th>
                  <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Fecha de Registro</th>
                  <th className="py-3 px-4 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pollos.map((pollo) => (
                  <tr key={pollo.id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="py-4 px-4 text-center text-2xl text-black">{pollo.id}</td>
                    <td className="py-4 px-4 text-left text-2xl text-black">
                      {editingPolloId === pollo.id ? (
                        <input
                          type="text"
                          name="responsable"
                          value={editedPollo.responsable || ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded text-xl"
                        />
                      ) : (
                        pollo.responsable
                      )}
                    </td>
                    <td className="py-4 px-4 text-left text-2xl text-black">
                      {editingPolloId === pollo.id ? (
                        <input
                          type="text"
                          name="nombre_comp"
                          value={editedPollo.nombre_comp || ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded text-xl"
                        />
                      ) : (
                        pollo.nombre_comp
                      )}
                    </td>
                    <td className="py-4 px-4 text-right text-2xl text-black">
                      {editingPolloId === pollo.id ? (
                        <input
                          type="number"
                          name="peso_pol"
                          value={editedPollo.peso_pol || ''}
                          onChange={handleChange}
                          step="0.01"
                          className="w-full p-2 border border-gray-300 rounded text-xl"
                        />
                      ) : (
                        `${pollo.peso_pol} kg`
                      )}
                    </td>
                    <td className="py-4 px-4 text-left text-2xl text-black">
                      {editingPolloId === pollo.id ? (
                        <input
                          type="date"
                          name="fecha_regis"
                          value={editedPollo.fecha_regis ? editedPollo.fecha_regis.substring(0, 10) : ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded text-xl"
                        />
                      ) : (
                        pollo.fecha_regis ? new Date(pollo.fecha_regis).toLocaleDateString() : 'N/A'
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-5xl text-black">
                      {editingPolloId === pollo.id ? (
                        // Botones en modo edición
                        <div className="flex justify-center items-center gap-4">
                          <button
                            onClick={handleSaveClick}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-base"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-base"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        // Botones en modo visualización
                        <div className="flex justify-center items-center gap-4">
                          <button
                            onClick={() => handleEditClick(pollo)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-base"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteClick(pollo.id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-base"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Regis;