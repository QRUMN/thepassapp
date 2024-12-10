import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { FaUpload, FaEdit, FaCalendar, FaPlus, FaTimes } from 'react-icons/fa';

interface UserProfile {
  id: string;
  name: string;
  role: 'educator' | 'school';
  email: string;
  avatar: string;
  bio: string;
  location: string;
  resume?: string;
  skills: string[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
  }[];
  availability: {
    date: string;
    slots: string[];
  }[];
  // School-specific fields
  schoolInfo?: {
    type: string;
    size: string;
    founded: string;
    website: string;
    programs: string[];
  };
  // Educator-specific fields
  educatorInfo?: {
    yearsOfExperience: number;
    gradeLevel: string[];
    subjects: string[];
    preferredLocations: string[];
  };
}

export default function Profile() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - educator profile
      const mockProfile: UserProfile = {
        id: '1',
        name: 'John Doe',
        role: 'educator',
        email: 'john.doe@email.com',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
        bio: 'Passionate educator with 5+ years of experience in teaching mathematics and science. Committed to fostering a dynamic learning environment and helping students achieve their full potential.',
        location: 'San Francisco, CA',
        resume: 'resume_john_doe.pdf',
        skills: ['Mathematics', 'Science', 'Project-Based Learning', 'Classroom Management', 'Curriculum Development'],
        certifications: [
          {
            name: 'Teaching Credential',
            issuer: 'California Department of Education',
            date: '2019-05-15'
          },
          {
            name: 'STEM Education Certificate',
            issuer: 'Stanford University',
            date: '2020-08-20'
          }
        ],
        availability: [
          {
            date: '2024-12-11',
            slots: ['09:00', '10:00', '14:00', '15:00']
          },
          {
            date: '2024-12-12',
            slots: ['11:00', '13:00', '16:00']
          }
        ],
        educatorInfo: {
          yearsOfExperience: 5,
          gradeLevel: ['Middle School', 'High School'],
          subjects: ['Mathematics', 'Physics', 'Chemistry'],
          preferredLocations: ['San Francisco', 'Oakland', 'San Jose']
        }
      };

      setProfile(mockProfile);
      setIsLoading(false);
    } catch (error) {
      showToast('Failed to load profile. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast('Resume uploaded successfully', 'success');
      
      setProfile(prev => prev ? {
        ...prev,
        resume: file.name
      } : null);
    } catch (error) {
      showToast('Failed to upload resume. Please try again.', 'error');
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || !profile) return;

    setProfile({
      ...profile,
      skills: [...profile.skills, newSkill.trim()]
    });
    setNewSkill('');
    
    showToast('Skill added successfully', 'success');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return;

    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast('Profile updated successfully', 'success');
      setIsEditing(false);
    } catch (error) {
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAvailability = (date: string, slot: string) => {
    if (!profile) return;

    const updatedAvailability = [...profile.availability];
    const dateIndex = updatedAvailability.findIndex(a => a.date === date);

    if (dateIndex === -1) {
      updatedAvailability.push({
        date,
        slots: [slot]
      });
    } else {
      const slots = updatedAvailability[dateIndex].slots;
      const slotIndex = slots.indexOf(slot);

      if (slotIndex === -1) {
        slots.push(slot);
      } else {
        slots.splice(slotIndex, 1);
      }

      if (slots.length === 0) {
        updatedAvailability.splice(dateIndex, 1);
      }
    }

    setProfile({
      ...profile,
      availability: updatedAvailability
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-500">{profile.location}</p>
                <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaEdit className="mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <textarea
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              className="mt-4 w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="mt-4 text-gray-600">{profile.bio}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Resume Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume</h2>
              {profile.resume ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{profile.resume}</span>
                  <button
                    onClick={() => window.open('#', '_blank')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View
                  </button>
                </div>
              ) : null}
              <div className="mt-4">
                <label className="block">
                  <span className="sr-only">Choose file</span>
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-700"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Certifications Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h2>
              <div className="space-y-4">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{cert.name}</h3>
                      <p className="text-sm text-gray-500">{cert.issuer}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(cert.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Calendar */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Interview Availability
              </h2>
              <div className="space-y-4">
                {profile.availability.map((day, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {day.slots.map(slot => (
                        <span
                          key={slot}
                          className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {isEditing && (
                <button
                  onClick={() => {/* Open availability modal */}}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaCalendar className="mr-2" />
                  Update Availability
                </button>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
