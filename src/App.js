import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

// Admin
import AdminLogin from './adminComponent/AdminLogin';

// Credentials Change
// import ChangeCredentials from './ChangeCredentials';
import ChangeStudentCredentials from './components/ChangeStudentCredentials';

// Register && Login
import RegisterForm from './RegisterForm';
import CombinedLogin from './CombinedLogin';

// Student Side
// import Login from './components/Login';
// import Register from './components/Register';
import AnnouncementDetails from './components/Details';
import StudentDashboard from './components/StudentDashboard';
import Favorites from './components/Favourites';
import TeacherProfile from './components/TeacherProfile';

// Tutor Side
import TeacherDashboard from './teacherComponent/teacherDashboard';
import EditTeacherProfile from './teacherComponent/EditTeacherProfile';
// import TeacherLogin from './teacherComponent/teacherLogin';
// import TeacherRegisterForm from './teacherComponent/TRegister';
import AdminDashboard from './adminComponent/AdminDashboard';

import Home from './Home';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/announcements/:id" element={<AnnouncementDetails />} />
          <Route path="/teacher-profile/:teacherId" element={<TeacherProfile />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/favorites" element={<Favorites />} />

          <Route path='/main_register_form' element={<RegisterForm />}></Route>
          <Route path='/main_login_form' element={<CombinedLogin />}></Route>

          {/* <Route path="/teacher_login" element={<TeacherLogin />}/> */}
          <Route path="/teacher_dashboard" element={<TeacherDashboard />}/>
          <Route path="/edit_teacher/:id" element={<EditTeacherProfile />}/>
          {/* <Route path="/teacher_reg" element={<TeacherRegisterForm />}/> */}

          <Route path="/student/change_credentials/:id" element={<ChangeStudentCredentials />} />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
