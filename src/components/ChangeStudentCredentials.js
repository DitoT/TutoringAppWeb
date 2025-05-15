import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ChangeStudentCredentials = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

const handleChange = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');

  try {
    const response = await axios.post(
      `http://localhost:5000/api/student_cred_change/${id}`,
      {
        currentPassword,
        newPassword,
        newUsername,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      setSuccess(response.data.message);
      setError('');
      setTimeout(() => navigate('/dashboard'), 1500);
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong');
    setSuccess('');
  }
};

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Change Credentials</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleChange} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label>Current Password</label>
          <input
            type="password"
            className="form-control"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>New Username</label>
          <input
            type="text"
            className="form-control"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success">Update</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangeStudentCredentials;
