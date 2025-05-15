import React, { useState } from 'react';
import axios from 'axios';

const TeacherRegisterForm = () => {
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register_teachers', formData);
      if (response.data.success) {
        setMessage('Registration successful!');
        setFormData({
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
      } else {
        setMessage(`Error: ${response.data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Registration failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register as a Teacher</h2>
      <input name="firstname" value={formData.firstname} onChange={handleChange} placeholder="First Name" required />
      <input name="lastname" value={formData.lastname} onChange={handleChange} placeholder="Last Name" required />
      <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
      <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
      <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" />
      <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Price per hour" />
      <input name="img_url" value={formData.img_url} onChange={handleChange} placeholder="Image URL" />
      <input name="availability" value={formData.availability} onChange={handleChange} placeholder="Availability (e.g. Mon-Fri 9-5)" />
      
      <select name="tutoring_location" value={formData.tutoring_location} onChange={handleChange}>
        <option value="Online">Online</option>
        <option value="In Person">In Person</option>
        <option value="Both">Both</option>
      </select>

      <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
      <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required />

      <button type="submit">Register</button>
      <p>{message}</p>
    </form>
  );
};

export default TeacherRegisterForm;
