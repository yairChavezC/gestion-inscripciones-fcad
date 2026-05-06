import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Cursos from './pages/Cursos';
import Inscripciones from './pages/Inscripciones';

function App() {
  return (
    <Router>
      <div className="app-layout" style={{ display: 'flex', width: '100vw', height: '100vh' }}>
        <Sidebar />
        
        <div className="main-wrapper" style={{ flex: 1, width: '100%', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Topbar />
          
          <Routes>
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/inscripciones" element={<Inscripciones />} />
            <Route path="*" element={<Cursos />} /> 
          </Routes>
          
        </div>
      </div>
    </Router>
  );
}

export default App;