const About = () => {
  return (
    <div>
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">About OPVP Kolhampur Public School</h1>
          <p className="text-xl">Nurturing minds, shaping futures</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                OPVP Kolhampur Public School was established in 1985 with a vision to provide quality education to children from all walks of life. 
                Over the years, we have grown from a small institution to one of the most reputed schools in the region.
              </p>
              <p className="text-gray-600 mb-4">
                Our mission is to develop well-rounded individuals who are academically excellent, socially responsible, 
                and morally upright. We believe in holistic education that nurtures the mind, body, and spirit.
              </p>
            </div>
            <div className="relative group overflow-hidden rounded-2xl shadow-2xl bg-gray-100">
              <img 
                src="http://localhost:5000/uploads/slider4.png" 
                alt="School Building" 
                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6 group hover:bg-white hover:shadow-xl rounded-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 group-hover:from-red-500 group-hover:to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl transition-all duration-300 group-hover:scale-110">🎯</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">Excellence</h3>
              <p className="text-gray-600">Striving for the highest standards in everything we do</p>
            </div>
            <div className="text-center p-6 group hover:bg-white hover:shadow-xl rounded-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 group-hover:from-green-500 group-hover:to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl transition-all duration-300 group-hover:scale-110">💚</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">Integrity</h3>
              <p className="text-gray-600">Building character through honesty and moral values</p>
            </div>
            <div className="text-center p-6 group hover:bg-white hover:shadow-xl rounded-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 group-hover:from-blue-500 group-hover:to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl transition-all duration-300 group-hover:scale-110">🤝</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">Community</h3>
              <p className="text-gray-600">Fostering teamwork and social responsibility</p>
            </div>
            <div className="text-center p-6 group hover:bg-white hover:shadow-xl rounded-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 group-hover:from-yellow-500 group-hover:to-yellow-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl transition-all duration-300 group-hover:scale-110">🌟</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-600 transition-colors">Innovation</h3>
              <p className="text-gray-600">Embracing creativity and modern teaching methods</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Facilities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="text-5xl mb-4">💻</div>
              <h3 className="text-2xl font-bold mb-3">Smart Classrooms</h3>
              <p className="text-blue-100">Equipped with modern technology for interactive learning</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="text-5xl mb-4">🔬</div>
              <h3 className="text-2xl font-bold mb-3">Science Labs</h3>
              <p className="text-purple-100">Well-equipped physics, chemistry, and biology labs</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-3">Library</h3>
              <p className="text-green-100">Extensive collection of books and digital resources</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-700 text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="text-5xl mb-4">⚽</div>
              <h3 className="text-2xl font-bold mb-3">Sports Complex</h3>
              <p className="text-red-100">Indoor and outdoor sports facilities</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="text-5xl mb-4">🖥️</div>
              <h3 className="text-2xl font-bold mb-3">Computer Lab</h3>
              <p className="text-indigo-100">Modern computers with high-speed internet</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="text-5xl mb-4">🚌</div>
              <h3 className="text-2xl font-bold mb-3">Transport</h3>
              <p className="text-yellow-100">Safe and reliable school bus service</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
