import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { GraduationCap, Award, Calendar, BookOpen } from 'lucide-react';

const EducationPage = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEdu = async () => {
      try {
        const res = await API.get('/education');
        if (res.data.success) {
          setEducation(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEdu();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Education & <span className="gradient-text">Qualifications</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Academic background, degree program, and academic performance.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <div className="space-y-6">
          {education.map((edu) => (
            <div key={edu._id || edu.institution} className="glass-card glass-card-hover p-8 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{edu.institution}</h2>
                    <p className="text-base font-semibold text-blue-500">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {edu.startYear} – {edu.endYear}
                  </span>
                  {edu.cgpa && (
                    <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                      {edu.gradeType === 'Percentage' ? `Percentage: ${edu.cgpa}%` : `CGPA: ${edu.cgpa}`}
                    </span>
                  )}
                </div>
              </div>

              {edu.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationPage;
