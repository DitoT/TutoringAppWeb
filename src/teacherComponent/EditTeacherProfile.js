import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditTeacherProfile = () => {
  const [teacherData, setTeacherData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    subject: '',
    phone: '',
    address: '',
    description: '',
    availability: '',
    tutoring_location: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [credError, setCredError] = useState('');
  const [credSuccess, setCredSuccess] = useState('');
  const [credentials, setCredentials] = useState({
    currentPassword: '',
    newPassword: '',
    newUsername: '',
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTeacherData(response.data.data);
      })
      .catch((err) => {
        setError('Failed to fetch teacher data.');
        console.error(err);
      });
  }, [id, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:5000/api/teacher_update/${id}`, teacherData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSuccess('Profile updated successfully!');
        setError('');
        navigate(`/teacher_dashboard`);
      })
      .catch((err) => {
        setError('Failed to update profile.');
        console.error(err);
      });
  };

  const handleCredentialChange = async (e) => {
    e.preventDefault();
    setCredError('');
    setCredSuccess('');

    try {
      const res = await axios.post(
        `http://localhost:5000/api/tutor_cred_change/${id}`,
        credentials,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setCredSuccess('Credentials updated successfully!');
        setCredentials({
          currentPassword: '',
          newPassword: '',
          newUsername: '',
        });
      } else {
        setCredError(res.data.message || 'Failed to update credentials.');
      }
    } catch (err) {
      setCredError('Error updating credentials. Please try again.');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 fw-bold text-primary">
        <i className="bi bi-person-fill-gear me-2"></i>Edit Teacher Profile
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6 form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                value={teacherData.firstname}
                onChange={(e) =>
                  setTeacherData({ ...teacherData, firstname: e.target.value })
                }
              />
              <label>First Name</label>
            </div>
            <div className="col-md-6 form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                value={teacherData.lastname}
                onChange={(e) =>
                  setTeacherData({ ...teacherData, lastname: e.target.value })
                }
              />
              <label>Last Name</label>
            </div>
            <div className="col-md-6 form-floating">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={teacherData.email}
                onChange={(e) =>
                  setTeacherData({ ...teacherData, email: e.target.value })
                }
              />
              <label>Email</label>
            </div>
            <div className="col-md-6 form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="Subject"
                value={teacherData.subject}
                onChange={(e) =>
                  setTeacherData({ ...teacherData, subject: e.target.value })
                }
              />
              <label>Subject</label>
            </div>
            <div className="col-md-6 form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="Phone"
                value={teacherData.phone}
                onChange={(e) =>
                  setTeacherData({ ...teacherData, phone: e.target.value })
                }
              />
              <label>Phone</label>
            </div>
            <div className="col-md-6 form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="Address"
                value={teacherData.address}
                onChange={(e) =>
                  setTeacherData({ ...teacherData, address: e.target.value })
                }
              />
              <label>Address</label>
            </div>
            <div className="col-12 form-floating">
              <textarea
                className="form-control"
                style={{ height: '100px' }}
                placeholder="Description"
                value={teacherData.description}
                onChange={(e) =>
                  setTeacherData({ ...teacherData, description: e.target.value })
                }
              />
              <label>Description</label>
            </div>
            <div className="col-md-6 form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="Availability"
                value={teacherData.availability}
                onChange={(e) =>
                  setTeacherData({
                    ...teacherData,
                    availability: e.target.value,
                  })
                }
              />
              <label>Availability</label>
            </div>
            <div className="col-md-6 form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="Tutoring Location"
                value={teacherData.tutoring_location}
                onChange={(e) =>
                  setTeacherData({
                    ...teacherData,
                    tutoring_location: e.target.value,
                  })
                }
              />
              <label>Tutoring Location</label>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary w-100">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Credential Change Section */}
      <div className="card shadow-sm mt-5">
        <div className="card-body">
          <h5 className="mb-3 text-secondary">Change Username or Password</h5>

          {credError && <div className="alert alert-danger">{credError}</div>}
          {credSuccess && (
            <div className="alert alert-success">{credSuccess}</div>
          )}

          <form onSubmit={handleCredentialChange} className="row g-3">
            <div className="col-md-6 form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="New Username"
                value={credentials.newUsername}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    newUsername: e.target.value,
                  })
                }
                required
              />
              <label>New Username</label>
            </div>
            <div className="col-md-6 form-floating">
              <input
                type="password"
                className="form-control"
                placeholder="Current Password"
                value={credentials.currentPassword}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    currentPassword: e.target.value,
                  })
                }
                required
              />
              <label>Current Password</label>
            </div>
            <div className="col-md-6 form-floating">
              <input
                type="password"
                className="form-control"
                placeholder="New Password"
                value={credentials.newPassword}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    newPassword: e.target.value,
                  })
                }
                required
              />
              <label>New Password</label>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-outline-warning w-100">
                Update Credentials
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTeacherProfile;
