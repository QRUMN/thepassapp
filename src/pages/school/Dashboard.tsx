import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import {
  FaUserGraduate,
  FaBriefcase,
  FaCalendar,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaEye,
  FaMapMarkerAlt,
  FaPlus
} from 'react-icons/fa';

interface Candidate {
  id: string;
  name: string;
  position: string;
  stage: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  matchScore: number;
  location: string;
  experience: number;
  appliedDate: string;
  lastActivity: string;
}

interface Position {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  status: 'active' | 'paused' | 'filled';
  applicants: number;
  newMatches: number;
  postedDate: string;
}

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface Analytics {
  totalCandidates: number;
  activePositions: number;
  scheduledInterviews: number;
  averageTimeToHire: number;
  candidatesByStage: {
    new: number;
    screening: number;
    interview: number;
    offer: number;
    hired: number;
    rejected: number;
  };
  applicationTrend: {
    date: string;
    count: number;
  }[];
}

export default function SchoolDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockCandidates: Candidate[] = [
        {
          id: '1',
          name: 'John Doe',
          position: 'Math Teacher',
          stage: 'interview',
          matchScore: 92,
          location: 'San Francisco, CA',
          experience: 5,
          appliedDate: '2024-12-08',
          lastActivity: '2024-12-09T15:30:00'
        },
        {
          id: '2',
          name: 'Sarah Smith',
          position: 'Science Teacher',
          stage: 'screening',
          matchScore: 88,
          location: 'Oakland, CA',
          experience: 3,
          appliedDate: '2024-12-09',
          lastActivity: '2024-12-10T09:15:00'
        },
        {
          id: '3',
          name: 'Michael Johnson',
          position: 'English Teacher',
          stage: 'offer',
          matchScore: 95,
          location: 'San Jose, CA',
          experience: 7,
          appliedDate: '2024-12-07',
          lastActivity: '2024-12-09T16:45:00'
        }
      ];

      const mockPositions: Position[] = [
        {
          id: '1',
          title: 'Math Teacher',
          department: 'Mathematics',
          location: 'San Francisco, CA',
          type: 'full-time',
          status: 'active',
          applicants: 12,
          newMatches: 3,
          postedDate: '2024-12-01'
        },
        {
          id: '2',
          title: 'Science Teacher',
          department: 'Science',
          location: 'San Francisco, CA',
          type: 'full-time',
          status: 'active',
          applicants: 8,
          newMatches: 2,
          postedDate: '2024-12-05'
        },
        {
          id: '3',
          title: 'English Teacher',
          department: 'English',
          location: 'San Francisco, CA',
          type: 'full-time',
          status: 'active',
          applicants: 15,
          newMatches: 4,
          postedDate: '2024-12-03'
        }
      ];

      const mockInterviews: Interview[] = [
        {
          id: '1',
          candidateName: 'John Doe',
          position: 'Math Teacher',
          date: '2024-12-11',
          time: '14:00',
          type: 'video',
          status: 'scheduled'
        },
        {
          id: '2',
          candidateName: 'Michael Johnson',
          position: 'English Teacher',
          date: '2024-12-12',
          time: '11:00',
          type: 'in-person',
          status: 'scheduled'
        }
      ];

      const mockAnalytics: Analytics = {
        totalCandidates: 35,
        activePositions: 3,
        scheduledInterviews: 5,
        averageTimeToHire: 14,
        candidatesByStage: {
          new: 8,
          screening: 12,
          interview: 6,
          offer: 4,
          hired: 3,
          rejected: 2
        },
        applicationTrend: [
          { date: '2024-12-04', count: 3 },
          { date: '2024-12-05', count: 5 },
          { date: '2024-12-06', count: 4 },
          { date: '2024-12-07', count: 6 },
          { date: '2024-12-08', count: 8 },
          { date: '2024-12-09', count: 7 },
          { date: '2024-12-10', count: 4 }
        ]
      };

      setCandidates(mockCandidates);
      setPositions(mockPositions);
      setInterviews(mockInterviews);
      setAnalytics(mockAnalytics);
      setIsLoading(false);
      showToast('Dashboard data loaded successfully', 'success');
    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
      setIsLoading(false);
    }
  };

  const getStageColor = (stage: Candidate['stage']) => {
    switch (stage) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'screening':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'offer':
        return 'bg-green-100 text-green-800';
      case 'hired':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">School Dashboard</h1>
          <button
            onClick={() => navigate('/school/positions/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus className="mr-2" />
            Post New Position
          </button>
        </div>

        {/* Analytics Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-blue-100 text-blue-600">
                  <FaUserGraduate className="w-6 h-6" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Total Candidates</p>
                  <p className="text-2xl font-semibold text-gray-900">{analytics.totalCandidates}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-green-100 text-green-600">
                  <FaBriefcase className="w-6 h-6" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Active Positions</p>
                  <p className="text-2xl font-semibold text-gray-900">{analytics.activePositions}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-purple-100 text-purple-600">
                  <FaCalendar className="w-6 h-6" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Scheduled Interviews</p>
                  <p className="text-2xl font-semibold text-gray-900">{analytics.scheduledInterviews}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-yellow-100 text-yellow-600">
                  <FaClock className="w-6 h-6" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Avg. Time to Hire</p>
                  <p className="text-2xl font-semibold text-gray-900">{analytics.averageTimeToHire} days</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Candidate Pipeline */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Candidate Pipeline</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {candidates.map(candidate => (
                    <div
                      key={candidate.id}
                      className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                          <p className="text-sm text-gray-500">{candidate.position}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                            {candidate.matchScore}% Match
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStageColor(candidate.stage)}`}>
                            {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          {candidate.location}
                        </div>
                        <div className="flex items-center">
                          <FaBriefcase className="mr-1" />
                          {candidate.experience} years experience
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          Applied {formatDate(candidate.appliedDate)}
                        </span>
                        <button
                          onClick={() => navigate(`/school/candidates/${candidate.id}`)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaEye className="mr-1" />
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Active Positions */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Active Positions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {positions.map(position => (
                    <div
                      key={position.id}
                      className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{position.title}</h3>
                          <p className="text-sm text-gray-500">{position.department}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          position.status === 'active' ? 'bg-green-100 text-green-800' :
                          position.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {position.status.charAt(0).toUpperCase() + position.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{position.applicants} applicants</span>
                        {position.newMatches > 0 && (
                          <span className="text-blue-600 font-medium">
                            {position.newMatches} new matches
                          </span>
                        )}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          Posted {formatDate(position.postedDate)}
                        </span>
                        <button
                          onClick={() => navigate(`/school/positions/${position.id}`)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaEye className="mr-1" />
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {interviews.map(interview => (
                    <div
                      key={interview.id}
                      className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{interview.candidateName}</h3>
                          <p className="text-sm text-gray-500">{interview.position}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          interview.type === 'video' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {interview.type === 'video' ? 'Video Call' : 'In Person'}
                        </span>
                      </div>
                      <div className="mt-2 space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaCalendar className="mr-2" />
                          {formatDate(interview.date)}
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-2" />
                          {formatTime(interview.time)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
