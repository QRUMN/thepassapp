import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MobileLayout from '../../components/layouts/MobileLayout';
import {
  FaUserGraduate,
  FaSchool,
  FaBriefcase,
  FaHandshake,
  FaChartBar,
  FaUserCog,
  FaExclamationTriangle,
  FaBell
} from 'react-icons/fa';

interface Stats {
  totalEducators: number;
  totalSchools: number;
  activePositions: number;
  totalMatches: number;
  pendingReports: number;
  newUsersToday: number;
}

interface RecentActivity {
  id: string;
  type: 'new_school' | 'new_educator' | 'new_match' | 'report';
  details: string;
  date: string;
  status?: 'pending' | 'resolved';
  priority?: 'low' | 'medium' | 'high';
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports'>('overview');
  const [stats] = useState<Stats>({
    totalEducators: 1250,
    totalSchools: 85,
    activePositions: 156,
    totalMatches: 324,
    pendingReports: 12,
    newUsersToday: 28
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'new_school',
      details: 'Lincoln High School joined the platform',
      date: '2024-12-09'
    },
    {
      id: '2',
      type: 'new_match',
      details: 'New match: Sarah Johnson - Edison Middle School',
      date: '2024-12-08'
    },
    {
      id: '3',
      type: 'report',
      details: 'Inappropriate content report submitted',
      date: '2024-12-08',
      status: 'pending',
      priority: 'high'
    }
  ]);

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'new_school':
        return <FaSchool className="h-4 w-4 text-blue-600" />;
      case 'new_educator':
        return <FaUserGraduate className="h-4 w-4 text-green-600" />;
      case 'new_match':
        return <FaHandshake className="h-4 w-4 text-purple-600" />;
      case 'report':
        return <FaExclamationTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FaBell className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <MobileLayout showHeader={true} headerTitle="Admin Dashboard">
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Quick Actions */}
        <div className="px-4 py-6">
          <div className="grid grid-cols-3 gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('users')}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mb-2">
                <FaUserCog className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">Users</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('reports')}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full mb-2">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">Reports</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin/analytics')}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full mb-2">
                <FaChartBar className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">Analytics</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <FaUserGraduate className="h-5 w-5 text-blue-600" />
                <span className="text-xs font-medium text-blue-600">Today: +{stats.newUsersToday}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalEducators}</div>
              <div className="text-xs text-gray-500">Total Educators</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <FaSchool className="h-5 w-5 text-green-600" />
                <span className="text-xs font-medium text-green-600">Active</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalSchools}</div>
              <div className="text-xs text-gray-500">Total Schools</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <FaBriefcase className="h-5 w-5 text-yellow-600" />
                <span className="text-xs font-medium text-yellow-600">Open</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.activePositions}</div>
              <div className="text-xs text-gray-500">Active Positions</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <FaHandshake className="h-5 w-5 text-purple-600" />
                <span className="text-xs font-medium text-purple-600">Success</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalMatches}</div>
              <div className="text-xs text-gray-500">Total Matches</div>
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
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'users'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeTab === 'reports'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Reports
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
                    {recentActivity.map((activity) => (
                      <motion.div
                        key={activity.id}
                        whileTap={{ backgroundColor: '#f9fafb' }}
                        className="p-4 flex items-start space-x-3"
                      >
                        <div className={`
                          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                          ${activity.type === 'new_school' ? 'bg-blue-100' :
                            activity.type === 'new_educator' ? 'bg-green-100' :
                            activity.type === 'new_match' ? 'bg-purple-100' :
                            'bg-red-100'}
                        `}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{activity.details}</p>
                            {activity.status && (
                              <span className={`
                                ml-2 px-2 py-1 text-xs font-medium rounded-full
                                ${activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}
                              `}>
                                {activity.status}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                          {activity.priority && (
                            <p className={`
                              text-xs mt-1
                              ${activity.priority === 'high' ? 'text-red-600' :
                                activity.priority === 'medium' ? 'text-yellow-600' :
                                'text-green-600'}
                            `}>
                              Priority: {activity.priority}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-sm"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-900">User Management</h2>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/admin/users/new')}
                      className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                    >
                      Add User
                    </motion.button>
                  </div>
                </div>
                {/* User list would go here */}
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-900">Pending Reports</h2>
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      {stats.pendingReports} pending
                    </span>
                  </div>
                  {/* Reports list would go here */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MobileLayout>
  );
}
