import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [userType, setUserType] = useState('Student');
  const [studentData, setStudentData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
  });

  const [teacherData, setTeacherData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    subject: '',
    price: '',
    img_url: '',
    availability: '',
    tutoring_location: 'Online',
    username: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (userType === 'Student') {
      setStudentData(prev => ({ ...prev, [name]: value }));
    } else {
      setTeacherData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userType === 'Student') {
        const response = await axios.post('http://localhost:5000/api/student_register', studentData);
        if (response.data) {
          setMessage('Student registration successful!');
          setStudentData({ firstname: '', lastname: '', email: '', username: '', password: '' });
        }
      } else {
        const response = await axios.post('http://localhost:5000/api/register_teachers', teacherData);
        if (response.data.success) {
          setMessage('Teacher registration successful!');
          setTeacherData({
            firstname: '', lastname: '', email: '', phone: '', address: '', description: '',
            subject: '', price: '', img_url: '', availability: '', tutoring_location: 'Online',
            username: '', password: ''
          });
        } else {
          setMessage(`Error: ${response.data.message}`);
        }
      }
    } catch (error) {
      console.error(error);
      setMessage('Registration failed.');
    }
  };

  const renderInput = (label, name, type = 'text', value, required = true) => (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        className="form-control"
        required={required}
      />
    </div>
  );

  const renderTextarea = (label, name, value) => (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        className="form-control"
        rows="3"
      />
    </div>
  );

  const renderStudentForm = () => (
    <>
      {renderInput('First Name', 'firstname', 'text', studentData.firstname)}
      {renderInput('Last Name', 'lastname', 'text', studentData.lastname)}
      {renderInput('Email', 'email', 'email', studentData.email)}
      {renderInput('Username', 'username', 'text', studentData.username)}
      {renderInput('Password', 'password', 'password', studentData.password)}
    </>
  );

  const renderTeacherForm = () => (
    <>
      {renderInput('First Name', 'firstname', 'text', teacherData.firstname)}
      {renderInput('Last Name', 'lastname', 'text', teacherData.lastname)}
      {renderInput('Email', 'email', 'email', teacherData.email)}
      {renderInput('Phone', 'phone', 'text', teacherData.phone, false)}
      {renderInput('Address', 'address', 'text', teacherData.address, false)}
      {renderTextarea('Description', 'description', teacherData.description)}
      {renderInput('Subject', 'subject', 'text', teacherData.subject)}
      {renderInput('Average price per hour ($)', 'price', 'number', teacherData.price, false)}
      {renderInput('Image URL', 'img_url', 'text', teacherData.img_url, false)}
      {renderInput('Availability', 'availability', 'text', teacherData.availability, false)}
      <div className="mb-3">
        <label className="form-label">Tutoring Location</label>
        <select
          name="tutoring_location"
          value={teacherData.tutoring_location}
          onChange={handleChange}
          className="form-select"
        >
          <option value="Online">Online</option>
          <option value="In Person">In Person</option>
          <option value="Both">Both</option>
        </select>
      </div>
      {renderInput('Username', 'username', 'text', teacherData.username)}
      {renderInput('Password', 'password', 'password', teacherData.password)}
    </>
  );

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4 text-center">Register</h2>

          <div className="mb-4">
            <label className="form-label">Select User Type</label>
            <select
              value={userType}
              onChange={handleUserTypeChange}
              className="form-select"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>

          <form onSubmit={handleSubmit}>
            {userType === 'Student' ? renderStudentForm() : renderTeacherForm()}
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Register as {userType}
            </button>
          </form>

          {message && (
            <div className="alert alert-info mt-4" role="alert">
              {message}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/" className="btn btn-outline-secondary w-100">
              ← Go Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
