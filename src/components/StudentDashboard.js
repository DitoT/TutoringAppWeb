import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

const StudentDashboard = () => {
  const navigate = useNavigate()
  const [announcements, setAnnouncements] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites")
    return stored ? JSON.parse(stored) : []
  })

  const [studentId, setStudentId] = useState(null)
  const username = localStorage.getItem("username")

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      navigate("/")
      return
    }

    const fetchStudentInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/students`)
        const students = response.data.data
        const student = students.find((s) => s.username === username)
        if (student) {
          setStudentId(student.id)
        }
      } catch (error) {
        console.error("Failed to fetch student info:", error)
      }
    }

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/announcements")
        if (response.data.data && Array.isArray(response.data.data)) {
          setAnnouncements(response.data.data)
        } else {
          console.error("Unexpected announcements format:", response.data)
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudentInfo()
    fetchAnnouncements()
  }, [navigate, username])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("username")
    navigate("/")
  }

  const handleSaveFavorite = (announcement) => {
    const updatedFavorites = [...favorites, announcement]
    setFavorites(updatedFavorites)
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
  }

  const isFavorite = (id) => {
    return favorites.some((fav) => fav.id === id)
  }

  const filteredAnnouncements = announcements.filter((announcement) => {
    const teacherName = announcement.teacher_name || ""
    const subject = announcement.subject || ""
    return (
      teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleChangeCredentials = () => {
    const userId = localStorage.getItem("studentId")
    navigate(`/student/change_credentials/${userId}`)
  }

  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontFamily: "inherit",
  }

  const primaryButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
  }

  const successButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
  }

  const dangerButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
  }

  const warningButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "white",
    boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
  }

  const infoButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #06b6d4, #0891b2)",
    color: "white",
    boxShadow: "0 4px 15px rgba(6, 182, 212, 0.3)",
  }

  const disabledButtonStyle = {
    ...buttonStyle,
    background: "#e5e7eb",
    color: "#9ca3af",
    cursor: "not-allowed",
    boxShadow: "none",
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(102, 126, 234, 0.1)",
          padding: "20px 0",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <span style={{ fontSize: "2rem" }}>🎓</span>
              <h1
                style={{
                  margin: 0,
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Welcome back, {username}!
              </h1>
            </div>
            <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
              <span style={{ marginRight: "8px" }}>🆔</span>
              Student ID: {localStorage.getItem("studentId")}
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/favorites" style={{ textDecoration: "none" }}>
              <button
                style={infoButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 8px 25px rgba(6, 182, 212, 0.4)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 15px rgba(6, 182, 212, 0.3)"
                }}
              >
                ⭐ Favorites
              </button>
            </Link>
            <button
              style={warningButtonStyle}
              onClick={handleChangeCredentials}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)"
                e.target.style.boxShadow = "0 8px 25px rgba(245, 158, 11, 0.4)"
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)"
                e.target.style.boxShadow = "0 4px 15px rgba(245, 158, 11, 0.3)"
              }}
            >
              ⚙️ Settings
            </button>
            <button
              style={dangerButtonStyle}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)"
                e.target.style.boxShadow = "0 8px 25px rgba(239, 68, 68, 0.4)"
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)"
                e.target.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)"
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📚</div>
            <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "4px" }}>
              {filteredAnnouncements.length}
            </div>
            <div style={{ opacity: 0.9 }}>Available Tutors</div>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "white",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>⭐</div>
            <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "4px" }}>{favorites.length}</div>
            <div style={{ opacity: 0.9 }}>Saved Favorites</div>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              color: "white",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(245, 158, 11, 0.3)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🎯</div>
            <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "4px" }}>
              {new Set(announcements.map((a) => a.subject)).size}
            </div>
            <div style={{ opacity: 0.9 }}>Subjects Available</div>
          </div>
        </div>

        {/* Search Section */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            padding: "32px",
            borderRadius: "20px",
            marginBottom: "32px",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "1.5rem" }}>🔍</span>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "600", color: "#1a1a1a" }}>
              Find Your Perfect Tutor
            </h2>
          </div>
          <input
            type="text"
            style={{
              width: "100%",
              padding: "16px 20px",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              outline: "none",
              fontFamily: "inherit",
              background: "white",
            }}
            placeholder="🔍 Search by teacher name or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = "#667eea"
              e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb"
              e.target.style.boxShadow = "none"
            }}
          />
        </div>

        {/* Announcements Section */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            padding: "32px",
            borderRadius: "20px",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <span style={{ fontSize: "1.5rem" }}>📢</span>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "600", color: "#1a1a1a" }}>
              Available Tutoring Sessions
            </h2>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "4px solid #e5e7eb",
                  borderTop: "4px solid #667eea",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 16px",
                }}
              ></div>
              <p style={{ color: "#64748b", margin: 0 }}>Loading announcements...</p>
            </div>
          ) : filteredAnnouncements.length > 0 ? (
            <div style={{ display: "grid", gap: "20px" }}>
              {filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  style={{
                    background: "white",
                    padding: "24px",
                    borderRadius: "16px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #e5e7eb",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)"
                    e.target.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.12)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)"
                    e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.08)"
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <span style={{ fontSize: "1.2rem" }}>📚</span>
                        <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "600", color: "#1a1a1a" }}>
                          {announcement.subject}
                        </h3>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                        <span style={{ fontSize: "1rem" }}>💰</span>
                        <span style={{ fontSize: "1.1rem", fontWeight: "600", color: "#059669" }}>
                          ${announcement.price}/hour
                        </span>
                      </div>
                      {announcement.teacher_name && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                          <span style={{ fontSize: "1rem" }}>👨‍🏫</span>
                          <span style={{ color: "#64748b" }}>by {announcement.teacher_name}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <Link to={`/announcements/${announcement.id}`} style={{ textDecoration: "none" }}>
                        <button
                          style={primaryButtonStyle}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)"
                            e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.4)"
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)"
                            e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)"
                          }}
                        >
                          📋 View Details
                        </button>
                      </Link>
                      {!isFavorite(announcement.id) ? (
                        <button
                          style={successButtonStyle}
                          onClick={() => handleSaveFavorite(announcement)}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)"
                            e.target.style.boxShadow = "0 8px 25px rgba(16, 185, 129, 0.4)"
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)"
                            e.target.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.3)"
                          }}
                        >
                          ⭐ Save
                        </button>
                      ) : (
                        <button style={disabledButtonStyle} disabled>
                          ✅ Saved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#64748b",
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🔍</div>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem", fontWeight: "600" }}>No tutors found</h3>
              <p style={{ margin: 0 }}>
                {searchQuery
                  ? `No tutors match your search for "${searchQuery}"`
                  : "No tutoring announcements are currently available"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animation for loading spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .dashboard-header {
              flex-direction: column !important;
              align-items: flex-start !important;
            }
            
            .dashboard-buttons {
              width: 100% !important;
              justify-content: flex-start !important;
            }
          }
        `}
      </style>
    </div>
  )
}

export default StudentDashboard
