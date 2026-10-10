import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminExperience = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    startDate: '',
    endDate: 'Present',
    description: '',
    technologies: '',
    order: 0,
  });

  const fetchExperience = async () => {
    try {
      const res = await API.get('/experience');
      if (res.data.success) setExperience(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const handleOpenModal = (exp = null) => {
    if (exp) {
      setEditingId(exp._id);
      setFormData({
        company: exp.company || '',
        role: exp.role || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || 'Present',
        description: Array.isArray(exp.description) ? exp.description.join('\n') : exp.description || '',
        technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : '',
        order: exp.order || 0,
      });
    } else {
      setEditingId(null);
      setFormData({
        company: '',
        role: '',
        location: '',
        startDate: '',
        endDate: 'Present',
        description: '',
        technologies: '',
        order: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      description: formData.description.split('\n').filter(Boolean),
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await API.put(`/admin/experience/${editingId}`, payload);
      } else {
        await API.post('/admin/experience', payload);
      }
      setIsModalOpen(false);
      fetchExperience();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving experience');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete experience entry?')) return;
    try {
      await API.delete(`/admin/experience/${id}`);
      fetchExperience();
    } catch (err) {
      alert('Error deleting experience');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader title="Manage Experience" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Experience Entries ({experience.length})</h2>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp._id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex items-start justify-between shadow-sm">
                <div className="space-y-2 max-w-2xl">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                    <p className="text-sm font-semibold text-blue-500">{exp.company} • {exp.startDate} - {exp.endDate}</p>
                  </div>
                  <ul className="text-xs text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                    {Array.isArray(exp.description) ? exp.description.map((bullet, idx) => <li key={idx}>{bullet}</li>) : <li>{exp.description}</li>}
                  </ul>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenModal(exp)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(exp._id)} className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Experience' : 'Add Experience'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Company</label>
              <input type="text" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <input type="text" required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                <input type="text" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} placeholder="Mar 2026" className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                <input type="text" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} placeholder="Aug 2026 or Present" className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Description Bullets (one per line)</label>
              <textarea rows={4} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Technologies (comma separated)</label>
              <input type="text" value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white">Save Experience</button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default AdminExperience;
