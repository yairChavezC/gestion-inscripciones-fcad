import React from 'react';
// Importamos íconos para la info de las tarjetas y el ícono de 'Plus' para la inscripción
import { FiBookOpen, FiUsers, FiClock, FiMapPin, FiUser, FiPlusCircle } from 'react-icons/fi';
import './Inscripciones.css';

/**
 * Componente Inscripciones (Rediseñado):
 * Muestra el catálogo de cursos disponibles para matriculación utilizando el sistema de tarjetas.
 * Permite al usuario visualizar la oferta académica y seleccionar un curso para inscribirse.
 */
const Inscripciones = () => {
  // Datos simulados de cursos disponibles (Oferta académica actual)
  // Nota: En la integración final, estos datos vendrán de una consulta SELECT al backend.
  const cursosDisponibles = [
    { id: 5, nombre: 'Programación IV', depto: 'Informática', alumnos: 20, semanas: 16, campus: 'FCAD - Concordia', prof: 'Lic. Cristian Pacifico' },
    { id: 6, nombre: 'Sistemas Operativos', depto: 'Informática', alumnos: 15, semanas: 12, campus: 'FCAD - Concordia', prof: 'Ing. Silvia Ruiz' },
    { id: 7, nombre: 'Redes de Datos', depto: 'Informática', alumnos: 25, semanas: 14, campus: 'Virtual', prof: 'Ing. Roberto Sanchez' },
    { id: 8, nombre: 'Inglés Técnico', depto: 'Idiomas', alumnos: 50, semanas: 8, campus: 'Virtual', prof: 'Trad. Maria Lopez' },
  ];

  /**
   * handleInscripcion:
   * Función para procesar el clic en el botón de inscripción de una tarjeta específica.
   */
  const handleInscripcion = (cursoNombre) => {
    // Por ahora, manejamos la acción con un feedback visual simple.
    alert(`Solicitud enviada para: ${cursoNombre}\nPróximamente se conectará con el endpoint POST de la API.`);
  };

  return (
    <div className="page-content">
      {/* Encabezado de la sección de Oferta Académica */}
      <div className="page-header">
        <div>
          <h2>Oferta Académica</h2>
          <p style={{ color: '#5f6368', marginTop: '5px' }}>Seleccioná una materia para realizar tu inscripción al ciclo lectivo.</p>
        </div>
      </div>

      {/* Grilla de Cursos Disponibles: Reutilizamos la lógica visual de las tarjetas */}
      <div className="cards-grid">
        {cursosDisponibles.map((curso) => (
          <div className="course-card" key={curso.id}>
            
            {/* Cabecera: Info básica del curso disponible */}
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ backgroundColor: '#e8f0fe', color: '#1a73e8' }}>
                  <FiBookOpen />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px' }}>{curso.nombre}</h3>
                  <span style={{ color: '#5f6368', fontSize: '13px' }}>{curso.depto}</span>
                </div>
              </div>
              {/* Badge indicativo de vacantes o disponibilidad */}
              <span className="badge vigente">DISPONIBLE</span>
            </div>

            {/* Detalles técnicos de la materia */}
            <div className="card-info">
              <div><FiUsers /> {curso.alumnos} Inscriptos</div>
              <div><FiClock /> {curso.semanas} Semanas</div>
              <div><FiMapPin /> {curso.campus}</div>
              <div style={{ color: '#1a73e8' }}><FiUser /> {curso.prof}</div>
            </div>

            {/* Acción principal: Botón de Inscripción */}
            <div className="card-actions" style={{ justifyContent: 'center' }}>
              <button 
                className="btn-primary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => handleInscripcion(curso.nombre)}
              >
                <FiPlusCircle /> Inscribirme a esta materia
              </button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inscripciones;