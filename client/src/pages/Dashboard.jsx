// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ← added this import
import './Dashboard.css';

const Dashboard = () => {
  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // added for better UX

  const navigate = useNavigate();

  // Check authentication first
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // If token exists, fetch topics
    const fetchTopics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/topics');
        setTopics(res.data);
      } catch (err) {
        console.error('Failed to fetch topics:', err);
        // Optional: if token invalid → logout
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [navigate]); // ← dependency array includes navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    };

    try {
      if (editingId) {
        // Update existing topic
        const res = await axios.put(
          `http://localhost:5000/api/topics/${editingId}`,
          formData,
          config
        );
        setTopics(topics.map((t) => (t._id === editingId ? res.data : t)));
        setEditingId(null);
      } else {
        // Create new topic
        const res = await axios.post(
          'http://localhost:5000/api/topics',
          formData,
          config
        );
        setTopics([...topics, res.data]);
      }

      // Reset form
      setFormData({ title: '', slug: '', description: '', content: '' });
    } catch (err) {
      console.error('Error saving topic:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleEdit = (topic) => {
    setFormData({
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      content: topic.content,
    });
    setEditingId(topic._id);
  };

  const handleDelete = async (id) => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    };

    try {
      await axios.delete(`http://localhost:5000/api/topics/${id}`, config);
      setTopics(topics.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Error deleting topic:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  if (isLoading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Admin Dashboard - Manage Topics</h1>

      <form onSubmit={handleSubmit} className="topic-form">
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          name="slug"
          placeholder="Slug (e.g. intro-to-js)"
          value={formData.slug}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Short Description"
          value={formData.description}
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="Content (use Markdown for definitions, code boxes, etc.)"
          value={formData.content}
          onChange={handleChange}
          rows={10}
          required
        />
        <button type="submit">
          {editingId ? 'Update Topic' : 'Add Topic'}
        </button>
      </form>

      <h2>Existing Topics</h2>
      {topics.length === 0 ? (
        <p>No topics yet. Add one above.</p>
      ) : (
        <ul className="topic-list">
          {topics.map((topic) => (
            <li key={topic._id} className="topic-item">
              <span>
                {topic.title} <small>({topic.slug})</small>
              </span>
              <div className="actions">
                <button onClick={() => handleEdit(topic)}>Edit</button>
                <button onClick={() => handleDelete(topic._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;