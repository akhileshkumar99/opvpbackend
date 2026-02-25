import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { noticeAPI, galleryAPI, dashboardAPI } from '../../services/api';
import axios from 'axios';

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0, activities: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [slides, setSlides] = useState([]);
  const [counters, setCounters] = useState({ students: 0, teachers: 0, courses: 0, activities: 0 });
  const popupImageUrl = "http://localhost:5000/uploads/POPUP2.png";

  const features = [
    {
      title: "Expert Faculty",
      description: "Highly qualified and experienced teachers dedicated to student success",
      image: "http://localhost:5000/uploads/expert teacher.png"
    },
    {
      title: "Smart Classes",
      description: "Modern technology-enabled classrooms with interactive learning",
      image: "http://localhost:5000/uploads/smart classes.jpg"
    },
    {
      title: "Sports & Activities",
      description: "Comprehensive sports program and extracurricular activities",
      image: "http://localhost:5000/uploads/sports activity.jpg"
    },
    {
      title: "Holistic Development",
      description: "Focus on academics, character, and life skills",
      image: "http://localhost:5000/uploads/Holistic Development.jpg"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noticesRes, galleryRes, statsRes, slidersRes] = await Promise.all([
          noticeAPI.getPublic(),
          galleryAPI.getAll({ limit: 6 }),
          dashboardAPI.getStats().catch(() => ({ data: {} })),
          axios.get('http://localhost:5000/api/slider')
        ]);
        setNotices(noticesRes.data.slice(0, 4));
        setGallery(galleryRes.data.gallery?.slice(0, 6) || []);
        setSlides(slidersRes.data || []);
        setStats({
          students: statsRes.data?.totalStudents || 1280,
          teachers: statsRes.data?.totalStaff || 12,
          courses: 10,
          activities: 27
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();

    // Show popup on every page refresh
    setShowPopup(true);
  }, []);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Counter animation
  useEffect(() => {
    const animateCounter = (target, key) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCounters(prev => ({ ...prev, [key]: target }));
          clearInterval(timer);
        } else {
          setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
        }
      }, 30);
    };

    if (stats.students > 0) {
      animateCounter(stats.students, 'students');
      animateCounter(stats.teachers, 'teachers');
      animateCounter(stats.courses, 'courses');
      animateCounter(stats.activities, 'activities');
    }
  }, [stats]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      {/* Popup Modal - Close Button on Image Corner */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80"
            onClick={handleClosePopup}
          ></div>
          
          {/* Popup Content - Relative Container for Button Positioning */}
          <div className="relative z-10 w-full max-w-4xl mx-auto">
            {/* Close Button - Positioned on Image Corner */}
            <button 
              onClick={handleClosePopup}
              className="absolute top-2 right-2 z-20 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg hover:bg-red-600 transition-colors"
            >
              ✕
            </button>
            <img 
              src={popupImageUrl} 
              alt="School Popup" 
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Hero Slider - Professional & Responsive */}
      <section className="relative w-full h-[80vh] min-h-[500px] md:min-h-[600px] overflow-hidden">
        {slides.length > 0 ? slides.map((slide, index) => (
          <div
            key={slide._id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0 w-full h-full">
              <img 
                src={slide.imageUrl} 
                alt="School Hero Slider" 
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
            
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20"></div>
          </div>
        )) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-800 flex items-center justify-center">
            <div className="text-white text-center px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Welcome to OPVP Kolhampur Public School</h1>
              <p className="text-lg sm:text-xl">Upload slider images from admin panel</p>
            </div>
          </div>
        )}
        
        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl transition-all"
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl transition-all"
              aria-label="Next slide"
            >
              ›
            </button>
          </>
        )}
        
        {/* Slide Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-8 sm:w-10' : 'bg-white/50 w-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Counter Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="counter-item">
              <div className="text-5xl font-bold text-white mb-2">{counters.students}+</div>
              <div className="text-primary-100 font-medium">Students</div>
            </div>
            <div className="counter-item">
              <div className="text-5xl font-bold text-white mb-2">{counters.teachers}+</div>
              <div className="text-primary-100 font-medium">Teachers</div>
            </div>
            <div className="counter-item">
              <div className="text-5xl font-bold text-white mb-2">{counters.courses}+</div>
              <div className="text-primary-100 font-medium">Courses</div>
            </div>
            <div className="counter-item">
              <div className="text-5xl font-bold text-white mb-2">{counters.activities}+</div>
              <div className="text-primary-100 font-medium">Activities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Principal Message */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600" 
                  alt="Principal" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white p-6 rounded-xl shadow-xl group-hover:bg-primary-700 transition-colors">
                <p className="text-3xl font-bold">39+</p>
                <p className="text-sm">Years Experience</p>
              </div>
            </div>
            <div className="space-y-4">
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wide">Message from Principal</span>
              <h2 className="text-4xl font-bold text-gray-800">Welcome to OPVP Kolhampur Public School</h2>
              <p className="text-gray-600 leading-relaxed">
                Dear Parents and Students, it gives me immense pleasure to welcome you to OPVP Kolhampur Public School. 
                We are committed to providing quality education that nurtures young minds and builds strong character.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our dedicated faculty, modern infrastructure, and holistic approach ensure that every student 
                receives the best possible education and opportunities for growth.
              </p>
              <div className="border-l-4 border-primary-600 pl-4 bg-gray-50 p-4 rounded-r-lg hover:bg-primary-50 transition-colors">
                <p className="text-gray-700 italic">"Education is not preparation for life; education is life itself."</p>
              </div>
              <div className="pt-4">
                <p className="font-bold text-gray-800">Dr. Rajesh Kumar</p>
                <p className="text-gray-500 text-sm">Principal, OPVP Kolhampur Public School</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide a nurturing environment for your child's holistic development
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group rounded-2xl bg-white border border-gray-100 hover:shadow-2xl hover:border-primary-200 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {index !== 0 && <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Achievements</h2>
            <p className="text-gray-400 text-lg">Excellence in every aspect</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <p className="text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">39+</p>
              <p className="text-xl text-gray-400 mt-2">Years of Excellence</p>
            </div>
            <div className="text-center p-6">
              <p className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">2000+</p>
              <p className="text-xl text-gray-400 mt-2">Alumni</p>
            </div>
            <div className="text-center p-6">
              <p className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">100%</p>
              <p className="text-xl text-gray-400 mt-2">Pass Rate</p>
            </div>
            <div className="text-center p-6">
              <p className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">50+</p>
              <p className="text-xl text-gray-400 mt-2">Awards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">World-Class Facilities</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Modern infrastructure designed for comprehensive learning
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-blue-200 transition-all">
                🔬
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">Science Labs</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">Well-equipped physics, chemistry, and biology labs with modern equipment</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-green-200 transition-all">
                📚
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">Library</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">Extensive collection of books, journals, and digital resources</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-red-200 transition-all">
                ⚽
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors">Sports Complex</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">Indoor and outdoor sports facilities for all-round development</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-purple-200 transition-all">
                💻
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">Computer Lab</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">Latest computers with high-speed internet and modern software</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-yellow-200 transition-all">
                🎨
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-yellow-600 transition-colors">Art & Music</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">Dedicated spaces for creative expression and cultural activities</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:bg-pink-200 transition-all">
                🚌
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">Transport</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">Safe and comfortable bus service covering all major routes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4">Join Our Family</h2>
          <p className="text-xl mb-8 opacity-90">Give your child the best start in life</p>
          <Link to="/admission" className="inline-block px-10 py-5 bg-white text-primary-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
            Apply for Admission
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
