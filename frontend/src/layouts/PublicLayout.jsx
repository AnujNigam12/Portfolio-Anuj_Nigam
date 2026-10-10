import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../services/api';

const PublicLayout = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get('/settings');
        if (res.data.success) {
          setSettings(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load settings:', err.message);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />
      <main className="flex-1 pt-20 overflow-x-clip">
        <Outlet context={{ settings }} />
      </main>
      <Footer settings={settings} />
    </div>
  );
};

export default PublicLayout;
