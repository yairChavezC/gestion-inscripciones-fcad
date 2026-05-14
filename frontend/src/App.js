import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 

import './App.css';
import Dashboard from './pages/Dashboard';
import Cursos from './pages/Cursos';
import Inscripciones from './pages/Inscripciones';
import Login from './pages/Login'; // <-- Asegurate de que la ruta sea correcta
import { Layout } from './components/Layout';
import Estudiantes from './pages/Estudiantes';


// ==========================================
// EL GUARDIA DE SEGURIDAD (Protected Route)
// ==========================================
const ProtectedRoute = ({ children }) => {
  // Buscamos la "pulsera VIP" en la memoria del navegador
  const token = localStorage.getItem('token');
  
  // Si no hay token, lo redirigimos al Login automáticamente
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Si hay token, lo dejamos pasar a la pantalla que pidió (children)
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        
        {/* RUTA PÚBLICA: El Login va suelto, sin el Layout para que ocupe toda la pantalla */}
        <Route path="/login" element={<Login />} />

        {/* RUTAS PRIVADAS: Todo lo que está adentro del Layout ahora está protegido */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Si alguien entra a la raíz "/", lo mandamos al dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} /> 
          <Route path="estudiantes" element={<Estudiantes />} />
          <Route path="cursos" element={<Cursos />} />       
          <Route path="inscripciones" element={<Inscripciones />} />
        </Route>

        {/* Ruta comodín: Si tipean cualquier fruta en la URL, van a la raíz */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </Router>
  );
}