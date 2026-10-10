import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../../services/api';
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  FileText,
  ArrowRight,
  ExternalLink,
  Code2,
  Database,
  Terminal,
  Cpu,
  GraduationCap,
  Briefcase,
  Award,
  Trophy,
  Send,
  CheckCircle2,
  Star,
  GitFork,
  BookOpen,
  CheckSquare,
  Sparkles,
  Layers,
  Wrench,
  BarChart3,
  Cloud,
  Brain,
  Calendar,
  Clock,
} from 'lucide-react';

const Home = () => {
  const { settings } = useOutletContext();
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [githubStats, setGithubStats] = useState(null);
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeExperienceId, setActiveExperienceId] = useState(null);

  // Contact Form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          skillsRes,
          projectsRes,
          expRes,
          eduRes,
          certRes,
          achRes,
          githubRes,
          leetcodeRes,
        ] = await Promise.allSettled([
          API.get('/skills'),
          API.get('/projects'),
          API.get('/experience'),
          API.get('/education'),
          API.get('/certifications'),
          API.get('/achievements'),
          API.get('/github'),
          API.get('/leetcode'),
        ]);

        if (skillsRes.status === 'fulfilled' && skillsRes.value.data.success) setSkills(skillsRes.value.data.data);
        if (projectsRes.status === 'fulfilled' && projectsRes.value.data.success) setProjects(projectsRes.value.data.data);
        if (expRes.status === 'fulfilled' && expRes.value.data.success) setExperience(expRes.value.data.data);
        if (eduRes.status === 'fulfilled' && eduRes.value.data.success) setEducation(eduRes.value.data.data);
        if (certRes.status === 'fulfilled' && certRes.value.data.success) setCertifications(certRes.value.data.data);
        if (achRes.status === 'fulfilled' && achRes.value.data.success) setAchievements(achRes.value.data.data);
        if (githubRes.status === 'fulfilled' && githubRes.value.data.success) setGithubStats(githubRes.value.data.data);
        if (leetcodeRes.status === 'fulfilled' && leetcodeRes.value.data.success) setLeetcodeStats(leetcodeRes.value.data.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormSuccess('');
    setFormError('');

    try {
      const res = await API.post('/contact', contactForm);
      if (res.data.success) {
        setFormSuccess(res.data.message || 'Thank you! Your message has been sent successfully.');
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormError(res.data.message || 'Failed to send message.');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error submitting message. Please check input fields.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const getCategoryIcon = (category) => {
    switch (category) {
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
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-8 pt-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-gradient-to-tr from-purple-600/20 via-pink-500/15 to-amber-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold shadow-sm backdrop-blur-md"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Available for Engineering & Software Opportunities</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white"
            >
              Hi, I'm{' '}
              <span className="gradient-text">
                {settings?.heroTitle || 'Anuj Nigam'}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200"
            >
              {settings?.heroSubtitle || 'MERN Stack & Full Stack Web Developer'}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl"
            >
              Building modern software solutions, web applications, and intelligent algorithms. Experienced across web technologies, data pipelines, database architecture, and agile problem solving.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <a
                href="#projects"
                className="min-h-[44px] px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 flex items-center gap-2 transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {settings?.resumeUrl && (
                <a
                  href={settings.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-7 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/80 text-gray-900 dark:text-gray-100 font-bold text-sm sm:text-base flex items-center gap-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Download Resume</span>
                </a>
              )}

              <a
                href="#contact"
                className="min-h-[44px] px-7 py-3.5 rounded-2xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold text-sm sm:text-base flex items-center gap-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Me</span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-4 pt-4 text-gray-500 dark:text-gray-400"
            >
              {settings?.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="min-w-[44px] min-h-[44px] p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:text-blue-500 hover:border-blue-500 transition shadow-sm flex items-center justify-center"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {settings?.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="min-w-[44px] min-h-[44px] p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:text-blue-500 hover:border-blue-500 transition shadow-sm flex items-center justify-center"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  aria-label="Email Anuj Nigam"
                  className="min-w-[44px] min-h-[44px] p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:text-blue-500 hover:border-blue-500 transition shadow-sm flex items-center justify-center"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </motion.div>
          </div>

          {/* Right Visualizer Column (Color Grading & Animated Interactive Graphic) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 relative flex justify-center items-center"
          >
            <div className="relative w-full max-w-md aspect-square rounded-3xl p-1 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/20">
              <div className="w-full h-full rounded-[22px] bg-gray-950/90 backdrop-blur-xl p-6 flex flex-col justify-between overflow-hidden relative border border-white/10">
                {/* Floating Ambient Color Spheres */}
                <motion.div
                  animate={{
                    x: [0, 30, -20, 0],
                    y: [0, -30, 20, 0],
                    scale: [1, 1.2, 0.9, 1],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-4 right-4 w-44 h-44 rounded-full bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 blur-2xl opacity-40 pointer-events-none"
                ></motion.div>

                <motion.div
                  animate={{
                    x: [0, -25, 25, 0],
                    y: [0, 25, -25, 0],
                    scale: [1, 0.9, 1.15, 1],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-4 left-4 w-48 h-48 rounded-full bg-gradient-to-tr from-fuchsia-500 via-pink-600 to-amber-400 blur-2xl opacity-40 pointer-events-none"
                ></motion.div>

                {/* Top Code Header Widget */}
                <div className="flex items-center justify-between z-10 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="text-[11px] font-mono text-blue-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>AnujNigam.dev</span>
                  </span>
                </div>

                {/* Central Interactive Stack Visualizer */}
                <div className="z-10 my-auto space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg space-y-2 transform hover:-translate-y-1 transition duration-300">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-200">
                      <span className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-blue-400" /> Full-Stack Web Development
                      </span>
                      <span className="text-emerald-400 font-mono">100% Active</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.2, delay: 0.6 }}
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full"
                      ></motion.div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Development</span>
                      <span className="text-sm font-extrabold text-blue-400 font-mono">JS / ReactJS / NextJS / NodeJS</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Database & Data</span>
                      <span className="text-sm font-extrabold text-emerald-400 font-mono">MySQL / MongoDB / Supabase</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Live Metrics Pill */}
                <div className="z-10 flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300">
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" /> Clean Architecture & Systems
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                    Production Ready
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 shadow-xl">
                <img
                  src={settings?.profileImageUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnujNigam'}
                  alt="Anuj Nigam"
                  className="w-full h-full rounded-full object-cover bg-gray-900"
                />
              </div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                {settings?.name || 'Anuj Nigam'}
              </h3>
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mt-1">
                {settings?.location || 'Lucknow, Uttar Pradesh, India'}
              </p>
            </div>

            <div className="lg:col-span-2 space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">About Me</h2>
              <p className="text-base">
                {settings?.bio ||
                  'MERN Stack Developer with 1+ year of experience building and deploying scalable full-stack web applications with MongoDB, Express.js, React.js, and Node.js, with a focus on RESTful APIs, backend performance, and application security.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800 text-sm">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white block">Email:</span>
                  <a href={`mailto:${settings?.email}`} className="text-blue-500 hover:underline">
                    {settings?.email || 'anujnig.07@gmail.com'}
                  </a>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white block">Phone:</span>
                  <span>{settings?.phone || '+91 9140499809'}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white block">Education:</span>
                  <span>B.Tech in CSE (2021 - 2025)</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white block">Core Focus:</span>
                  <span>MERN Stack, Next.js & Redux</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SKILLS SECTION */}
      <motion.section
        id="skills"
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="space-y-2 text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Technical Skills</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm sm:text-base">
            Languages, frameworks, databases, and development tools I leverage for scalable solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(skillsByCategory).map(([category, items], catIdx) => {
            const CategoryIcon = getCategoryIcon(category);
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: catIdx * 0.08 }}
                className="glass-card glass-card-hover p-6 rounded-2xl space-y-4"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2.5 border-b border-gray-200 dark:border-gray-800 pb-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <span>{category}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill._id || skill.name}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 border border-gray-200/80 dark:border-gray-700/80 hover:border-blue-500 transition"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* PROJECTS SECTION */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Featured Projects</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base max-w-xl">
              Key applications designed and developed end-to-end.
            </p>
          </div>
          <Link
            to="/projects"
            className="text-blue-500 hover:text-blue-600 font-bold text-sm flex items-center gap-1 min-h-[44px] px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, projIdx) => (
            <motion.div
              key={project._id || project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: projIdx * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden flex flex-col group hover:shadow-2xl hover:border-blue-500/50 transition duration-300"
            >
              <div className="h-48 overflow-hidden relative bg-gray-800">
                <img
                  src={project.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                {project.featured && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold tracking-wider uppercase shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Featured</span>
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition">
                    <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {project.shortDescription || project.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800 text-xs font-bold">
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      >
                        <Github className="w-4 h-4" />
                        <span>Code</span>
                      </a>
                    ) : <div></div>}

                    <Link
                      to={`/projects/${project.slug}`}
                      className="min-h-[36px] flex items-center gap-1 px-3 py-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* EXPERIENCE SECTION (HORIZONTAL TIMELINE & HOTSPOTS) */}
      <motion.section
        id="experience"
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="space-y-2 text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <span>Experience & Trainee Roles</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
              Horizontal Timeline
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm sm:text-base">
            Click on any minimal hotspot card along the horizontal timeline to expand detailed responsibilities.
          </p>
        </div>

        {/* Horizontal Scrollable Timeline */}
        <div className="relative py-8">
          {/* Horizontal Connecting Line */}
          <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/40 to-blue-500/20 -z-0 rounded-full"></div>

          <div className="flex gap-6 overflow-x-auto pb-6 pt-4 px-2 scrollbar-thin scrollbar-thumb-blue-500/20">
            {experience.map((exp, expIdx) => {
              const expId = exp._id || exp.company;
              const isSelected = activeExperienceId === expId;

              return (
                <div key={expId} className="flex-none w-80 sm:w-96 flex flex-col items-center group">
                  {/* Pulsing Hotspot Icon Above Card */}
                  <button
                    onClick={() => setActiveExperienceId(isSelected ? null : expId)}
                    className="relative flex items-center justify-center mb-6 cursor-pointer focus:outline-none"
                    aria-label={`Toggle details for ${exp.role} at ${exp.company}`}
                  >
                    <span className="relative flex h-8 w-8">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSelected ? 'bg-indigo-400' : 'bg-blue-400'} opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-8 w-8 ${isSelected ? 'bg-indigo-600 scale-110' : 'bg-blue-600'} border-4 border-white dark:border-gray-900 shadow-xl items-center justify-center text-white text-xs font-bold transition transform group-hover:scale-110`}>
                        {expIdx + 1}
                      </span>
                    </span>
                  </button>

                  {/* Minimal Card Component */}
                  <div
                    onClick={() => setActiveExperienceId(isSelected ? null : expId)}
                    className={`w-full glass-card p-6 rounded-3xl cursor-pointer space-y-3 border transition-all duration-300 ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-2xl scale-[1.02] bg-blue-500/5'
                        : 'border-gray-200/80 dark:border-gray-800/80 hover:border-blue-500/50 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                        {exp.startDate} – {exp.endDate || 'Present'}
                      </span>
                      <span className="text-xs font-bold text-blue-500 hover:underline">
                        {isSelected ? 'Less ▲' : 'Details ▼'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{exp.role}</h3>
                      <p className="text-sm font-semibold text-blue-500 mt-0.5">{exp.company}</p>
                    </div>

                    {/* Minimal summary preview */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {Array.isArray(exp.description) ? exp.description[0] : exp.description}
                    </p>

                    {/* Expanded Detailed View inside minimal card */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3"
                      >
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Key Contributions</h4>
                        <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 list-disc list-inside leading-relaxed">
                          {Array.isArray(exp.description)
                            ? exp.description.map((bullet, idx) => <li key={idx}>{bullet}</li>)
                            : <li>{exp.description}</li>}
                        </ul>

                        {exp.technologies?.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1.5">Tech Stack</span>
                            <div className="flex flex-wrap gap-1.5">
                              {exp.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* EDUCATION SECTION */}
      <motion.section
        id="education"
        initial={{ opacity: 0, rotateX: -15 }}
        whileInView={{ opacity: 1, rotateX: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="space-y-2 text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Education</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm sm:text-base">
            Academic qualifications and engineering background.
          </p>
        </div>

        <div className="space-y-6">
          {education.map((edu) => (
            <div key={edu._id || edu.institution} className="glass-card glass-card-hover p-6 sm:p-8 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 flex-shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{edu.degree}</h3>
                    <p className="text-base font-semibold text-blue-500">{edu.institution}</p>
                    {edu.field && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{edu.field}</p>
                    )}
                  </div>
                </div>
                <div className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 w-fit">
                  {edu.startYear} – {edu.endYear || 'Present'}
                </div>
              </div>
              {edu.cgpa && (
                <div className="inline-block px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-xs font-bold">
                  {edu.gradeType === 'Percentage' ? `Percentage: ${edu.cgpa}%` : `CGPA: ${edu.cgpa}`}
                </div>
              )}
              {edu.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {/* CERTIFICATIONS SECTION */}
      <motion.section
        id="certifications"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="space-y-2 text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Certifications</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm sm:text-base">
            Professional certifications and verified technical credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert) => (
            <div key={cert._id || cert.name} className="glass-card glass-card-hover p-6 rounded-3xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                    <Award className="w-6 h-6" />
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1 min-h-[36px] px-2"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{cert.name}</h3>
                  <p className="text-sm font-semibold text-indigo-500">{cert.issuer}</p>
                </div>
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
            </div>
          ))}
        </div>
      </motion.section>

      {/* ACHIEVEMENTS SECTION */}
      <motion.section
        id="achievements"
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="space-y-2 text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Achievements & Honors</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm sm:text-base">
            Competitions, hackathons, and technical accomplishments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((ach) => (
            <div key={ach._id || ach.title} className="glass-card glass-card-hover p-6 rounded-3xl space-y-3">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 flex-shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{ach.title}</h3>
                  {ach.date && <p className="text-xs text-amber-500 font-semibold">{ach.date}</p>}
                  {ach.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                      {ach.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CODING PROFILES SECTION */}
      <motion.section
        id="coding-profiles"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="space-y-2 text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Coding Profiles & Statistics</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm sm:text-base">
            Synchronized activity metrics from GitHub and LeetCode.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* GitHub Card */}
          <div className="glass-card p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gray-800 text-white">
                  <Github className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">GitHub Profile</h3>
                  <p className="text-xs text-gray-400">@{githubStats?.username || 'AnujNigam12'}</p>
                </div>
              </div>
              <a
                href={`https://github.com/${githubStats?.username || 'AnujNigam12'}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View GitHub Profile"
                className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline min-h-[36px] px-2"
              >
                <span>Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-gray-100/80 dark:bg-gray-800/60">
                <BookOpen className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <span className="block text-2xl font-extrabold text-gray-900 dark:text-white">
                  {githubStats?.totalRepos || 0}
                </span>
                <span className="text-xs text-gray-500">Public Repos</span>
              </div>
              <div className="p-4 rounded-2xl bg-gray-100/80 dark:bg-gray-800/60">
                <Star className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <span className="block text-2xl font-extrabold text-gray-900 dark:text-white">
                  {githubStats?.totalStars || 0}
                </span>
                <span className="text-xs text-gray-500">Stars</span>
              </div>
              <div className="p-4 rounded-2xl bg-gray-100/80 dark:bg-gray-800/60">
                <GitFork className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <span className="block text-2xl font-extrabold text-gray-900 dark:text-white">
                  {githubStats?.totalForks || 0}
                </span>
                <span className="text-xs text-gray-500">Forks</span>
              </div>
            </div>

            {githubStats?.topRepos?.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Top Repositories</h4>
                <div className="space-y-2">
                  {githubStats.topRepos.slice(0, 3).map((repo) => (
                    <div key={repo.name} className="flex items-center justify-between text-xs p-3 rounded-xl bg-gray-100 dark:bg-gray-800/40">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{repo.name}</span>
                      <span className="text-gray-400">{repo.language}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LeetCode Card */}
          <div className="glass-card p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">LeetCode Metrics</h3>
                  <p className="text-xs text-gray-400">@{leetcodeStats?.username || 'AnujNigam12'}</p>
                </div>
              </div>
              <a
                href={`https://leetcode.com/${leetcodeStats?.username || 'AnujNigam12'}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View LeetCode Profile"
                className="text-xs font-bold text-amber-500 flex items-center gap-1 hover:underline min-h-[36px] px-2"
              >
                <span>Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 text-center">
              <span className="block text-4xl font-black text-amber-500">
                {leetcodeStats?.totalSolved || 0}
              </span>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Total Solved Problems
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="block text-xl font-extrabold text-emerald-500">
                  {leetcodeStats?.easySolved || 0}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Easy</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="block text-xl font-extrabold text-amber-500">
                  {leetcodeStats?.mediumSolved || 0}
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Medium</span>
              </div>
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <span className="block text-xl font-extrabold text-rose-500">
                  {leetcodeStats?.hardSolved || 0}
                </span>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Hard</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CONTACT SECTION */}
      <motion.section
        id="contact"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="space-y-2 text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Get In Touch</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm sm:text-base">
            Interested in collaboration or open positions? Send a direct message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <div className="glass-card p-8 rounded-3xl space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4">
                Direct Contact
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-100 dark:bg-gray-800/60">
                  <div className="p-3 rounded-xl bg-blue-600 text-white">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-gray-400">Email</span>
                    <a href={`mailto:${settings?.email}`} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-500">
                      {settings?.email || 'anujnig.07@gmail.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-100 dark:bg-gray-800/60">
                  <div className="p-3 rounded-xl bg-indigo-600 text-white">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-gray-400">Phone</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {settings?.phone || '+91 9140499809'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-100 dark:bg-gray-800/60">
                  <div className="p-3 rounded-xl bg-purple-600 text-white">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase text-gray-400">Location</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {settings?.location || 'Lucknow, Uttar Pradesh, India'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-center gap-4">
              {settings?.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {settings?.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 glass-card p-8 sm:p-10 rounded-3xl shadow-xl">
            {formSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {formError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="Project Inquiry / Job Opportunity"
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full min-h-[48px] py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {formSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
