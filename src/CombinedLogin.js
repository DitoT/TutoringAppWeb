import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

const CombinedLogin = () => {
  const [role, setRole] = useState("student")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (role === "student" && localStorage.getItem("isLoggedIn") === "true") {
      navigate("/dashboard")
    }
  }, [navigate, role])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const url = role === "teacher" ? "http://localhost:5000/api/teacher_auth" : "http://localhost:5000/api/student_auth"

    try {
      const response = await axios.post(url, { username, password })
      const data = response.data

      if (data.success) {
        if (role === "teacher" && data.teacher) {
          const { token, teacher } = data
          if (!teacher?.id) return setError("Invalid teacher response")
          localStorage.setItem("token", token)
          localStorage.setItem("teacherId", teacher.id)
          navigate("/teacher_dashboard")
        } else if (role === "student" && data.student) {
          const { token } = data
          const { id, username } = data.student
          localStorage.setItem("token", token)
          localStorage.setItem("isLoggedIn", "true")
          localStorage.setItem("username", username)
          localStorage.setItem("studentId", id.toString())
          navigate("/dashboard")
        } else {
          setError("User data missing in response")
        }
      } else {
        setError("Invalid credentials")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
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
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "40px",
          width: "100%",
          maxWidth: "450px",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "16px",
            }}
          >
            🎓
          </div>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: "2rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Welcome Back
          </h2>
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "1rem",
            }}
          >
            Sign in to your account to continue
          </p>
        </div>

        {/* Role Selection */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#374151",
              fontSize: "0.9rem",
            }}
          >
            <span style={{ marginRight: "8px" }}>👤</span>
            Login as
          </label>
          <select
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "1rem",
              background: "white",
              transition: "all 0.3s ease",
              outline: "none",
              fontFamily: "inherit",
            }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = "#667eea"
              e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb"
              e.target.style.boxShadow = "none"
            }}
          >
            <option value="student">🎓 Student</option>
            <option value="teacher">👨‍🏫 Teacher</option>
          </select>
        </div>

        <form onSubmit={handleLogin}>
          {/* Username Field */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#374151",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ marginRight: "8px" }}>✉️</span>
              Username
            </label>
            <input
              type="text"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                outline: "none",
                fontFamily: "inherit",
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea"
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb"
                e.target.style.boxShadow = "none"
              }}
              required
              placeholder="Enter your username"
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#374151",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ marginRight: "8px" }}>🔒</span>
              Password
            </label>
            <input
              type="password"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                outline: "none",
                fontFamily: "inherit",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea"
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb"
                e.target.style.boxShadow = "none"
              }}
              required
              placeholder="Enter your password"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: "linear-gradient(135deg, #fee2e2, #fecaca)",
                border: "1px solid #f87171",
                color: "#dc2626",
                padding: "12px 16px",
                borderRadius: "12px",
                marginBottom: "24px",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ marginRight: "8px" }}>⚠️</span>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: isLoading
                ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                : "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = "translateY(-2px)"
                e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.4)"
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = "translateY(0)"
                e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)"
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
                Signing in...
              </>
            ) : (
              <>🚀 Sign In</>
            )}
          </button>
        </form>

        {/* Sign Up Link for Students */}
        {role === "student" && (
          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
              padding: "16px",
              background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
              borderRadius: "12px",
              border: "1px solid #bae6fd",
            }}
          >
            <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Don't have an account?{" "}
              <Link
                to="/main_register_form"
                style={{
                  color: "#667eea",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#4f46e5")}
                onMouseLeave={(e) => (e.target.style.color = "#667eea")}
              >
                Sign up here
              </Link>
            </span>
          </div>
        )}

        {/* Back to Home Button */}
        <div style={{ marginTop: "24px" }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              padding: "12px 24px",
              background: "transparent",
              color: "#64748b",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: "500",
              textDecoration: "none",
              transition: "all 0.3s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#667eea"
              e.target.style.color = "#667eea"
              e.target.style.background = "rgba(102, 126, 234, 0.05)"
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#e5e7eb"
              e.target.style.color = "#64748b"
              e.target.style.background = "transparent"
            }}
          >
            ← Go Back to Home
          </Link>
        </div>
      </div>

      {/* CSS Animation for loading spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default CombinedLogin
