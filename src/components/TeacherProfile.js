import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const TeacherProfile = () => {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [overallRating, setOverallRating] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teachers/${teacherId}`);
        const data = await response.json();

        if (data.success && data.data) {
          setTeacher(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch teacher details:', error);
      }
    };

    const fetchTeacherOverallRating = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teachers/${teacherId}/overallRating`);
        const data = await response.json();

        if (data.success) {
          setOverallRating(data.averageRating);
        }
      } catch (error) {
        console.error("Failed to fetch teacher's overall rating:", error);
      }
    };

    const fetchTeacherAnnouncements = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teacher/${teacherId}`);
        const result = await response.json();
    
        if (result.success && Array.isArray(result.data)) {
          setAnnouncements(result.data);
        } else {
          console.error("Unexpected announcements response format:", result);
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      }
    };

    fetchTeacherProfile();
    fetchTeacherOverallRating();
    fetchTeacherAnnouncements();
  }, [teacherId]);

  return (
    <div className="container mt-5">
      {teacher ? (
        <>
          <div className="card shadow-lg mb-4">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={teacher.img_url || 'default-image.jpg'}
                  alt="Teacher"
                  className="img-fluid rounded-start p-4"
                  style={{ maxHeight: '250px', objectFit: 'cover' }}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h2 className="card-title text-primary mb-3">{teacher.firstname} {teacher.lastname}</h2>
                  <p className="card-text mb-2"><strong>Email:</strong> {teacher.email}</p>
                  <p className="card-text mb-2"><strong>Phone:</strong> {teacher.phone || 'Not specified'}</p>
                  <p className="card-text mb-2"><strong>Address:</strong> {teacher.address || 'Not specified'}</p>
                  <p className="card-text mb-2"><strong>Description:</strong> {teacher.description || 'No description available'}</p>
                  <p className="card-text mb-2"><strong>Subject:</strong> {teacher.subject || 'Not specified'}</p>
                  <p className="card-text mb-2"><strong>Price:</strong> ${teacher.price || 'Not specified'}</p>
                  <p className="card-text mb-2"><strong>Availability:</strong> {teacher.availability || 'Not specified'}</p>
                  <p className="card-text mb-2"><strong>Overall Rating:</strong> {overallRating ?? 'Not rated yet'}</p>
                  <p className="card-text"><strong>Tutoring Location:</strong> {teacher.tutoring_location || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow p-4">
            <h3 className="text-secondary mb-3">All Announcements by {teacher.firstname}</h3>
            {announcements.length > 0 ? (
              <ul className="list-group">
                {announcements.map((ann) => (
                  <li key={ann.id} className="list-group-item">
                    <h5>{ann.subject}</h5>
                    <p>{ann.content}</p>
                    <small className="text-muted">Posted on: {new Date(ann.created_at).toLocaleDateString()}</small>
                    <Link to={`/teacher/${teacher.id}`}>
                      <button className="btn btn-primary">Details</button>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No announcements found for this teacher.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading teacher profile...</p>
      )}
    </div>
  );
};

export default TeacherProfile;
