import React, { useState, useEffect } from 'react';
import { FiGrid, FiChevronLeft, FiChevronRight, FiBell, FiUsers, FiBookOpen, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {

    const navigate = useNavigate();
    

    // estados para la bd 

    const [estadisticas, setEstadisticas] = useState({
        totalEstudiantes: 0,
        totalCursos: 0,
        cursosActivos: []
    });
    const [cargando, setCargando] = useState(true);


    const [currentSlide, setCurrentSlide] = useState(0);
    
    
    const imagenesSlider = [
        "/imagen1.png",
        "/imagen2.png",
        "/imagen3.png",
        "/imagen4.png",
        "/imagen5.png"
        
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === imagenesSlider.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? imagenesSlider.length - 1 : prev - 1));
    };

    // Autoplay: se mueve solo cada 5 segundos
    useEffect(() => {
        const intervalo = setInterval(nextSlide, 5000);
        return () => clearInterval(intervalo);
    }, []);

    useEffect(() => {
        const cargarDashboard = async () => {
            try {
                
                const response = await fetch('http://localhost:4000/api/dashboard/resumen');
                if (response.ok) {
                    const data = await response.json();
                    setEstadisticas(data); // Guarda los datos de PostgreSQL
                }
            } catch (error) {
                console.error("Error al cargar el dashboard:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarDashboard();
    }, []);

    //  NOTICIAS 
    const noticias = [
        {
            titulo: "Inscripciones Abiertas",
            contenido: "Se informa que ya se encuentra formalmente habilitado el período de matriculación para participar de esta nueva propuesta de formación. Invitamos a la comunidad académica y a los interesados a completar el formulario de registro correspondiente para asegurar su vacante.",
            footer: "FCAD - 2026"
        },
        {
            titulo: "Viví la UNER en Concordia",
            contenido: "Se llevará a cabo en la ciudad de Concordia la Feria de carreras 'Viví la UNER', una propuesta destinada a estudiantes de los últimos años del nivel secundario y a docentes vinculados a espacios de prácticas educativas.",
            footer: "Comunidad UNER"
        },
        {
            titulo: "Nuevo curso de React avanzado",
            contenido: "Se anuncia el lanzamiento del nuevo curso de React Avanzado, una propuesta académica orientada a estudiantes de sistemas, desarrolladores y profesionales del sector informático que busquen profundizar sus conocimientos en la creación de interfaces escalables y el desarrollo web moderno.",
            footer: "Comunidad UNER"
        }
    ];

    return (
        <div className="page-content">
            <div className="page-header">
                <div className="page-title-group">
                    <div className="page-icon"><FiGrid /></div>
                    <div>
                        <h1 style={{ fontSize: '24px', margin: 0 }}>Panel Principal</h1>
                        <p style={{ color: '#5f6368', margin: 0 }}>Bienvenido al sistema de gestión de la FCAD</p>
                    </div>
                </div>
            </div>



            
            <div className="slider-container-react">
                <div 
                    className="slider-wrapper" 
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {imagenesSlider.map((img, index) => (
                        <div className="slide-item" key={index}>
                            <img src={img} alt={`Banner ${index}`} />
                        </div>
                    ))}
                </div>
                
                {/* Botones de navegación */}
                <button className="slider-control prev" onClick={prevSlide}><FiChevronLeft /></button>
                <button className="slider-control next" onClick={nextSlide}><FiChevronRight /></button>
            </div>
            {/*indicadores */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div className="course-card" style={{ flex: 1, padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="card-icon" style={{ backgroundColor: '#e8f0fe', color: '#1a73e8', fontSize: '24px' }}>
                        <FiUsers />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '14px', color: '#5f6368', margin: 0 }}>Total Estudiantes</h3>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#202124' }}>
                            {cargando ? '...' : estadisticas.totalEstudiantes}
                        </p>
                    </div>
                </div>

                <div className="course-card" style={{ flex: 1, padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div className="card-icon" style={{ backgroundColor: '#e6f4ea', color: '#1e8e3e', fontSize: '24px' }}>
                        <FiBookOpen />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '14px', color: '#5f6368', margin: 0 }}>Cursos Ofrecidos</h3>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#202124' }}>
                            {cargando ? '...' : estadisticas.totalCursos}
                        </p>
                    </div>
                </div>
            </div>

            {/* acceso rápido */}
            <div className="course-card" style={{ padding: '20px', marginBottom: '40px' }}>
                <h3 style={{ fontSize: '16px', margin: '0 0 15px 0', color: '#3c4043' }}>Accesos Rápidos a Cursos Activos</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {cargando ? <p style={{color: '#888', fontSize: '14px'}}>Cargando accesos...</p> : 
                        estadisticas.cursosActivos.map(curso => (
                            <button 
                                key={curso.id_curso}
                                onClick={() => navigate('/cursos')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '8px 16px', borderRadius: '20px',
                                    border: '1px solid #dadce0', backgroundColor: '#fff',
                                    color: '#1a73e8', cursor: 'pointer', fontWeight: '500',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                            >
                                {curso.nombre} <FiArrowRight size={14} />
                            </button>
                        ))
                    }
                </div>
            </div>
            {/* SECCIÓN DE NOTICIAS */}
            <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#3c4043' }}>Últimas Novedades</h2>
            <div className="cards-grid">
                {noticias.map((nota, index) => (
                    <div className="course-card" key={index}>
                        <div className="card-header">
                            <div className="card-title-group">
                                <FiBell className="card-icon" style={{ backgroundColor: '#e8f0fe' }} />
                                <h3>{nota.titulo}</h3>
                            </div>
                        </div>
                        <div className="card-info" style={{ margin: '10px 0', color: '#5f6368' }}>
                            <p>{nota.contenido}</p>
                        </div>
                        <div className="card-actions" style={{ borderTop: '1px solid #eee', paddingTop: '10px', fontSize: '12px', color: '#1a73e8' }}>
                            {nota.footer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
