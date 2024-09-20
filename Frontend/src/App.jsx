import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Register';
import Login from './components/Login';
import Navbar from './components/navbar.jsx';
import Projects from './components/Projects';
import Account from './components/Account.jsx';
import { getCookie } from './components/Cookies';
import Confirm from './components/Confirm.jsx';
import EditUser from './components/EditUser.jsx';
import HandleUsers from './components/HandleUsers.jsx';
import Dashboard from './components/Dashboard.jsx';
import UsersProjects from './components/UsersProjects.jsx';
import './index.css';



function App() {
  const user = getCookie('user');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Projects /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />}/>
        <Route path="/account/confirm" element={<Confirm />}></Route>
        <Route path="/account/edituser" element={<EditUser/>}></Route>
        <Route path="/account/handleusers" element={<HandleUsers/>}></Route>
        <Route path="/projects" element={user ? <Projects /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/projects/usersprojects" element={<UsersProjects />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
