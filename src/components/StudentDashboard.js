import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  const [studentId, setStudentId] = useState(null);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    const fetchStudentInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/students`);
        const students = response.data.data;
        const student = students.find((s) => s.username === username);
        if (student) {
          setStudentId(student.id);
        }
      } catch (error) {
        console.error('Failed to fetch student info:', error);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/announcements');
        if (response.data.data && Array.isArray(response.data.data)) {
          setAnnouncements(response.data.data);
        } else {
          console.error('Unexpected announcements format:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      }
    };

    fetchStudentInfo();
    fetchAnnouncements();
  }, [navigate, username]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleSaveFavorite = (announcement) => {
    const updatedFavorites = [...favorites, announcement];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (id) => {
    return favorites.some((fav) => fav.id === id);
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const teacherName = announcement.teacher_name || '';
    const subject = announcement.subject || '';
    return (
      teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Navigate to Change Credentials page
  const handleChangeCredentials = () => {
    if (studentId) {
      navigate(`/student/change_credentials/${studentId}`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="text-primary">Welcome, {username}!</h3>
          {studentId && <p className="text-muted">{studentId}</p>}
          <span className="text-secondary">Student ID: {localStorage.getItem('studentId')}</span>
        </div>
        <div className="d-flex gap-2">
          <Link to="/favorites">
            <button className="btn btn-outline-info">Favorites</button>
          </Link>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>

          <button className="btn btn-warning" onClick={handleChangeCredentials}>
            Change Credentials
          </button>
        </div>
      </div>

      <h4 className="mb-3">Announcements</h4>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by teacher name or subject"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <ul className="list-group">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <li key={announcement.id} className="list-group-item mb-3">
              <div className="mb-1">
                <strong>Subject:</strong> {announcement.subject}
              </div>
              <div className="mb-2">
                <strong>Price:</strong> ${announcement.price} in hour.
              </div>
              <div className="d-flex gap-2">
                <Link to={`/announcements/${announcement.id}`}>
                  <button className="btn btn-primary">Details</button>
                </Link>
                {!isFavorite(announcement.id) ? (
                  <button className="btn btn-success" onClick={() => handleSaveFavorite(announcement)}>
                    Save
                  </button>
                ) : (
                  <button className="btn btn-secondary" disabled>
                    Saved
                  </button>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>No announcements found.</p>
        )}
      </ul>
    </div>
  );
};

export default StudentDashboard;
