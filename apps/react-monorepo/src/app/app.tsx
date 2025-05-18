import NxWelcome from './nx-welcome';

import { Route, Routes, Link } from 'react-router-dom';
import { useState } from 'react';

function YouTubeComments() {
  const [url, setUrl] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    setError('');
    setComments([]);
    try {
      const res = await fetch(`/api/comments?url=${encodeURIComponent(url)}`);
      if (!res.ok) {
        throw new Error('Request failed');
      }
      const data = await res.json();
      setComments(data.comments || []);
    } catch (e) {
      setError('Failed to load comments');
    }
  };

  return (
    <div className="p-4">
      <input
        className="border p-1 mr-2"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="YouTube URL"
      />
      <button className="bg-blue-500 text-white px-2 py-1" onClick={fetchComments}>
        Load Comments
      </button>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="mt-2 list-disc pl-4">
        {comments.map((c, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: c }} />
        ))}
      </ul>
    </div>
  );
}

export function App() {
  return (
    <div>
      <NxWelcome title="react-monorepo" />
      <YouTubeComments />

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={<YouTubeComments />}
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
