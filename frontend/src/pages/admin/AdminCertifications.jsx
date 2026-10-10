import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminCertifications = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    duration: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
  });

  const fetchCerts = async () => {
    try {
      const res = await API.get('/certifications');
      if (res.data.success) setCerts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleOpenModal = (cert = null) => {
    if (cert) {
      setEditingId(cert._id);
      setFormData({
        name: cert.name || '',
        issuer: cert.issuer || '',
        issueDate: cert.issueDate || '',
        duration: cert.duration || '',
        description: cert.description || '',
        credentialId: cert.credentialId || '',
        credentialUrl: cert.credentialUrl || '',
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', issuer: '', issueDate: '', duration: '', credentialId: '', credentialUrl: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/admin/certifications/${editingId}`, formData);
      } else {
        await API.post('/admin/certifications', formData);
      }
      setIsModalOpen(false);
      fetchCerts();
    } catch (err) {
      alert('Error saving certification');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete certification?')) return;
    try {
      await API.delete(`/admin/certifications/${id}`);
      fetchCerts();
    } catch (err) {
      alert('Error deleting certification');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader title="Manage Certifications" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Certifications ({certs.length})</h2>
          <button onClick={() => handleOpenModal()} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Certification</span>
          </button>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <div className="space-y-4">
            {certs.map((c) => (
              <div key={c._id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-6 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">{c.name}</h3>
                  <p className="text-xs text-blue-500">{c.issuer}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-x-3">
                    {c.issueDate && <span>Issued: {c.issueDate}</span>}
                    {c.duration && <span>Duration: {c.duration}</span>}
                    {c.credentialId && <span>ID: {c.credentialId}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenModal(c)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(c._id)} className="p-2 rounded-lg bg-rose-500/10 text-rose-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Certification' : 'Add Certification'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Certification Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Issuer</label>
              <input type="text" required value={formData.issuer} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Issue Date</label>
              <input type="text" value={formData.issueDate} placeholder="e.g. Mar 2025" onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Duration</label>
              <input type="text" value={formData.duration} placeholder="e.g. 6 Months" onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
            </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Credential ID</label>
              <input type="text" value={formData.credentialId} placeholder="Optional" onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Credential URL</label>
              <input type="url" value={formData.credentialUrl} placeholder="https://..." onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea rows={3} value={formData.description} placeholder="Optional short summary" onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
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

export default AdminCertifications;
