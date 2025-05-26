import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./Home.css"

const Home = () => {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:5000/api/contact", formData)
      alert(response.data.message)
      setFormData({ fullname: "", email: "", subject: "", message: "" })
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!")
    }
  }

  const carouselImages = [
    "https://lsc.cornell.edu/wp-content/uploads/2021/07/k-g-g0905-achi-39404-lyj2328-1-tutoring.jpg",
    "https://lsc.cornell.edu/wp-content/uploads/2021/07/k-g-g0905-achi-39404-lyj2328-1-tutoring.jpg",
    "https://lsc.cornell.edu/wp-content/uploads/2021/07/k-g-g0905-achi-39404-lyj2328-1-tutoring.jpg",
    "https://lsc.cornell.edu/wp-content/uploads/2021/07/k-g-g0905-achi-39404-lyj2328-1-tutoring.jpg",
  ]

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Geography",
    "Computer Science",
    "Economics",
    "Literature",
    "French",
    "German",
    "Spanish",
    "Art",
    "Etc",
  ]

  const tutors = [
    {
      name: "Alice Johnson",
      desc: "Expert in Mathematics and Physics with 10+ years of experience.",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.9,
      students: 150,
    },
    {
      name: "Michael Smith",
      desc: "Dedicated English and Literature tutor with modern methods.",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.8,
      students: 120,
    },
    {
      name: "Sara Lee",
      desc: "Passionate about Computer Science and helping students succeed.",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5.0,
      students: 200,
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <span className="nav-icon">🎓</span>
            <span className="nav-title">TutorFind</span>
          </div>
          <div className="nav-buttons">
            <button className="btn btn-ghost" onClick={() => navigate("/main_login_form")}>
              Login
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/main_register_form")}>
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Carousel Section */}
      <section className="hero-section">
        <div className="carousel-container">
          {carouselImages.map((img, index) => (
            <div key={index} className={`carousel-slide ${index === currentSlide ? "active" : ""}`}>
              <img src={img || "/placeholder.svg"} alt={`Slide ${index + 1}`} className="carousel-image" />
              <div className="carousel-overlay"></div>
            </div>
          ))}

          {/* Carousel Content Overlay */}
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Find Your Perfect <span className="gradient-text">Tutor</span>
              </h1>
              <p className="hero-description">Connect with expert tutors and unlock your academic potential</p>
              <button className="btn btn-hero" onClick={() => navigate("/main_login_form")}>
                Get Started Today
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>

          {/* Carousel Controls */}
          <button onClick={prevSlide} className="carousel-btn carousel-prev">
            ‹
          </button>
          <button onClick={nextSlide} className="carousel-btn carousel-next">
            ›
          </button>

          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`indicator ${index === currentSlide ? "active" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="subjects-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Subjects We Cover</h2>
            <p className="section-description">
              From mathematics to literature, we have expert tutors for every subject
            </p>
          </div>

          <div className="subjects-grid">
            {subjects.map((subject, index) => (
              <div key={index} className="subject-card" onClick={() => navigate("/main_login_form")}>
                <div className="subject-icon">📚</div>
                <h3 className="subject-title">{subject}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <section className="tutors-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Meet Our Top Tutors</h2>
            <p className="section-description">
              Learn from experienced professionals who are passionate about teaching
            </p>
          </div>

          <div className="tutors-grid">
            {tutors.map((tutor, index) => (
              <div key={index} className="tutor-card" onClick={() => navigate("/main_login_form")}>
                <div className="tutor-header">
                  <div className="tutor-avatar-container">
                    <img src={tutor.img || "/placeholder.svg"} alt={tutor.name} className="tutor-avatar" />
                    <div className="online-indicator"></div>
                  </div>
                  <h3 className="tutor-name">{tutor.name}</h3>
                </div>
                <div className="tutor-content">
                  <p className="tutor-description">{tutor.desc}</p>
                  <div className="tutor-stats">
                    <div className="tutor-rating">
                      <span className="star">⭐</span>
                      <span className="rating-value">{tutor.rating}</span>
                    </div>
                    <div className="tutor-students">{tutor.students} students</div>
                  </div>
                  <button className="btn btn-primary btn-full">View Profile</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="container">
          <h2 className="section-title">About TutorFind</h2>
          <div className="about-content">
            <p className="about-text">
              TutorFind is a platform that connects students with qualified tutors across various subjects and
              educational levels. Whether you're looking for help in math, languages, science, or coding, our platform
              ensures you find the best match for your learning goals. We support both in-person and online tutoring to
              meet your schedule and preferences.
            </p>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Students</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎓</div>
                <div className="stat-number">500+</div>
                <div className="stat-label">Expert Tutors</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-number">4.9</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Contact Us</h2>
            <p className="section-description">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="contact-card">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullname" className="form-label">
                    <span className="label-icon">👤</span>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <span className="label-icon">✉️</span>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  <span className="label-icon">📄</span>
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Subject of your message"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  <span className="label-icon">💬</span>
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="form-textarea"
                  placeholder="Write your message here..."
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-large">
                Send Message
                <span className="btn-icon">📤</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-brand">
                <span className="footer-icon">🎓</span>
                <span className="footer-title">TutorFind</span>
              </div>
              <p className="footer-description">
                Connecting students with expert tutors worldwide for personalized learning experiences.
              </p>
            </div>
            <div className="footer-section">
              <h3 className="footer-heading">Platform</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">Find Tutors</a>
                </li>
                <li>
                  <a href="#">Become a Tutor</a>
                </li>
                <li>
                  <a href="#">Subjects</a>
                </li>
                <li>
                  <a href="#">Pricing</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3 className="footer-heading">Support</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">Help Center</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">Safety</a>
                </li>
                <li>
                  <a href="#">Community</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3 className="footer-heading">Company</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Press</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 TutorFind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
