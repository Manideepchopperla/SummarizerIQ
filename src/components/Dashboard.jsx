import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL+'/api';

function Dashboard() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewSummary, setViewSummary] = useState(null);
  const [shareSummary, setShareSummary] = useState(null);
  const [recipientEmails, setRecipientEmails] = useState('');
  const [sharingLoading, setSharingLoading] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [titleEditing, setTitleEditing] = useState(false);
  const [savingTitle, setSavingTitle] = useState(false);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/summaries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummaries(response.data);
    } catch (err) {
      console.error('Error fetching summaries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenView = (summary) => {
    setViewSummary(summary);
    setEditTitle(summary.title || 'Meeting Summary');
    setTitleEditing(false);
  };

  const handleCloseView = () => {
    setViewSummary(null);
    setTitleEditing(false);
  };

  const saveTitle = async () => {
    if (!editTitle.trim()) {
      alert('Title cannot be empty');
      return;
    }
    setSavingTitle(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/summaries/${viewSummary._id}`, 
        { title: editTitle }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setViewSummary(prev => ({ ...prev, title: editTitle }));
      setSummaries(prev =>
        prev.map(s => (s._id === viewSummary._id ? { ...s, title: editTitle } : s))
      );
      setTitleEditing(false);
    } catch (err) {
      console.error('Error updating title:', err);
      alert('Failed to update title');
    } finally {
      setSavingTitle(false);
    }
  };

  const handleOpenShare = (summary) => {
    setShareSummary(summary);
  };

  const handleCloseShare = () => {
    setShareSummary(null);
    setRecipientEmails('');
  };

  const handleSendShare = async () => {
    if (!recipientEmails.trim()) {
      alert('Please enter recipient email addresses');
      return;
    }

    setSharingLoading(true);
    try {
      const token = localStorage.getItem('token');
      const recipients = recipientEmails.split(',').map(email => email.trim());

      await axios.post(`${API_BASE_URL}/summaries/share`, {
        summary: shareSummary.content,
        recipients,
        summaryId: shareSummary._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Summary sent successfully!');
      handleCloseShare();
    } catch (err) {
      console.error('Error sending summary:', err);
      alert('Failed to send summary. Please try again.');
    } finally {
      setSharingLoading(false);
    }
  };

  const handleDeleteSummary = async (id) => {
    if (!window.confirm('Are you sure you want to delete this summary?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/summaries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummaries(prevSummaries => prevSummaries.filter(s => s._id !== id));
    } catch (err) {
      console.error('Failed to delete summary:', err);
      alert('Could not delete summary. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/summarizer"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          New Summary
        </Link>
      </div>

      {summaries.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No summaries yet</h3>
          <p className="text-gray-600 mb-4">Create your first meeting summary to get started.</p>
          <Link
            to="/summarizer"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Summary
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map((summary) => (
            <div key={summary._id} className="bg-white p-6 rounded-lg shadow border flex flex-col justify-between">
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate max-w-[70%]">
                    {summary.title || 'Meeting Summary'}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(summary.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 line-clamp-3">
                  {summary.content.substring(0, 200)}...
                </p>
              </div>

              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="text-sm text-gray-500 truncate max-w-[50%]">
                  Prompt: {summary.prompt.substring(0, 50)}...
                </span>
                <div className="flex space-x-2 flex-wrap">
                  <button
                    onClick={() => handleOpenView(summary)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleOpenShare(summary)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => handleDeleteSummary(summary._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Summary Modal */}
      {viewSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-full sm:max-w-3xl md:max-w-4xl shadow-lg relative max-h-[90vh] overflow-y-auto w-full">
            <button
              onClick={handleCloseView}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
              aria-label="Close view modal"
            >
              &times;
            </button>

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center flex-wrap gap-4">
              {titleEditing ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 flex-grow min-w-[200px]"
                    placeholder="Enter title"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={saveTitle}
                      disabled={savingTitle}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {savingTitle ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setTitleEditing(false)}
                      className="px-3 py-1 rounded border border-gray-400 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold truncate">{viewSummary.title || 'Meeting Summary'}</h2>
                  <button
                    onClick={() => setTitleEditing(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline ml-4"
                  >
                    Edit Title
                  </button>
                </>
              )}
            </div>

            <p className="mb-1 text-sm">
              <strong>Created At:</strong> {new Date(viewSummary.createdAt).toLocaleString()}
            </p>
            <p className="mb-1 text-sm">
              <strong>Updated At:</strong> {new Date(viewSummary.updatedAt).toLocaleString()}
            </p>
            <p className="mb-2 text-sm">
              <strong>Prompt:</strong> {viewSummary.prompt}
            </p>

            <section className="mb-6 max-h-60 overflow-y-auto bg-gray-50 p-4 rounded border whitespace-pre-wrap">
              <h3 className="font-semibold mb-2">Summary:</h3>
              {viewSummary.content}
            </section>

            <section className="max-h-72 overflow-y-auto bg-gray-50 p-4 rounded border whitespace-pre-wrap">
              <h3 className="font-semibold mb-2">Transcript:</h3>
              {viewSummary.transcript}
            </section>
          </div>
        </div>
      )}

      {/* Share Summary Modal */}
      {shareSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg relative">
            <button
              onClick={handleCloseShare}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
              aria-label="Close share modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Share Summary</h2>
            <p className="mb-4 text-sm text-gray-600">
              Enter recipient email addresses separated by commas
            </p>
            <textarea
              value={recipientEmails}
              onChange={(e) => setRecipientEmails(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded p-2 mb-4"
              placeholder="email1@example.com, email2@example.com"
            />
            <div className="flex justify-end">
              <button
                onClick={handleCloseShare}
                className="mr-3 px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
                disabled={sharingLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSendShare}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                disabled={sharingLoading}
              >
                {sharingLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
