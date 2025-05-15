import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({ subject: '', content: '', price: '' });
  const [updateAnnouncement, setUpdateAnnouncement] = useState({ id: null, subject: '', content: '', price: '' });
  const [error, setError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const navigate = useNavigate();

  const teacherId = localStorage.getItem('teacherId');
  const token = localStorage.getItem('token');

  useEffect(() => {

    if (!teacherId || !token) {
      setError('You must be logged in.');
      navigate('/teacher_login');
      return;
    }

    const handlePopState = () => {
      if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.reload();
      }
    };

    window.history.pushState(null, '', window.location.href);
    window.onpopstate = handlePopState;

    axios.get(`http://localhost:5000/api/teachers/${teacherId}`)
      .then((response) => setTeacher(response.data.data))
      .catch((err) => {
        setError('Failed to load teacher profile.');
        console.error(err);
      });

    axios.get(`http://localhost:5000/api/teacher/${teacherId}`)
      .then((response) => setAnnouncements(response.data.data || []))
      .catch((err) => {
        setError('Failed to load announcements.');
        console.error(err);
      });

    return () => {
      window.onpopstate = null;
    };
  }, [teacherId, token, navigate]);

  const fetchReviews = async (announcementId) => {
    if (selectedAnnouncementId === announcementId) {
      setSelectedAnnouncementId(null);
      setReviews([]);
      return;
    }

    setReviews([]);
    setReviewError('');
    setSelectedAnnouncementId(announcementId);

    try {
      const response = await axios.get(`http://localhost:5000/api/announcementReviews/${announcementId}`);
      const data = response.data.data;
      if (Array.isArray(data) && data.length > 0) {
        setReviews(data);
      } else {
        setReviewError('No reviews found for this announcement.');
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setReviewError('Failed to fetch reviews.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();

    if (!newAnnouncement.subject || !newAnnouncement.content || !newAnnouncement.price) {
      setError('All fields are required.');
      return;
    }

    axios.post('http://localhost:5000/api/create_announcements', {
      teacher_id: teacherId,
      subject: newAnnouncement.subject,
      content: newAnnouncement.content,
      price: newAnnouncement.price,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setAnnouncements((prev) => [...prev, res.data]);
        setNewAnnouncement({ subject: '', content: '', price: '' });
        window.location.reload();
      })
      .catch((err) => {
        console.error('Error creating announcement:', err);
        setError('Failed to create announcement.');
      });
  };

  const handleUpdateAnnouncement = (e) => {
    e.preventDefault();

    if (!updateAnnouncement.subject || !updateAnnouncement.content || !updateAnnouncement.price) {
      setError('All fields are required.');
      return;
    }

    axios.put(`http://localhost:5000/api/update_announcements/${updateAnnouncement.id}`, {
      subject: updateAnnouncement.subject,
      content: updateAnnouncement.content,
      price: updateAnnouncement.price,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        const updated = response.data;
        setAnnouncements((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        setUpdateAnnouncement({ id: null, subject: '', content: '', price: '' });
        window.location.reload(); // Refresh after updating announcement
      })
      .catch((err) => {
        console.error('Error updating announcement:', err);
        setError('Failed to update announcement.');
      });
  };

  const handleDeleteAnnouncement = (id) => {
    if (!window.confirm('Delete this announcement?')) return;

    axios.delete(`http://localhost:5000/api/delete_announcements/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        if (selectedAnnouncementId === id) {
          setReviews([]);
          setSelectedAnnouncementId(null);
        }
      })
      .catch((err) => {
        console.error('Error deleting announcement:', err);
        setError('Failed to delete announcement.');
      });
  };

  const handleEditAnnouncement = (announcement) => {
    setUpdateAnnouncement({
      id: announcement.id,
      subject: announcement.subject,
      content: announcement.content,
      price: announcement.price,
    });
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 fw-bold text-primary">
        <i className="bi bi-person-workspace me-2"></i>Teacher Dashboard
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {teacher && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-primary text-white d-flex align-items-center">
            <img
              src={teacher.img_url}
              alt={`${teacher.firstname}'s avatar`}
              className="rounded-circle me-3"
              style={{ width: '90px', height: '90px', objectFit: 'cover', border: '2px solid #fff' }}
            />
            <h5 className="mb-0">Welcome, {teacher.firstname}!</h5>
          </div>
          <div className="card-body">
            <p><strong>Name:</strong> {teacher.firstname} {teacher.lastname}</p>
            <p><strong>Email:</strong> {teacher.email}</p>
            <p><strong>Subject:</strong> <span className="badge bg-info text-dark">{teacher.subject}</span></p>
            <p><strong>Rating:</strong> ⭐ {teacher.teacher_rating}</p>
            <p><strong>Phone:</strong> {teacher.phone}</p>
            <p><strong>Address:</strong> {teacher.address}</p>
            <p><strong>Description:</strong> {teacher.description}</p>
            <p><strong>Availability:</strong> {teacher.availability}</p>
            <p><strong>Tutoring location:</strong> {teacher.tutoring_location}</p>
            <button className="btn btn-outline-danger mt-2" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>Logout
            </button>
            <button
              className="btn btn-outline-primary mt-2 ms-2"
              onClick={() => navigate(`/edit_teacher/${teacher.id}`)}
            >
              <i className="bi bi-pencil-square me-1"></i>Edit Profile
            </button>

          </div>
        </div>
      )}

      {/* Create Announcement */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">Create New Announcement</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleCreateAnnouncement} className="row g-3">
            <div className="col-md-4 form-floating">
              <input type="text" className="form-control" placeholder="Subject"
                value={newAnnouncement.subject}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, subject: e.target.value })}
              />
              <label>Subject</label>
            </div>
            <div className="col-md-6 form-floating">
              <textarea className="form-control" style={{ height: '58px' }} placeholder="Content"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              />
              <label>Content</label>
            </div>
            <div className="col-md-2 form-floating">
              <input type="number" className="form-control" placeholder="Price"
                value={newAnnouncement.price}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, price: e.target.value })}
              />
              <label>Price ($)</label>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success w-100">
                <i className="bi bi-plus-circle me-1"></i>Create
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Announcements */}
      <h4 className="text-dark mb-3">My Announcements</h4>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="col">
            <div className="card h-100 border-primary shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{announcement.subject}</h5>
                <p className="card-text">{announcement.content}</p>
                <span className="badge bg-success mb-3">Price: ${announcement.price}</span>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-outline-info btn-sm"
                    onClick={() => fetchReviews(announcement.id)}>
                    {selectedAnnouncementId === announcement.id ? 'Close' : 'Reviews'}
                  </button>
                  <button className="btn btn-outline-warning btn-sm"
                    onClick={() => handleEditAnnouncement(announcement)} >
                    <i className="bi bi-pencil-square"></i> Edit
                  </button>
                  <button className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteAnnouncement(announcement.id)}>
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>

                {selectedAnnouncementId === announcement.id && (
                  <div className="mt-3">
                    <h6>Reviews:</h6>
                    {reviewError ? (
                      <div className="alert alert-warning">{reviewError}</div>
                    ) : reviews.length > 0 ? (
                      <ul className="list-group">
                        {reviews.map((r, i) => (
                          <li key={i} className="list-group-item">
                            <strong>{r.student_name}:</strong> {r.review}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-muted">Loading reviews...</div>
                    )}
                  </div>
                )}
              </div>

              {updateAnnouncement.id === announcement.id && (
                <div className="card-footer bg-light">
                  <form onSubmit={handleUpdateAnnouncement} className="row g-2">
                    <div className="col-4">
                      <input type="text" className="form-control" placeholder="Subject"
                        value={updateAnnouncement.subject}
                        onChange={(e) => setUpdateAnnouncement({ ...updateAnnouncement, subject: e.target.value })}
                      />
                    </div>
                    <div className="col-4">
                      <input type="text" className="form-control" placeholder="Content"
                        value={updateAnnouncement.content}
                        onChange={(e) => setUpdateAnnouncement({ ...updateAnnouncement, content: e.target.value })}
                      />
                    </div>
                    <div className="col-2">
                      <input type="number" className="form-control" placeholder="Price"
                        value={updateAnnouncement.price}
                        onChange={(e) => setUpdateAnnouncement({ ...updateAnnouncement, price: e.target.value })}
                      />
                    </div>
                    <div className="col-2 d-flex gap-1">
                      <button type="submit" className="btn btn-sm btn-primary w-50">Update</button>
                      <button type="button" className="btn btn-sm btn-secondary w-50"
                        onClick={() => setUpdateAnnouncement({ id: null, subject: '', content: '', price: '' })}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
