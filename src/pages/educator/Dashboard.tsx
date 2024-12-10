import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import MobileLayout from '../../components/layouts/MobileLayout';
import {
  FaCalendar,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaStar
} from 'react-icons/fa';

interface Application {
  id: string;
  schoolName: string;
  position: string;
  location: string;
  status: 'pending' | 'interview' | 'offered' | 'rejected';
  appliedDate: string;
}

interface Interview {
  id: string;
  schoolName: string;
  position: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface Activity {
  id: string;
  type: 'application' | 'interview' | 'message' | 'offer';
  title: string;
  description: string;
  timestamp: string;
}

export default function EducatorDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'interviews'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockApplications: Application[] = [
        {
          id: '1',
          schoolName: 'Sunshine Elementary',
          position: 'Grade 3 Teacher',
          location: 'San Francisco, CA',
          status: 'interview',
          appliedDate: '2024-12-08'
        },
        {
          id: '2',
          schoolName: 'Tech Academy',
          position: 'Computer Science Teacher',
          location: 'Mountain View, CA',
          status: 'pending',
          appliedDate: '2024-12-09'
        },
        {
          id: '3',
          schoolName: 'Arts & Music School',
          position: 'Music Teacher',
          location: 'Berkeley, CA',
          status: 'offered',
          appliedDate: '2024-12-07'
        }
      ];

      const mockInterviews: Interview[] = [
        {
          id: '1',
          schoolName: 'Sunshine Elementary',
          position: 'Grade 3 Teacher',
          date: '2024-12-11',
          time: '14:00',
          type: 'video',
          location: 'Zoom',
          status: 'upcoming'
        },
        {
          id: '2',
          schoolName: 'Arts & Music School',
          position: 'Music Teacher',
          date: '2024-12-12',
          time: '11:00',
          type: 'in-person',
          location: '123 Music Ave, Berkeley, CA',
          status: 'upcoming'
        }
      ];

      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'message',
          title: 'New message from Sunshine Elementary',
          description: 'Regarding your application for Grade 3 Teacher position',
          timestamp: '2024-12-10T06:30:00'
        },
        {
          id: '2',
          type: 'interview',
          title: 'Interview scheduled',
          description: 'Video interview with Sunshine Elementary for Grade 3 Teacher position',
          timestamp: '2024-12-09T15:45:00'
        },
        {
          id: '3',
          type: 'offer',
          title: 'Offer received',
          description: 'Congratulations! You received an offer from Arts & Music School',
          timestamp: '2024-12-09T11:20:00'
        }
      ];

      setApplications(mockApplications);
      setInterviews(mockInterviews);
      setActivities(mockActivities);
      setIsLoading(false);
      showToast('Dashboard data loaded successfully', 'success');
    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview':
        return 'bg-blue-100 text-blue-800';
      case 'offered':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <MobileLayout showHeader={true} headerTitle="Dashboard">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showHeader={true} headerTitle="Dashboard">
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Quick Actions */}
        <div className="px-4 py-6">
          <div className="grid grid-cols-3 gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/educator/swipe')}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mb-2">
                <FaBriefcase className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">Find Jobs</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/educator/interviews')}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full mb-2">
                <FaCalendar className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">Interviews</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/educator/profile')}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full mb-2">
                <FaGraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">Profile</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="px-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {applications.length}
                </div>
                <div className="text-xs text-gray-500">Active Applications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {interviews.length}
                </div>
                <div className="text-xs text-gray-500">Upcoming Interviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 mb-4">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'applications'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveTab('interviews')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'interviews'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Interviews
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 px-4 pb-6">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {activities.slice(0, 5).map((activity) => (
                      <motion.div
                        key={activity.id}
                        whileTap={{ backgroundColor: '#f9fafb' }}
                        className="p-4 flex items-start space-x-3"
                      >
                        <div className={`
                          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                          ${activity.type === 'application' ? 'bg-blue-100' :
                            activity.type === 'interview' ? 'bg-green-100' :
                            activity.type === 'message' ? 'bg-yellow-100' : 'bg-purple-100'}
                        `}>
                          {activity.type === 'application' && <FaBriefcase className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'interview' && <FaCalendar className="h-4 w-4 text-green-600" />}
                          {activity.type === 'message' && <FaEnvelope className="h-4 w-4 text-yellow-600" />}
                          {activity.type === 'offer' && <FaStar className="h-4 w-4 text-purple-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'applications' && (
              <motion.div
                key="applications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {applications.map((application) => (
                  <motion.div
                    key={application.id}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-lg shadow-sm p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {application.position}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {application.schoolName}
                        </p>
                      </div>
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                          application.status === 'offered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'}
                      `}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                      {application.location}
                    </div>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <FaClock className="h-3 w-3 mr-1" />
                      Applied {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'interviews' && (
              <motion.div
                key="interviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {interviews.map((interview) => (
                  <motion.div
                    key={interview.id}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-lg shadow-sm p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {interview.position}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {interview.schoolName}
                        </p>
                      </div>
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${interview.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'}
                      `}>
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <FaCalendar className="h-3 w-3 mr-1" />
                      {new Date(interview.date).toLocaleDateString()} at {interview.time}
                    </div>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                      {interview.type === 'video' ? 'Video Call' : interview.location}
                    </div>
                    {interview.status === 'upcoming' && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/educator/interviews/${interview.id}`)}
                        className="mt-3 w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                      >
                        Join Interview
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MobileLayout>
  );
}
