import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navigation from './Navigation';
import Login from "./Admin/Login.js";
import Register from './Admin/Register';
import Reset from './Admin/Reset';
import SLogin from "./Student/SLogin.js";
import SRegister from './Student/SRegister';
import SReset from './Student/SReset';
import TLogin from "./Teacher/TLogin.js";
import TRegister from './Teacher/TRegister';
import TReset from './Teacher/TReset';
import Page from './Admin/Page';
import Welcome from './WelcomePage';
import Teacher from './Teacher/Teacher';
import Student  from "./Student/Student";

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route exact path="/" element={<Welcome />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Navigate to="/page" replace />} />
          <Route exact path="/tlogin" element={<TLogin />} />
          <Route exact path="/tregister" element={<TRegister />} />
          <Route exact path="/treset" element={<TReset />} />
          <Route exact path="/tdashboard" element={<Navigate to="/teacher" replace />} />
          <Route exact path="/slogin" element={<SLogin />} />
          <Route exact path="/sregister" element={<SRegister />} />
          <Route exact path="/sreset" element={<SReset />} />
          <Route exact path="/sdashboard" element={<Navigate to="/student" replace />} />
          <Route exact path="/page" element={<Page />} />
          <Route exact path="/teacher" element={<Teacher />} />
          <Route exact path="/student" element={<Student />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
