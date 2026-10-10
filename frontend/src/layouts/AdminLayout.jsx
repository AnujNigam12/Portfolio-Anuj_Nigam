import React, { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminNavContext = createContext({ open: false, setOpen: () => {} });
export const useAdminNav = () => useContext(AdminNavContext);

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the drawer on navigation
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the drawer is open on small screens
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AdminNavContext.Provider value={{ open, setOpen }}>
      <div className="min-h-screen flex bg-gray-100 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100">
        {open && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
        <AdminSidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Outlet />
        </div>
      </div>
    </AdminNavContext.Provider>
  );
};

export default AdminLayout;
