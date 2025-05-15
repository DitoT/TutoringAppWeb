import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="/">TutorFind</a>
          <div className="ms-auto">
            <button className="btn btn-outline-light me-2" onClick={() => navigate('/main_login_form')}>Login</button>
            <button className="btn btn-light" onClick={() => navigate('/main_register_form')}>Register</button>
          </div>
        </div>
      </nav>

      {/* Carousel Section */}
      <div id="teachingCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {[
            'https://lsc.cornell.edu/wp-content/uploads/2021/07/k-g-g0905-achi-39404-lyj2328-1-tutoring.jpg',
            'https://lsc.cornell.edu/wp-content/uploads/2021/07/k-g-g0905-achi-39404-lyj2328-1-tutoring.jpg',
            'https://lsc.cornell.edu/wp-content/uploads/2021/07/k-g-g0905-achi-39404-lyj2328-1-tutoring.jpg',
            'https://lsc.cornell.edu/wp-content/uploads/2021/07/k-g-g0905-achi-39404-lyj2328-1-tutoring.jpg'
          ].map((img, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <img
                src={img}
                className="d-block w-100"
                alt={`Slide ${index + 1}`}
                style={{ height: '400px', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#teachingCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#teachingCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>

      {/* Subjects Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Subjects We Cover</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4 text-center">
          {[
            'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
            'History', 'Geography', 'Computer Science', 'Economics', 'Literature',
            'French', 'German', 'Spanish', 'Art', 'Etc'
          ].map((subject, index) => (
            <div key={index} className="col">
              <div className="card h-100 border-primary shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{subject}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Tutors Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Meet Our Top Tutors</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4 text-center">
          {[
            {
              name: 'Alice Johnson',
              desc: 'Expert in Mathematics and Physics with 10+ years of experience.',
              img: 'https://randomuser.me/api/portraits/women/44.jpg'
            },
            {
              name: 'Michael Smith',
              desc: 'Dedicated English and Literature tutor with modern methods.',
              img: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            {
              name: 'Sara Lee',
              desc: 'Passionate about Computer Science and helping students succeed.',
              img: 'https://randomuser.me/api/portraits/women/68.jpg'
            }
          ].map((tutor, index) => (
            <div key={index} className="col">
              <div className="card h-100 shadow-sm">
                <img src={tutor.img} className="card-img-top" alt={tutor.name} />
                <div className="card-body">
                  <h5 className="card-title">{tutor.name}</h5>
                  <p className="card-text">{tutor.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Us Section */}
      <div className="bg-light py-5">
        <div className="container text-center">
          <h2>About TutorFind</h2>
          <p className="lead mt-3">
            TutorFind is a platform that connects students with qualified tutors across various subjects and educational levels. 
            Whether you're looking for help in math, languages, science, or coding, our platform ensures you find the best match 
            for your learning goals. We support both in-person and online tutoring to meet your schedule and preferences.
          </p>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="container py-5">
        <h2 className="text-center mb-4">Contact Us</h2>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input type="text" className="form-control" id="name" placeholder="Enter your full name" />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input type="email" className="form-control" id="email" placeholder="Enter your email" />
              </div>
              <div className="mb-3">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input type="text" className="form-control" id="subject" placeholder="Subject of your message" />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea className="form-control" id="message" rows="5" placeholder="Write your message here..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">Send Message</button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <div className="container">
          <p className="mb-1">© 2025 TutorFind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
