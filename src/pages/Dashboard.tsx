import { useState } from 'react';

interface Stats {
  applications: number;
  matches: number;
  interviews: number;
  offers: number;
}

interface RecentActivity {
  id: string;
  type: 'application' | 'match' | 'interview' | 'offer';
  position: string;
  school: string;
  date: string;
}

export default function Dashboard() {
  const [stats] = useState<Stats>({
    applications: 45,
    matches: 12,
    interviews: 5,
    offers: 2
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'offer',
      position: 'Math Teacher',
      school: 'Lincoln High School',
      date: '2024-12-09'
    },
    {
      id: '2',
      type: 'interview',
      position: 'Science Teacher',
      school: 'Edison Middle School',
      date: '2024-12-08'
    },
    {
      id: '3',
      type: 'match',
      position: 'English Teacher',
      school: 'Washington Elementary',
      date: '2024-12-07'
    }
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Applications"
          value={stats.applications}
          color="blue"
        />
        <StatCard
          title="Matches"
          value={stats.matches}
          color="green"
        />
        <StatCard
          title="Interviews"
          value={stats.interviews}
          color="yellow"
        />
        <StatCard
          title="Offers"
          value={stats.offers}
          color="purple"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <div className="mt-6 flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="py-5">
                  <div className="flex items-center space-x-4">
                    <ActivityIcon type={activity.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.position}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {activity.school}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-full ${colorClasses[color as keyof typeof colorClasses]} bg-opacity-20`} />
        </div>
      </div>
    </div>
  );
}

function ActivityIcon({ type }: { type: RecentActivity['type'] }) {
  const icons = {
    application: (
      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    match: (
      <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    interview: (
      <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    offer: (
      <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return icons[type];
}
