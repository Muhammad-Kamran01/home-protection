import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-blue-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://img.freepik.com/premium-photo/teamwork-human-resources-hr-management-technology-business-kudos_31965-617873.jpg?q=80&w=1974&auto=format&fit=crop" alt="Team" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl font-black text-white mb-6">Built on Trust & Excellence</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">Providing professional maintenance solutions since 2020. Our mission is to protect every home with quality workmanship.</p>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-center text-center">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">To become the most reliable and efficient maintenance partner for homeowners and businesses across Pakistan through transparency and skill.</p>
            </div>
            <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">Defining the future of facility management by integrating smart technology with traditional craftsmanship to ensure total property safety.</p>
            </div>
            <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Our Values</h2>
              <p className="text-gray-600 leading-relaxed">Integrity, Punctuality, and Quality. We treat every home like our own and every client like family.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-black text-blue-600 mb-2">500+</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Active Clients</p>
            </div>
            <div>
              <p className="text-4xl font-black text-blue-600 mb-2">100+</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Technicians</p>
            </div>
            <div>
              <p className="text-4xl font-black text-blue-600 mb-2">15+</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">City Sectors</p>
            </div>
            <div>
              <p className="text-4xl font-black text-blue-600 mb-2">98%</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Retention Rate</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Us</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Home Protection was founded on a simple premise: home maintenance should be stress-free, transparent, and professional. In a market often characterized by unreliability, we set out to build a platform where quality is guaranteed.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              We leverage modern technology and a strictly vetted workforce to ensure that when you book a "Protector", you get the best in the business.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <h4 className="font-bold text-blue-900 text-2xl">100+</h4>
                <p className="text-gray-500 text-sm uppercase font-semibold">Certified Pros</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-bold text-blue-900 text-2xl">Anytime</h4>
                <p className="text-gray-500 text-sm uppercase font-semibold">Support Coverage</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img src="https://f.hubspotusercontent40.net/hubfs/9492292/AdobeStock_290366802.jpeg?auto=format&fit=crop&q=80" alt="Team at work" className="rounded-3xl shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Home Protection?</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">We differentiate ourselves through a commitment to absolute excellence in every repair and installation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Vetted Professionals', text: 'Every technician undergoes rigorous background checks and skill assessments before joining our fleet.', icon: 'fa-user-check' },
              { title: 'Fixed Pricing', text: 'No surprises. Our app shows you the cost upfront, ensuring complete transparency for every service.', icon: 'fa-tags' },
              { title: 'Service Warranty', text: 'We stand by our work. All services come with a standard 7-day workmanship guarantee.', icon: 'fa-shield-heart' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Promo */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-800 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2 text-white">
                <h5 className="text-4xl md:text-5xl font-black mb-8" style={{textAlign: 'center'}}>Booking a service is now at your fingertips</h5>
                <p className="text-lg text-blue-100 mb-8" style={{textAlign: 'center'}}>Download the Home Protection app to manage bookings, track technicians, and get exclusive discounts.</p>
                <h4 className="text-4xl md:text-5xl font-black mb-6" style={{textAlign: 'center'}}>Coming Soon</h4> <br></br>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button className="bg-white text-blue-900 px-8 py-3 rounded-xl flex items-center gap-3 font-bold hover:bg-gray-100 transition-all">
                    <i className="fab fa-apple text-2xl"></i>
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-bold text-gray-500 leading-none">Download on</p>
                      <p className="text-lg">App Store</p>
                    </div>
                  </button>
                  <button className="bg-white text-blue-900 px-8 py-3 rounded-xl flex items-center gap-3 font-bold hover:bg-gray-100 transition-all">
                    <i className="fab fa-google-play text-2xl text-blue-600"></i>
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-bold text-gray-500 leading-none">Get it on</p>
                      <p className="text-lg">Google Play</p>
                    </div>
                  </button>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative flex items-center justify-center -my-12 md:-my-20">
                  <img src="https://d3puhl2t51lebl.cloudfront.net/uploads/2024/07/homeservice.png?resize=850x1024&vertical=center" alt="Mobile App" className="max-w-full h-full mx-auto rounded-[3rem] shadow-2xl transform rotate-4 border-10 border-gray-900" />
                  <div className="absolute top-1/2 -left-10 w-24 h-24 bg-yellow-400 rounded-full blur-3xl opacity-30"></div>
                </div>
              </div>
            </div>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="bg-blue-600 rounded-[3rem] p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Want to Join the Protector Fleet?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              We are always looking for skilled technicians, engineers, and customer service stars to help us redefine home maintenance.
            </p>
            <Link to="/careers" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
              Explore Careers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
