import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Trophy, Shield, Calendar, ExternalLink } from 'lucide-react';

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAch = async () => {
      try {
        const res = await API.get('/achievements');
        if (res.data.success) {
          setAchievements(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAch();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Leadership & <span className="gradient-text">Achievements</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Honors, hackathon finalist titles, and tech community leadership positions.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((ach) => (
            <div key={ach._id || ach.title} className="glass-card glass-card-hover p-6 sm:p-8 rounded-3xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Trophy className="w-6 h-6" />
                  </div>
                  {ach.date && (
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-500" />
                      {ach.date}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{ach.title}</h2>
                {ach.organization && <p className="text-xs font-semibold text-blue-500">{ach.organization}</p>}
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{ach.description}</p>
              </div>

              {ach.proofUrl && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                  <a
                    href={ach.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 min-h-[36px]"
                  >
                    <span>Verification Link</span>
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

export default AchievementsPage;
