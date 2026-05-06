import React from 'react';
// Importamos los íconos vectoriales de la familia Feather Icons (react-icons/fi):
// FiMenu (Menú hamburguesa), FiSearch (Lupa de búsqueda) y FiBell (Campanita).
import { FiMenu, FiSearch, FiBell } from 'react-icons/fi';
// Importamos la hoja de estilos correspondiente a esta barra superior.
import './Topbar.css';

/**
 * Componente Topbar:
 * Representa la barra superior (header) estática de la aplicación.
 * Provee acceso rápido a la búsqueda global, notificaciones y el estado de la sesión del usuario.
 */
const Topbar = () => {
  return (
    <div className="topbar">
      
      {/* SECCIÓN IZQUIERDA: Contiene el control del menú y el título contextual */}
      <div className="topbar-left">
        {/* 
          Ícono de menú. Se utilizan estilos en línea (inline-styles) para ajustes 
          rápidos específicos que no justifican una clase CSS entera. 
        */}
        <FiMenu style={{ color: '#5f6368', cursor: 'pointer' }} />
        {/* Título de la sección o módulo activo en ese momento */}
        <span>Gestión de Cursos</span>
      </div>

      {/* SECCIÓN DERECHA: Contiene las herramientas de usuario y perfil */}
      <div className="topbar-right">
        
        {/* Componente visual de la barra de búsqueda (funcionalidad a implementar) */}
        <div className="search-bar">
          <FiSearch />
          <input type="text" placeholder="Buscar..." />
        </div>
        
        {/* Sistema de notificaciones (alertas de inscripciones, mensajes, etc.) */}
        <FiBell style={{ color: '#5f6368', fontSize: '20px', cursor: 'pointer' }} />
        
        {/* 
          Bloque de información de sesión.
          Muestra la credencial actual, estructurada en Nombre/Entidad y Rol.
          Ideal para escalar el sistema a múltiples roles (Administrador, Docente, Alumno).
        */}
        <div style={{ textAlign: 'right', fontSize: '13px' }}>
          <strong>Administrador UNER</strong><br/>
          <span style={{ color: '#5f6368' }}>ADMIN</span>
        </div>
        
      </div>
    </div>
  );
};

// Exportamos el componente por defecto para poder inyectarlo en el layout de App.js
export default Topbar;