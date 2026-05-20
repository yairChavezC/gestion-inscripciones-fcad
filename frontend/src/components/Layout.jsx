import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Outlet} from 'react-router-dom'; // Importá Outlet
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ClipboardList, 
  LogOut, 
  Menu, 
  Bell,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Layout.css';

// Simulacro de autenticación para que no tire error
const useAuth = () => {
  const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
  return {
    user: { 
      name: usuarioGuardado.nombre_usuario || 'Usuario', 
      role: usuarioGuardado.apellido || 'Admin' 
    },
    logout: () => localStorage.clear(),
    isAuthenticated: !!localStorage.getItem('token')
  };
};

const SidebarLink = ({to, icon: Icon, label, collapsed})  =>  {
  return(
    <NavLink to={to} className={({ isActive }) => isActive? "sidebar-link active":"sidebar-link"}>
      <Icon size={20} className="icon"/>
      {!collapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="small-text"
        >
          {label}
        </motion.span>
      )}
    </NavLink>
  )
}

export const Layout = ({children}) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifAbierta, setNotifAbierta] = useState(false);
  const [searchValue, setSearchValue] = useState('');

const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim() !== '') {
        if (location.pathname.includes('cursos')) {
            navigate(`/cursos?search=${searchValue}`);
        } else {
            navigate(`/estudiantes?search=${searchValue}`);
        }
        setSearchValue('');
    }
};

  const location = useLocation();
  const navigate = useNavigate();



  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pageTitle = {
    '/': 'Panel de Control',
    '/students': 'Gestión de Estudiantes',
    '/courses': 'Gestión de Cursos',
    '/enrollments': 'Inscripciones'
  }[location.pathname] || 'UNER';

  return(
    <div className="layout-container">

      {/* Sidebar */}
      <motion.aside initial={false} animate={{ width: isSidebarOpen ? 280 : 80 }} className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="logo-box">
              U
            </div>

            {isSidebarOpen && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="brand-title">
                UNER <span className="brand-highlight">Gestión</span>
              </motion.span>
            )}

          </div>
        </div>
        {/* Navigation */}
        <div className="sidebar-content">
          <SidebarLink to="/" icon={LayoutDashboard} label="Dashboardd" collapsed={!isSidebarOpen}/>
          <SidebarLink to="/estudiantes" icon={Users} label="Estudiantes" collapsed={!isSidebarOpen}/>
          <SidebarLink to="/cursos" icon={BookOpen} label="Cursos" collapsed={!isSidebarOpen}/>
          <SidebarLink to="/inscripciones" icon={ClipboardList} label="Inscripciones" collapsed={!isSidebarOpen}/>
        </div>
        {/* Footer */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} />
            {isSidebarOpen && (
              <span className="logout-text">
                Cerrar Sesión
              </span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <header className="navbar">
          {/* Left section */}
          <div className="navbar-left">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="menu-button">
              <Menu size={20} />
            </button>
            <h1 className="page-title">
              {pageTitle}
            </h1>
          </div>
          {/* Right section */}
          <div className="navbar-right">
            {/* Search */}
            <div className="search-container">
              <Search size={18} className="search-icon"/>
              <input 
    type="text" 
    placeholder="Buscar..." 
    className="search-input"
    value={searchValue}
    onChange={(e) => setSearchValue(e.target.value)}
    onKeyDown={handleSearch}
/>
            </div>
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
  <button className="notification-button" onClick={() => setNotifAbierta(!notifAbierta)}>
    <Bell size={20} />
    <span className="notification-dot"></span>
  </button>
  {notifAbierta && (
    <div style={{
      position: 'absolute', right: 0, top: '45px',
      background: 'white', border: '1px solid #e0e0e0',
      borderRadius: '8px', width: '260px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000, padding: '10px 0'
    }}>
      <p style={{ padding: '8px 16px', fontWeight: 600, borderBottom: '1px solid #eee', margin: 0 }}>
        Notificaciones
      </p>
      <p style={{ padding: '20px 16px', color: '#888', fontSize: '14px', textAlign: 'center', margin: 0 }}>
        No hay notificaciones nuevas.
      </p>
    </div>
  )}
</div>
            {/* User */}
            <div className="user-section">
              <div className="user-info">
                <p className="user-name">
                  {user?.name}
                </p>
                <p className="user-role">
                  {user?.role}
                </p>
              </div>
              <div className="user-avatar">
                {user?.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

          {/* Content Area */}
          <main className="content-area">
            <div className="content-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
      </div>
    </div>
  )
}