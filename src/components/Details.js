import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AnnouncementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch announcement by ID
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/announcements/${id}`);
        const data = await response.json();
        if (data.success && data.data) {
          setAnnouncement(data.data);
        } else {
          setError('Announcement not found.');
        }
      } catch (err) {
        setError('Failed to fetch announcement.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  // Fetch teacher details based on the teacher_id in the announcement
  useEffect(() => {
    if (!announcement || !announcement.teacher_id) {
      return;
    }

    const fetchTeacher = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teachers/${announcement.teacher_id}`);
        const data = await response.json();
        if (data.success && data.data) {
          setTeacher(data.data);
        } else {
          console.log("Teacher data not found.");
        }
      } catch (err) {
        console.error('Failed to fetch teacher', err);
      }
    };

    fetchTeacher();
  }, [announcement]);

  // Fetch reviews for the announcement
  useEffect(() => {
    const fetchReviews = async () => {
      if (!announcement?.id) return;
      try {
        const response = await fetch(`http://localhost:5000/api/announcementReviews/${announcement.id}`);
        const data = await response.json();
        if (data.success && data.data) {
          setReviews(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch reviews');
      }
    };
    fetchReviews();
  }, [announcement]);

  const handleMoreInfoClick = () => {
    if (teacher?.id) navigate(`/teacher-profile/${teacher.id}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!studentId.trim() || !rating || !reviewText.trim()) {
      alert('All fields are required.');
      return;
    }

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
      alert('Rating must be between 1 and 5.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/announcementReviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          announcement_id: announcement.id,
          rating: numericRating,
          review: reviewText,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setReviews([data.data, ...reviews]);
        setStudentId('');
        setRating('');
        setReviewText('');
      } else {
        alert(data.message || 'Failed to submit review.');
      }
    } catch (err) {
      alert('Error submitting review.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="container mt-5"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="container mt-5"><p className="text-danger">{error}</p></div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-primary">{announcement?.subject || 'No Subject Provided'}</h2>
          <p><strong>Price:</strong> ${announcement?.price} per hour</p>
          <p><strong>Description:</strong> {announcement?.content}</p>
          <p><strong>Posted on:</strong> {new Date(announcement?.created_at).toLocaleDateString()}</p>

          <hr />

          <h4 className="text-success">Teacher Details</h4>
          {teacher ? (
            <>
              <p><strong>Name:</strong> {teacher.firstname} {teacher.lastname}</p>
              <p><strong>Availability:</strong> {teacher.availability || 'Not specified'}</p>
              <button className="btn btn-info mb-4" onClick={handleMoreInfoClick}>More Information</button>
            </>
          ) : (
            <p>Loading teacher information...</p>
          )}

          <hr />

          <h4 className="text-info">Reviews</h4>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <ul className="list-group mb-4">
              {reviews.map((review) => (
                <li key={review.id} className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <span><strong>{review.student_name}</strong> - Rating: {review.rating}/5</span>
                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <p>{review.review}</p>
                </li>
              ))}
            </ul>
          )}

          <h5 className="mt-4">Leave a Review</h5>
          <form onSubmit={handleReviewSubmit}>
            <div className="form-group mb-2">
              <label>Student ID</label>
              <input
                type="text"
                className="form-control"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <label>Rating (1-5)</label>
              <input
                type="number"
                className="form-control"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label>Review</label>
              <textarea
                className="form-control"
                rows="3"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetails;
