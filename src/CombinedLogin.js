import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const CombinedLogin = () => {
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'student' && localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/dashboard');
    }
  }, [navigate, role]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const url =
      role === 'teacher'
        ? 'http://localhost:5000/api/teacher_auth'
        : 'http://localhost:5000/api/student_auth';

    try {
      const response = await axios.post(url, { username, password });
      const data = response.data;

      if (data.success) {
        if (role === 'teacher' && data.teacher) {
          const { token, teacher } = data;
          if (!teacher?.id) return setError('Invalid teacher response');
          localStorage.setItem('token', token);
          localStorage.setItem('teacherId', teacher.id);
          navigate('/teacher_dashboard');
        } else if (role === 'student' && data.student) {
          const { id, username } = data.student;
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', username);
          localStorage.setItem('studentId', id.toString());
          navigate('/dashboard');
        } else {
          setError('User data missing in response');
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Login</h3>

        <div className="mb-3">
          <label className="form-label">Login as</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {role === 'student' && (
          <div className="text-center mt-3">
            <small>
              Don't have an account? <Link to="/main_register_form">Sign up</Link>
            </small>
          </div>
        )}

        <div className="text-center mt-3">
          <small>
            Forgot your credentials?{' '}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => {
                if (!username) {
                  setError('Please enter your username before changing credentials.');
                  return;
                }
                navigate('/change-credentials', {
                  state: { username, role },
                });
              }}
            >
              Change Username/Password
            </button>
          </small>
        </div>

          <div className="text-center mt-4">
          <Link to="/" className="btn btn-outline-secondary w-100">
            ← Go Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CombinedLogin;
