import { useEffect, useState } from "react"
import axios from "axios"

const AdminDashboard = () => {
  const [teacherRequests, setTeacherRequests] = useState([])
  const [contactMessages, setContactMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")
  const [activeTab, setActiveTab] = useState("teachers")
  const [stats, setStats] = useState({
    pendingTeachers: 0,
    totalMessages: 0,
    approvedToday: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, contactRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/teacher_requests"),
          axios.get("http://localhost:5000/api/from_contact_form"),
        ])

        const teachers = teacherRes.data.data || []
        const messages = contactRes.data.data || []

        setTeacherRequests(teachers)
        setContactMessages(messages)

        // Calculate stats
        setStats({
          pendingTeachers: teachers.length,
          totalMessages: messages.length,
          approvedToday: 0, // This would need to be calculated from actual data
        })
      } catch (err) {
        console.error("Error fetching data:", err)
        setMessage("Failed to load data.")
        setMessageType("error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAction = async (id, action) => {
    if (action === "reject" && !window.confirm("Are you sure you want to reject this teacher request?")) {
      return
    }

    setActionLoadingId(id)
    setMessage("")

    try {
      const endpoint =
        action === "approve"
          ? `http://localhost:5000/api/admin/teachers/${id}/approve`
          : `http://localhost:5000/api/admin/teachers/${id}/reject`

      await axios.post(endpoint)
      setTeacherRequests((prev) => prev.filter((req) => req.id !== id))
      setMessage(`Teacher request ${action}d successfully.`)
      setMessageType("success")

      // Update stats
      setStats((prev) => ({
        ...prev,
        pendingTeachers: prev.pendingTeachers - 1,
        approvedToday: action === "approve" ? prev.approvedToday + 1 : prev.approvedToday,
      }))
    } catch (error) {
      console.error(`Failed to ${action} teacher request:`, error)
      setMessage(`Failed to ${action} teacher request. Please try again.`)
      setMessageType("error")
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return

    try {
      await axios.delete(`http://localhost:5000/api/contact/${id}`)
      setContactMessages((prev) => prev.filter((msg) => msg.id !== id))
      setMessage("Message deleted successfully.")
      setMessageType("success")

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalMessages: prev.totalMessages - 1,
      }))
    } catch (error) {
      console.error("Failed to delete message:", error)
      setMessage("Failed to delete message. Please try again.")
      setMessageType("error")
    }
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      window.location.href = "http://localhost:3000/admin"
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)",
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
              borderTop: "4px solid #dc2626",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          ></div>
          <p style={{ color: "#64748b", margin: 0, fontSize: "1.1rem" }}>Loading admin dashboard...</p>
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
          borderBottom: "1px solid rgba(220, 38, 38, 0.1)",
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
            <span style={{ fontSize: "2.5rem" }}>🛡️</span>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #dc2626, #991b1b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Admin Dashboard
              </h1>
              <p style={{ margin: 0, color: "#64748b", fontSize: "1rem" }}>TutorFind Administration Panel</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 15px rgba(220, 38, 38, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)"
              e.target.style.boxShadow = "0 8px 25px rgba(220, 38, 38, 0.4)"
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = "0 4px 15px rgba(220, 38, 38, 0.3)"
            }}
          >
            🚪 Logout
          </button>
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
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              color: "white",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(220, 38, 38, 0.3)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>👨‍🏫</div>
            <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "4px" }}>{stats.pendingTeachers}</div>
            <div style={{ opacity: 0.9 }}>Pending Teacher Requests</div>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #059669, #047857)",
              color: "white",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(5, 150, 105, 0.3)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📧</div>
            <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "4px" }}>{stats.totalMessages}</div>
            <div style={{ opacity: 0.9 }}>Contact Messages</div>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #0891b2, #0e7490)",
              color: "white",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(8, 145, 178, 0.3)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>✅</div>
            <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "4px" }}>{stats.approvedToday}</div>
            <div style={{ opacity: 0.9 }}>Approved Today</div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            style={{
              background:
                messageType === "success"
                  ? "linear-gradient(135deg, #d1fae5, #a7f3d0)"
                  : "linear-gradient(135deg, #fee2e2, #fecaca)",
              border: `1px solid ${messageType === "success" ? "#10b981" : "#f87171"}`,
              color: messageType === "success" ? "#065f46" : "#dc2626",
              padding: "16px 20px",
              borderRadius: "12px",
              marginBottom: "24px",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>{messageType === "success" ? "✅" : "⚠️"}</span>
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px",
            padding: "8px",
            marginBottom: "24px",
            display: "flex",
            gap: "8px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <button
            onClick={() => setActiveTab("teachers")}
            style={{
              flex: 1,
              padding: "12px 24px",
              background: activeTab === "teachers" ? "linear-gradient(135deg, #dc2626, #991b1b)" : "transparent",
              color: activeTab === "teachers" ? "white" : "#64748b",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            👨‍🏫 Teacher Requests ({stats.pendingTeachers})
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            style={{
              flex: 1,
              padding: "12px 24px",
              background: activeTab === "messages" ? "linear-gradient(135deg, #dc2626, #991b1b)" : "transparent",
              color: activeTab === "messages" ? "white" : "#64748b",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            📧 Contact Messages ({stats.totalMessages})
          </button>
        </div>

        {/* Content Area */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            padding: "32px",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {activeTab === "teachers" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <span style={{ fontSize: "1.5rem" }}>👨‍🏫</span>
                <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "600", color: "#1a1a1a" }}>
                  Pending Teacher Registrations
                </h3>
              </div>

              {teacherRequests.length === 0 ? (
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
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>✨</div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "1.3rem", fontWeight: "600", color: "#374151" }}>
                    All caught up!
                  </h4>
                  <p style={{ margin: 0, fontSize: "1rem" }}>No pending teacher registrations at the moment.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "20px" }}>
                  {teacherRequests.map((teacher) => (
                    <div
                      key={teacher.id}
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
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                            <div
                              style={{
                                width: "50px",
                                height: "50px",
                                background: "linear-gradient(135deg, #dc2626, #991b1b)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "1.2rem",
                                fontWeight: "700",
                              }}
                            >
                              {teacher.firstname ? teacher.firstname.charAt(0).toUpperCase() : "T"}
                            </div>
                            <div>
                              <h4
                                style={{
                                  margin: 0,
                                  fontSize: "1.3rem",
                                  fontWeight: "600",
                                  color: "#1a1a1a",
                                }}
                              >
                                {teacher.firstname} {teacher.lastname}
                              </h4>
                              <div
                                style={{
                                  background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
                                  color: "#0369a1",
                                  padding: "2px 8px",
                                  borderRadius: "12px",
                                  fontSize: "0.8rem",
                                  fontWeight: "500",
                                  display: "inline-block",
                                }}
                              >
                                {teacher.subject || "No subject specified"}
                              </div>
                            </div>
                          </div>

                          <p
                            style={{
                              margin: "0 0 16px 0",
                              color: "#4b5563",
                              lineHeight: "1.6",
                              fontSize: "1rem",
                            }}
                          >
                            {teacher.description || "No description provided."}
                          </p>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                              gap: "12px",
                              marginBottom: "20px",
                            }}
                          >
                            <div
                              style={{
                                background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #a7f3d0",
                              }}
                            >
                              <div style={{ fontSize: "0.8rem", color: "#059669", fontWeight: "600" }}>📧 Email</div>
                              <div style={{ fontSize: "0.9rem", color: "#065f46" }}>{teacher.email}</div>
                            </div>
                            <div
                              style={{
                                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #f59e0b",
                              }}
                            >
                              <div style={{ fontSize: "0.8rem", color: "#d97706", fontWeight: "600" }}>📞 Phone</div>
                              <div style={{ fontSize: "0.9rem", color: "#92400e" }}>{teacher.phone || "N/A"}</div>
                            </div>
                            <div
                              style={{
                                background: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #f9a8d4",
                              }}
                            >
                              <div style={{ fontSize: "0.8rem", color: "#be185d", fontWeight: "600" }}>💰 Price</div>
                              <div style={{ fontSize: "0.9rem", color: "#9d174d" }}>
                                {teacher.price != null ? `$${teacher.price}/hr` : "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                        <button
                          disabled={actionLoadingId === teacher.id}
                          onClick={() => handleAction(teacher.id, "approve")}
                          style={{
                            padding: "10px 20px",
                            background:
                              actionLoadingId === teacher.id
                                ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                                : "linear-gradient(135deg, #10b981, #059669)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            cursor: actionLoadingId === teacher.id ? "not-allowed" : "pointer",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                          }}
                          onMouseEnter={(e) => {
                            if (actionLoadingId !== teacher.id) {
                              e.target.style.transform = "translateY(-2px)"
                              e.target.style.boxShadow = "0 8px 25px rgba(16, 185, 129, 0.4)"
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (actionLoadingId !== teacher.id) {
                              e.target.style.transform = "translateY(0)"
                              e.target.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.3)"
                            }
                          }}
                        >
                          {actionLoadingId === teacher.id ? (
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
                              Processing...
                            </>
                          ) : (
                            <>✅ Approve</>
                          )}
                        </button>
                        <button
                          disabled={actionLoadingId === teacher.id}
                          onClick={() => handleAction(teacher.id, "reject")}
                          style={{
                            padding: "10px 20px",
                            background:
                              actionLoadingId === teacher.id
                                ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                                : "linear-gradient(135deg, #ef4444, #dc2626)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            cursor: actionLoadingId === teacher.id ? "not-allowed" : "pointer",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                          }}
                          onMouseEnter={(e) => {
                            if (actionLoadingId !== teacher.id) {
                              e.target.style.transform = "translateY(-2px)"
                              e.target.style.boxShadow = "0 8px 25px rgba(239, 68, 68, 0.4)"
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (actionLoadingId !== teacher.id) {
                              e.target.style.transform = "translateY(0)"
                              e.target.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)"
                            }
                          }}
                        >
                          {actionLoadingId === teacher.id ? (
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
                              Processing...
                            </>
                          ) : (
                            <>❌ Reject</>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "messages" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <span style={{ fontSize: "1.5rem" }}>📧</span>
                <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "600", color: "#1a1a1a" }}>
                  Contact Form Submissions
                </h3>
              </div>

              {contactMessages.length === 0 ? (
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
                    No messages yet
                  </h4>
                  <p style={{ margin: 0, fontSize: "1rem" }}>No contact form submissions have been received.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "20px" }}>
                  {contactMessages.map((msg) => (
                    <div
                      key={msg.id}
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
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                            <div
                              style={{
                                width: "50px",
                                height: "50px",
                                background: "linear-gradient(135deg, #059669, #047857)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "1.2rem",
                                fontWeight: "700",
                              }}
                            >
                              {msg.fullname ? msg.fullname.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <h4
                                style={{
                                  margin: 0,
                                  fontSize: "1.2rem",
                                  fontWeight: "600",
                                  color: "#1a1a1a",
                                }}
                              >
                                {msg.fullname}
                              </h4>
                              <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>{msg.email}</p>
                            </div>
                          </div>

                          <div
                            style={{
                              background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
                              padding: "12px",
                              borderRadius: "8px",
                              border: "1px solid #bae6fd",
                              marginBottom: "16px",
                            }}
                          >
                            <div
                              style={{ fontSize: "0.8rem", color: "#0369a1", fontWeight: "600", marginBottom: "4px" }}
                            >
                              📋 Subject
                            </div>
                            <div style={{ fontSize: "1rem", color: "#1e40af", fontWeight: "500" }}>{msg.subject}</div>
                          </div>

                          <div
                            style={{
                              background: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
                              padding: "16px",
                              borderRadius: "8px",
                              border: "1px solid #e5e7eb",
                              marginBottom: "16px",
                            }}
                          >
                            <div
                              style={{ fontSize: "0.8rem", color: "#374151", fontWeight: "600", marginBottom: "8px" }}
                            >
                              💬 Message
                            </div>
                            <p
                              style={{
                                margin: 0,
                                color: "#4b5563",
                                lineHeight: "1.6",
                                fontSize: "1rem",
                                fontStyle: "italic",
                              }}
                            >
                              "{msg.message}"
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          style={{
                            padding: "10px 20px",
                            background: "linear-gradient(135deg, #ef4444, #dc2626)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                            minWidth: "100px",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)"
                            e.target.style.boxShadow = "0 8px 25px rgba(239, 68, 68, 0.4)"
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)"
                            e.target.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)"
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
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
            .admin-header {
              flex-direction: column !important;
              align-items: flex-start !important;
            }
            
            .admin-tabs {
              flex-direction: column !important;
            }
            
            .admin-stats {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  )
}

export default AdminDashboard
