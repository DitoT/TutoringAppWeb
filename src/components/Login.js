import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/student_auth', {
        username,
        password,
      });

      if (response.data.success && response.data.student) {
        const { id, username } = response.data.student;

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('studentId', id.toString());

        navigate('/dashboard');
      
      }
    } catch (error) {
      console.error('Login failed:', error);
    }

   
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">Login</h3>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-primary" onClick={handleLogin} style={{ width: '100%' }}>
            Login
          </button>
        </div>

        <div className="d-flex justify-content-center mt-2">
          <small>
            Don't have an account? <a href="/register">Sign up</a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
