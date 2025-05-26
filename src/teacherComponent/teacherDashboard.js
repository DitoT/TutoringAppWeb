import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [reviews, setReviews] = useState([])
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null)
  const [newAnnouncement, setNewAnnouncement] = useState({ subject: "", content: "", price: "" })
  const [updateAnnouncement, setUpdateAnnouncement] = useState({ id: null, subject: "", content: "", price: "" })
  const [error, setError] = useState("")
  const [reviewError, setReviewError] = useState("")
  const navigate = useNavigate()

  const teacherId = localStorage.getItem("teacherId")
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!teacherId || !token) {
      setError("You must be logged in.")
      navigate("/teacher_login")
      return
    }

    const handlePopState = () => {
      if (localStorage.getItem("isLoggedIn") === "true") {
        window.location.reload()
      }
    }

    window.history.pushState(null, "", window.location.href)
    window.onpopstate = handlePopState

    axios
      .get(`http://localhost:5000/api/teachers/${teacherId}`)
      .then((response) => setTeacher(response.data.data))
      .catch((err) => {
        setError("Failed to load teacher profile.")
        console.error(err)
      })

    axios
      .get(`http://localhost:5000/api/teacher/${teacherId}`)
      .then((response) => setAnnouncements(response.data.data || []))
      .catch((err) => {
        setError("Failed to load announcements.")
        console.error(err)
      })

    return () => {
      window.onpopstate = null
    }
  }, [teacherId, token, navigate])

  const fetchReviews = async (announcementId) => {
    if (selectedAnnouncementId === announcementId) {
      setSelectedAnnouncementId(null)
      setReviews([])
      return
    }

    setReviews([])
    setReviewError("")
    setSelectedAnnouncementId(announcementId)

    try {
      const response = await axios.get(`http://localhost:5000/api/announcementReviews/${announcementId}`)
      const data = response.data.data
      if (Array.isArray(data) && data.length > 0) {
        setReviews(data)
      } else {
        setReviewError("No reviews found for this announcement.")
      }
    } catch (error) {
      console.error("Failed to load reviews:", error)
      setReviewError("Failed to fetch reviews.")
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  const handleCreateAnnouncement = (e) => {
    e.preventDefault()

    if (!newAnnouncement.subject || !newAnnouncement.content || !newAnnouncement.price) {
      setError("All fields are required.")
      return
    }

    axios
      .post(
        "http://localhost:5000/api/create_announcements",
        {
          teacher_id: teacherId,
          subject: newAnnouncement.subject,
          content: newAnnouncement.content,
          price: newAnnouncement.price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        setAnnouncements((prev) => [...prev, res.data])
        setNewAnnouncement({ subject: "", content: "", price: "" })
        window.location.reload()
      })
      .catch((err) => {
        console.error("Error creating announcement:", err)
        setError("Failed to create announcement.")
      })
  }

  const handleUpdateAnnouncement = (e) => {
    e.preventDefault()

    if (!updateAnnouncement.subject || !updateAnnouncement.content || !updateAnnouncement.price) {
      setError("All fields are required.")
      return
    }

    axios
      .put(
        `http://localhost:5000/api/update_announcements/${updateAnnouncement.id}`,
        {
          subject: updateAnnouncement.subject,
          content: updateAnnouncement.content,
          price: updateAnnouncement.price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((response) => {
        const updated = response.data
        setAnnouncements((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
        setUpdateAnnouncement({ id: null, subject: "", content: "", price: "" })
        window.location.reload()
      })
      .catch((err) => {
        console.error("Error updating announcement:", err)
        setError("Failed to update announcement.")
      })
  }

  const handleDeleteAnnouncement = (id) => {
    if (!window.confirm("Delete this announcement?")) return

    axios
      .delete(`http://localhost:5000/api/delete_announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id))
        if (selectedAnnouncementId === id) {
          setReviews([])
          setSelectedAnnouncementId(null)
        }
      })
      .catch((err) => {
        console.error("Error deleting announcement:", err)
        setError("Failed to delete announcement.")
      })
  }

  const handleEditAnnouncement = (announcement) => {
    setUpdateAnnouncement({
      id: announcement.id,
      subject: announcement.subject,
      content: announcement.content,
      price: announcement.price,
    })
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "white",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              margin: "0",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "0.5rem",
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              📚
            </span>
            Teacher Dashboard
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              opacity: "0.9",
              margin: "0.5rem 0 0 0",
            }}
          >
            Manage your profile, announcements, and student interactions
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
              color: "white",
              padding: "1rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        {teacher && (
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: "20px",
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Teacher Profile Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "2rem",
                padding: "1.5rem",
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                borderRadius: "15px",
                color: "white",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginRight: "1.5rem",
                  border: "4px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                }}
              >
                <img
                  src={teacher.img_url || "/placeholder.svg?height=100&width=100"}
                  alt={`${teacher.firstname}'s avatar`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div>
                <h2
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "1.8rem",
                    fontWeight: "600",
                  }}
                >
                  Welcome back, {teacher.firstname}! 👋
                </h2>
                <p
                  style={{
                    margin: "0",
                    opacity: "0.9",
                    fontSize: "1.1rem",
                  }}
                >
                  Ready to inspire and educate today?
                </p>
              </div>
            </div>

            {/* Teacher Details Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "1.5rem",
                  borderRadius: "15px",
                  color: "white",
                }}
              >
                <h4 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem", fontWeight: "600" }}>📋 Personal Information</h4>
                <div style={{ lineHeight: "1.8" }}>
                  <p style={{ margin: "0.5rem 0" }}>
                    <strong>Name:</strong> {teacher.firstname} {teacher.lastname}
                  </p>
                  <p style={{ margin: "0.5rem 0" }}>
                    <strong>Email:</strong> {teacher.email}
                  </p>
                  <p style={{ margin: "0.5rem 0" }}>
                    <strong>Phone:</strong> {teacher.phone || "Not provided"}
                  </p>
                  <p style={{ margin: "0.5rem 0" }}>
                    <strong>Address:</strong> {teacher.address || "Not provided"}
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                  padding: "1.5rem",
                  borderRadius: "15px",
                  color: "#333",
                }}
              >
                <h4 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem", fontWeight: "600" }}>🎓 Teaching Details</h4>
                <div style={{ lineHeight: "1.8" }}>
                  <p style={{ margin: "0.5rem 0" }}>
                    <strong>Subject:</strong>
                    <span
                      style={{
                        background: "rgba(255,255,255,0.8)",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "20px",
                        marginLeft: "0.5rem",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                      }}
                    >
                      {teacher.subject}
                    </span>
                  </p>
                  <p style={{ margin: "0.5rem 0" }}>
                    <strong>Rating:</strong>
                    <span style={{ marginLeft: "0.5rem", fontSize: "1.1rem" }}>
                      ⭐ {teacher.teacher_rating || "No rating yet"}
                    </span>
                  </p>
                  <p style={{ margin: "0.5rem 0" }}>
                    <strong>Location:</strong> {teacher.tutoring_location || "Not specified"}
                  </p>
                  <p style={{ margin: "0.5rem 0" }}>
                    <strong>Availability:</strong> {teacher.availability || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {teacher.description && (
              <div
                style={{
                  background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                  padding: "1.5rem",
                  borderRadius: "15px",
                  marginBottom: "2rem",
                }}
              >
                <h4 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem", fontWeight: "600", color: "#333" }}>
                  📝 About Me
                </h4>
                <p style={{ margin: "0", lineHeight: "1.6", color: "#555" }}>{teacher.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  background: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
                  color: "white",
                  border: "none",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 6px 20px rgba(255, 107, 107, 0.4)"
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 15px rgba(255, 107, 107, 0.3)"
                }}
              >
                🚪 Logout
              </button>
              <button
                onClick={() => navigate(`/edit_teacher/${teacher.id}`)}
                style={{
                  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  color: "white",
                  border: "none",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(79, 172, 254, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 6px 20px rgba(79, 172, 254, 0.4)"
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 15px rgba(79, 172, 254, 0.3)"
                }}
              >
                ✏️ Edit Profile
              </button>
            </div>
          </div>
        )}

        {/* Create Announcement Section */}
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "1.5rem",
              borderRadius: "15px",
              marginBottom: "1.5rem",
            }}
          >
            <h3
              style={{
                margin: "0",
                fontSize: "1.5rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              ➕ Create New Announcement
            </h3>
            <p style={{ margin: "0.5rem 0 0 0", opacity: "0.9" }}>Share your tutoring services with students</p>
          </div>

          <form onSubmit={handleCreateAnnouncement}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  📚 Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g., Advanced Mathematics"
                  value={newAnnouncement.subject}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, subject: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    border: "2px solid #e1e5e9",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "white",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea"
                    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e1e5e9"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>

              <div style={{ position: "relative" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  💰 Price per Hour
                </label>
                <input
                  type="number"
                  placeholder="25"
                  value={newAnnouncement.price}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, price: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    border: "2px solid #e1e5e9",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "white",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea"
                    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e1e5e9"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                📝 Description
              </label>
              <textarea
                placeholder="Describe your tutoring approach, experience, and what students can expect..."
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                rows="4"
                style={{
                  width: "100%",
                  padding: "1rem",
                  border: "2px solid #e1e5e9",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  background: "white",
                  resize: "vertical",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea"
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e1e5e9"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "10px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)"
                e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)"
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)"
                e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)"
              }}
            >
              ✨ Create Announcement
            </button>
          </form>
        </div>

        {/* Announcements Section */}
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
              color: "#333",
              padding: "1.5rem",
              borderRadius: "15px",
              marginBottom: "2rem",
            }}
          >
            <h3
              style={{
                margin: "0",
                fontSize: "1.5rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              📢 My Announcements ({announcements.length})
            </h3>
            <p style={{ margin: "0.5rem 0 0 0", opacity: "0.8" }}>Manage your active tutoring announcements</p>
          </div>

          {announcements.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "#666",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</div>
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>No announcements yet</h4>
              <p style={{ margin: "0" }}>Create your first announcement to start connecting with students!</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  style={{
                    background: "white",
                    borderRadius: "15px",
                    padding: "1.5rem",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    border: "1px solid #e1e5e9",
                    transition: "all 0.3s ease",
                    position: "relative",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)"
                    e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.15)"
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)"
                  }}
                >
                  {/* Announcement Header */}
                  <div
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      padding: "1rem",
                      borderRadius: "10px",
                      marginBottom: "1rem",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "1.3rem",
                        fontWeight: "600",
                      }}
                    >
                      {announcement.subject}
                    </h4>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        display: "inline-block",
                        fontSize: "1rem",
                        fontWeight: "600",
                      }}
                    >
                      💰 ${announcement.price}/hour
                    </div>
                  </div>

                  {/* Announcement Content */}
                  <div
                    style={{
                      marginBottom: "1.5rem",
                      lineHeight: "1.6",
                      color: "#555",
                    }}
                  >
                    {announcement.content}
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                      marginBottom: "1rem",
                    }}
                  >
                    <button
                      onClick={() => fetchReviews(announcement.id)}
                      style={{
                        background:
                          selectedAnnouncementId === announcement.id
                            ? "linear-gradient(135deg, #ff6b6b, #ee5a52)"
                            : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        flex: "1",
                      }}
                    >
                      {selectedAnnouncementId === announcement.id ? "❌ Close Reviews" : "⭐ View Reviews"}
                    </button>
                    <button
                      onClick={() => handleEditAnnouncement(announcement)}
                      style={{
                        background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                        color: "#333",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        flex: "1",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      style={{
                        background: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        flex: "1",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  {/* Reviews Section */}
                  {selectedAnnouncementId === announcement.id && (
                    <div
                      style={{
                        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                        padding: "1.5rem",
                        borderRadius: "10px",
                        marginBottom: "1rem",
                      }}
                    >
                      <h5
                        style={{
                          margin: "0 0 1rem 0",
                          fontSize: "1.1rem",
                          fontWeight: "600",
                          color: "#333",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        ⭐ Student Reviews
                      </h5>
                      {reviewError ? (
                        <div
                          style={{
                            background: "rgba(255, 193, 7, 0.2)",
                            color: "#856404",
                            padding: "1rem",
                            borderRadius: "8px",
                            border: "1px solid rgba(255, 193, 7, 0.3)",
                          }}
                        >
                          {reviewError}
                        </div>
                      ) : reviews.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                          {reviews.map((review, index) => (
                            <div
                              key={index}
                              style={{
                                background: "rgba(255,255,255,0.8)",
                                padding: "1rem",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.5)",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: "600",
                                  color: "#333",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                👤 {review.student_name}
                              </div>
                              <div
                                style={{
                                  color: "#555",
                                  lineHeight: "1.5",
                                }}
                              >
                                "{review.review}"
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                            color: "#666",
                            fontStyle: "italic",
                          }}
                        >
                          Loading reviews...
                        </div>
                      )}
                    </div>
                  )}

                  {/* Edit Form */}
                  {updateAnnouncement.id === announcement.id && (
                    <div
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        padding: "1.5rem",
                        borderRadius: "10px",
                        color: "white",
                      }}
                    >
                      <h5
                        style={{
                          margin: "0 0 1rem 0",
                          fontSize: "1.1rem",
                          fontWeight: "600",
                        }}
                      >
                        ✏️ Edit Announcement
                      </h5>
                      <form onSubmit={handleUpdateAnnouncement}>
                        <div
                          style={{
                            display: "grid",
                            gap: "1rem",
                            marginBottom: "1rem",
                          }}
                        >
                          <input
                            type="text"
                            placeholder="Subject"
                            value={updateAnnouncement.subject}
                            onChange={(e) => setUpdateAnnouncement({ ...updateAnnouncement, subject: e.target.value })}
                            style={{
                              padding: "0.8rem",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "1rem",
                              background: "rgba(255,255,255,0.9)",
                              color: "#333",
                            }}
                          />
                          <textarea
                            placeholder="Content"
                            value={updateAnnouncement.content}
                            onChange={(e) => setUpdateAnnouncement({ ...updateAnnouncement, content: e.target.value })}
                            rows="3"
                            style={{
                              padding: "0.8rem",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "1rem",
                              background: "rgba(255,255,255,0.9)",
                              color: "#333",
                              resize: "vertical",
                              fontFamily: "inherit",
                            }}
                          />
                          <input
                            type="number"
                            placeholder="Price"
                            value={updateAnnouncement.price}
                            onChange={(e) => setUpdateAnnouncement({ ...updateAnnouncement, price: e.target.value })}
                            style={{
                              padding: "0.8rem",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "1rem",
                              background: "rgba(255,255,255,0.9)",
                              color: "#333",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                          }}
                        >
                          <button
                            type="submit"
                            style={{
                              background: "rgba(255,255,255,0.2)",
                              color: "white",
                              border: "2px solid rgba(255,255,255,0.3)",
                              padding: "0.8rem 1.5rem",
                              borderRadius: "8px",
                              fontSize: "1rem",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              flex: "1",
                            }}
                          >
                            ✅ Update
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpdateAnnouncement({ id: null, subject: "", content: "", price: "" })}
                            style={{
                              background: "rgba(255,255,255,0.1)",
                              color: "white",
                              border: "2px solid rgba(255,255,255,0.2)",
                              padding: "0.8rem 1.5rem",
                              borderRadius: "8px",
                              fontSize: "1rem",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              flex: "1",
                            }}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
