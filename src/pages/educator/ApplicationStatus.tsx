import { useState } from 'react';

interface Application {
  id: string;
  position: string;
  school: string;
  status: 'pending' | 'reviewed' | 'interview' | 'offered' | 'rejected';
  appliedDate: string;
  lastUpdated: string;
  nextStep?: string;
}

export default function ApplicationStatus() {
  const [applications] = useState<Application[]>([
    {
      id: '1',
      position: 'Math Teacher',
      school: 'Lincoln High School',
      status: 'interview',
      appliedDate: '2024-12-01',
      lastUpdated: '2024-12-09',
      nextStep: 'Interview scheduled for Dec 15, 2024'
    },
    {
      id: '2',
      position: 'Science Teacher',
      school: 'Edison Middle School',
      status: 'pending',
      appliedDate: '2024-12-05',
      lastUpdated: '2024-12-05'
    },
    {
      id: '3',
      position: 'English Teacher',
      school: 'Washington Elementary',
      status: 'offered',
      appliedDate: '2024-11-15',
      lastUpdated: '2024-12-08',
      nextStep: 'Review and sign offer letter'
    }
  ]);

  const getStatusColor = (status: Application['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      interview: 'bg-purple-100 text-purple-800',
      offered: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getStatusText = (status: Application['status']) => {
    const text = {
      pending: 'Application Pending',
      reviewed: 'Under Review',
      interview: 'Interview Phase',
      offered: 'Offer Extended',
      rejected: 'Not Selected'
    };
    return text[status];
  };

  return (
    <div className="max-w-7xl mx-auto py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Application Status</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {applications.map((application) => (
            <li key={application.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {application.position}
                    </p>
                    <p className="text-sm text-gray-500">
                      {application.school}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                      {getStatusText(application.status)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <span>Applied: {application.appliedDate}</span>
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <span>Last Updated: {application.lastUpdated}</span>
                    </p>
                  </div>
                </div>

                {application.nextStep && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Next Step:</span> {application.nextStep}
                    </p>
                  </div>
                )}

                <div className="mt-3 flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Contact School
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
