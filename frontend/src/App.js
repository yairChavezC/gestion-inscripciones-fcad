import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 

import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Cursos from './pages/Cursos';
import Inscripciones from './pages/Inscripciones';
import { Layout } from './components/Layout';

// Componente temporal (Placeholder)
const Students = () => (
  <div style={{ padding: '20px' }}>
    <h2>Sección de Estudiantes (En desarrollo)</h2>
    <p>Próximamente podrás gestionar los alumnos aquí.</p>
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="estudiantes" element={<Students />} />
          <Route path="dashboard" element={<Dashboard />} /> 
          <Route path="cursos" element={<Cursos />} />       
          <Route path="inscripciones" element={<Inscripciones />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
     
      {/* <div className="app-layout" style={{ display: 'flex', width: '100vw', height: '100vh' }}>
        <Sidebar />
        <div className="main-wrapper" style={{ flex: 1, width: '100%', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Topbar />
          <Routes>
            <Route path="/" element={<Dashboard />} /> 
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/inscripciones" element={<Inscripciones />} />
            <Route path="*" element={<Cursos />} /> 
          </Routes>
        </div>
      </div> */}
    </Router>
  );
}

