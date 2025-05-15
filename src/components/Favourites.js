import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleRemove = (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const handleViewDetails = (id) => {
    navigate(`/announcements/${id}`);
  };

  return (
    <div className="container mt-5">
      <h3 className="text-info">Your Favorite Announcements</h3>
      {favorites.length === 0 ? (
        <p className="text-muted mt-3">No saved announcements.</p>
      ) : (
        <ul className="list-group mt-4">
          {favorites.map((announcement) => (
            <li key={announcement.id} className="list-group-item mb-3">
              <h5>{announcement.teacher_name}</h5>
              <p><strong>Subject:</strong> {announcement.subject}</p>
              <p><strong>Price:</strong> ${announcement.price}</p>
              <button
                className="btn btn-outline-info me-2"
                onClick={() => handleViewDetails(announcement.id)}
              >
                View Details
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => handleRemove(announcement.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
