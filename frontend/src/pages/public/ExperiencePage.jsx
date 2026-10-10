import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

const ExperiencePage = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExp = async () => {
      try {
        const res = await API.get('/experience');
        if (res.data.success) {
          setExperience(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExp();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Work <span className="gradient-text">Experience</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Professional engineering internships, production feature ownership, and database optimization roles.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-8 sm:before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-indigo-500 before:to-purple-500">
          {experience.map((exp, idx) => (
            <div key={exp._id || exp.company} className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="w-full glass-card p-5 sm:p-8 rounded-3xl space-y-4 hover:border-blue-500/50 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{exp.role}</h2>
                    <p className="text-base font-semibold text-blue-500">{exp.company}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500">
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {exp.startDate} – {exp.endDate || 'Present'}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside leading-relaxed">
                  {Array.isArray(exp.description)
                    ? exp.description.map((bullet, i) => <li key={i}>{bullet}</li>)
                    : <li>{exp.description}</li>}
                </ul>

                {exp.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperiencePage;
