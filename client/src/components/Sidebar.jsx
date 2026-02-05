// src/components/Sidebar.jsx
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true); // default open on desktop
  const { slug } = useParams();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/topics');
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  if (loading) {
    return <aside className="sidebar loading">Loading topics...</aside>;
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        {isOpen ? (
          <>
            <h2>Course Topics</h2>
            <button className="close-btn" onClick={toggleSidebar} aria-label="Close sidebar">
              ×
            </button>
          </>
        ) : (
          <button className="hamburger" onClick={toggleSidebar} aria-label="Open sidebar">
            ☰
          </button>
        )}
      </div>

      {isOpen && (
        <ul className="topic-list">
          {topics.map((topic) => (
            <li key={topic.slug}>
              <Link
                to={`/${topic.slug}`}
                className={`topic-link ${slug === topic.slug ? 'active' : ''}`}
              >
                {topic.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default Sidebar;