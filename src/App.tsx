import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import EducatorDashboard from './pages/educator/Dashboard';
import SchoolDashboard from './pages/school/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeToggle } from './components/ThemeToggle';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <Layout>
                <ThemeToggle />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  
                  {/* Protected Routes */}
                  <Route path="/educator/*" element={
                    <ProtectedRoute>
                      <EducatorDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/school/*" element={
                    <ProtectedRoute>
                      <SchoolDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/*" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Default Route */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Navigate to="/educator/dashboard" />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Layout>
            </Router>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
