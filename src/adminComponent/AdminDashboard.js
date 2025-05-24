import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, contactRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/teacher_requests'),
          axios.get('http://localhost:5000/api/from_contact_form'),
        ]);

        setTeacherRequests(teacherRes.data.data || []);
        setContactMessages(contactRes.data.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setMessage('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAction = async (id, action) => {
    if (action === 'reject' && !window.confirm('Are you sure you want to reject this teacher request?')) {
      return;
    }

    setActionLoadingId(id);
    setMessage('');

    try {
      const endpoint =
        action === 'approve'
          ? `http://localhost:5000/api/admin/teachers/${id}/approve`
          : `http://localhost:5000/api/admin/teachers/${id}/reject`;

      await axios.post(endpoint);
      setTeacherRequests(prev => prev.filter(req => req.id !== id));
      setMessage(`Teacher request ${action}d successfully.`);
    } catch (error) {
      console.error(`Failed to ${action} teacher request:`, error);
      setMessage(`Failed to ${action} teacher request. Please try again.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/contact/${id}`);
      setContactMessages(prev => prev.filter(msg => msg.id !== id));
      setMessage('Message deleted successfully.');
    } catch (error) {
      console.error('Failed to delete message:', error);
      setMessage('Failed to delete message. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status" />
        <p>Loading pending teacher requests...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '900px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <button
          className="btn btn-outline-danger"
          onClick={() => (window.location.href = 'http://localhost:3000/admin')}
        >
          Logout
        </button>
      </div>

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      <h4 className="mb-3">Pending Teacher Registrations</h4>
      {teacherRequests.length === 0 ? (
        <p className="text-center">No pending teacher registrations.</p>
      ) : (
        <div className="list-group mb-5">
          {teacherRequests.map((teacher) => (
            <div
              key={teacher.id}
              className="list-group-item list-group-item-action flex-column align-items-start"
            >
              <div className="d-flex w-100 justify-content-between align-items-center">
                <h5 className="mb-1">
                  {teacher.firstname} {teacher.lastname}
                </h5>
                <small>{teacher.subject || 'No subject specified'}</small>
              </div>
              <p className="mb-1">{teacher.description || 'No description provided.'}</p>
              <p className="mb-1">
                <strong>Email:</strong> {teacher.email} |{' '}
                <strong>Phone:</strong> {teacher.phone || 'N/A'} |{' '}
                <strong>Price/hr:</strong> {teacher.price != null ? `$${teacher.price}` : 'N/A'}
              </p>

              <div className="mt-2">
                <button
                  className="btn btn-success btn-sm me-2"
                  disabled={actionLoadingId === teacher.id}
                  onClick={() => handleAction(teacher.id, 'approve')}
                >
                  {actionLoadingId === teacher.id ? 'Processing...' : 'Approve'}
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  disabled={actionLoadingId === teacher.id}
                  onClick={() => handleAction(teacher.id, 'reject')}
                >
                  {actionLoadingId === teacher.id ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h4 className="mb-3">Contact Form Submissions</h4>
      {contactMessages.length === 0 ? (
        <p className="text-center">No messages submitted.</p>
      ) : (
        <ul className="list-group">
          {contactMessages.map((msg) => (
            <li key={msg.id} className="list-group-item d-flex justify-content-between align-items-start flex-column">
              <div className="w-100">
                <strong>{msg.fullname}</strong> ({msg.email})<br />
                <em>Subject: {msg.subject}</em><br />
                <p>Content: {msg.message}</p>
              </div>
              <button
                className="btn btn-sm btn-outline-danger align-self-end"
                onClick={() => handleDeleteMessage(msg.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
