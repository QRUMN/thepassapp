import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import {
  FaVideo,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaUserGraduate,
  FaBriefcase,
  FaNotesMedical,
  FaLink,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  location?: string;
  videoLink?: string;
  notes?: string;
}

interface TimeSlot {
  time: string;
  interviews: Interview[];
}

interface DaySchedule {
  date: string;
  timeSlots: TimeSlot[];
}

export default function InterviewSchedule() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  useEffect(() => {
    loadScheduleData();
  }, [selectedDate]);

  const loadScheduleData = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate week schedule based on selected date
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

      const mockWeekSchedule: DaySchedule[] = Array.from({ length: 7 }).map((_, index) => {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(currentDate.getDate() + index);

        // Generate mock interviews for this day
        const mockInterviews: Interview[] = [];
        if (index < 5) { // Only add interviews on weekdays
          mockInterviews.push({
            id: `interview-${index}-1`,
            candidateName: 'John Smith',
            position: 'Math Teacher',
            date: currentDate.toISOString().split('T')[0],
            time: '09:00',
            duration: 60,
            type: 'video',
            status: 'scheduled',
            videoLink: 'https://meet.google.com/abc-defg-hij',
            notes: 'Initial screening interview'
          });

          if (index % 2 === 0) {
            mockInterviews.push({
              id: `interview-${index}-2`,
              candidateName: 'Sarah Johnson',
              position: 'Science Teacher',
              date: currentDate.toISOString().split('T')[0],
              time: '14:00',
              duration: 45,
              type: 'in-person',
              status: 'scheduled',
              location: 'Room 204, Main Building',
              notes: 'Follow-up interview with department head'
            });
          }
        }

        return {
          date: currentDate.toISOString().split('T')[0],
          timeSlots: [
            { time: '09:00', interviews: mockInterviews.filter(i => i.time === '09:00') },
            { time: '10:00', interviews: mockInterviews.filter(i => i.time === '10:00') },
            { time: '11:00', interviews: mockInterviews.filter(i => i.time === '11:00') },
            { time: '14:00', interviews: mockInterviews.filter(i => i.time === '14:00') },
            { time: '15:00', interviews: mockInterviews.filter(i => i.time === '15:00') },
            { time: '16:00', interviews: mockInterviews.filter(i => i.time === '16:00') }
          ]
        };
      });

      setWeekSchedule(mockWeekSchedule);
      setIsLoading(false);
      showToast('Interview schedule loaded successfully', 'success');
    } catch (error) {
      showToast('Failed to load interview schedule', 'error');
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleJoinMeeting = (interview: Interview) => {
    if (interview.videoLink) {
      window.open(interview.videoLink, '_blank');
    } else {
      showToast('Video link is not available for this interview.', 'error');
    }
  };

  const handleUpdateStatus = async (interview: Interview, newStatus: Interview['status']) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      showToast(`Interview status updated to ${newStatus}`, 'success');

      // Reload schedule data
      loadScheduleData();
    } catch (error) {
      showToast('Failed to update interview status. Please try again.', 'error');
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Interview Schedule</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousWeek}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Previous Week
            </button>
            <button
              onClick={handleNextWeek}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next Week
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {weekSchedule.map((day) => (
              <div key={day.date} className="bg-white">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">
                    {formatDate(day.date)}
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {day.timeSlots.map((slot) => (
                    <div key={slot.time} className="px-4 py-3">
                      <div className="text-xs text-gray-500 mb-1">
                        {formatTime(slot.time)}
                      </div>
                      {slot.interviews.map((interview) => (
                        <div
                          key={interview.id}
                          className="p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                          onClick={() => setSelectedInterview(interview)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-blue-900">
                                {interview.candidateName}
                              </h4>
                              <p className="text-sm text-blue-700">{interview.position}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {interview.type === 'video' ? (
                                <FaVideo className="text-blue-600" />
                              ) : (
                                <FaMapMarkerAlt className="text-blue-600" />
                              )}
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                interview.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Details Modal */}
        {selectedInterview && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Interview Details
                  </h2>
                  <button
                    onClick={() => setSelectedInterview(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUserGraduate className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedInterview.candidateName}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedInterview.position}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="w-4 h-4 mr-2" />
                      {formatDate(selectedInterview.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaClock className="w-4 h-4 mr-2" />
                      {formatTime(selectedInterview.time)} ({selectedInterview.duration} min)
                    </div>
                    {selectedInterview.type === 'in-person' && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                        {selectedInterview.location}
                      </div>
                    )}
                    {selectedInterview.type === 'video' && selectedInterview.videoLink && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FaLink className="w-4 h-4 mr-2" />
                        <button
                          onClick={() => handleJoinMeeting(selectedInterview)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Join Video Call
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    {selectedInterview.notes && (
                      <div className="space-y-1">
                        <div className="flex items-center text-sm font-medium text-gray-700">
                          <FaNotesMedical className="w-4 h-4 mr-2" />
                          Notes
                        </div>
                        <p className="text-sm text-gray-500">{selectedInterview.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleUpdateStatus(selectedInterview, 'completed')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FaCheck className="mr-2" />
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedInterview, 'cancelled')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaTimes className="mr-2" />
                    Cancel Interview
                  </button>
                </div>
                <button
                  onClick={() => navigate(`/messages?candidate=${selectedInterview.candidateName}`)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Message Candidate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
