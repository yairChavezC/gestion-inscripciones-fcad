import React, { useState, useEffect, useCallback } from 'react';
import { FiUsers, FiSearch, FiPlusCircle, FiEye, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Estudiantes.css';

const API_URL = 'http://localhost:4000/api/estudiantes';

const FORM_VACIO = {
    documento: '',
    apellido: '',
    nombres: '',
    email: '',
    fecha_nacimiento: ''
};

const Estudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalEstudiantes: 0 });
    const [modal, setModal] = useState({ tipo: null, datos: null });
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const cargarEstudiantes = useCallback(async (page = 1, busqueda = '') => {
        setCargando(true);
        try {
            const res = await fetch(`${API_URL}?page=${page}&search=${busqueda}`);
            if (!res.ok) throw new Error('Error al conectar con el servidor');
            const data = await res.json();
            setEstudiantes(data.estudiantes);
            setPagination(data.pagination);
        } catch (err) {
            setError('No se pudo cargar la lista de estudiantes.');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarEstudiantes(pagination.currentPage, search);
    }, [search, pagination.currentPage]); // eslint-disable-line

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const abrirVer = async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`);
            const datos = await res.json();
            setModal({ tipo: 'ver', datos });
        } catch {
            setError('No se pudo cargar el estudiante.');
        }
    };

    const abrirEditar = async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`);
            const datos = await res.json();
            const fechaFormateada = datos.fecha_nacimiento
                ? new Date(datos.fecha_nacimiento).toISOString().split('T')[0]
                : '';
            setModal({ tipo: 'editar', datos: { ...datos, fecha_nacimiento: fechaFormateada } });
        } catch {
            setError('No se pudo cargar el estudiante.');
        }
    };

    const abrirCrear = () => {
        setModal({ tipo: 'crear', datos: { ...FORM_VACIO } });
    };

    const cerrarModal = () => {
        setModal({ tipo: null, datos: null });
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setModal(prev => ({ ...prev, datos: { ...prev.datos, [name]: value } }));
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        setError('');
        const esEdicion = modal.tipo === 'editar';
        const url = esEdicion ? `${API_URL}/${modal.datos.id_estudiante}` : API_URL;
        const metodo = esEdicion ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(modal.datos)
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.mensaje || 'Error al guardar');
                return;
            }

            setExito(esEdicion ? 'Estudiante actualizado con éxito.' : 'Estudiante creado con éxito.');
            cerrarModal();
            cargarEstudiantes(pagination.currentPage, search);
            setTimeout(() => setExito(''), 3000);
        } catch {
            setError('No se pudo conectar con el servidor.');
        }
    };

    const handleEliminar = async (id, nombreCompleto) => {
        if (!window.confirm(`¿Confirmás que querés eliminar a ${nombreCompleto}? Esta acción es irreversible.`)) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (!res.ok) {
                setError(data.mensaje || 'Error al eliminar');
                return;
            }

            setExito('Estudiante eliminado correctamente.');
            cargarEstudiantes(pagination.currentPage, search);
            setTimeout(() => setExito(''), 3000);
        } catch {
            setError('No se pudo conectar con el servidor.');
        }
    };

    const irAPagina = (nuevaPagina) => {
        if (nuevaPagina < 1 || nuevaPagina > pagination.totalPages) return;
        setPagination(prev => ({ ...prev, currentPage: nuevaPagina }));
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <div className="page-title-group">
                    <div className="page-icon est-icon"><FiUsers /></div>
                    <div>
                        <h1>Estudiantes</h1>
                        <p>Gestión de estudiantes registrados en el sistema.</p>
                    </div>
                </div>
                <button className="btn-primary" onClick={abrirCrear}>
                    <FiPlusCircle /> Nuevo Estudiante
                </button>
            </div>

            {exito && <div className="msg-exito">{exito}</div>}
            {error && !modal.tipo && <div className="msg-error">{error}</div>}

            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Buscar por apellido, nombre o documento..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit"><FiSearch /> Buscar</button>
            </form>

            <div className="table-container">
                {cargando ? (
                    <p className="estado-carga">Cargando...</p>
                ) : estudiantes.length === 0 ? (
                    <p className="estado-carga">No se encontraron estudiantes.</p>
                ) : (
                    <table className="est-table">
                        <thead>
                            <tr>
                                <th>Documento</th>
                                <th>Apellido y Nombre</th>
                                <th>Email</th>
                                <th>F. Nacimiento</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {estudiantes.map((est) => (
                                <tr key={est.id_estudiante}>
                                    <td>{est.documento}</td>
                                    <td><strong>{est.apellido}</strong>, {est.nombres}</td>
                                    <td>{est.email || '—'}</td>
                                    <td>{est.fecha_nacimiento ? new Date(est.fecha_nacimiento).toLocaleDateString('es-AR') : '—'}</td>
                                    <td>
                                        <div className="acciones">
                                            <button className="btn-accion ver" title="Ver detalle" onClick={() => abrirVer(est.id_estudiante)}>
                                                <FiEye />
                                            </button>
                                            <button className="btn-accion editar" title="Editar" onClick={() => abrirEditar(est.id_estudiante)}>
                                                <FiEdit />
                                            </button>
                                            <button className="btn-accion eliminar" title="Eliminar" onClick={() => handleEliminar(est.id_estudiante, `${est.apellido}, ${est.nombres}`)}>
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {pagination.totalPages > 1 && (
                <div className="paginacion">
                    <span className="pag-info">
                        Página {pagination.currentPage} de {pagination.totalPages} — {pagination.totalEstudiantes} estudiantes
                    </span>
                    <div className="pag-botones">
                        <button onClick={() => irAPagina(pagination.currentPage - 1)} disabled={pagination.currentPage === 1}>
                            <FiChevronLeft />
                        </button>
                        <button onClick={() => irAPagina(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages}>
                            <FiChevronRight />
                        </button>
                    </div>
                </div>
            )}

            {modal.tipo && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                {modal.tipo === 'ver' && 'Detalle del Estudiante'}
                                {modal.tipo === 'editar' && 'Editar Estudiante'}
                                {modal.tipo === 'crear' && 'Nuevo Estudiante'}
                            </h3>
                            <button className="btn-close" onClick={cerrarModal}>&times;</button>
                        </div>

                        {error && <div className="msg-error" style={{ marginBottom: '15px' }}>{error}</div>}

                        {modal.tipo === 'ver' && (
                            <div>
                                <div className="detalle-fila"><strong>Documento:</strong> <span>{modal.datos.documento}</span></div>
                                <div className="detalle-fila"><strong>Apellido:</strong> <span>{modal.datos.apellido}</span></div>
                                <div className="detalle-fila"><strong>Nombres:</strong> <span>{modal.datos.nombres}</span></div>
                                <div className="detalle-fila"><strong>Email:</strong> <span>{modal.datos.email || '—'}</span></div>
                                <div className="detalle-fila"><strong>F. Nacimiento:</strong>
                                    <span>{modal.datos.fecha_nacimiento ? new Date(modal.datos.fecha_nacimiento).toLocaleDateString('es-AR') : '—'}</span>
                                </div>
                                <div className="modal-actions">
                                    <button className="btn-primary" style={{ backgroundColor: '#6c757d' }} onClick={cerrarModal}>Cerrar</button>
                                </div>
                            </div>
                        )}

                        {(modal.tipo === 'editar' || modal.tipo === 'crear') && (
                            <form onSubmit={handleGuardar}>
                                <div className="form-group">
                                    <label>Documento (DNI) *</label>
                                    <input type="text" name="documento" value={modal.datos.documento} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Apellido *</label>
                                    <input type="text" name="apellido" value={modal.datos.apellido} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Nombres *</label>
                                    <input type="text" name="nombres" value={modal.datos.nombres} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" name="email" value={modal.datos.email} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Fecha de Nacimiento</label>
                                    <input type="date" name="fecha_nacimiento" value={modal.datos.fecha_nacimiento} onChange={handleChange} />
                                </div>
                                <div className="modal-actions">
                                    <button type="submit" className="btn-primary">Guardar</button>
                                    <button type="button" className="btn-primary" style={{ backgroundColor: '#dc3545' }} onClick={cerrarModal}>Cancelar</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Estudiantes;