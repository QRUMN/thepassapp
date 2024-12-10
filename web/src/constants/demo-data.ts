import { EducatorProfile, InstitutionProfile } from '@/types/profile';

export const DEMO_EDUCATOR: EducatorProfile = {
  id: 'demo_educator',
  type: 'educator',
  email: 'demo.teacher@thepassapp.com',
  name: 'John Smith',
  phone: '(302) 555-0123',
  avatar: '/images/avatar.jpg',
  createdAt: new Date('2024-01-01'),
  lastActive: new Date(),
  status: 'active',
  credentials: [
    {
      type: 'Teaching License',
      issuer: 'Delaware Department of Education',
      issueDate: new Date('2020-01-01'),
      expiryDate: new Date('2025-01-01'),
      verificationStatus: 'verified'
    }
  ],
  subjects: ['Mathematics', 'Physics'],
  grades: ['9-12'],
  experience: [
    {
      institution: 'Delaware High School',
      role: 'Mathematics Teacher',
      startDate: new Date('2020-01-01'),
      current: true,
      description: 'Teaching advanced mathematics and AP calculus.'
    }
  ],
  education: [
    {
      institution: 'University of Delaware',
      degree: 'Master of Education',
      field: 'Secondary Education',
      graduationDate: new Date('2019-05-15')
    }
  ],
  availability: {
    type: 'full-time',
    preferences: {
      location: ['Wilmington', 'Newark'],
      distance: 25,
      salary: {
        min: 55000,
        max: 75000
      }
    }
  },
  skills: ['Classroom Management', 'Curriculum Development', 'Student Assessment'],
  certifications: ['AP Calculus Certified', 'Special Education Certified']
};

export const DEMO_INSTITUTION: InstitutionProfile = {
  id: 'demo_institution',
  type: 'institution',
  email: 'admin@demoacademy.edu',
  name: 'Demo Academy',
  phone: '(302) 555-0456',
  avatar: '/images/school.jpg',
  createdAt: new Date('2024-01-01'),
  lastActive: new Date(),
  status: 'active',
  address: {
    street: '123 Education Lane',
    city: 'Wilmington',
    state: 'DE',
    zip: '19801',
    country: 'USA'
  },
  description: 'A leading private academy focused on STEM education and college preparation.',
  type: 'Private',
  grades: ['K-12'],
  studentCount: 800,
  yearEstablished: 1985,
  accreditations: [
    {
      name: 'Middle States Association of Colleges and Schools',
      issueDate: new Date('2020-01-01'),
      expiryDate: new Date('2025-01-01'),
      status: 'active'
    }
  ],
  facilities: [
    'Science Labs',
    'Computer Labs',
    'Library',
    'Athletic Fields',
    'Performing Arts Center'
  ],
  programs: [
    'Advanced Placement',
    'International Baccalaureate',
    'STEM Focus',
    'Arts Program'
  ],
  openPositions: [
    {
      id: 'pos_1',
      title: 'High School Mathematics Teacher',
      type: 'full-time',
      startDate: new Date('2024-08-01'),
      subjects: ['Mathematics'],
      grades: ['9-12'],
      requirements: [
        'Master\'s degree in Mathematics or Education',
        '3+ years teaching experience',
        'AP Calculus certification preferred'
      ]
    }
  ]
};
