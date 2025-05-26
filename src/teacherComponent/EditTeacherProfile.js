import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

const EditTeacherProfile = () => {
  const [teacherData, setTeacherData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    subject: "",
    phone: "",
    address: "",
    description: "",
    availability: "",
    tutoring_location: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [credError, setCredError] = useState("")
  const [credSuccess, setCredSuccess] = useState("")
  const [credentials, setCredentials] = useState({
    currentPassword: "",
    newPassword: "",
    newUsername: "",
  })

  const navigate = useNavigate()
  const { id } = useParams()
  const token = localStorage.getItem("token")

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTeacherData(response.data.data)
      })
      .catch((err) => {
        setError("Failed to fetch teacher data.")
        console.error(err)
      })
  }, [id, token])

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post(`http://localhost:5000/api/teacher_update/${id}`, teacherData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSuccess("Profile updated successfully!")
        setError("")
        navigate(`/teacher_dashboard`)
      })
      .catch((err) => {
        setError("Failed to update profile.")
        console.error(err)
      })
  }

  const handleCredentialChange = async (e) => {
    e.preventDefault()
    setCredError("")
    setCredSuccess("")

    try {
      const res = await axios.post(`http://localhost:5000/api/tutor_cred_change/${id}`, credentials, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.data.success) {
        setCredSuccess("Credentials updated successfully!")
        setCredentials({
          currentPassword: "",
          newPassword: "",
          newUsername: "",
        })
      } else {
        setCredError(res.data.message || "Failed to update credentials.")
      }
    } catch (err) {
      setCredError("Error updating credentials. Please try again.")
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 0",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "2.5rem",
              fontWeight: "700",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
            }}
          >
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "15px",
                borderRadius: "50%",
                backdropFilter: "blur(10px)",
              }}
            >
              ✏️
            </span>
            Edit Teacher Profile
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "1.1rem",
              margin: "0",
            }}
          >
            Update your professional information and credentials
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div
            style={{
              background: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
              color: "white",
              padding: "15px 20px",
              borderRadius: "12px",
              marginBottom: "25px",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "linear-gradient(135deg, #51cf66, #40c057)",
              color: "white",
              padding: "15px 20px",
              borderRadius: "12px",
              marginBottom: "25px",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <strong>✅ Success:</strong> {success}
          </div>
        )}

        {/* Profile Information Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "40px",
            marginBottom: "30px",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                margin: "0",
                fontSize: "1.5rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              👤 Profile Information
            </h2>
            <p
              style={{
                margin: "5px 0 0 0",
                opacity: "0.9",
                fontSize: "0.95rem",
              }}
            >
              Update your teaching profile details
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "25px",
                marginBottom: "30px",
              }}
            >
              {/* First Name */}
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95rem",
                  }}
                >
                  👤 First Name
                </label>
                <input
                  type="text"
                  value={teacherData.firstname}
                  onChange={(e) => setTeacherData({ ...teacherData, firstname: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "15px 20px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4facfe"
                    e.target.style.background = "white"
                    e.target.style.boxShadow = "0 0 0 3px rgba(79, 172, 254, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e1e5e9"
                    e.target.style.background = "#f8f9fa"
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="Enter your first name"
                />
              </div>

              {/* Last Name */}
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95rem",
                  }}
                >
                  👤 Last Name
                </label>
                <input
                  type="text"
                  value={teacherData.lastname}
                  onChange={(e) => setTeacherData({ ...teacherData, lastname: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "15px 20px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4facfe"
                    e.target.style.background = "white"
                    e.target.style.boxShadow = "0 0 0 3px rgba(79, 172, 254, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e1e5e9"
                    e.target.style.background = "#f8f9fa"
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="Enter your last name"
                />
              </div>

              {/* Email */}
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95rem",
                  }}
                >
                  📧 Email Address
                </label>
                <input
                  type="email"
                  value={teacherData.email}
                  onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "15px 20px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4facfe"
                    e.target.style.background = "white"
                    e.target.style.boxShadow = "0 0 0 3px rgba(79, 172, 254, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e1e5e9"
                    e.target.style.background = "#f8f9fa"
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="Enter your email address"
                />
              </div>

              {/* Subject */}
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95rem",
                  }}
                >
                  📚 Subject
                </label>
                <input
                  type="text"
                  value={teacherData.subject}
                  onChange={(e) => setTeacherData({ ...teacherData, subject: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "15px 20px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4facfe"
                    e.target.style.background = "white"
                    e.target.style.boxShadow = "0 0 0 3px rgba(79, 172, 254, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e1e5e9"
                    e.target.style.background = "#f8f9fa"
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="Enter your teaching subject"
                />
              </div>

              {/* Phone */}
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95rem",
                  }}
                >
                  📞 Phone Number
                </label>
                <input
                  type="text"
                  value={teacherData.phone}
                  onChange={(e) => setTeacherData({ ...teacherData, phone: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "15px 20px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4facfe"
                    e.target.style.background = "white"
                    e.target.style.boxShadow = "0 0 0 3px rgba(79, 172, 254, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e1e5e9"
                    e.target.style.background = "#f8f9fa"
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Address */}
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95rem",
                  }}
                >
                  🏠 Address
                </label>
                <input
                  type="text"
                  value={teacherData.address}
                  onChange={(e) => setTeacherData({ ...teacherData, address: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "15px 20px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4facfe"
                    e.target.style.background = "white"
                    e.target.style.boxShadow = "0 0 0 3px rgba(79, 172, 254, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e1e5e9"
                    e.target.style.background = "#f8f9fa"
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="Enter your address"
                />
              </div>

              {/* Availability */}
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95rem",
                  }}
                >
                  🕒 Availability
                </label>
                <input
                  type="text"
                  value={teacherData.availability}
                  onChange={(e) =>
                    setTeacherData({
                      ...teacherData,
                      availability: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "15px 20px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4facfe"
                    e.target.style.background = "white"
                    e.target.style.boxShadow = "0 0 0 3px rgba(79, 172, 254, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e1e5e9"
                    e.target.style.background = "#f8f9fa"
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="e.g., Mon-Fri 9AM-5PM"
                />
              </div>

              {/* Tutoring Location */}
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95rem",
                  }}
                >
                  📍 Tutoring Location
                </label>
                <input
                  type="text"
                  value={teacherData.tutoring_location}
                  onChange={(e) =>
                    setTeacherData({
                      ...teacherData,
                      tutoring_location: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "15px 20px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4facfe"
                    e.target.style.background = "white"
                    e.target.style.boxShadow = "0 0 0 3px rgba(79, 172, 254, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e1e5e9"
                    e.target.style.background = "#f8f9fa"
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="e.g., Online, Library, Student's home"
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "30px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333",
                  fontSize: "0.95rem",
                }}
              >
                📝 Description
              </label>
              <textarea
                value={teacherData.description}
                onChange={(e) => setTeacherData({ ...teacherData, description: e.target.value })}
                rows="4"
                style={{
                  width: "100%",
                  padding: "15px 20px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  background: "#f8f9fa",
                  boxSizing: "border-box",
                  resize: "vertical",
                  minHeight: "120px",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4facfe"
                  e.target.style.background = "white"
                  e.target.style.boxShadow = "0 0 0 3px rgba(79, 172, 254, 0.1)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e1e5e9"
                  e.target.style.background = "#f8f9fa"
                  e.target.style.boxShadow = "none"
                }}
                placeholder="Describe your teaching experience, qualifications, and approach..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "18px",
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(79, 172, 254, 0.4)",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)"
                e.target.style.boxShadow = "0 8px 25px rgba(79, 172, 254, 0.6)"
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)"
                e.target.style.boxShadow = "0 4px 15px rgba(79, 172, 254, 0.4)"
              }}
            >
              💾 Save Profile Changes
            </button>
          </form>
        </div>

        {/* Credentials Change Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "40px",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
              color: "white",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                margin: "0",
                fontSize: "1.5rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              🔐 Security Settings
            </h2>
            <p
              style={{
                margin: "5px 0 0 0",
                opacity: "0.9",
                fontSize: "0.95rem",
              }}
            >
              Update your login credentials for enhanced security
            </p>
          </div>

          {/* Credential Alert Messages */}
          {credError && (
            <div
              style={{
                background: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
                color: "white",
                padding: "15px 20px",
                borderRadius: "12px",
                marginBottom: "25px",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <strong>❌ Error:</strong> {credError}
            </div>
          )}

          {credSuccess && (
            <div
              style={{
                background: "linear-gradient(135deg, #51cf66, #40c057)",
                color: "white",
                padding: "15px 20px",
                borderRadius: "12px",
                marginBottom: "25px",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <strong>✅ Success:</strong> {credSuccess}
            </div>
          )}

          <form onSubmit={handleCredentialChange}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "25px",
                marginBottom: "30px",
              }}
            >
              {/* New Username */}
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95rem",
                  }}
                >
                  👤 New Username
                </label>
                <input
                  type="text"
                  value={credentials.newUsername}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      newUsername: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "15px 20px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#ff9a9e"
                    e.target.style.background = "white"
                    e.target.style.boxShadow = "0 0 0 3px rgba(255, 154, 158, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e1e5e9"
                    e.target.style.background = "#f8f9fa"
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="Enter new username"
                />
              </div>

              {/* Current Password */}
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95rem",
                  }}
                >
                  🔒 Current Password
                </label>
                <input
                  type="password"
                  value={credentials.currentPassword}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "15px 20px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#ff9a9e"
                    e.target.style.background = "white"
                    e.target.style.boxShadow = "0 0 0 3px rgba(255, 154, 158, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e1e5e9"
                    e.target.style.background = "#f8f9fa"
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="Enter current password"
                />
              </div>

              {/* New Password */}
              <div style={{ position: "relative", gridColumn: "span 2" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95rem",
                  }}
                >
                  🔑 New Password
                </label>
                <input
                  type="password"
                  value={credentials.newPassword}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "15px 20px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "#f8f9fa",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#ff9a9e"
                    e.target.style.background = "white"
                    e.target.style.boxShadow = "0 0 0 3px rgba(255, 154, 158, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e1e5e9"
                    e.target.style.background = "#f8f9fa"
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="Enter new password"
                />
              </div>
            </div>

            {/* Update Credentials Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "18px",
                background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(255, 154, 158, 0.4)",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)"
                e.target.style.boxShadow = "0 8px 25px rgba(255, 154, 158, 0.6)"
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)"
                e.target.style.boxShadow = "0 4px 15px rgba(255, 154, 158, 0.4)"
              }}
            >
              🔐 Update Credentials
            </button>
          </form>
        </div>

        {/* Back to Dashboard Button */}
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            onClick={() => navigate("/teacher_dashboard")}
            style={{
              padding: "15px 30px",
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "2px solid rgba(255,255,255,0.3)",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "rgba(255,255,255,0.3)"
              e.target.style.transform = "translateY(-2px)"
            }}
            onMouseOut={(e) => {
              e.target.style.background = "rgba(255,255,255,0.2)"
              e.target.style.transform = "translateY(0)"
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditTeacherProfile
