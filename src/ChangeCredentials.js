import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangeCredentials = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!state || !state.role) {
      setError('User role is missing.');
      return;
    }

    // Get ID and token from localStorage
    const id = state.role === 'student' ? localStorage.getItem('studentId') : localStorage.getItem('teacherId');
    const token = localStorage.getItem('token');

    if (!id) {
      setError('User ID not found. Please log in again.');
      return;
    }

    const url =
      state.role === 'teacher'
        ? `http://localhost:5000/api/tutor_cred_change/${id}`
        : `http://localhost:5000/api/student_cred_change/${id}`;

    try {
      const response = await axios.post(
        url,
        { currentPassword, newPassword, newUsername },
        {
          headers: {
            Authorization: `Bearer ${token}`, // If your middleware checks for token
          },
        }
      );

      if (response.data.success) {
        setSuccess('Credentials changed successfully!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(response.data.message || 'Failed to change credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error changing credentials.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Change Credentials</h3>

        <form onSubmit={handleChange}>
          <div className="mb-3">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="Enter current password"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">New Username</label>
            <input
              type="text"
              className="form-control"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
              placeholder="Enter new username"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <button type="submit" className="btn btn-primary w-100">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangeCredentials;
