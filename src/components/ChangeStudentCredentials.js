import { useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

const ChangeStudentCredentials = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const handleChange = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const token = localStorage.getItem("token")

    try {
      const response = await axios.post(
        `http://localhost:5000/api/student_cred_change/${id}`,
        {
          currentPassword,
          newPassword,
          newUsername,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.data.success) {
        setSuccess(response.data.message)
        setError("")
        setTimeout(() => navigate("/dashboard"), 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
      setSuccess("")
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "inherit",
    background: "white",
  }

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#374151",
    fontSize: "0.95rem",
  }

  const handleInputFocus = (e) => {
    e.target.style.borderColor = "#667eea"
    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
  }

  const handleInputBlur = (e) => {
    e.target.style.borderColor = "#e5e7eb"
    e.target.style.boxShadow = "none"
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "200px",
          height: "200px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(40px)",
          zIndex: 1,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "300px",
          height: "300px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "50%",
          filter: "blur(60px)",
          zIndex: 1,
        }}
      ></div>

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⚙️</div>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: "2.2rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Change Credentials
          </h2>
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Update your account username and password
          </p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div
            style={{
              background: "linear-gradient(135deg, #fee2e2, #fecaca)",
              border: "1px solid #f87171",
              color: "#dc2626",
              padding: "16px 20px",
              borderRadius: "12px",
              marginBottom: "24px",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
              border: "1px solid #10b981",
              color: "#065f46",
              padding: "16px 20px",
              borderRadius: "12px",
              marginBottom: "24px",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>✅</span>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleChange}>
          {/* Current Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>
              <span style={{ marginRight: "8px" }}>🔒</span>
              Current Password
              <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showCurrentPassword ? "text" : "password"}
                style={{
                  ...inputStyle,
                  paddingRight: "50px",
                }}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  color: "#64748b",
                  padding: "4px",
                }}
              >
                {showCurrentPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>
              <span style={{ marginRight: "8px" }}>🔑</span>
              New Password
              <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showNewPassword ? "text" : "password"}
                style={{
                  ...inputStyle,
                  paddingRight: "50px",
                }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  color: "#64748b",
                  padding: "4px",
                }}
              >
                {showNewPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <div
              style={{
                marginTop: "8px",
                padding: "12px",
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                borderRadius: "8px",
                border: "1px solid #f59e0b",
                fontSize: "0.85rem",
                color: "#92400e",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span>💡</span>
                <strong>Password Requirements:</strong>
              </div>
              <ul style={{ margin: "4px 0 0 20px", paddingLeft: "0" }}>
                <li>At least 8 characters long</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Include at least one number</li>
              </ul>
            </div>
          </div>

          {/* New Username */}
          <div style={{ marginBottom: "32px" }}>
            <label style={labelStyle}>
              <span style={{ marginRight: "8px" }}>👤</span>
              New Username
              <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>
            </label>
            <input
              type="text"
              style={inputStyle}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
              placeholder="Enter your new username"
            />
            <p
              style={{
                margin: "8px 0 0 0",
                color: "#64748b",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>ℹ️</span>
              Username must be unique and contain only letters, numbers, and underscores
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "16px 24px",
                background: isLoading
                  ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                  : "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 8px 25px rgba(16, 185, 129, 0.4)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.3)"
                }
              }}
            >
              {isLoading ? (
                <>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  Updating...
                </>
              ) : (
                <>✅ Update Credentials</>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={isLoading}
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "16px 24px",
                background: "white",
                color: "#64748b",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "inherit",
                opacity: isLoading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = "#667eea"
                  e.target.style.color = "#667eea"
                  e.target.style.background = "rgba(102, 126, 234, 0.05)"
                  e.target.style.transform = "translateY(-2px)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = "#e5e7eb"
                  e.target.style.color = "#64748b"
                  e.target.style.background = "white"
                  e.target.style.transform = "translateY(0)"
                }
              }}
            >
              ← Go Back to Dashboard
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div
          style={{
            marginTop: "32px",
            padding: "20px",
            background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
            borderRadius: "12px",
            border: "1px solid #c4b5fd",
            color: "#6d28d9",
            fontSize: "0.9rem",
            lineHeight: "1.6",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.2rem" }}>🔐</span>
            <div>
              <strong>Security Notice:</strong>
              <br />
              After updating your credentials, you'll be redirected to the dashboard. Make sure to remember your new
              username and password. For security reasons, we recommend using a strong, unique password that you don't
              use elsewhere.
            </div>
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
            .credentials-form {
              padding: 20px !important;
            }
            
            .credentials-buttons {
              flex-direction: column !important;
            }
            
            .credentials-buttons button {
              min-width: auto !important;
            }
          }
        `}
      </style>
    </div>
  )
}

export default ChangeStudentCredentials
