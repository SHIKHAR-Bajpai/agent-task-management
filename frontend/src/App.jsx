import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import AgentManagement from './components/AgentManagement';
import TaskManagement from './components/TaskManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/agent-management" element={<AgentManagement />} />
        <Route path='/task-management' element={ < TaskManagement/>}/>
      </Routes>
    </Router>
  );
}

export default App;
