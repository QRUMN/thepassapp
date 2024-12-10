import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'educator' | 'school' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export default function UserManagement() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'educator',
      status: 'active',
      createdAt: '2024-11-01'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@school.edu',
      role: 'school',
      status: 'active',
      createdAt: '2024-11-15'
    }
  ]);

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    setLoading(true);
    try {
      // This would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('User status updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update user status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    setLoading(true);
    try {
      // This would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('User role updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update user role', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setLoading(true);
    try {
      // This would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('User deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: User['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status];
  };

  if (loading) {
    return <LoadingSpinner size="lg" fullScreen text="Processing request..." />;
  }

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto py-6">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
              <p className="mt-2 text-sm text-gray-700">
                Manage user accounts, roles, and permissions
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                onClick={() => showToast('Add User feature coming soon!', 'info')}
              >
                Add User
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                        <th className="relative px-3 py-3.5">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            {user.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <select
                              onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                              defaultValue={user.role}
                            >
                              <option value="educator">Educator</option>
                              <option value="school">School</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <select
                              onChange={(e) => handleStatusChange(user.id, e.target.value as User['status'])}
                              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${getStatusColor(user.status)}`}
                              defaultValue={user.status}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="pending">Pending</option>
                            </select>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {user.createdAt}
                          </td>
                          <td className="relative whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
