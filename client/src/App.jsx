// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import TopicContent from './pages/TopicContent';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';           // global styles (we'll add below)

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Default view when no slug is selected */}
        <Route index element={<TopicContent />} />
        {/* Dynamic route for any topic slug */}
        <Route path=":slug" element={<TopicContent />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;