
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { ServiceCategory, Review } from '../types';

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('service_categories').select('*');
      if (data) setCategories(data);
      else {
        // Fallback for demo if DB is empty
        setCategories([
          { id: '1', name: 'AC Services', icon: 'fa-snowflake', description: 'Expert cooling solutions' },
          { id: '2', name: 'Carpentry', icon: 'fa-hammer', description: 'Fine woodwork and repair' },
          { id: '3', name: 'CCTV & Security', icon: 'fa-video', description: 'Keep your home safe' },
          { id: '4', name: 'Cleaning', icon: 'fa-broom', description: 'Sparkling clean spaces' },
          { id: '5', name: 'Electrical', icon: 'fa-bolt', description: 'Safe power installations' },
          { id: '6', name: 'Plumbing', icon: 'fa-faucet', description: 'Flow control and repair' },
        ]);
      }
    };
    fetchCategories();
  }, []);

  const stats = [
    { label: 'Expert Technicians', value: '150+', icon: 'fa-user-cog' },
    { label: 'Service Calls', value: '10k+', icon: 'fa-phone-volume' },
    { label: 'Average Rating', value: '4.8/5', icon: 'fa-star' },
    { label: 'Work Guarantee', value: '100%', icon: 'fa-shield-check' },
  ];

  const testimonials: Review[] = [
    { id: '1', user_name: 'Ali Ahmed', comment: 'Best AC service I have ever used. On time and very professional.', rating: 5, location: 'LAHORE' },
    { id: '2', user_name: 'Sana Khan', comment: 'Fixed my electrical issue within 30 minutes. Highly recommend!', rating: 5, location: 'LAHORE' },
    { id: '3', user_name: 'Zohaib Malik', comment: 'Fair pricing and great communication. The tech was very polite.', rating: 5, location: 'LAHORE' },
  ];

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[650px] bg-blue-900 flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://electrafix.pk/wp-content/uploads/2024/10/Handyman-Services.jpg?q=80&w=2070&auto=format&fit=crop" 
            alt="Maintenance Worker" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Your Home Deserves <br />
              <span className="text-yellow-400">Professional Protection</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed">
              Our protector is coming at your home. We are experts to take care of your home. We provide services in preferred time. Ensure the standards and security of the home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/services" className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 transition-all flex items-center gap-2 group">
                Explore Services <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </Link>
              <Link to="/contact" className="bg-transparent border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-sm">
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Stat Badge */}
        <div className="hidden lg:block absolute right-20 bottom-20 bg-green-500/90 backdrop-blur-md p-6 rounded-2xl text-white shadow-2xl border border-white/20">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <i className="fas fa-check-circle text-2xl"></i>
            </div>
            <div>
              <p className="font-bold text-lg">10k+ Happy Homes</p>
              <p className="text-sm opacity-80">Maintained with care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white relative -mt-10 mx-auto max-w-6xl rounded-2xl shadow-xl z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="text-blue-600 mb-2">
                <i className={`fas ${stat.icon} text-3xl`}></i>
              </div>
              <p className="text-3xl font-extrabold text-blue-900">{stat.value}</p>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h4 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Top Categories</h4>
            <h2 className="text-4xl font-extrabold text-blue-900 mb-4">Services We Offer</h2>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => navigate(`/services?category=${cat.id}`)}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center gap-4 group border border-gray-100"
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <i className={`fas ${cat.icon} text-2xl`}></i>
                </div>
                <span className="font-bold text-blue-900 group-hover:text-blue-600">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img src="https://img.freepik.com/premium-photo/male-technician-repairing-air-conditioner-safety-uniform-indoors_61243-423.jpg?q=80&w=2069&auto=format&fit=crop" alt="Quality Service" className="w-full h-[500px] object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-yellow-400 p-8 rounded-3xl shadow-xl hidden md:block w-48 text-center">
                <p className="text-4xl font-black text-blue-900">20+</p>
                <p className="text-sm font-bold text-blue-800 uppercase tracking-tighter">Years Excellence</p>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-extrabold text-blue-900 mb-8" style={{textAlign: 'center'}}>
                Experience the Best Home <br /> Protection Services
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed" style={{textAlign: 'justify'}}>
                Our protector is coming at your home. We have experts to take care of your home. We provide services in the given time. Ensure the standards and security of the home. Special care is taken to ensure that the honor of the family is not damaged during the work.
              </p>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed" style={{textAlign: 'justify'}}>
                Our first priority is that your beloved home always remains magnificent and lasts for a long time. Our consultants provide the best advice to save your money and time. Because we know that you have built it with great love. The problem of your home is not only yours——it is also ours, which we solve with 25 years of experience.
              </p>
              <ul className="space-y-4 mb-10">
                {['Quality Workmanship Guaranteed', 'Transparent Pricing with No Hidden Costs', 'Background-checked & Certified Pros'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-blue-900 font-semibold">
                    <i className="fas fa-check-circle text-blue-600"></i>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/about" className="text-blue-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Learn more about us <i className="fas fa-chevron-right text-sm"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Areas */}
      <section className="py-24 bg-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-blue-900">Service Coverage Areas</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-lg border-t-4 border-blue-600 text-center flex flex-col items-center">
              <i className="fas fa-map-marked-alt text-4xl text-blue-600 mb-6"></i>
              <h3 className="text-xl font-bold mb-4">Lahore-Punjab</h3>
              <p className="text-gray-500 mb-6">Partially covered. All services available across all major sectors.</p>
              <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Active Now</span>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-lg border-t-4 border-yellow-400 text-center flex flex-col items-center">
              <i className="fas fa-city text-4xl text-yellow-400 mb-6"></i>
              <h3 className="text-xl font-bold mb-4">Islamabad</h3>
              <p className="text-gray-500 mb-6">Operational hub setup in progress. Coming very soon.</p>
              <span className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Coming Soon</span>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-lg border-t-4 border-gray-300 text-center flex flex-col items-center opacity-60">
              <i className="fas fa-globe text-4xl text-gray-400 mb-6"></i>
              <h3 className="text-xl font-bold mb-4">Rest of Pakistan</h3>
              <p className="text-gray-500 mb-6">Consultancy and remote support available nationwide.</p>
              <span className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Future Phase</span>
            </div>
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

      {/* Customer Reviews */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-blue-900">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((rev) => (
              <div key={rev.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex gap-1 text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star text-sm"></i>)}
                </div>
                <p className="italic text-gray-600 mb-8 leading-relaxed">"{rev.comment}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {rev.user_name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900">{rev.user_name}</h4>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{rev.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
