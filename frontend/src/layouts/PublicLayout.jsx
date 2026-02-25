import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { noticeAPI } from '../services/api';

const PublicLayout = () => {
  const [notices, setNotices] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoUrl = "http://localhost:5000/uploads/LOGO2.png";
  const schoolName = "OPVP KOLHAMPUR PUBLIC SCHOOL";

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await noticeAPI.getPublic();
        setNotices(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };
    fetchNotices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Stylish Modern Design */}
      <header className="bg-white/95 backdrop-blur-md shadow-xl sticky top-0 z-50 relative overflow-hidden border-b border-gray-100">
        {/* Animated running border */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500" style={{height: '5px'}}></div>
        <div className="absolute bottom-0 left-0 w-32 bg-gradient-to-r from-white via-white to-transparent animate-[slide_3s_linear_infinite]" style={{height: '5px'}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/20 via-transparent to-blue-50/20 pointer-events-none"></div>
        <style>{`
          @keyframes slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(calc(100vw + 100%)); }
          }
        `}</style>
        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <div className="flex items-center justify-between py-2 sm:py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 md:gap-4 group relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-blue-500 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <img src={logoUrl} alt="School Logo" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl object-cover bg-white shadow-2xl group-hover:scale-110 transition-transform relative z-10 ring-2 ring-primary-100 group-hover:ring-primary-300" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xs sm:text-sm md:text-base lg:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-primary-600 to-blue-600 leading-tight">{schoolName}</h1>
                <p className="text-[10px] sm:text-xs text-gray-600 font-bold tracking-wide">Est. 1985 • CBSE Affiliated</p>
              </div>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Link to="/" className="px-2 xl:px-4 py-2.5 text-sm xl:text-base text-gray-700 hover:text-white font-bold rounded-xl hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 transition-all hover:shadow-lg hover:scale-105">Home</Link>
              <Link to="/about" className="px-2 xl:px-4 py-2.5 text-sm xl:text-base text-gray-700 hover:text-white font-bold rounded-xl hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 transition-all hover:shadow-lg hover:scale-105">About</Link>
              <Link to="/gallery" className="px-2 xl:px-4 py-2.5 text-sm xl:text-base text-gray-700 hover:text-white font-bold rounded-xl hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 transition-all hover:shadow-lg hover:scale-105">Gallery</Link>
              <Link to="/notices" className="px-2 xl:px-4 py-2.5 text-sm xl:text-base text-gray-700 hover:text-white font-bold rounded-xl hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 transition-all hover:shadow-lg hover:scale-105">Notices</Link>
              <Link to="/contact" className="px-2 xl:px-4 py-2.5 text-sm xl:text-base text-gray-700 hover:text-white font-bold rounded-xl hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 transition-all hover:shadow-lg hover:scale-105">Contact</Link>
              <div className="flex gap-1 xl:gap-2 ml-2 xl:ml-3">
                {notices.length > 0 && (
                  <Link 
                    to="/notices" 
                    className="px-2 xl:px-4 py-2.5 text-sm xl:text-base bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all font-bold flex items-center gap-1 xl:gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <span className="animate-pulse text-base xl:text-lg">📢</span>
                    <span className="hidden xl:inline">Notices</span>
                  </Link>
                )}
                <Link to="/login" className="px-3 xl:px-5 py-2.5 text-sm xl:text-base border-2 border-primary-600 text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all font-bold hover:scale-105 shadow-md hover:shadow-lg">
                  Login
                </Link>
                <Link to="/admission" className="px-3 xl:px-5 py-2.5 text-sm xl:text-base bg-gradient-to-r from-primary-500 via-primary-600 to-blue-600 text-white rounded-xl hover:from-primary-600 hover:via-primary-700 hover:to-blue-700 transition-all font-bold shadow-xl hover:shadow-2xl hover:scale-105">
                  Apply
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-xl sm:text-2xl p-2 text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t py-3 px-3 sm:px-4 shadow-lg">
            <nav className="flex flex-col gap-1.5 sm:gap-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:text-white font-medium rounded-lg hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 transition-all">Home</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:text-white font-medium rounded-lg hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 transition-all">About</Link>
              <Link to="/gallery" onClick={() => setMobileMenuOpen(false)} className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:text-white font-medium rounded-lg hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 transition-all">Gallery</Link>
              <Link to="/notices" onClick={() => setMobileMenuOpen(false)} className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:text-white font-medium rounded-lg hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 transition-all">Notices</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:text-white font-medium rounded-lg hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-600 transition-all">Contact</Link>
              <div className="flex gap-2 mt-3 sm:mt-4">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-primary-600 text-primary-600 rounded-lg text-center font-medium hover:bg-primary-600 hover:text-white transition-all">
                  Login
                </Link>
                <Link to="/admission" onClick={() => setMobileMenuOpen(false)} className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-center font-medium hover:from-primary-600 hover:to-primary-700 transition-all">
                  Apply Now
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <Outlet />

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* About */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img src={logoUrl} alt="School Logo" className="w-14 h-14 rounded-xl object-cover bg-white" />
                <div>
                  <h3 className="text-lg font-bold">{schoolName}</h3>
                  <p className="text-xs text-gray-400">Est. 1985</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Providing quality education since 1985. We nurture future leaders with excellence in academics, sports, and character development.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">f</a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">t</a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">in</a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">Y</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2">→ Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2">→ About Us</Link></li>
                <li><Link to="/gallery" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2">→ Gallery</Link></li>
                <li><Link to="/notices" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2">→ Notices</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2">→ Contact</Link></li>
                <li><Link to="/admission" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2">→ Admission</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-6">Contact Info</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <span>O.P.V.P. Kolhampur Public School<br/>Kolhampur Bazar Nawabganj, Gonda<br/>Uttar Pradesh 271319</span>
                    <br/>
                    <a 
                      href="https://maps.app.goo.gl/aPUVqtKH6o642W1M8" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 text-sm underline mt-1 inline-block"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">📞</span>
                  <span>+91 1234567890</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">✉️</span>
                  <span>info@stjosephschool.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">🌐</span>
                  <span>www.stjosephschool.com</span>
                </li>
              </ul>
            </div>

            {/* Google Map */}
            <div>
              <h3 className="text-lg font-bold mb-6">Our Location</h3>
              <div className="rounded-xl overflow-hidden h-48 bg-gray-800">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2858.6374706703605!2d82.19723697430749!3d26.89590316081479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399a01dde67bfa6f%3A0xb4e6b66c4934cd40!2sO.P.V.P.%20Kolhampur%20Public%20school!5e1!3m2!1sen!2sin!4v1772041199261!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="O.P.V.P. Kolhampur Public School Location"
                ></iframe>
              </div>
              <a 
                href="https://maps.app.goo.gl/aPUVqtKH6o642W1M8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                📍 View on Google Maps
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">© 2024 {schoolName}. All rights reserved.</p>
              <p className="text-gray-500 text-sm">Designed with ❤️ Akhilesh Infotech</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
