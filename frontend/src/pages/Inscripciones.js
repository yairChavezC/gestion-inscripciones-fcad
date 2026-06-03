import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiUsers, FiClock, FiCalendar, FiPlusCircle, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import './Inscripciones.css';

const Inscripciones = () => {
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estado para controlar el Modal. 
  // 'tipo' puede ser: null (cerrado), 'ver', 'editar' o 'crear'.
  // 'datos' guarda la información del curso seleccionado.
  const [modal, setModal] = useState({ tipo: null, datos: null });

  useEffect(() => {
    const obtenerOfertaAcademica = async () => {
      try {
        const respuesta = await fetch('http://localhost:4000/api/cursos');
        if (!respuesta.ok) throw new Error('Error en la respuesta del servidor');
        const json = await respuesta.json();
        setCursosDisponibles(json.cursos || []);
      } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerOfertaAcademica();
  }, []);

  // ==========================================
  // HANDLERS PARA ABRIR EL MODAL
  // ==========================================
  const handleInscripcion = (cursoNombre) => {
    alert(`Solicitud de inscripción enviada para: ${cursoNombre}`);
  };

  const handleAgregarCurso = () => {
    // Para crear, abrimos el modal con datos vacíos
    setModal({
      tipo: 'crear',
      datos: { nombre: '', descripcion: '', fecha_inicio: '', cantidad_horas: '', inscriptos_max: '', estado_nombre: 'BORRADOR' }
    });
  };

  const handleVer = (curso) => {
    // Pasamos todo el objeto del curso al estado del modal
    setModal({ tipo: 'ver', datos: curso });
  };

  const handleEditar = (curso) => {
    // Formateamos la fecha para que el input type="date" la entienda (YYYY-MM-DD)
    const fechaFormateada = new Date(curso.fecha_inicio).toISOString().split('T')[0];
    setModal({ tipo: 'editar', datos: { ...curso, fecha_inicio: fechaFormateada } });
  };

  const handleEliminar = async (id) => {
    // Le pedimos confirmación al usuario antes de borrar
    if (window.confirm('¿Estás seguro de que querés eliminar este curso? Esta acción no se puede deshacer.')) {
      try {
        // Hacemos la petición con el método DELETE
        const respuesta = await fetch(`http://localhost:4000/api/cursos/${id}`, {
          method: 'DELETE',
        });

        if (respuesta.ok) {
          alert('Curso eliminado con éxito');
          window.location.reload(); // Recargamos la página para ver que el curso desapareció
        } else {
          const errorData = await respuesta.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('No se pudo conectar con el servidor');
      }
    }
  };

  const cerrarModal = () => {
    setModal({ tipo: null, datos: null });
  };

  // ==========================================
  // HANDLERS PARA EL FORMULARIO (EDICIÓN/CREACIÓN)
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Actualizamos solo el campo que el usuario está escribiendo
    setModal({
      ...modal,
      datos: { ...modal.datos, [name]: value }
    });
  };

  const handleGuardar = async (e) => {
  e.preventDefault();
  
  const esEdicion = modal.tipo === 'editar';
  const url = esEdicion 
    ? `http://localhost:4000/api/cursos/${modal.datos.id_curso}` 
    : 'http://localhost:4000/api/cursos';
  
  const metodo = esEdicion ? 'PUT' : 'POST';

  try {
    const respuesta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modal.datos)
    });

    if (respuesta.ok) {
      alert(esEdicion ? 'Curso actualizado con éxito' : 'Curso creado con éxito');
      cerrarModal();
      
      // Truco: Recargamos la lista para ver los cambios reflejados
      window.location.reload(); 
    } else {
      const errorData = await respuesta.json();
      alert(`Error: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error al guardar:', error);
    alert('No se pudo conectar con el servidor');
  }
};

  if (cargando) {
    return (
      <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Cargando oferta académica...</h2>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Oferta Académica</h2>
          <p style={{ color: '#5f6368', marginTop: '5px' }}>Gestioná los cursos disponibles para el ciclo lectivo.</p>
        </div>
        <button 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1a73e8' }}
          onClick={handleAgregarCurso}
        >
          <FiPlusCircle /> Agregar curso
        </button>
      </div>

      <div className="cards-grid">
        {cursosDisponibles.map((curso) => (
          <div className="course-card" key={curso.id_curso}>
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ backgroundColor: '#e8f0fe', color: '#1a73e8' }}><FiBookOpen /></div>
                <div>
                  <h3 style={{ fontSize: '16px' }}>{curso.nombre}</h3>
                  <span style={{ color: '#5f6368', fontSize: '13px' }}>
                    {curso.descripcion.length > 40 ? curso.descripcion.substring(0, 40) + '...' : curso.descripcion}
                  </span>
                </div>
              </div>
              <span className="badge vigente">{curso.estado_nombre}</span>
            </div>

            <div className="card-info">
              <div><FiUsers /> Cupo: {curso.inscriptos_max}</div>
              <div><FiClock /> {curso.cantidad_horas} Horas</div>
              <div><FiCalendar /> Inicio: {new Date(curso.fecha_inicio).toLocaleDateString()}</div>
            </div>

            <div className="card-actions" style={{ justifyContent: 'center' }}>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleInscripcion(curso.nombre)}>
                Inscribirme
              </button>
            </div>

            {/* Pasamos el objeto 'curso' completo en lugar de solo el ID */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '15px', borderTop: '1px solid #e0e0e0', paddingTop: '15px' }}>
              <button style={{ flex: 1, backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }} onClick={() => handleVer(curso)}>
                <FiEye /> Ver
              </button>
              <button style={{ flex: 1, backgroundColor: '#facc15', color: '#1f2937', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }} onClick={() => handleEditar(curso)}>
                <FiEdit /> Editar
              </button>
              <button style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }} onClick={() => handleEliminar(curso.id_curso)}>
                <FiTrash2 /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ==========================================
          MODAL DINÁMICO (Se muestra solo si modal.tipo no es null)
          ========================================== */}
      {modal.tipo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {modal.tipo === 'ver' && 'Detalle del Curso'}
                {modal.tipo === 'editar' && 'Edición de curso'}
                {modal.tipo === 'crear' && 'Nuevo Curso'}
              </h3>
              <button className="btn-close" onClick={cerrarModal}>&times;</button>
            </div>

            {/* --- CONTENIDO MODO VER --- */}
            {modal.tipo === 'ver' && (
              <div>
                <div className="detalle-fila"><strong>Nombre:</strong> <span>{modal.datos.nombre}</span></div>
                <div className="detalle-fila"><strong>Descripción:</strong> <span>{modal.datos.descripcion}</span></div>
                <div className="detalle-fila"><strong>Fecha Inicio:</strong> <span>{new Date(modal.datos.fecha_inicio).toLocaleDateString()}</span></div>
                <div className="detalle-fila"><strong>Cantidad Horas:</strong> <span>{modal.datos.cantidad_horas}</span></div>
                <div className="detalle-fila"><strong>Máx. Inscriptos:</strong> <span>{modal.datos.inscriptos_max}</span></div>
                <div className="detalle-fila"><strong>Estado:</strong> <span>{modal.datos.estado_nombre}</span></div>
                
                <div className="modal-actions">
                  <button className="btn-primary" style={{ backgroundColor: '#6c757d' }} onClick={cerrarModal}>Cerrar</button>
                </div>
              </div>
            )}

            {/* --- CONTENIDO MODO EDITAR / CREAR --- */}
            {(modal.tipo === 'editar' || modal.tipo === 'crear') && (
              <form onSubmit={handleGuardar}>
                <div className="form-group">
                  <label>Nombre:</label>
                  <input type="text" name="nombre" value={modal.datos.nombre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Descripción:</label>
                  <textarea name="descripcion" value={modal.datos.descripcion} onChange={handleChange} rows="3" required />
                </div>
                <div className="form-group">
                  <label>Inicio:</label>
                  <input type="date" name="fecha_inicio" value={modal.datos.fecha_inicio} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Carga Horaria:</label>
                  <input type="number" name="cantidad_horas" value={modal.datos.cantidad_horas} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Máx. Inscriptos:</label>
                  <input type="number" name="inscriptos_max" value={modal.datos.inscriptos_max} onChange={handleChange} required />
                </div>
                
                <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
                  <button type="submit" className="btn-primary" style={{ backgroundColor: '#007bff' }}>
                    Guardar
                  </button>
                  <button type="button" className="btn-primary" style={{ backgroundColor: '#dc3545' }} onClick={cerrarModal}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inscripciones;