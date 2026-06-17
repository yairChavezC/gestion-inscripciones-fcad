import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiUsers, FiClock, FiPlus, FiEye, FiEdit, FiTrash2, FiAward, FiX } from 'react-icons/fi';
import './Cursos.css';
import { useNavigate } from 'react-router-dom';

const Cursos = () => {
  const navigate = useNavigate();
  
  // --- ESTADOS PRINCIPALES ---
  const [listaCursos, setCursos] = useState([]);
  const [modal, setModal] = useState({ tipo: null, datos: null });
  
  // --- ESTADOS PARA PAGINACIÓN Y BÚSQUEDA ---
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(0); 
  const [totalRegistros, setTotalRegistros] = useState(0);
  const limite = 4; 

  // --- ESTADOS PARA EL DIPLOMA ---
  const [listaEstudiantes, setListaEstudiantes] = useState([]);
  const [modalDiploma, setModalDiploma] = useState({ visible: false, idCurso: null, nombreAlumno: '' });

  // --- CARGA DE CURSOS ---
  const cargarCursos = async () => {
    try {
      const offset = paginaActual * limite;
      const url = `http://localhost:4000/api/cursos?limit=${limite}&offset=${offset}&search=${busqueda}`;
      
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setCursos(data.cursos);
        setTotalRegistros(data.pagination?.count || 0);
      } else {
        console.error("No autorizado o token vencido");
      }
    } catch (error) {
      console.error("Error al cargar cursos:", error);
    }
  };

  useEffect(() => {
    cargarCursos();
  }, [paginaActual]); 

  // --- MANEJO DEL MODAL PRINCIPAL (Cursos) ---
  const cerrarModal = () => setModal({ tipo: null, datos: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModal({
      ...modal,
      datos: { ...modal.datos, [name]: value }
    });
  };

  const handleCrearModal = () => {
    setModal({
      tipo: 'crear',
      datos: { nombre: '', descripcion: '', fecha_inicio: '', cantidad_horas: '', inscriptos_max: '' }
    });
  };

  const handleDetalles = (curso) => setModal({ tipo: 'detalles', datos: curso });

  const handleEditar = (curso) => {
    setModal({ 
      tipo: 'editar', 
      datos: { 
        id_curso: curso.id_curso,
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        fecha_inicio: curso.fecha_inicio ? curso.fecha_inicio.split('T')[0] : '',
        cantidad_horas: curso.cantidad_horas,
        inscriptos_max: curso.inscriptos_max 
      } 
    });
  };

  const handleEliminar = async (id_curso) => {
    if (!window.confirm("¿Estás seguro de que deseas dar de baja este curso?")) return;
    try {
      const respuesta = await fetch(`http://localhost:4000/api/cursos/${id_curso}`, {
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (respuesta.ok) {
        alert('Curso dado de baja exitosamente');
        cargarCursos();
      } else {
        alert('Error al dar de baja el curso');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const esCreacion = modal.tipo === 'crear';
    const url = esCreacion 
      ? `http://localhost:4000/api/cursos` 
      : `http://localhost:4000/api/cursos/${modal.datos.id_curso}`;
    
    try {
      const respuesta = await fetch(url, {
        method: esCreacion ? 'POST' : 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(modal.datos)
      });

      if (respuesta.ok) {
        alert(esCreacion ? 'Curso creado con éxito' : 'Curso actualizado con éxito');
        cargarCursos(); 
        cerrarModal();
      } else {
        alert('Error al guardar el curso');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // --- LÓGICA DEL DIPLOMA ---
  const cargarEstudiantes = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/estudiantes?limit=1000`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setListaEstudiantes(data.estudiantes || []);
      }
    } catch (error) {
      console.error("Error al cargar estudiantes para el modal:", error);
    }
  };

  const abrirModalDiploma = (id_curso) => {
    setModalDiploma({ visible: true, idCurso: id_curso, nombreAlumno: '' });
    if (listaEstudiantes.length === 0) {
        cargarEstudiantes(); 
    }
  };

  const descargarDiplomaReal = async (e) => {
    e.preventDefault();
    try {
      alert(`Generando diploma para ${modalDiploma.nombreAlumno}...`);
      
      const urlDiploma = `http://localhost:4000/api/cursos/diploma/${modalDiploma.idCurso}?alumno=${encodeURIComponent(modalDiploma.nombreAlumno)}`;
      
      const respuesta = await fetch(urlDiploma, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!respuesta.ok) throw new Error("Error al generar el PDF");

      const blob = await respuesta.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Diploma-${modalDiploma.nombreAlumno}.pdf`); 
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setModalDiploma({ visible: false, idCurso: null, nombreAlumno: '' });
      
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al descargar el diploma');
    }
  };

  // --- RENDER DEL COMPONENTE ---
  return (
    <div className="page-content">
      
      <div className="page-header">
        <h2>Gestión de Cursos</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #dadce0', outline: 'none' }}
          />
          <button 
            className="btn-primary"
            style={{ backgroundColor: '#5f6368' }}
            onClick={() => { setPaginaActual(0); cargarCursos(); }}
          >
            Buscar
          </button>
        </div>
        <button className="btn-primary" onClick={handleCrearModal} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
           <FiPlus /> Nuevo Curso
        </button>
      </div>
      
      <div className="cards-grid">
        {listaCursos.map((curso) => (
          <div className="course-card" key={curso.id_curso}>
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon"><FiBookOpen /></div>
                <div><h3 style={{ fontSize: '16px', margin: 0 }}>{curso.nombre}</h3></div>
              </div>
              <span className={`badge ${curso.estado_nombre?.toLowerCase()}`}>
                {curso.estado_nombre?.toUpperCase()}
              </span>
            </div>

            <div className="card-info" style={{ marginTop: '15px', marginBottom: '15px' }}>
              <div><FiUsers style={{ marginRight: '5px' }} /> {curso.inscriptos_max} Inscriptos Máx</div>
              <div><FiClock style={{ marginRight: '5px' }} /> {curso.cantidad_horas} Horas</div>
            </div>

            <div className="card-actions">
              <button className="btn-action btn-detalles" onClick={() => handleDetalles(curso)} title="Ver Detalles"><FiEye /></button>
              <button className="btn-action btn-editar" onClick={() => handleEditar(curso)} title="Editar Curso"><FiEdit /></button>
              <button className="btn-action btn-baja" onClick={() => handleEliminar(curso.id_curso)} title="Dar de Baja"><FiTrash2 /></button>
              {/* ACÁ ENLAZAMOS EL BOTÓN AL NUEVO MODAL */}
              <button className="btn-action btn-diploma" onClick={() => abrirModalDiploma(curso.id_curso)} title="Generar Diploma"><FiAward /></button>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
        <button disabled={paginaActual === 0} onClick={() => setPaginaActual(paginaActual - 1)} style={{ padding: '8px 15px', cursor: paginaActual === 0 ? 'not-allowed' : 'pointer', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: paginaActual === 0 ? '#f5f5f5' : 'white' }}>Anterior</button>
        <span style={{ alignSelf: 'center', fontWeight: 'bold' }}>Página {paginaActual + 1}</span>
        <button disabled={(paginaActual + 1) * limite >= totalRegistros} onClick={() => setPaginaActual(paginaActual + 1)} style={{ padding: '8px 15px', cursor: (paginaActual + 1) * limite >= totalRegistros ? 'not-allowed' : 'pointer', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: (paginaActual + 1) * limite >= totalRegistros ? '#f5f5f5' : 'white' }}>Siguiente</button>
      </div>

      {/* --- MODAL PRINCIPAL (Crear/Editar/Detalles) --- */}
      {modal.tipo && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal.tipo === 'crear' ? 'Crear Nuevo Curso' : modal.tipo === 'editar' ? 'Editar Curso' : 'Detalles del Curso'}</h3>
              <button onClick={cerrarModal} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#5f6368' }}><FiX /></button>
            </div>
            
            {modal.tipo === 'detalles' ? (
              <div>
                <div className="form-group"><label>Nombre del Curso</label><p style={{margin: '5px 0 15px'}}>{modal.datos.nombre}</p></div>
                <div className="form-group"><label>Descripción</label><p style={{margin: '5px 0 15px'}}>{modal.datos.descripcion}</p></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group"><label>Fecha de Inicio</label><p style={{margin: '5px 0'}}>{modal.datos.fecha_inicio ? modal.datos.fecha_inicio.split('T')[0] : 'No definida'}</p></div>
                  <div className="form-group"><label>Horas</label><p style={{margin: '5px 0'}}>{modal.datos.cantidad_horas} hrs</p></div>
                  <div className="form-group"><label>Cupo Máximo</label><p style={{margin: '5px 0'}}>{modal.datos.inscriptos_max} alumnos</p></div>
                </div>
                <div className="modal-footer"><button className="btn-cancelar" onClick={cerrarModal}>Cerrar</button></div>
              </div>
            ) : (
              <form onSubmit={handleGuardar}>
                <div className="form-group"><label>Nombre del Curso</label><input required type="text" name="nombre" value={modal.datos.nombre} onChange={handleChange} /></div>
                <div className="form-group"><label>Descripción</label><textarea name="descripcion" value={modal.datos.descripcion} onChange={handleChange} /></div>
                <div className="form-group"><label>Fecha de Inicio</label><input required type="date" name="fecha_inicio" value={modal.datos.fecha_inicio} onChange={handleChange} /></div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}><label>Horas Totales</label><input required type="number" name="cantidad_horas" value={modal.datos.cantidad_horas} onChange={handleChange} /></div>
                  <div className="form-group" style={{ flex: 1 }}><label>Cupo Máximo</label><input required type="number" name="inscriptos_max" value={modal.datos.inscriptos_max} onChange={handleChange} /></div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-cancelar" onClick={cerrarModal}>Cancelar</button>
                  <button type="submit" className="btn-primary">Guardar Curso</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL PARA EL DIPLOMA --- */}
      {modalDiploma.visible && (
        <div className="modal-overlay" onClick={() => setModalDiploma({ visible: false, idCurso: null, nombreAlumno: '' })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Emitir Certificado</h3>
              <button onClick={() => setModalDiploma({ visible: false, idCurso: null, nombreAlumno: '' })} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#5f6368' }}>
                <FiX />
              </button>
            </div>
            <form onSubmit={descargarDiplomaReal}>
              <div className="form-group">
                <label>Seleccione el alumno:</label>
                <select 
                  required 
                  value={modalDiploma.nombreAlumno} 
                  onChange={(e) => setModalDiploma({ ...modalDiploma, nombreAlumno: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="">-- Elija un estudiante --</option>
                  {listaEstudiantes.map((est) => (
                    <option key={est.id_estudiante} value={`${est.nombres} ${est.apellido}`}>
                      {est.apellido}, {est.nombres} (DNI: {est.documento})
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer" style={{ marginTop: '20px' }}>
                <button type="button" className="btn-cancelar" onClick={() => setModalDiploma({ visible: false, idCurso: null, nombreAlumno: '' })}>Cancelar</button>
                <button type="submit" className="btn-primary">Generar PDF</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Cursos;