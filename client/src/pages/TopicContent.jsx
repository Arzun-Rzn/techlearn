// src/pages/TopicContent.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TopicContent.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // or choose another theme

const TopicContent = () => {
  const { slug } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setTopic(null);
      setLoading(false);
      return;
    }

    const fetchTopic = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/topics/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Topic not found');
          }
          throw new Error('Failed to fetch topic');
        }
        const data = await response.json();
        setTopic(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [slug]);

  if (!slug) {
    return (
      <div className="topic-placeholder">
        <h1>Welcome to TechLearn</h1>
        <p>Select a topic from the sidebar to start learning.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="topic-loading">Loading topic...</div>;
  }

  if (error) {
    return <div className="topic-error">Error: {error}</div>;
  }

  if (!topic) {
    return <div className="topic-not-found">Topic not found</div>;
  }

  return (
    <div className="topic-content">
      <h1>{topic.title}</h1>

      {topic.description && (
        <p className="topic-desc">{topic.description}</p>
      )}

      <div className="topic-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {topic.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default TopicContent;