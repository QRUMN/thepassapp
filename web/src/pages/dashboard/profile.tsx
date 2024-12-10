import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/auth';
import { getProfile, updateProfile } from '@/utils/firebase/profile';
import { EducatorProfile, InstitutionProfile } from '@/types/profile';
import EditableField from '@/components/profile/EditableField';
import ImageUpload from '@/components/profile/ImageUpload';
import { toast } from 'react-hot-toast';

// Demo profiles moved to a separate file for cleaner code
import { DEMO_EDUCATOR, DEMO_INSTITUTION } from '@/constants/demo-data';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<EducatorProfile | InstitutionProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'credentials' | 'preferences'>('info');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;
      
      try {
        const profileData = await getProfile(user.uid);
        setProfile(profileData || DEMO_EDUCATOR); // Use demo data if no profile exists
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user?.uid || !profile) return;

    try {
      await updateProfile(user.uid, profile);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleImageUpload = (url: string) => {
    if (!profile) return;
    setProfile({ ...profile, avatar: url });
  };

  const handleFieldChange = (field: string, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900">Profile Not Found</h2>
          <p className="mt-2 text-gray-500">Please contact support if this issue persists.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Profile - The Pass App</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="md:flex">
              <ImageUpload
                userId={user?.uid || 'demo'}
                currentImage={profile.avatar}
                onUploadComplete={handleImageUpload}
                isEditing={isEditing}
              />
              <div className="p-8 flex-grow">
                <div className="flex items-center justify-between">
                  <div className="space-y-4 flex-grow">
                    <EditableField
                      value={profile.name}
                      onChange={(value) => handleFieldChange('name', value)}
                      label="Name"
                      isEditing={isEditing}
                    />
                    <EditableField
                      value={profile.email}
                      onChange={(value) => handleFieldChange('email', value)}
                      label="Email"
                      type="email"
                      isEditing={isEditing}
                    />
                    <EditableField
                      value={profile.phone || ''}
                      onChange={(value) => handleFieldChange('phone', value)}
                      label="Phone"
                      type="tel"
                      isEditing={isEditing}
                    />
                  </div>
                  <div className="ml-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        <button
                          onClick={handleSave}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {profile.availability.type}
                  </span>
                  {profile.subjects.map(subject => (
                    <span
                      key={subject}
                      className="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {(['info', 'credentials', 'preferences'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-6 text-sm font-medium ${
                      activeTab === tab
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Experience</h3>
                    {profile.experience.map((exp, index) => (
                      <div key={index} className="mt-4">
                        <h4 className="font-medium">{exp.role}</h4>
                        <p className="text-gray-600">{exp.institution}</p>
                        <p className="text-sm text-gray-500">
                          {exp.startDate.toLocaleDateString()} -{' '}
                          {exp.current ? 'Present' : exp.endDate?.toLocaleDateString()}
                        </p>
                        {exp.description && (
                          <p className="mt-2 text-gray-600">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Education</h3>
                    {profile.education.map((edu, index) => (
                      <div key={index} className="mt-4">
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">
                          Graduated {edu.graduationDate.toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {profile.skills.map(skill => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'credentials' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Teaching Credentials</h3>
                    {profile.credentials.map((credential, index) => (
                      <div key={index} className="mt-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{credential.type}</h4>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              credential.verificationStatus === 'verified'
                                ? 'bg-green-100 text-green-800'
                                : credential.verificationStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {credential.verificationStatus}
                          </span>
                        </div>
                        <p className="text-gray-600">{credential.issuer}</p>
                        <p className="text-sm text-gray-500">
                          Issued: {credential.issueDate.toLocaleDateString()}
                          {credential.expiryDate &&
                            ` - Expires: ${credential.expiryDate.toLocaleDateString()}`}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Certifications</h3>
                    <div className="mt-4 space-y-2">
                      {profile.certifications.map((cert, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          {cert}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Availability</h3>
                    <div className="mt-4">
                      <p className="text-gray-600">
                        Looking for {profile.availability.type} positions
                      </p>
                      {profile.availability.preferences && (
                        <>
                          <h4 className="font-medium mt-4">Preferred Locations</h4>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {profile.availability.preferences.location?.map(loc => (
                              <span
                                key={loc}
                                className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                              >
                                {loc}
                              </span>
                            ))}
                          </div>
                          <p className="mt-2 text-gray-600">
                            Within {profile.availability.preferences.distance} miles
                          </p>
                          <h4 className="font-medium mt-4">Salary Range</h4>
                          <p className="text-gray-600">
                            ${profile.availability.preferences.salary?.min.toLocaleString()} -{' '}
                            ${profile.availability.preferences.salary?.max.toLocaleString()} per year
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
