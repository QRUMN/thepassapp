import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PositionForm {
  title: string;
  department: string;
  type: 'full-time' | 'part-time' | 'substitute';
  description: string;
  requirements: string;
  salary: {
    min: number;
    max: number;
  };
  startDate: string;
  deadline: string;
}

export default function PostPosition() {
  const navigate = useNavigate();
  const [form, setForm] = useState<PositionForm>({
    title: '',
    department: '',
    type: 'full-time',
    description: '',
    requirements: '',
    salary: {
      min: 0,
      max: 0
    },
    startDate: '',
    deadline: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // This would be replaced with an API call
    console.log('Position posted:', form);
    navigate('/school/positions');
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Post New Position</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Position Title
            </label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              type="text"
              id="department"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Position Type
            </label>
            <select
              id="type"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as PositionForm['type'] })}
              required
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="substitute">Substitute</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Position Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
              Requirements
            </label>
            <textarea
              id="requirements"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="salary-min" className="block text-sm font-medium text-gray-700">
              Minimum Salary
            </label>
            <input
              type="number"
              id="salary-min"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.salary.min}
              onChange={(e) => setForm({
                ...form,
                salary: { ...form.salary, min: parseInt(e.target.value) }
              })}
              required
            />
          </div>

          <div>
            <label htmlFor="salary-max" className="block text-sm font-medium text-gray-700">
              Maximum Salary
            </label>
            <input
              type="number"
              id="salary-max"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.salary.max}
              onChange={(e) => setForm({
                ...form,
                salary: { ...form.salary, max: parseInt(e.target.value) }
              })}
              required
            />
          </div>

          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
              Application Deadline
            </label>
            <input
              type="date"
              id="deadline"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Post Position
          </button>
        </div>
      </form>
    </div>
  );
}
