import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ArrowLeft, Github, ExternalLink, Calendar, Code2 } from 'lucide-react';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await API.get(`/projects/${slug}`);
        if (res.data.success) {
          setProject(res.data.data);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading project');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-rose-500">{error || 'Project Not Found'}</h2>
        <Link to="/projects" className="text-blue-500 hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-500 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="h-64 sm:h-96 relative bg-gray-900 overflow-hidden">
          <img
            src={project.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8 sm:p-12 space-y-8">
          <div className="space-y-3 border-b border-gray-200 dark:border-gray-800 pb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider">
                {project.status || 'Completed'}
              </span>
              {(project.startDate || project.endDate) && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {project.startDate} {project.endDate && `- ${project.endDate}`}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
              {project.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">{project.shortDescription}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Project Overview</h3>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-gray-900 dark:bg-gray-800 text-white font-semibold text-sm flex items-center gap-2 hover:bg-gray-800 transition"
              >
                <Github className="w-4 h-4" />
                <span>View GitHub Repository</span>
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
