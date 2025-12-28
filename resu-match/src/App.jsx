import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import RegisterSimple from './pages/auth/RegisterSimple';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/dashboard/Profile';
import Resume from './pages/dashboard/Resume';
import Applications from './pages/dashboard/Applications';
import Settings from './pages/dashboard/Settings';

// Job Pages
import JobSearch from './pages/jobs/JobSearch';
import JobDetails from './pages/jobs/JobDetails';
import SavedJobs from './pages/jobs/SavedJobs';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <JobProvider>
          <div className="app flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterSimple />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Job Routes (Public) */}
                <Route path="/jobs" element={<JobSearch />} />
                <Route path="/jobs/:id" element={<JobDetails />} />

                {/* Protected Routes - Auth Disabled */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/jobs/saved" element={<SavedJobs />} />
                <Route path="/settings" element={<Settings />} />

                {/* Admin Routes - Auth Disabled */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </JobProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
