import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentForm from './pages/StudentForm';
import Teachers from './pages/Teachers';
import TeacherForm from './pages/TeacherForm';
import Fees from './pages/Fees';
import FeeForm from './pages/FeeForm';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Attendance from './pages/Attendance';
import Exams from './pages/Exams';
import Results from './pages/Results';
import Notices from './pages/Notices';
import Classes from './pages/Classes';
import Gallery from './pages/Gallery';
import HeroSlider from './pages/HeroSlider';
import Admissions from './pages/Admissions';
import Settings from './pages/Settings';
import Contact from './pages/Contact';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import AdmissionForm from './pages/public/AdmissionForm';
import PublicGallery from './pages/public/Gallery';
import PublicNotices from './pages/public/Notices';
import PublicContact from './pages/public/Contact';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admission" element={<AdmissionForm />} />
            <Route path="/gallery" element={<PublicGallery />} />
            <Route path="/notices" element={<PublicNotices />} />
            <Route path="/contact" element={<PublicContact />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/login" element={<Login />} />
          
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="students/add" element={<StudentForm />} />
            <Route path="students/:id" element={<StudentForm />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="teachers/add" element={<TeacherForm />} />
            <Route path="teachers/:id" element={<TeacherForm />} />
            <Route path="fees" element={<Fees />} />
            <Route path="fees/add" element={<FeeForm />} />
            <Route path="fees/:id" element={<FeeForm />} />
            <Route path="income" element={<Income />} />
            <Route path="expense" element={<Expense />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="exams" element={<Exams />} />
            <Route path="results" element={<Results />} />
            <Route path="notices" element={<Notices />} />
            <Route path="classes" element={<Classes />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="slider" element={<HeroSlider />} />
            <Route path="admissions" element={<Admissions />} />
            <Route path="contact" element={<Contact />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
