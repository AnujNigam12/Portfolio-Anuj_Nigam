import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Mail, Check, Trash2, Clock } from 'lucide-react';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await API.get('/admin/messages');
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await API.put(`/admin/messages/${id}/read`);
      fetchMessages();
    } catch (err) {
      alert('Error updating message status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await API.delete(`/admin/messages/${id}`);
      fetchMessages();
    } catch (err) {
      alert('Error deleting message');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader title="Messages Inbox" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Received Contact Messages ({messages.length})</h2>

        {loading ? (
          <LoadingSpinner size="lg" />
        ) : messages.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center text-gray-500">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p>No messages received yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`bg-white dark:bg-gray-900 border rounded-2xl p-6 space-y-3 transition shadow-sm ${
                  msg.status === 'unread'
                    ? 'border-blue-500/50 dark:border-blue-500/40 bg-blue-500/5'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">{msg.name}</h3>
                      <span className="text-xs text-gray-500">({msg.email})</span>
                      {msg.status === 'unread' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-blue-500 mt-0.5">{msg.subject}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>

                    {msg.status === 'unread' && (
                      <button
                        onClick={() => handleMarkRead(msg._id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Read</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminMessages;
