import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import {
  FaUserGraduate,
  FaBriefcase,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStar,
  FaComments,
  FaCheck,
  FaTimes,
  FaUserPlus,
  FaFileDownload,
  FaChartBar,
  FaEnvelope,
  FaVideo
} from 'react-icons/fa';

interface Candidate {
  id: string;
  name: string;
  position: string;
  matchScore: number;
  experience: number;
  location: string;
  education: string;
  certifications: string[];
  skills: string[];
  availability: string;
  resumeUrl: string;
  stage: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  lastActivity: string;
  teamFeedback: TeamFeedback[];
}

interface TeamFeedback {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: string;
}

interface ComparisonCriteria {
  education: number;
  experience: number;
  skills: number;
  certifications: number;
  location: number;
  availability: number;
}

export default function ApplicantReview() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{ isOpen: boolean; candidateId: string | null }>({
    isOpen: false,
    candidateId: null
  });

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockCandidates: Candidate[] = [
        {
          id: '1',
          name: 'John Smith',
          position: 'Math Teacher',
          matchScore: 92,
          experience: 5,
          location: 'San Francisco, CA',
          education: 'M.Ed. in Mathematics Education',
          certifications: ['Teaching License', 'Advanced Mathematics'],
          skills: ['Algebra', 'Calculus', 'Statistics', 'Classroom Management'],
          availability: 'Immediate',
          resumeUrl: '/resumes/john-smith.pdf',
          stage: 'interview',
          lastActivity: '2024-12-09T15:30:00',
          teamFeedback: [
            {
              id: '1',
              userId: 'user1',
              userName: 'Sarah Johnson',
              rating: 4.5,
              comment: 'Strong candidate with excellent teaching experience',
              timestamp: '2024-12-09T14:00:00'
            }
          ]
        },
        {
          id: '2',
          name: 'Emily Davis',
          position: 'Math Teacher',
          matchScore: 88,
          experience: 3,
          location: 'Oakland, CA',
          education: 'B.S. in Mathematics',
          certifications: ['Teaching License'],
          skills: ['Algebra', 'Geometry', 'Problem-Based Learning'],
          availability: '2 weeks notice',
          resumeUrl: '/resumes/emily-davis.pdf',
          stage: 'screening',
          lastActivity: '2024-12-09T12:45:00',
          teamFeedback: []
        },
        {
          id: '3',
          name: 'Michael Chen',
          position: 'Math Teacher',
          matchScore: 95,
          experience: 7,
          location: 'San Jose, CA',
          education: 'Ph.D. in Mathematics',
          certifications: ['Teaching License', 'STEM Education'],
          skills: ['Calculus', 'Linear Algebra', 'Research Methods', 'Project-Based Learning'],
          availability: 'Immediate',
          resumeUrl: '/resumes/michael-chen.pdf',
          stage: 'new',
          lastActivity: '2024-12-10T09:15:00',
          teamFeedback: []
        }
      ];

      setCandidates(mockCandidates);
      setIsLoading(false);
      showToast('Applicant data loaded successfully', 'success');
    } catch (error) {
      showToast('Failed to load applicant data', 'error');
      setIsLoading(false);
    }
  };

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidates(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      }
      if (prev.length < 3) {
        return [...prev, candidateId];
      }
      showToast('You can compare up to 3 candidates at a time', 'warning');
      return prev;
    });
  };

  const handleStageUpdate = async (candidateId: string, newStage: Candidate['stage']) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setCandidates(prev =>
        prev.map(candidate =>
          candidate.id === candidateId
            ? { ...candidate, stage: newStage }
            : candidate
        )
      );

      showToast(`Application status updated to ${newStage}`, 'success');
    } catch (error) {
      showToast('Failed to update application status', 'error');
    }
  };

  const handleFeedbackSubmit = async (candidateId: string, rating: number, comment: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newFeedback: TeamFeedback = {
        id: Date.now().toString(),
        userId: 'currentUser',
        userName: 'Current User',
        rating,
        comment,
        timestamp: new Date().toISOString()
      };

      setCandidates(prev =>
        prev.map(candidate =>
          candidate.id === candidateId
            ? { ...candidate, teamFeedback: [...candidate.teamFeedback, newFeedback] }
            : candidate
        )
      );

      setFeedbackModal({ isOpen: false, candidateId: null });
      showToast('Feedback submitted successfully', 'success');
    } catch (error) {
      showToast('Failed to submit feedback', 'error');
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
          <h1 className="text-2xl font-bold text-gray-900">Applicant Review</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                comparisonMode
                  ? 'border-blue-600 text-blue-600 bg-blue-50 hover:bg-blue-100'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {comparisonMode ? 'Exit Comparison' : 'Compare Candidates'}
            </button>
          </div>
        </div>

        {/* Candidate Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {candidates.map(candidate => (
            <div
              key={candidate.id}
              className={`bg-white rounded-lg shadow-sm overflow-hidden ${
                comparisonMode && selectedCandidates.includes(candidate.id)
                  ? 'ring-2 ring-blue-500'
                  : ''
              }`}
            >
              {/* Candidate Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{candidate.name}</h2>
                    <p className="text-sm text-gray-500">{candidate.position}</p>
                  </div>
                  {comparisonMode && (
                    <button
                      onClick={() => handleCandidateSelect(candidate.id)}
                      className={`p-2 rounded-full ${
                        selectedCandidates.includes(candidate.id)
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <FaCheck className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Candidate Details */}
              <div className="px-6 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                      {candidate.matchScore}% Match
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStageColor(candidate.stage)}`}>
                      {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(candidate.resumeUrl, '_blank')}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <FaFileDownload className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/messages?candidate=${candidate.name}`)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <FaEnvelope className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/school/interview-schedule?candidate=${candidate.name}`)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <FaVideo className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaBriefcase className="w-4 h-4 mr-2" />
                      {candidate.experience} years experience
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                      {candidate.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="w-4 h-4 mr-2" />
                      {candidate.availability}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Education</h3>
                    <p className="text-sm text-gray-500">{candidate.education}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Team Feedback Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Team Feedback</h3>
                    <button
                      onClick={() => setFeedbackModal({ isOpen: true, candidateId: candidate.id })}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Add Feedback
                    </button>
                  </div>
                  <div className="space-y-2">
                    {candidate.teamFeedback.map(feedback => (
                      <div key={feedback.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{feedback.userName}</span>
                          <div className="flex items-center">
                            <FaStar className="w-4 h-4 text-yellow-400" />
                            <span className="ml-1 text-sm text-gray-600">{feedback.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{feedback.comment}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(feedback.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <select
                    onChange={(e) => handleStageUpdate(candidate.id, e.target.value as Candidate['stage'])}
                    value={candidate.stage}
                    className="block w-1/2 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="new">New</option>
                    <option value="screening">Screening</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStageUpdate(candidate.id, 'interview')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Schedule Interview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Modal */}
        {feedbackModal.isOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Add Feedback</h2>
                  <button
                    onClick={() => setFeedbackModal({ isOpen: false, candidateId: null })}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const rating = parseFloat(formData.get('rating') as string);
                  const comment = formData.get('comment') as string;
                  if (feedbackModal.candidateId) {
                    handleFeedbackSubmit(feedbackModal.candidateId, rating, comment);
                  }
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                    Rating
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    required
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
