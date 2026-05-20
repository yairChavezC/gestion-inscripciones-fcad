import React, { useState } from 'react';
// Importación de íconos para la representación visual de los datos del curso
import { FiBookOpen, FiUsers, FiClock, FiMapPin, FiUser, FiArrowRight, FiPlus } from 'react-icons/fi';
import './Cursos.css';
import { useNavigate } from 'react-router-dom';

/**
 * Componente Cursos:
 * Renderiza el catálogo de materias disponibles. 
 * Actualmente utiliza datos estáticos (mock data) que serán reemplazados por 
 * llamadas a la API del backend en el futuro.
 */
const Cursos = () => {
  const navigate = useNavigate();
  // Simulación de respuesta de base de datos (Estructura de objeto para cada curso)
  const [listaCursos, setCursos]= useState([
    { id: 1, nombre: 'React Avanzado', depto: 'Informática', estado: 'Vigente', alumnos: 45, semanas: 12, campus: 'Campus Virtual', prof: 'Lic. Martin Vera' },
    { id: 2, nombre: 'Bases de Datos II', depto: 'Informática', estado: 'Vigente', alumnos: 32, semanas: 10, campus: 'Campus Virtual', prof: 'Ing. Ana Soria' },
    { id: 3, nombre: 'Derecho Civil I', depto: 'Derecho', estado: 'Inactivo', alumnos: 120, semanas: 16, campus: 'Campus Virtual', prof: 'Dr. Roberto Gomez' },
    { id: 4, nombre: 'Anatomía Humana', depto: 'Medicina', estado: 'Vigente', alumnos: 85, semanas: 20, campus: 'Campus Virtual', prof: 'Dra. Julia Ruiz' },
  ]);


  // Estado para el Modal 
  const [modal, setModal] = useState({ tipo: null, datos: null });


  const handleEditar = (curso) => {
    setModal({ 
      tipo: 'editar', 
      datos: { 
        id_curso: curso.id, 
        nombre: curso.nombre, 
        descripcion: curso.descripcion, 
        fecha_inicio: curso.fecha_inicio, 
        cantidad_horas: curso.semanas, 
        inscriptos_max: curso.alumnos 
      } 
    });
  };

  const cerrarModal = () => setModal({ tipo: null, datos: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModal({
      ...modal,
      datos: { ...modal.datos, [name]: value }
    });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    
    try {
      const respuesta = await fetch(`http://localhost:4000/api/cursos/${modal.datos.id_curso}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modal.datos)
      });

      if (respuesta.ok) {
        alert('Curso actualizado con éxito');
        
        // Actualiza la lista 
        const nuevosCursos = listaCursos.map(c => {
          if (c.id === modal.datos.id_curso) {
            return { 
              ...c, 
              nombre: modal.datos.nombre,
              descripcion: modal.datos.descripcion,
              alumnos: modal.datos.inscriptos_max,
              semanas: modal.datos.cantidad_horas
            };
          }
          return c;
        });
        setCursos(nuevosCursos);
        cerrarModal();
      } else {
        alert('Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo conectar con el servidor.');
    }
  };

  //Botón suspender y activar
  const handleSuspender = (id) => {
    const nuevosCursos = listaCursos.map(curso => {
      if (curso.id === id) {
        return { ...curso, estado: curso.estado === 'Vigente' ? 'Inactivo' : 'Vigente' };
      }
      return curso;
    });
    setCursos(nuevosCursos);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2>Mis Cursos</h2>
          <p style={{ color: '#5f6368', marginTop: '5px' }}>Cursos en los que estoy Inscripto.</p>
        </div>
        
        {/* 
          3. Agregamos el evento onClick:
          Al hacer clic, ejecutamos navigate('/inscripciones') para saltar a la 
          pantalla de oferta académica sin recargar la página.
        */}
        <button 
          className="btn-primary" 
          onClick={() => navigate('/inscripciones')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FiPlus /> Nuevo Curso
        </button>
      </div>

      {/* 
        Grilla de tarjetas (Grid System):
        Se utiliza el método .map() para iterar sobre 'listaCursos' y generar 
        un componente visual por cada objeto en el arreglo.
      */}
      <div className="cards-grid">
        {listaCursos.map((curso) => (
          /* Es obligatorio usar 'key' con un ID único para que React gestione los cambios de forma eficiente */
          <div className="course-card" key={curso.id}>
            
            {/* Cabecera de la Tarjeta: Icono, nombre y badge de estado */}
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon"><FiBookOpen /></div>
                <div>
                  <h3 style={{ fontSize: '16px' }}>{curso.nombre}</h3>
                  <span style={{ color: '#5f6368', fontSize: '13px' }}>{curso.depto}</span>
                </div>
              </div>
              {/* 
                Badge Dinámico: La clase CSS cambia según el estado (vigente/inactivo) 
                usando toLowerCase() para coincidir con los selectores del CSS.
              */}
              <span className={`badge ${curso.estado.toLowerCase()}`}>
                {curso.estado.toUpperCase()}
              </span>
            </div>

            {/* Cuerpo de la Tarjeta: Información técnica y administrativa del curso */}
            <div className="card-info">
              <div><FiUsers /> {curso.alumnos} Alumnos</div>
              <div><FiClock /> {curso.semanas} Semanas</div>
              <div><FiMapPin /> {curso.campus}</div>
              <div style={{ color: '#1a73e8' }}><FiUser /> {curso.prof}</div>
            </div>

            {/* 
              Pie de la Tarjeta: Acciones de gestión (CRUD). 
              Estas funciones permitirán interactuar con el backend de la facultad.
            */}
            <div className="card-actions">
              <div className="action-links">
                {/* El botón Editar abre el editor*/}
                <span className="link-edit" onClick={() => handleEditar(curso)} style={{cursor: 'pointer'}}>
                  Editar
                </span>
                {/* Botón suspender y activar */}
                <span className="link-suspend" onClick={() => handleSuspender(curso.id)}>
                  {curso.estado === 'Vigente' ? 'Suspender' : 'Activar'}
                </span>
              </div>
              <span className="link-view">
                Ver Programa <FiArrowRight />
              </span>
            </div>
            
          </div>
        ))}
      </div>

      {/*VENTANA DE EDICIÓN*/}
      {modal.tipo === 'editar' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edición de curso</h3>
              <button className="btn-close" onClick={cerrarModal}>&times;</button>
            </div>

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
              
              <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ backgroundColor: '#1a73e8' }}>
                  Guardar
                </button>
                <button type="button" className="btn-primary" style={{ backgroundColor: '#dc3545' }} onClick={cerrarModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cursos;
