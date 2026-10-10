import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organization: '',
    date: '',
    position: '',
  });

  const fetchAchievements = async () => {
    try {
      const res = await API.get('/achievements');
      if (res.data.success) setAchievements(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleOpenModal = (ach = null) => {
    if (ach) {
      setEditingId(ach._id);
      setFormData({
        title: ach.title || '',
        description: ach.description || '',
        organization: ach.organization || '',
        date: ach.date || '',
        position: ach.position || '',
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', organization: '', date: '', position: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/admin/achievements/${editingId}`, formData);
      } else {
        await API.post('/admin/achievements', formData);
      }
      setIsModalOpen(false);
      fetchAchievements();
    } catch (err) {
      alert('Error saving achievement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete achievement?')) return;
    try {
      await API.delete(`/admin/achievements/${id}`);
      fetchAchievements();
    } catch (err) {
      alert('Error deleting achievement');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader title="Manage Achievements" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Achievements & Leadership ({achievements.length})</h2>
          <button onClick={() => handleOpenModal()} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Achievement</span>
          </button>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <div className="space-y-4">
            {achievements.map((a) => (
              <div key={a._id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">{a.title}</h3>
                  <p className="text-xs text-blue-500">{a.organization} • {a.date}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{a.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenModal(a)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(a._id)} className="p-2 rounded-lg bg-rose-500/10 text-rose-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Achievement' : 'Add Achievement'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white">Save</button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default AdminAchievements;
