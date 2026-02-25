import { useState } from 'react';
import { contactAPI } from '../../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.create(formData);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-primary-100">We'd love to hear from you</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow border-t-4 border-primary-500">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">📍</div>
              <h3 className="font-bold text-xl mb-2">Address</h3>
              <p className="text-gray-600 leading-relaxed">O.P.V.P. Kolhampur Public School<br />Kolhampur Bazar Nawabganj, Gonda<br />Uttar Pradesh 271319</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow border-t-4 border-green-500">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">📞</div>
              <h3 className="font-bold text-xl mb-2">Phone</h3>
              <p className="text-gray-600">+91 1234567890<br />+91 0987654321</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow border-t-4 border-red-500">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">✉️</div>
              <h3 className="font-bold text-xl mb-2">Email</h3>
              <p className="text-gray-600">info@opvpkolhampur.com<br />principal@opvpkolhampur.com</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow border-t-4 border-yellow-500">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">🕐</div>
              <h3 className="font-bold text-xl mb-2">Office Hours</h3>
              <p className="text-gray-600">Monday - Friday: 8:00 AM - 4:00 PM<br />Saturday: 9:00 AM - 1:00 PM</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all" 
                      placeholder="Your name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all" 
                      placeholder="Your email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all" 
                      placeholder="Your phone number" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all" 
                      placeholder="What is this about?" 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                  <textarea 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all" 
                    rows="6" 
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2858.6374706703605!2d82.19723697430749!3d26.89590316081479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399a01dde67bfa6f%3A0xb4e6b66c4934cd40!2sO.P.V.P.%20Kolhampur%20Public%20school!5e1!3m2!1sen!2sin!4v1772041199261!5m2!1sen!2sin" 
              width="100%" 
              height="450" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
