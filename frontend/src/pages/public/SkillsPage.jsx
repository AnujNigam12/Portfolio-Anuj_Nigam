import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Cpu, Terminal, Code2, Layers, Database, Brain, Cloud, Wrench, BarChart3 } from 'lucide-react';

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await API.get('/skills');
        if (res.data.success) {
          setSkills(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories = ['All', ...new Set(skills.map((s) => s.category))];

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  const skillsByCategory = filteredSkills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Programming': return Terminal;
      case 'Frontend': return Code2;
      case 'Backend': return Layers;
      case 'Database': return Database;
      case 'AI/ML': return Brain;
      case 'Cloud': return Cloud;
      case 'Tools': return Wrench;
      case 'Data & Analytics': return BarChart3;
      default: return Cpu;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Technical <span className="gradient-text">Skills</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Core languages, backend frameworks, relational/NoSQL databases, data science tools, and cloud platforms.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(skillsByCategory).map(([category, items]) => {
            const Icon = getCategoryIcon(category);
            return (
              <div key={category} className="glass-card p-6 rounded-3xl space-y-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span>{category}</span>
                </h2>

                <div className="space-y-3">
                  {items.map((skill) => (
                    <div key={skill._id || skill.name} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{skill.name}</span>
                      <span className="px-2.5 py-1 rounded-md font-semibold bg-gray-100 dark:bg-gray-800 text-blue-500">
                        {skill.level || 'Intermediate'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
