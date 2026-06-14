import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiUsers, FiClock, FiMapPin, FiUser, FiArrowRight, FiPlus } from 'react-icons/fi';
import './Cursos.css';
import { useNavigate } from 'react-router-dom';

const Cursos = () => {
  const navigate = useNavigate();
  const [listaCursos, setCursos] = useState([]); // Iniciamos vacío
  const [modal, setModal] = useState({ tipo: null, datos: null });

  // 1. Cargar datos del backend al iniciar
  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/cursos');
        const data = await res.json();
        // Ajustamos según la estructura que definiste en tu backend (data.cursos)
        setCursos(data.cursos);
      } catch (error) {
        console.error("Error al cargar cursos:", error);
      }
    };
    cargarCursos();
  }, []);

  const handleEditar = (curso) => {
    setModal({ 
      tipo: 'editar', 
      datos: { 
        id_curso: curso.id_curso, // Asegúrate de usar los nombres de tu DB
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        fecha_inicio: curso.fecha_inicio ? curso.fecha_inicio.split('T')[0] : '',
        cantidad_horas: curso.cantidad_horas,
        inscriptos_max: curso.inscriptos_max 
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
        // Recargamos la lista después de guardar
        window.location.reload(); 
        cerrarModal();
      } else {
        alert('Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="page-content">
      {/* ... header y botón ... */}
      
      <div className="cards-grid">
        {listaCursos.map((curso) => (
          <div className="course-card" key={curso.id_curso}>
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon"><FiBookOpen /></div>
                <div>
                  <h3 style={{ fontSize: '16px' }}>{curso.nombre}</h3>
                  <span style={{ color: '#5f6368', fontSize: '13px' }}>{curso.estado_nombre}</span>
                </div>
              </div>
              <span className={`badge ${curso.estado_nombre?.toLowerCase()}`}>
                {curso.estado_nombre?.toUpperCase()}
              </span>
            </div>

            <div className="card-info">
              <div><FiUsers /> {curso.inscriptos_max} Inscriptos Máx</div>
              <div><FiClock /> {curso.cantidad_horas} Horas</div>
              <div style={{ color: '#1a73e8' }}>Profesor ID: {curso.id_usuario_modificacion}</div>
            </div>

            <div className="card-actions">
              <span className="link-edit" onClick={() => handleEditar(curso)} style={{cursor: 'pointer'}}>Editar</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* ... resto del modal ... */}
    </div>
  );
};

export default Cursos;