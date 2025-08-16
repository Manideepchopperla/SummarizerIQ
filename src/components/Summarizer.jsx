import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function Summarizer() {
  const [title, setTitle] = useState('');
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [editedSummary, setEditedSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailSending, setEmailSending] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTranscript(event.target.result);
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid text file');
    }
  };

  const generateSummary = async () => {
    if (!transcript.trim()) {
      alert('Please provide a transcript');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/summaries/generate`,
        {
          title: title.trim() || undefined,
          transcript,
          prompt: prompt || 'Summarize the following meeting notes in a clear and structured format'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSummary(response.data.summary);
      setEditedSummary(response.data.summary);
    } catch (err) {
      console.error('Error generating summary:', err);
      alert('Error generating summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    if (!editedSummary.trim() || !emailRecipients.trim()) {
      alert('Please provide both summary and email recipients');
      return;
    }
    setEmailSending(true);
    try {
      const token = localStorage.getItem('token');
      const recipients = emailRecipients.split(',').map(email => email.trim());
      await axios.post(
        `${API_BASE_URL}/summaries/share`,
        { summary: editedSummary, recipients },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Summary sent successfully!');
      setEmailRecipients('');
    } catch (err) {
      console.error('Error sending email:', err);
      alert('Error sending email. Please try again.');
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Meeting Summarizer</h1>

      {/* Title Input */}
      <div className="bg-white p-6 rounded-lg shadow border mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Title of Summary (Optional)</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for this summary"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Transcript Input */}
      <div className="bg-white p-6 rounded-lg shadow border mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">1. Upload or Paste Transcript</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Text File</label>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Or Paste Transcript</label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript here..."
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Custom Prompt */}
      <div className="bg-white p-6 rounded-lg shadow border mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">2. Custom Instructions (Optional)</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Summarize in bullet points for executives' or 'Highlight only action items'"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Generate Summary Button */}
      <div className="mb-6">
        <button
          onClick={generateSummary}
          disabled={loading || !transcript.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Generating Summary...' : 'Generate Summary'}
        </button>
      </div>

      {/* Summary Output */}
      {summary && (
        <div className="bg-white p-6 rounded-lg shadow border mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">3. Generated Summary (Editable)</h2>
          <textarea
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Email Sharing */}
      {summary && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-medium text-gray-900 mb-4">4. Share via Email</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email Addresses (comma-separated)
            </label>
            <input
              type="text"
              value={emailRecipients}
              onChange={(e) => setEmailRecipients(e.target.value)}
              placeholder="email1@example.com, email2@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={sendEmail}
            disabled={emailSending || !editedSummary.trim() || !emailRecipients.trim()}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {emailSending ? 'Sending...' : 'Send Summary'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Summarizer;
