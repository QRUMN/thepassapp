export interface BaseProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  lastActive: Date;
  status: 'active' | 'inactive' | 'suspended';
}

export interface EducatorProfile extends BaseProfile {
  type: 'educator';
  credentials: {
    type: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    verificationStatus: 'pending' | 'verified' | 'expired';
  }[];
  subjects: string[];
  grades: string[];
  experience: {
    institution: string;
    role: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description?: string;
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    graduationDate: Date;
  }[];
  availability: {
    type: 'full-time' | 'part-time' | 'substitute';
    schedule?: {
      [key: string]: boolean; // e.g., 'monday': true
    };
    preferences?: {
      location?: string[];
      distance?: number;
      salary?: {
        min: number;
        max: number;
      };
    };
  };
  skills: string[];
  certifications: string[];
}

export interface InstitutionProfile extends BaseProfile {
  type: 'institution';
  institution: {
    name: string;
    type: 'public' | 'private' | 'charter';
    district: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    website?: string;
  };
  contacts: {
    name: string;
    role: string;
    email: string;
    phone?: string;
  }[];
  accreditation: {
    body: string;
    status: string;
    expiryDate: Date;
  }[];
  programs: string[];
  facilities: string[];
  stats?: {
    studentCount?: number;
    teacherCount?: number;
    studentTeacherRatio?: number;
  };
}
