import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || []

      console.log("Stored favorites data:", storedFavorites)
      if (storedFavorites.length > 0) {
        console.log("First favorite object keys:", Object.keys(storedFavorites[0]))
        console.log("First favorite object:", storedFavorites[0])
      }

      setFavorites(storedFavorites)
      setIsLoading(false)
    }, 500)
  }, [])

  const handleRemove = (id) => {
    setRemovingId(id)
    setTimeout(() => {
      const updated = favorites.filter((item) => item.id !== id)
      setFavorites(updated)
      localStorage.setItem("favorites", JSON.stringify(updated))
      setRemovingId(null)
    }, 300)
  }

  const handleViewDetails = (id) => {
    navigate(`/announcements/${id}`)
  }

  const handleBackToDashboard = () => {
    navigate("/dashboard")
  }

  const getTeacherName = (announcement) => {
    const possibleNames = [
      announcement.teacher_name,
      announcement.teacherName,
      announcement.teacher,
      announcement.instructor_name,
      announcement.instructorName,
      announcement.instructor,
      announcement.tutor_name,
      announcement.tutorName,
      announcement.tutor,
      announcement.name,
      announcement.full_name,
      announcement.fullName,
      announcement.first_name && announcement.last_name ? `${announcement.first_name} ${announcement.last_name}` : null,
      announcement.firstName && announcement.lastName ? `${announcement.firstName} ${announcement.lastName}` : null,
    ]

    return possibleNames.find((name) => name && name.trim() !== "") || ""
  }

  const getTeacherInitials = (teacherName) => {
    if (!teacherName || teacherName === "Teacher") return "T"

    const names = teacherName.split(" ")
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase()
    }
    return teacherName.charAt(0).toUpperCase()
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

  const dangerButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
  }

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: "white",
    color: "#667eea",
    border: "2px solid #667eea",
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
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "2.5rem" }}>⭐</span>
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "2rem",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Your Favorites
                </h1>
                <p style={{ margin: 0, color: "#64748b", fontSize: "1rem" }}>Manage your saved tutoring sessions</p>
              </div>
            </div>
          </div>

          <button
            style={secondaryButtonStyle}
            onClick={handleBackToDashboard}
            onMouseEnter={(e) => {
              e.target.style.background = "#667eea"
              e.target.style.color = "white"
              e.target.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "white"
              e.target.style.color = "#667eea"
              e.target.style.transform = "translateY(0)"
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {favorites.length > 0 && (
        <div
          style={{
            maxWidth: "1200px",
            margin: "20px auto 0",
            padding: "0 20px",
          }}
        >
          <details
            style={{
              background: "#f3f4f6",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "0.8rem",
            }}
          >
            <summary style={{ cursor: "pointer", fontWeight: "600" }}>
              🐛 Debug Info (Click to expand - Remove in production)
            </summary>
            <pre style={{ marginTop: "12px", overflow: "auto" }}>{JSON.stringify(favorites[0], null, 2)}</pre>
          </details>
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        {/* Stats Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white",
            padding: "32px",
            borderRadius: "20px",
            marginBottom: "32px",
            boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📊</div>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "2rem", fontWeight: "700" }}>
            {favorites.length} Saved {favorites.length === 1 ? "Tutor" : "Tutors"}
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "1.1rem" }}>
            {favorites.length === 0
              ? "Start exploring and save your favorite tutors"
              : "Your carefully curated list of preferred tutoring sessions"}
          </p>
        </div>

        {/* Content Area */}
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
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  border: "4px solid #e5e7eb",
                  borderTop: "4px solid #667eea",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 20px",
                }}
              ></div>
              <p style={{ color: "#64748b", margin: 0, fontSize: "1.1rem" }}>Loading your favorites...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                color: "#64748b",
              }}
            >
              <div style={{ fontSize: "5rem", marginBottom: "24px" }}>💫</div>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "1.5rem", fontWeight: "600", color: "#1a1a1a" }}>
                No favorites yet
              </h3>
              <p style={{ margin: "0 0 32px 0", fontSize: "1.1rem", maxWidth: "400px", margin: "0 auto 32px" }}>
                Explore our amazing tutors and save your favorites for quick access. Start building your personalized
                learning network!
              </p>
              <button
                style={primaryButtonStyle}
                onClick={handleBackToDashboard}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.4)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)"
                }}
              >
                🔍 Explore Tutors
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {favorites.map((announcement) => {
                const teacherName = getTeacherName(announcement)
                const teacherInitials = getTeacherInitials(teacherName)

                return (
                  <div
                    key={announcement.id}
                    style={{
                      background: "white",
                      padding: "28px",
                      borderRadius: "16px",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
                      border: "1px solid #e5e7eb",
                      transition: "all 0.3s ease",
                      opacity: removingId === announcement.id ? 0.5 : 1,
                      transform: removingId === announcement.id ? "scale(0.95)" : "scale(1)",
                    }}
                    onMouseEnter={(e) => {
                      if (removingId !== announcement.id) {
                        e.target.style.transform = "translateY(-4px)"
                        e.target.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.12)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (removingId !== announcement.id) {
                        e.target.style.transform = "translateY(0)"
                        e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.08)"
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "24px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        {/* Teacher Name */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              background: "linear-gradient(135deg, #667eea, #764ba2)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "1.2rem",
                              fontWeight: "700",
                            }}
                          >
                            {teacherInitials}
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "600", color: "#1a1a1a" }}>
                              {teacherName}
                            </h3>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                              <span style={{ fontSize: "0.9rem" }}>⭐</span>
                              <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Saved to favorites</span>
                            </div>
                          </div>
                        </div>

                        {/* Subject */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                          <span style={{ fontSize: "1.1rem" }}>📚</span>
                          <span style={{ fontWeight: "600", color: "#374151" }}>Subject:</span>
                          <span
                            style={{
                              background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
                              color: "#0369a1",
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "0.9rem",
                              fontWeight: "500",
                            }}
                          >
                            {announcement.subject || "Not specified"}
                          </span>
                        </div>

                        {/* Price */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                          <span style={{ fontSize: "1.1rem" }}>💰</span>
                          <span style={{ fontWeight: "600", color: "#374151" }}>Price:</span>
                          <span
                            style={{
                              fontSize: "1.2rem",
                              fontWeight: "700",
                              color: "#059669",
                              background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
                              padding: "4px 12px",
                              borderRadius: "8px",
                            }}
                          >
                            ${announcement.price || "0"}/hour
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "140px" }}>
                        <button
                          style={primaryButtonStyle}
                          onClick={() => handleViewDetails(announcement.id)}
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
                        <button
                          style={{
                            ...dangerButtonStyle,
                            opacity: removingId === announcement.id ? 0.6 : 1,
                            cursor: removingId === announcement.id ? "not-allowed" : "pointer",
                          }}
                          onClick={() => handleRemove(announcement.id)}
                          disabled={removingId === announcement.id}
                          onMouseEnter={(e) => {
                            if (removingId !== announcement.id) {
                              e.target.style.transform = "translateY(-2px)"
                              e.target.style.boxShadow = "0 8px 25px rgba(239, 68, 68, 0.4)"
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (removingId !== announcement.id) {
                              e.target.style.transform = "translateY(0)"
                              e.target.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)"
                            }
                          }}
                        >
                          {removingId === announcement.id ? (
                            <>
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  border: "2px solid rgba(255, 255, 255, 0.3)",
                                  borderTop: "2px solid white",
                                  borderRadius: "50%",
                                  animation: "spin 1s linear infinite",
                                }}
                              ></div>
                              Removing...
                            </>
                          ) : (
                            <>🗑️ Remove</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <div
            style={{
              marginTop: "32px",
              padding: "24px",
              background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
              borderRadius: "16px",
              border: "1px solid #bae6fd",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>💡</span>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "600", color: "#1a1a1a" }}>
                Ready to start learning?
              </h3>
            </div>
            <p style={{ margin: "0 0 20px 0", color: "#64748b" }}>
              You have {favorites.length} amazing {favorites.length === 1 ? "tutor" : "tutors"} saved. Contact them to
              schedule your first session!
            </p>
            <button
              style={primaryButtonStyle}
              onClick={handleBackToDashboard}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)"
                e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.4)"
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)"
                e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)"
              }}
            >
              🚀 Explore More Tutors
            </button>
          </div>
        )}
      </div>

      {/* CSS Animation for loading spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .favorites-card {
              flex-direction: column !important;
            }
            
            .favorites-actions {
              flex-direction: row !important;
              width: 100% !important;
            }
          }
        `}
      </style>
    </div>
  )
}

export default Favorites
