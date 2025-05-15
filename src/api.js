import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/'
});

export const loginStudent = (data) => api.post('student_auth', data);
export const registerStudent = (data) => api.post('student_register', data);

export const loginTeacher = (data) => api.post('teacher_auth', data);
export const registerTeacher = (data) => api.post('register_teachers', data);

export const getStudents = () => api.get('students');
export const getTeachers = () => api.get('teachers');


export const getAnnoucments = () => api.get('announcements')
