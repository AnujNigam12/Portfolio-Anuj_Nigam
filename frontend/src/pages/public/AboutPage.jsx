import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, GraduationCap, Code2, Award, ArrowRight, FileText } from 'lucide-react';

const AboutPage = () => {
  const { settings } = useOutletContext();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          About <span className="gradient-text">Anuj Nigam</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          MERN Stack Developer with 1+ year of experience building production full-stack applications with React, Next.js, Node.js, Express, and MongoDB.
        </p>
      </div>

      {/* Main Profile Glass Card */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          <div className="lg:col-span-1 flex flex-col items-center text-center space-y-4">
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full p-1.5 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 shadow-2xl">
              <img
                src={settings?.profileImageUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnujNigam'}
                alt="Anuj Nigam"
                className="w-full h-full rounded-full object-cover bg-gray-900"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {settings?.name || 'Anuj Nigam'}
              </h2>
              <p className="text-sm font-semibold text-blue-500 mt-1">
                {settings?.headline || 'MERN Stack Developer'}
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-2">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>{settings?.location || 'Lucknow, Uttar Pradesh, India'}</span>
              </div>
            </div>

            {settings?.resumeUrl && (
              <a
                href={settings.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
              >
                <FileText className="w-4 h-4" />
                <span>Download Resume</span>
              </a>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Professional Background</h3>
              <p className="text-base text-gray-600 dark:text-gray-300">
                {settings?.bio ||
                  'MERN Stack Developer with 1+ year of experience shipping and maintaining production full-stack applications across two dev-team roles and independent projects. Comfortable owning a feature from API design through deployment on Render, Vercel, and Railway.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800 text-sm">
              <div className="p-4 rounded-2xl bg-gray-100/80 dark:bg-gray-800/60 space-y-1">
                <span className="text-xs font-bold text-gray-500 uppercase">Degree</span>
                <span className="block font-bold text-gray-900 dark:text-white">B.Tech in Information Technology</span>
                <span className="text-xs text-blue-500 font-semibold">CGPA: 8.05 (2022 - 2026)</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-100/80 dark:bg-gray-800/60 space-y-1">
                <span className="text-xs font-bold text-gray-500 uppercase">Specialization</span>
                <span className="block font-bold text-gray-900 dark:text-white">MERN Stack, Next.js & RESTful APIs</span>
                <span className="text-xs text-indigo-500 font-semibold">End-to-End System Ownership</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-100/80 dark:bg-gray-800/60 space-y-1">
                <span className="text-xs font-bold text-gray-500 uppercase">Email Contact</span>
                <a href={`mailto:${settings?.email}`} className="block font-bold text-blue-500 hover:underline">
                  {settings?.email || 'anujnig.07@gmail.com'}
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-gray-100/80 dark:bg-gray-800/60 space-y-1">
                <span className="text-xs font-bold text-gray-500 uppercase">Phone</span>
                <span className="block font-bold text-gray-900 dark:text-white">{settings?.phone || '+91 9140499809'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/skills"
                className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <span>Explore Technical Skills</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/experience"
                className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <span>View Experience & Work</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
