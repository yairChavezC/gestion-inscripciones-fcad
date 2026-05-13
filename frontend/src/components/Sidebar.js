import React from 'react';
// Importamos los íconos vectoriales específicos que usaremos para la interfaz del menú
import { FiBookOpen, FiEdit, FiGrid, FiUsers } from 'react-icons/fi';
// Importamos los hooks de React Router:
// useNavigate: Nos permite cambiar de ruta de forma programática (al hacer clic).
// useLocation: Nos permite leer la URL actual para saber en qué vista está el usuario.
import { useNavigate, useLocation } from 'react-router-dom'; 
import './Sidebar.css';

/**
 * Componente Sidebar: 
 * Representa el menú lateral izquierdo de navegación principal del sistema.
 */
const Sidebar = () => {
  // Inicializamos los hooks de navegación y ubicación guardándolos en constantes
  const navigate = useNavigate(); 
  const location = useLocation(); 

  return (
    <div className="sidebar">
      <div>
        {/* Cabecera del menú con el logo e identidad visual de la institución */}
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">U</span>
          UNER Gestión
        </div>
        
        {/* Contenedor principal de los enlaces de navegación */}
        <ul className="sidebar-menu">
          
          {/* Módulos en desarrollo (Pendientes de implementar sus rutas) */}
          <li 
            className={`sidebar-item ${location.pathname === '/dashboard' || location.pathname === '/' ? 'active' : ''}`} 
            onClick={() => navigate('/dashboard')}>
            <FiGrid /> Dashboard
          </li>
          <li 
            className={`sidebar-item ${location.pathname === '/estudiantes' ? 'active' : ''}`} 
            onClick={() => navigate('/estudiantes')}>
            <FiUsers /> Estudiantes
          </li>
          
          {/* 
            Módulo Cursos:
            - Clases Dinámicas: Usamos template literals (``) para evaluar la URL.
            - Lógica: Si el 'pathname' es '/cursos' o la raíz ('/'), inyectamos la clase 
              CSS 'active' para que el botón quede pintado. Caso contrario, no inyecta nada ('').
            - Navegación: El evento onClick dispara la redirección SPA (Single Page Application)
              hacia '/cursos' evitando la recarga total del navegador.
          */}
          <li 
            className={`sidebar-item ${location.pathname === '/cursos' || location.pathname === '/' ? 'active' : ''}`} 
            onClick={() => navigate('/cursos')}
          >
            <FiBookOpen /> Cursos
          </li>
          
          {/* Módulo Inscripciones: Aplica la misma lógica de resaltado condicional y ruteo */}
          <li 
            className={`sidebar-item ${location.pathname === '/inscripciones' ? 'active' : ''}`} 
            onClick={() => navigate('/inscripciones')}
          >
            <FiEdit /> Inscripciones
          </li>
        </ul>
      </div>
      
      {/* Sección inferior anclada al final de la barra lateral */}
      <div className="sidebar-footer">
        <li className="sidebar-item" style={{ listStyle: 'none' }}>
          Cerrar Sesión
        </li>
      </div>
    </div>
  );
};

// Exportamos el componente para que pueda ser importado e incrustado en App.js
export default Sidebar;
