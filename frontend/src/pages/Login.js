import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  // Estados para guardar lo que escribe el usuario
  const [credenciales, setCredenciales] = useState({
    nombre_usuario: '',
    contrasenia: ''
  });
  
  // Estado para mostrar errores (ej: "contraseña incorrecta")
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página recargue
    setError(''); // Limpiamos errores previos

    try {
      const respuesta = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credenciales),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        // ¡Login exitoso! Guardamos la pulsera VIP en la memoria del navegador
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        // Redirigimos al usuario al dashboard (o inscripciones)
        window.location.href = '/dashboard'; 
      } else {
        // Si el backend rebotó el login, mostramos el mensaje
        setError(data.error || 'Error al intentar iniciar sesión');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sistema de Gestión</h2>
        
        {/* Si hay un error, mostramos el cartelito rojo */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input 
              type="text" 
              name="nombre_usuario" 
              value={credenciales.nombre_usuario}
              onChange={handleChange}
              placeholder="Ingresá tu usuario"
              required 
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              name="contrasenia" 
              value={credenciales.contrasenia}
              onChange={handleChange}
              placeholder="Ingresá tu contraseña"
              required 
            />
          </div>

          <button type="submit" className="btn-login">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;