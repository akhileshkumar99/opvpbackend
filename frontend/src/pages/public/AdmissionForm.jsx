import { useState } from 'react';
import { admissionAPI } from '../../services/api';

const AdmissionForm = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', gender: 'Male', dateOfBirth: '', fatherName: '', motherName: '',
    phone: '', email: '', address: '', class: '', previousSchool: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await admissionAPI.submit(formData);
      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', gender: 'Male', dateOfBirth: '', fatherName: '', motherName: '', phone: '', email: '', address: '', class: '', previousSchool: '', message: '' });
    } catch (error) {
      alert('Failed to submit application. Please try again.');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">Thank you for applying to ST Joseph School. We will review your application and contact you soon.</p>
          <button onClick={() => setSubmitted(false)} className="btn btn-primary">Submit Another Application</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Apply for Admission</h1>
          <p className="text-gray-600">Fill out the form below to apply for admission</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-4">Student Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="label">First Name *</label><input type="text" name="firstName" className="input" value={formData.firstName} onChange={handleChange} required /></div>
              <div><label className="label">Last Name *</label><input type="text" name="lastName" className="input" value={formData.lastName} onChange={handleChange} required /></div>
              <div><label className="label">Gender *</label><select name="gender" className="input" value={formData.gender} onChange={handleChange}><option value="Male">Male</option><option value="Female">Female</option></select></div>
              <div><label className="label">Date of Birth *</label><input type="date" name="dateOfBirth" className="input" value={formData.dateOfBirth} onChange={handleChange} required /></div>
              <div><label className="label">Class Applying For *</label><select name="class" className="input" value={formData.class} onChange={handleChange} required><option value="">Select Class</option><option value="Nursery">Nursery</option><option value="KG">KG</option><option value="Class 1">Class 1</option><option value="Class 2">Class 2</option><option value="Class 3">Class 3</option><option value="Class 4">Class 4</option><option value="Class 5">Class 5</option><option value="Class 6">Class 6</option><option value="Class 7">Class 7</option><option value="Class 8">Class 8</option><option value="Class 9">Class 9</option><option value="Class 10">Class 10</option></select></div>
              <div><label className="label">Previous School</label><input type="text" name="previousSchool" className="input" value={formData.previousSchool} onChange={handleChange} /></div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Parent Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="label">Father's Name *</label><input type="text" name="fatherName" className="input" value={formData.fatherName} onChange={handleChange} required /></div>
              <div><label className="label">Mother's Name</label><input type="text" name="motherName" className="input" value={formData.motherName} onChange={handleChange} /></div>
              <div><label className="label">Phone *</label><input type="tel" name="phone" className="input" value={formData.phone} onChange={handleChange} required /></div>
              <div><label className="label">Email</label><input type="email" name="email" className="input" value={formData.email} onChange={handleChange} /></div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Information</h3>
            <div><label className="label">Address *</label><textarea name="address" className="input" rows="2" value={formData.address} onChange={handleChange} required /></div>
          </div>

          <div>
            <label className="label">Additional Message</label>
            <textarea name="message" className="input" rows="3" value={formData.message} onChange={handleChange} placeholder="Any additional information..." />
          </div>

          <button type="submit" disabled={loading} className="w-full btn btn-primary py-3">
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;
