import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Notifications from './Notifications';
import { FaHome, FaSearch, FaCalendar, FaUsers, FaChartBar, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-gray-100' : '';
  };

  const renderNavLinks = () => {
    if (user?.role === 'educator') {
      return (
        <>
          <Link
            to="/educator"
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 ${isActive('/educator')}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaHome className="mr-2" />
            Dashboard
          </Link>
          <Link
            to="/educator/swipe"
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 ${isActive('/educator/swipe')}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaSearch className="mr-2" />
            Find Positions
          </Link>
          <Link
            to="/educator/interviews"
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 ${isActive('/educator/interviews')}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaCalendar className="mr-2" />
            Interviews
          </Link>
        </>
      );
    } else if (user?.role === 'school') {
      return (
        <>
          <Link
            to="/school"
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 ${isActive('/school')}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaHome className="mr-2" />
            Dashboard
          </Link>
          <Link
            to="/school/applicants"
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 ${isActive('/school/applicants')}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaUsers className="mr-2" />
            Applicants
          </Link>
          <Link
            to="/school/analytics"
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 ${isActive('/school/analytics')}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaChartBar className="mr-2" />
            Analytics
          </Link>
        </>
      );
    }
    return null;
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                  ThePassApp
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                {renderNavLinks()}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Notifications />
              <Link
                to="/profile"
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User profile"
                />
              </Link>
              <button
                type="button"
                className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out sm:hidden`}
      >
        {/* Overlay */}
        <div
          className={`${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          } fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-in-out`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer */}
        <div className="relative flex flex-col w-5/6 max-w-sm h-full bg-white shadow-xl">
          <div className="flex-1 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between px-4">
              <Link
                to="/"
                className="text-2xl font-bold text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ThePassApp
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {renderNavLinks()}
            </nav>
          </div>
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <Link
              to="/profile"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <img
                className="h-8 w-8 rounded-full mr-3"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User profile"
              />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
