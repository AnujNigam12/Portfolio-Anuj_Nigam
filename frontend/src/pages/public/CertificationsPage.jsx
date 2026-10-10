import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Award, ExternalLink, Calendar, Clock, CheckCircle2 } from 'lucide-react';

const CertificationsPage = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await API.get('/certifications');
        if (res.data.success) {
          setCerts(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Professional <span className="gradient-text">Certifications</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Verified technical certifications from NPTEL, IITs, and industry platforms.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((cert) => (
            <div key={cert._id || cert.name} className="glass-card glass-card-hover p-6 rounded-3xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{cert.name}</h2>
                <p className="text-xs font-semibold text-blue-500">{cert.issuer}</p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {cert.issueDate && (
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-500" />Issued: {cert.issueDate}
                    </span>
                  )}
                  {cert.duration && (
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-500" />Duration: {cert.duration}
                    </span>
                  )}
                  {cert.credentialId && (
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 break-all">ID: {cert.credentialId}</span>
                  )}
                </div>
                {cert.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{cert.description}</p>
                )}
              </div>

              {cert.credentialUrl && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1 min-h-[36px]"
                  >
                    <span>View Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificationsPage;
