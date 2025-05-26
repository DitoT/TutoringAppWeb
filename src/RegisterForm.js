import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

const RegisterForm = () => {
  const [userType, setUserType] = useState("Student")
  const [isLoading, setIsLoading] = useState(false)
  const [studentData, setStudentData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
  })

  const [teacherData, setTeacherData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    subject: "",
    price: "",
    img_url: "",
    availability: "",
    tutoring_location: "Online",
    username: "",
    password: "",
  })

  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // 'success' or 'error'

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value)
    setMessage("")
    setMessageType("")
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (userType === "Student") {
      setStudentData((prev) => ({ ...prev, [name]: value }))
    } else {
      setTeacherData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      if (userType === "Student") {
        const response = await axios.post("http://localhost:5000/api/student_register", studentData)
        if (response.data) {
          setMessage("Student registration successful!")
          setMessageType("success")
          setStudentData({ firstname: "", lastname: "", email: "", username: "", password: "" })
        }
      } else {
        const response = await axios.post("http://localhost:5000/api/register_teachers", teacherData)
        if (response.data.success) {
          setMessage(
            "Your application to register as teacher has been sent, our support will approve as soon as possible.",
          )
          setMessageType("success")
          setTeacherData({
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            address: "",
            description: "",
            subject: "",
            price: "",
            img_url: "",
            availability: "",
            tutoring_location: "Online",
            username: "",
            password: "",
          })
        } else {
          setMessage(`Error: ${response.data.message}`)
          setMessageType("error")
        }
      }
    } catch (error) {
      console.error(error)
      setMessage("Registration failed. Please try again.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
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
    fontSize: "0.9rem",
  }

  const fieldContainerStyle = {
    marginBottom: "20px",
  }

  const handleInputFocus = (e) => {
    e.target.style.borderColor = "#667eea"
    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
  }

  const handleInputBlur = (e) => {
    e.target.style.borderColor = "#e5e7eb"
    e.target.style.boxShadow = "none"
  }

  const renderInput = (label, name, type = "text", value, required = true, icon = "📝") => (
    <div style={fieldContainerStyle}>
      <label style={labelStyle}>
        <span style={{ marginRight: "8px" }}>{icon}</span>
        {label}
        {required && <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        style={inputStyle}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        required={required}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  )

  const renderTextarea = (label, name, value, icon = "📄") => (
    <div style={fieldContainerStyle}>
      <label style={labelStyle}>
        <span style={{ marginRight: "8px" }}>{icon}</span>
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        style={{
          ...inputStyle,
          minHeight: "100px",
          resize: "vertical",
        }}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        rows="4"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  )

  const renderSelect = (label, name, value, options, icon = "📋") => (
    <div style={fieldContainerStyle}>
      <label style={labelStyle}>
        <span style={{ marginRight: "8px" }}>{icon}</span>
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        style={inputStyle}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )

  const renderStudentForm = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      <div>
        {renderInput("First Name", "firstname", "text", studentData.firstname, true, "👤")}
        {renderInput("Email", "email", "email", studentData.email, true, "✉️")}
        {renderInput("Password", "password", "password", studentData.password, true, "🔒")}
      </div>
      <div>
        {renderInput("Last Name", "lastname", "text", studentData.lastname, true, "👤")}
        {renderInput("Username", "username", "text", studentData.username, true, "🏷️")}
      </div>
    </div>
  )

  const renderTeacherForm = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      <div>
        {renderInput("First Name", "firstname", "text", teacherData.firstname, true, "👤")}
        {renderInput("Email", "email", "email", teacherData.email, true, "✉️")}
        {renderInput("Address", "address", "text", teacherData.address, false, "🏠")}
        {renderInput("Subject", "subject", "text", teacherData.subject, true, "📚")}
        {renderInput("Image URL", "img_url", "text", teacherData.img_url, false, "🖼️")}
        {renderSelect(
          "Tutoring Location",
          "tutoring_location",
          teacherData.tutoring_location,
          [
            { value: "Online", label: "🌐 Online" },
            { value: "In Person", label: "🏢 In Person" },
            { value: "Both", label: "🔄 Both" },
          ],
          "📍",
        )}
        {renderInput("Username", "username", "text", teacherData.username, true, "🏷️")}
      </div>
      <div>
        {renderInput("Last Name", "lastname", "text", teacherData.lastname, true, "👤")}
        {renderInput("Phone", "phone", "text", teacherData.phone, false, "📞")}
        {renderTextarea("Description", "description", teacherData.description, "📝")}
        {renderInput("Price per Hour ($)", "price", "number", teacherData.price, false, "💰")}
        {renderInput("Availability", "availability", "text", teacherData.availability, false, "⏰")}
        {renderInput("Password", "password", "password", teacherData.password, true, "🔒")}
      </div>
    </div>
  )

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
          top: "5%",
          left: "5%",
          width: "300px",
          height: "300px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(60px)",
          zIndex: 1,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "5%",
          width: "400px",
          height: "400px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: 1,
        }}
      ></div>

      <div
        style={{
          maxWidth: "900px",
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
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>{userType === "Student" ? "🎓" : "👨‍🏫"}</div>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: "2.5rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Join TutorFind
          </h2>
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Create your account and start your learning journey
          </p>
        </div>

        {/* User Type Selection */}
        <div
          style={{
            marginBottom: "32px",
            padding: "24px",
            background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
            borderRadius: "16px",
            border: "1px solid #bae6fd",
          }}
        >
          <label style={labelStyle}>
            <span style={{ marginRight: "8px" }}>👥</span>
            Select User Type
          </label>
          <select
            value={userType}
            onChange={handleUserTypeChange}
            style={{
              ...inputStyle,
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          >
            <option value="Student">🎓 Student - Learn from expert tutors</option>
            <option value="Teacher">👨‍🏫 Teacher - Share your knowledge</option>
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          {userType === "Student" ? renderStudentForm() : renderTeacherForm()}

          {/* Submit Button */}
          <div style={{ marginTop: "32px" }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "16px 24px",
                background: isLoading
                  ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                  : "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
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
                  Creating Account...
                </>
              ) : (
                <>🚀 Register as {userType}</>
              )}
            </button>
          </div>
        </form>

        {/* Success/Error Message */}
        {message && (
          <div
            style={{
              marginTop: "24px",
              padding: "16px 20px",
              borderRadius: "12px",
              border: `1px solid ${messageType === "success" ? "#10b981" : "#f87171"}`,
              background:
                messageType === "success"
                  ? "linear-gradient(135deg, #d1fae5, #a7f3d0)"
                  : "linear-gradient(135deg, #fee2e2, #fecaca)",
              color: messageType === "success" ? "#065f46" : "#dc2626",
              display: "flex",
              alignItems: "center",
              fontSize: "0.95rem",
            }}
          >
            <span style={{ marginRight: "12px", fontSize: "1.2rem" }}>{messageType === "success" ? "✅" : "⚠️"}</span>
            {message}
          </div>
        )}

        {/* Navigation Links */}
        <div style={{ marginTop: "32px", display: "flex", gap: "16px" }}>
          <Link
            to="/main_login_form"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "transparent",
              color: "#667eea",
              border: "2px solid #667eea",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: "500",
              textDecoration: "none",
              transition: "all 0.3s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#667eea"
              e.target.style.color = "white"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent"
              e.target.style.color = "#667eea"
            }}
          >
            🔑 Already have an account?
          </Link>
          <Link
            to="/"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
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

        {/* Additional Info for Teachers */}
        {userType === "Teacher" && (
          <div
            style={{
              marginTop: "24px",
              padding: "20px",
              background: "linear-gradient(135deg, #fef3c7, #fde68a)",
              borderRadius: "12px",
              border: "1px solid #f59e0b",
              color: "#92400e",
              fontSize: "0.9rem",
              lineHeight: "1.6",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ fontSize: "1.2rem" }}>💡</span>
              <div>
                <strong>Teacher Application Process:</strong>
                <br />
                Your application will be reviewed by our team. We'll verify your credentials and contact you within 2-3
                business days. Make sure to provide accurate information to speed up the approval process.
              </div>
            </div>
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
            .form-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  )
}

export default RegisterForm
