import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"

const TeacherProfile = () => {
  const { teacherId } = useParams()
  const navigate = useNavigate()
  const [teacher, setTeacher] = useState(null)
  const [overallRating, setOverallRating] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teachers/${teacherId}`)
        const data = await response.json()

        if (data.success && data.data) {
          setTeacher(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch teacher details:", error)
      }
    }

    const fetchTeacherOverallRating = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teachers/${teacherId}/overallRating`)
        const data = await response.json()

        if (data.success) {
          setOverallRating(data.averageRating)
        }
      } catch (error) {
        console.error("Failed to fetch teacher's overall rating:", error)
      }
    }

    const fetchTeacherAnnouncements = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teacher/${teacherId}`)
        const result = await response.json()

        if (result.success && Array.isArray(result.data)) {
          setAnnouncements(result.data)
        } else {
          console.error("Unexpected announcements response format:", result)
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeacherProfile()
    fetchTeacherOverallRating()
    fetchTeacherAnnouncements()
  }, [teacherId])

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
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
          <p style={{ color: "#64748b", margin: 0, fontSize: "1.1rem" }}>Loading teacher profile...</p>
        </div>
      </div>
    )
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
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
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
            <span style={{ fontSize: "2.5rem" }}>👨‍🏫</span>
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
                Teacher Profile
              </h1>
              <p style={{ margin: 0, color: "#64748b", fontSize: "1rem" }}>
                {teacher ? `${teacher.firstname} ${teacher.lastname}` : "Professional Tutor"}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "10px 20px",
              background: "white",
              color: "#667eea",
              border: "2px solid #667eea",
              borderRadius: "12px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#667eea"
              e.target.style.color = "white"
              e.target.style.transform = "translateY(-2px)"
              e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "white"
              e.target.style.color = "#667eea"
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = "none"
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        {teacher ? (
          <>
            {/* Teacher Profile Card */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                padding: "40px",
                borderRadius: "24px",
                marginBottom: "32px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  gap: "40px",
                  alignItems: "start",
                }}
              >
                {/* Teacher Image */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "250px",
                      height: "250px",
                      borderRadius: "20px",
                      overflow: "hidden",
                      margin: "0 auto 20px",
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
                      border: "4px solid white",
                    }}
                  >
                    <img
                      src={teacher.img_url || "/placeholder.svg?height=250&width=250"}
                      alt={`${teacher.firstname} ${teacher.lastname}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Rating Display */}
                  <div
                    style={{
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "white",
                      padding: "12px 20px",
                      borderRadius: "12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>⭐</span>
                    <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                      {overallRating ? `${overallRating}/5` : "Not rated yet"}
                    </span>
                  </div>
                </div>

                {/* Teacher Information */}
                <div>
                  <div style={{ marginBottom: "32px" }}>
                    <h2
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "2.5rem",
                        fontWeight: "700",
                        color: "#1a1a1a",
                      }}
                    >
                      {teacher.firstname} {teacher.lastname}
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        color: "#667eea",
                        fontSize: "1.2rem",
                        fontWeight: "500",
                      }}
                    >
                      Professional {teacher.subject} Tutor
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                      marginBottom: "32px",
                    }}
                  >
                    <div
                      style={{
                        background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
                        padding: "20px",
                        borderRadius: "16px",
                        border: "1px solid #bae6fd",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "1.2rem" }}>✉️</span>
                        <span style={{ fontWeight: "600", color: "#374151" }}>Email</span>
                      </div>
                      <p style={{ margin: 0, color: "#0369a1", fontWeight: "500" }}>{teacher.email}</p>
                    </div>

                    <div
                      style={{
                        background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                        padding: "20px",
                        borderRadius: "16px",
                        border: "1px solid #a7f3d0",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "1.2rem" }}>📞</span>
                        <span style={{ fontWeight: "600", color: "#374151" }}>Phone</span>
                      </div>
                      <p style={{ margin: 0, color: "#059669", fontWeight: "500" }}>
                        {teacher.phone || "Not specified"}
                      </p>
                    </div>

                    <div
                      style={{
                        background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                        padding: "20px",
                        borderRadius: "16px",
                        border: "1px solid #f59e0b",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "1.2rem" }}>🏠</span>
                        <span style={{ fontWeight: "600", color: "#374151" }}>Address</span>
                      </div>
                      <p style={{ margin: 0, color: "#92400e", fontWeight: "500" }}>
                        {teacher.address || "Not specified"}
                      </p>
                    </div>

                    <div
                      style={{
                        background: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
                        padding: "20px",
                        borderRadius: "16px",
                        border: "1px solid #f9a8d4",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "1.2rem" }}>💰</span>
                        <span style={{ fontWeight: "600", color: "#374151" }}>Price</span>
                      </div>
                      <p style={{ margin: 0, color: "#be185d", fontWeight: "500" }}>
                        ${teacher.price || "Not specified"}/hour
                      </p>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div style={{ display: "grid", gap: "20px" }}>
                    <div
                      style={{
                        background: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
                        padding: "20px",
                        borderRadius: "16px",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <span style={{ fontSize: "1.2rem" }}>📝</span>
                        <span style={{ fontWeight: "600", color: "#374151" }}>Description</span>
                      </div>
                      <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.6" }}>
                        {teacher.description || "No description available"}
                      </p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      <div
                        style={{
                          background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                          padding: "20px",
                          borderRadius: "16px",
                          border: "1px solid #c4b5fd",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <span style={{ fontSize: "1.2rem" }}>⏰</span>
                          <span style={{ fontWeight: "600", color: "#374151" }}>Availability</span>
                        </div>
                        <p style={{ margin: 0, color: "#6d28d9", fontWeight: "500" }}>
                          {teacher.availability || "Not specified"}
                        </p>
                      </div>

                      <div
                        style={{
                          background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
                          padding: "20px",
                          borderRadius: "16px",
                          border: "1px solid #7dd3fc",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <span style={{ fontSize: "1.2rem" }}>📍</span>
                          <span style={{ fontWeight: "600", color: "#374151" }}>Location</span>
                        </div>
                        <p style={{ margin: 0, color: "#0369a1", fontWeight: "500" }}>
                          {teacher.tutoring_location || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Announcements Section */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                padding: "40px",
                borderRadius: "24px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                  }}
                >
                  📢
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.8rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "4px",
                    }}
                  >
                    All Announcements by {teacher.firstname}
                  </h3>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "1rem" }}>
                    {announcements.length} {announcements.length === 1 ? "announcement" : "announcements"} available
                  </p>
                </div>
              </div>

              {announcements.length > 0 ? (
                <div style={{ display: "grid", gap: "20px" }}>
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      style={{
                        background: "white",
                        padding: "24px",
                        borderRadius: "16px",
                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
                        border: "1px solid #e5e7eb",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)"
                        e.target.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.12)"
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)"
                        e.target.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.08)"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "20px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                            <span style={{ fontSize: "1.2rem" }}>📚</span>
                            <h4
                              style={{
                                margin: 0,
                                fontSize: "1.3rem",
                                fontWeight: "600",
                                color: "#1a1a1a",
                              }}
                            >
                              {ann.subject}
                            </h4>
                          </div>
                          <p
                            style={{
                              margin: "0 0 16px 0",
                              color: "#4b5563",
                              lineHeight: "1.6",
                              fontSize: "1rem",
                            }}
                          >
                            {ann.content}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              color: "#64748b",
                              fontSize: "0.9rem",
                            }}
                          >
                            <span>📅</span>
                            <span>Posted on: {new Date(ann.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Link to={`/announcements/${ann.id}`} style={{ textDecoration: "none" }}>
                          <button
                            style={{
                              padding: "12px 24px",
                              background: "linear-gradient(135deg, #667eea, #764ba2)",
                              color: "white",
                              border: "none",
                              borderRadius: "12px",
                              fontSize: "0.95rem",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                            }}
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
                    background: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
                    borderRadius: "16px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📭</div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "1.3rem", fontWeight: "600", color: "#374151" }}>
                    No announcements yet
                  </h4>
                  <p style={{ margin: 0, fontSize: "1rem" }}>
                    {teacher.firstname} hasn't posted any tutoring announcements yet.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#64748b",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>❌</div>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1.5rem", fontWeight: "600", color: "#374151" }}>
              Teacher not found
            </h3>
            <p style={{ margin: 0, fontSize: "1rem" }}>
              The teacher profile you're looking for doesn't exist or has been removed.
            </p>
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
            .teacher-profile-grid {
              grid-template-columns: 1fr !important;
            }
            
            .teacher-info-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  )
}

export default TeacherProfile
