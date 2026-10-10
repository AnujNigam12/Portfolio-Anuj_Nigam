const { z } = require('zod');

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const projectSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  shortDescription: z.string().min(5, 'Short description is required'),
  description: z.string().min(10, 'Description is required'),
  technologies: z.array(z.string()).optional(),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  featured: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['Completed', 'In Progress', 'Planned']).optional(),
  order: z.number().optional(),
});

const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum([
    'Programming',
    'Frontend',
    'Backend',
    'Database',
    'AI/ML',
    'Cloud',
    'Tools',
    'Data & Analytics',
    'Other',
  ]),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
});

module.exports = {
  contactSchema,
  loginSchema,
  projectSchema,
  skillSchema,
};
