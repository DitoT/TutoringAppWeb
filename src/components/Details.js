import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

const AnnouncementDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [announcement, setAnnouncement] = useState(null)
  const [teacher, setTeacher] = useState(null)
  const [reviews, setReviews] = useState([])
  const [studentId, setStudentId] = useState("")
  const [rating, setRating] = useState("")
  const [reviewText, setReviewText] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch announcement by ID
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/announcements/${id}`)
        const data = await response.json()
        if (data.success && data.data) {
          setAnnouncement(data.data)
        } else {
          setError("Announcement not found.")
        }
      } catch (err) {
        setError("Failed to fetch announcement.")
      } finally {
        setLoading(false)
      }
    }
    fetchAnnouncement()
  }, [id])

  // Fetch teacher details based on the teacher_id in the announcement
  useEffect(() => {
    if (!announcement || !announcement.teacher_id) {
      return
    }

    const fetchTeacher = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teachers/${announcement.teacher_id}`)
        const data = await response.json()
        if (data.success && data.data) {
          setTeacher(data.data)
        } else {
          console.log("Teacher data not found.")
        }
      } catch (err) {
        console.error("Failed to fetch teacher", err)
      }
    }

    fetchTeacher()
  }, [announcement])

  // Fetch reviews for the announcement
  useEffect(() => {
    const fetchReviews = async () => {
      if (!announcement?.id) return
      try {
        const response = await fetch(`http://localhost:5000/api/announcementReviews/${announcement.id}`)
        const data = await response.json()
        if (data.success && data.data) {
          setReviews(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch reviews")
      }
    }
    fetchReviews()
  }, [announcement])

  const handleMoreInfoClick = () => {
    if (teacher?.id) navigate(`/teacher-profile/${teacher.id}`)
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()

    if (!studentId.trim() || !rating || !reviewText.trim()) {
      alert("All fields are required.")
      return
    }

    const numericRating = Number(rating)
    if (numericRating < 1 || numericRating > 5) {
      alert("Rating must be between 1 and 5.")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/announcementReviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          announcement_id: announcement.id,
          rating: numericRating,
          review: reviewText,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setReviews([data.data, ...reviews])
        setStudentId("")
        setRating("")
        setReviewText("")
      } else {
        alert(data.message || "Failed to submit review.")
      }
    } catch (err) {
      alert("Error submitting review.")
      console.error(err)
    }
  }

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
          <p style={{ color: "#64748b", margin: 0, fontSize: "1.1rem" }}>Loading announcement details...</p>
        </div>
      </div>
    )
  }

  if (error) {
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
            maxWidth: "500px",
            margin: "0 20px",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>⚠️</div>
          <h2
            style={{
              color: "#ef4444",
              marginBottom: "16px",
              fontSize: "1.5rem",
              fontWeight: "700",
            }}
          >
            Error
          </h2>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "0 auto",
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
            ← Back to Dashboard
          </button>
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
            <span style={{ fontSize: "2.5rem" }}>📋</span>
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
                Tutoring Details
              </h1>
              <p style={{ margin: 0, color: "#64748b", fontSize: "1rem" }}>
                {announcement?.subject || "Subject Information"}
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
        {/* Announcement Details Card */}
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
              📚
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "2.2rem",
                  fontWeight: "700",
                  color: "#1a1a1a",
                  marginBottom: "4px",
                }}
              >
                {announcement?.subject || "No Subject Provided"}
              </h2>
              <p style={{ margin: 0, color: "#64748b", fontSize: "1rem" }}>Tutoring Session Details</p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "32px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid #bae6fd",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span style={{ fontSize: "1.5rem" }}>💰</span>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "600", color: "#374151" }}>Pricing</h3>
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: "#059669",
                  marginBottom: "8px",
                }}
              >
                ${announcement?.price || "0"}
                <span style={{ fontSize: "1rem", fontWeight: "500", color: "#64748b" }}>/hour</span>
              </div>
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>Competitive hourly rate</p>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid #f59e0b",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span style={{ fontSize: "1.5rem" }}>📅</span>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "600", color: "#374151" }}>Posted Date</h3>
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#92400e",
                  marginBottom: "8px",
                }}
              >
                {announcement?.created_at ? new Date(announcement.created_at).toLocaleDateString() : "Unknown"}
              </div>
              <p style={{ margin: 0, color: "#92400e", fontSize: "0.9rem", opacity: 0.8 }}>
                When this session was posted
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: "32px",
              padding: "24px",
              background: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <span style={{ fontSize: "1.5rem" }}>📝</span>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "600", color: "#374151" }}>Description</h3>
            </div>
            <p
              style={{
                margin: 0,
                color: "#4b5563",
                lineHeight: "1.7",
                fontSize: "1rem",
              }}
            >
              {announcement?.content || "No description provided for this tutoring session."}
            </p>
          </div>
        </div>

        {/* Teacher Details Card */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #10b981, #059669)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
              }}
            >
              👨‍🏫
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  color: "#059669",
                  marginBottom: "4px",
                }}
              >
                Teacher Information
              </h3>
              <p style={{ margin: 0, color: "#64748b", fontSize: "1rem" }}>Meet your potential tutor</p>
            </div>
          </div>

          {teacher ? (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  marginBottom: "24px",
                  padding: "24px",
                  background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                  borderRadius: "16px",
                  border: "1px solid #a7f3d0",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "2rem",
                    fontWeight: "700",
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  {teacher.firstname ? teacher.firstname.charAt(0).toUpperCase() : "T"}
                </div>
                <div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "4px",
                    }}
                  >
                    {teacher.firstname} {teacher.lastname}
                  </h4>
                  <p style={{ margin: 0, color: "#059669", fontSize: "1rem", fontWeight: "500" }}>Professional Tutor</p>
                </div>
              </div>

              <div
                style={{
                  padding: "20px",
                  background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
                  borderRadius: "12px",
                  border: "1px solid #bae6fd",
                  marginBottom: "24px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "1.2rem" }}>⏰</span>
                  <span style={{ fontWeight: "600", color: "#374151", fontSize: "1rem" }}>Availability:</span>
                </div>
                <p
                  style={{
                    margin: 0,
                    color: "#0369a1",
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  {teacher.availability || "Please contact for availability information"}
                </p>
              </div>

              <button
                onClick={handleMoreInfoClick}
                style={{
                  padding: "16px 32px",
                  background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 15px rgba(6, 182, 212, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-3px)"
                  e.target.style.boxShadow = "0 12px 30px rgba(6, 182, 212, 0.4)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 15px rgba(6, 182, 212, 0.3)"
                }}
              >
                ℹ️ More Information About This Teacher
              </button>
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
              <p style={{ margin: 0, fontSize: "1.1rem" }}>Loading teacher information...</p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
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
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
              }}
            >
              ⭐
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  color: "#f59e0b",
                  marginBottom: "4px",
                }}
              >
                Student Reviews
              </h3>
              <p style={{ margin: 0, color: "#64748b", fontSize: "1rem" }}>
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"} from students
              </p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#64748b",
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                borderRadius: "16px",
                border: "1px solid #f59e0b",
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>💭</div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "1.3rem", fontWeight: "600", color: "#92400e" }}>
                No reviews yet
              </h4>
              <p style={{ margin: 0, fontSize: "1rem", color: "#92400e", opacity: 0.8 }}>
                Be the first to leave a review for this tutor!
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "20px", marginBottom: "40px" }}>
              {reviews.map((review) => (
                <div
                  key={review.id}
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
                      marginBottom: "16px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          background: "linear-gradient(135deg, #f59e0b, #d97706)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "1.2rem",
                          fontWeight: "700",
                          boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
                        }}
                      >
                        {review.student_name ? review.student_name.charAt(0).toUpperCase() : "S"}
                      </div>
                      <div>
                        <h5
                          style={{
                            margin: 0,
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            color: "#1a1a1a",
                            marginBottom: "4px",
                          }}
                        >
                          {review.student_name}
                        </h5>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                style={{
                                  color: i < (review.rating || 0) ? "#fbbf24" : "#e5e7eb",
                                  fontSize: "1rem",
                                }}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                          <span style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: "500" }}>
                            {review.rating || 0}/5
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        color: "#64748b",
                        fontSize: "0.9rem",
                        background: "#f3f4f6",
                        padding: "4px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      {review.created_at ? new Date(review.created_at).toLocaleDateString() : "Unknown date"}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      color: "#374151",
                      lineHeight: "1.6",
                      fontSize: "1rem",
                      fontStyle: "italic",
                    }}
                  >
                    "{review.review || "No review text provided."}"
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Review Form */}
          <div
            style={{
              background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
              padding: "32px",
              borderRadius: "20px",
              border: "1px solid #bae6fd",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <span style={{ fontSize: "1.5rem" }}>📝</span>
              <h4
                style={{
                  margin: 0,
                  fontSize: "1.4rem",
                  fontWeight: "700",
                  color: "#1a1a1a",
                }}
              >
                Leave a Review
              </h4>
            </div>
            <p style={{ margin: "0 0 24px 0", color: "#64748b", fontSize: "1rem" }}>
              Share your experience with this tutor to help other students make informed decisions.
            </p>

            <form onSubmit={handleReviewSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "0.95rem",
                    }}
                  >
                    👤 Student ID
                  </label>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      outline: "none",
                      fontFamily: "inherit",
                      background: "white",
                    }}
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter your student ID"
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
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "0.95rem",
                    }}
                  >
                    ⭐ Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      outline: "none",
                      fontFamily: "inherit",
                      background: "white",
                    }}
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="Rate 1-5 stars"
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
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "0.95rem",
                  }}
                >
                  💬 Your Review
                </label>
                <textarea
                  rows="5"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    outline: "none",
                    fontFamily: "inherit",
                    resize: "vertical",
                    minHeight: "120px",
                    background: "white",
                  }}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this tutor. What did you like? How did they help you learn?"
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
              <button
                type="submit"
                style={{
                  padding: "16px 32px",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-3px)"
                  e.target.style.boxShadow = "0 12px 30px rgba(102, 126, 234, 0.4)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)"
                }}
              >
                🚀 Submit Review
              </button>
            </form>
          </div>
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
            .grid-responsive {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  )
}

export default AnnouncementDetails
