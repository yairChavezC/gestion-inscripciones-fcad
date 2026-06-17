import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiTrash2, FiPlus, FiCheck } from 'react-icons/fi';
import './Inscripciones.css';

const Inscripciones = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [datosFormulario, setDatosFormulario] = useState({ id_estudiante: '', id_curso: '' });

  useEffect(() => {
    cargarDatosPantalla();
  }, []);

  const cargarDatosPantalla = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token');

      const resInscripciones = await fetch('http://localhost:4000/api/inscripciones', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const jsonInscripciones = await resInscripciones.json();
      setInscripciones(Array.isArray(jsonInscripciones) ? jsonInscripciones : []);

      const resEstudiantes = await fetch('http://localhost:4000/api/inscripciones/aux/estudiantes', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const jsonEstudiantes = await resEstudiantes.json();
      setEstudiantes(jsonEstudiantes);

      const resCursos = await fetch('http://localhost:4000/api/inscripciones/aux/cursos', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const jsonCursos = await resCursos.json();
      setCursos(jsonCursos);

    } catch (error) {
      console.error('Error al cargar datos de gestión:', error);
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = () => {
    setDatosFormulario({ id_estudiante: '', id_curso: '' });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const handleChangeFormulario = (e) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarCrearInscripcion = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!datosFormulario.id_estudiante || !datosFormulario.id_curso) {
      alert('Debes seleccionar un estudiante y un curso obligatoriamente.');
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:4000/api/inscripciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_estudiante: parseInt(datosFormulario.id_estudiante, 10),
          id_curso: parseInt(datosFormulario.id_curso, 10)
        })
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        alert('¡Inscripción procesada con éxito!');
        cerrarModal();
        cargarDatosPantalla();
      } else {
        alert(`No se pudo crear: ${data.error || 'Error interno del servidor'}`);
      }
    } catch (error) {
      console.error('Error al procesar la inscripción:', error);
      alert('No se pudo conectar con el servidor.');
    }
  };

  const manejarEliminarInscripcion = async (idInscripcion, alumnoNombre) => {
    const token = localStorage.getItem('token');

    if (window.confirm(`¿Estás seguro de que querés dar de baja la inscripción de: "${alumnoNombre}"? Esta acción liberará la vacante.`)) {
      try {
        const respuesta = await fetch(`http://localhost:4000/api/inscripciones/${idInscripcion}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (respuesta.ok) {
          alert('Inscripción cancelada con éxito.');
          cargarDatosPantalla();
        } else {
          const errorData = await respuesta.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error al eliminar la inscripción:', error);
        alert('No se pudo conectar con el servidor.');
      }
    }
  };

  // Función auxiliar para calcular los estilos del Badge de estado
  const obtenerEstiloEstado = (estado) => {
    if (estado?.toUpperCase() === 'CONFIRMADA') {
      return { backgroundColor: '#d4edda', color: '#155724' };
    }
    // Para CANCELADA u otros estados inactivos
    return { backgroundColor: '#e2e3e5', color: '#383d41' };
  };

  if (cargando) {
    return (
      <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Cargando panel de gestión de inscripciones...</h2>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Gestión de Inscripciones</h2>
          <p style={{ color: '#5f6368', marginTop: '5px' }}>Panel de administración y bedelía para el control de alumnos vacantes.</p>
        </div>
        <button className="btn-primary" onClick={abrirModal} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus /> Nueva Inscripción
        </button>
      </div>

      <div className="table-container" style={{ marginTop: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0', color: '#5f6368', fontWeight: '600' }}>
              <th style={{ padding: '16px' }}>Nombre Alumno</th>
              <th style={{ padding: '16px' }}>Materia</th>
              <th style={{ padding: '16px' }}>Estado</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inscripciones.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: '#5f6368' }}>
                  No se registran inscripciones vigentes en el sistema.
                </td>
              </tr>
            ) : (
              inscripciones.map((inscripcion) => {
                const esCancelada = inscripcion.estado_nombre?.toUpperCase() === 'CANCELADA';
                const badgeEstilo = obtenerEstiloEstado(inscripcion.estado_nombre);

                return (
                  <tr key={inscripcion.id_inscripcion} style={{ borderBottom: '1px solid #e0e0e0', color: '#202124', opacity: esCancelada ? 0.75 : 1 }}>
                    <td style={{ padding: '16px', fontWeight: esCancelada ? 'normal' : '500' }}>{inscripcion.nombre_estudiante}</td>
                    <td style={{ padding: '16px' }}>{inscripcion.nombre_curso}</td>
                    <td style={{ padding: '16px' }}>
                      <span className="badge" style={{ ...badgeEstilo, padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                        {inscripcion.estado_nombre}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => manejarEliminarInscripcion(inscripcion.id_inscripcion, inscripcion.nombre_estudiante)}
                        disabled={esCancelada}
                        style={{
                          backgroundColor: esCancelada ? '#e0e0e0' : '#ef4444',
                          color: esCancelada ? '#a0a0a0' : 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: esCancelada ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <FiTrash2 /> Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '24px', borderRadius: '8px',
            width: '90%', maxWidth: '460px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            textAlign: 'left', animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{
              backgroundColor: '#e8f0fe', color: '#1a73e8', width: '48px', height: '48px',
              borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center',
              marginBottom: '16px', fontSize: '20px'
            }}>
              <FiUserPlus />
            </div>

            <h3 style={{ fontSize: '18px', color: '#202124', marginBottom: '16px' }}>Registrar Nueva Inscripción</h3>
            
            <form onSubmit={manejarCrearInscripcion}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#3c4043', marginBottom: '6px' }}>Estudiante</label>
                <select
                  name="id_estudiante"
                  value={datosFormulario.id_estudiante}
                  onChange={handleChangeFormulario}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #dadce0', fontSize: '14px', backgroundColor: 'white' }}
                  required
                >
                  <option value="">-- Seleccionar Estudiante --</option>
                  {estudiantes.map((e) => (
                    <option key={e.id_estudiante} value={e.id_estudiante}>
                      {e.nombre_completo}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#3c4043', marginBottom: '6px' }}>Curso / Materia</label>
                <select
                  name="id_curso"
                  value={datosFormulario.id_curso}
                  onChange={handleChangeFormulario}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #dadce0', fontSize: '14px', backgroundColor: 'white' }}
                  required
                >
                  <option value="">-- Seleccionar Curso --</option>
                  {cursos.map((c) => (
                    <option key={c.id_curso} value={c.id_curso}>
                      {c.nombre} (Máx: {c.inscriptos_max})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={cerrarModal}
                  style={{
                    padding: '10px 16px', backgroundColor: '#f1f3f4', color: '#3c4043',
                    border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '14px'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 16px', backgroundColor: '#1a73e8', color: 'white',
                    border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500',
                    fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <FiCheck /> Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inscripciones;