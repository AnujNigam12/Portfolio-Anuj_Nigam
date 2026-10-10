import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Dedicated Multi-Page Public Routes
import Home from './pages/public/Home';
import AboutPage from './pages/public/AboutPage';
import ProjectsPage from './pages/public/ProjectsPage';
import ProjectDetail from './pages/public/ProjectDetail';
import SkillsPage from './pages/public/SkillsPage';
import ExperiencePage from './pages/public/ExperiencePage';
import EducationPage from './pages/public/EducationPage';
import CertificationsPage from './pages/public/CertificationsPage';
import AchievementsPage from './pages/public/AchievementsPage';
import CodingProfilesPage from './pages/public/CodingProfilesPage';
import ContactPage from './pages/public/ContactPage';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminSkills from './pages/admin/AdminSkills';
import AdminExperience from './pages/admin/AdminExperience';
import AdminEducation from './pages/admin/AdminEducation';
import AdminCertifications from './pages/admin/AdminCertifications';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminMessages from './pages/admin/AdminMessages';
import AdminIntegrations from './pages/admin/AdminIntegrations';
import AdminSyncLogs from './pages/admin/AdminSyncLogs';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* PUBLIC MULTI-PAGE ROUTES */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/certifications" element={<CertificationsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/coding-profiles" element={<CodingProfilesPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* ADMIN AUTHENTICATION ROUTE */}
            <Route path="/admin/login" element={<Login />} />

            {/* PROTECTED ADMIN ROUTES */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/projects" element={<AdminProjects />} />
                <Route path="/admin/skills" element={<AdminSkills />} />
                <Route path="/admin/experience" element={<AdminExperience />} />
                <Route path="/admin/education" element={<AdminEducation />} />
                <Route path="/admin/certifications" element={<AdminCertifications />} />
                <Route path="/admin/achievements" element={<AdminAchievements />} />
                <Route path="/admin/messages" element={<AdminMessages />} />
                <Route path="/admin/integrations" element={<AdminIntegrations />} />
                <Route path="/admin/sync-logs" element={<AdminSyncLogs />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* FALLBACK CATCH-ALL ROUTE */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
