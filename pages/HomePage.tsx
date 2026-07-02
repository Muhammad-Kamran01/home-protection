
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { ServiceCategory, Review } from '../types';
import logo from '../assets/logo.png';
import { openMembershipOfferModal } from '../components/MembershipOfferModal';

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Array<{ id: string; name: string }>>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [guestReview, setGuestReview] = useState({
    user_name: '',
    contact_number: '',
    service_name: '',
    rating: 5,
    comment: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      const [categoriesRes, servicesRes] = await Promise.all([
        supabase.from('service_categories').select('*'),
        supabase.from('services').select('id, name').order('name', { ascending: true }),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
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

      if (servicesRes.data) setServices(servicesRes.data);
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (!showReviewModal) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showReviewModal]);

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

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewError('');
    setReviewSuccess('');
    setGuestReview({ user_name: '', contact_number: '', service_name: '', rating: 5, comment: '' });
  };

  const normalizeText = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');

  const findMatchingServiceId = (serviceName: string) => {
    const normalizedServiceName = normalizeText(serviceName);
    if (!normalizedServiceName) return null;

    const matchedService = services.find((service) => {
      const normalizedName = normalizeText(service.name);
      return normalizedName === normalizedServiceName || normalizedName.includes(normalizedServiceName) || normalizedServiceName.includes(normalizedName);
    });

    return matchedService?.id || null;
  };

  const submitGuestReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!guestReview.user_name.trim() || !guestReview.contact_number.trim() || !guestReview.service_name.trim() || !guestReview.comment.trim()) {
      setReviewError('Please complete your name, contact number, service/experience name, and review message.');
      return;
    }

    setReviewSubmitting(true);
    const matchedServiceId = findMatchingServiceId(guestReview.service_name);
    const reviewBody = [
      `Service: ${guestReview.service_name.trim()}`,
      `Contact: ${guestReview.contact_number.trim()}`,
      '',
      guestReview.comment.trim(),
    ].join('\n');

    const { error } = await supabase.from('reviews').insert([{
      service_id: matchedServiceId,
      user_name: guestReview.user_name.trim(),
      rating: guestReview.rating,
      comment: reviewBody,
    }]);

    if (error) {
      setReviewError(error.message);
    } else {
      setReviewSuccess('Thank you. Your review has been submitted successfully.');
      setGuestReview({ user_name: '', contact_number: '', service_name: '', rating: 5, comment: '' });
    }

    setReviewSubmitting(false);
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[560px] md:h-[650px] bg-blue-900 flex items-center py-16 md:py-0">
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
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-5 md:mb-6 leading-tight">
              Your Home Deserves <br />
              <span className="text-yellow-400">Professional Protection</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 md:mb-10 leading-relaxed">
              Our protector is coming at your home. We are experts to take care of your home. We provide services in preferred time. Ensure the standards and security of the home.
            </p>
            <div className="flex flex-nowrap items-center gap-3 sm:gap-4 overflow-x-auto pb-1 sm:overflow-visible sm:pb-0">
              <Link to="/services" className="inline-flex w-auto shrink-0 whitespace-nowrap justify-center bg-yellow-400 text-blue-900 px-5 sm:px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-yellow-500 transition-all items-center gap-2 group">
                Explore Services <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </Link>
              <Link to="/contact" className="inline-flex w-auto shrink-0 whitespace-nowrap items-center justify-center text-center bg-transparent border-2 border-white/30 hover:border-white text-white px-5 sm:px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all backdrop-blur-sm">
                Contact Support
              </Link>
              <button
                type="button"
                onClick={openMembershipOfferModal}
                className="inline-flex w-auto shrink-0 whitespace-nowrap items-center justify-center bg-white text-blue-900 px-5 sm:px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-blue-50 transition-all gap-2 border border-white/20 shadow-lg shadow-blue-950/20"
              >
                Membership Offer <i className="fas fa-id-card"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Stat Badge */}
        {/*
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
        */}
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 bg-white relative -mt-6 md:-mt-10 mx-4 sm:mx-auto max-w-6xl rounded-3xl sm:rounded-2xl shadow-xl z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="text-blue-600 mb-2">
                <i className={`fas ${stat.icon} text-3xl`}></i>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-900">{stat.value}</p>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h4 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Top Categories</h4>
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-4">Services We Offer</h2>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => navigate(`/services?category=${cat.id}`)}
                className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center gap-3 sm:gap-4 group border border-gray-100"
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <i className={`fas ${cat.icon} text-2xl`}></i>
                </div>
                <span className="font-bold text-sm sm:text-base text-blue-900 group-hover:text-blue-600 text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img src="https://img.freepik.com/premium-photo/male-technician-repairing-air-conditioner-safety-uniform-indoors_61243-423.jpg?q=80&w=2069&auto=format&fit=crop" alt="Quality Service" className="w-full h-[320px] sm:h-[420px] lg:h-[500px] object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-yellow-400 p-8 rounded-3xl shadow-xl hidden md:block w-48 text-center">
                <p className="text-4xl font-black text-blue-900">20+</p>
                <p className="text-sm font-bold text-blue-800 uppercase tracking-tighter">Years Excellence</p>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-6 md:mb-8" style={{textAlign: 'center'}}>
                Experience the Best Home <br /> Protection Services
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed" style={{textAlign: 'justify'}}>
                Our protector is coming at your home. We have experts to take care of your home. We provide services in the given time. Ensure the standards and security of the home. Special care is taken to ensure that the honor of the family is not damaged during the work.
              </p>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed" style={{textAlign: 'justify'}}>
                Our first priority is that your beloved home always remains magnificent and lasts for a long time. Our consultants provide the best advice to save your money and time. Because we know that you have built it with great love. The problem of your home is not only yours — it is also ours, which we solve with 20 years of experience.
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
      <section className="py-16 md:py-24 bg-blue-50/50">
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

      {/* For Logo Visibility*/}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-6 md:mb-8" style={{textAlign: 'center'}}>
                A Name You Can Trust for Maintaining Your Home's Integrity
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed" style={{textAlign: 'justify'}}>
                For over 20 years, we have protected homes with integrity, skill, and respect. Our reputation is built on consistent quality, honest work, and long-term relationships. Every home we serve is treated as our own — with care, professionalism, and responsibility.
              </p>
              <ul className="space-y-4 mb-10">
                {['Reliable & On-Time Service', '20+ Years of Proven Experience', 'Honest Advice & Long-Term Solutions'].map((item, idx) => (
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

            <div className="lg:w-1/2 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img src={logo} alt="Home Protection" className="w-full h-[320px] sm:h-[420px] lg:h-[500px] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Promo */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-800 rounded-[2rem] md:rounded-[3rem] p-6 sm:p-10 md:p-20 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
              <div className="md:w-1/2 text-white">
                <h5 className="text-2xl sm:text-3xl md:text-5xl font-black mb-6 md:mb-8" style={{textAlign: 'center'}}>Booking a service is now at your fingertips</h5>
                <p className="text-base md:text-lg text-blue-100 mb-6 md:mb-8" style={{textAlign: 'center'}}>Download the Home Protection app to manage bookings, track technicians, and get exclusive discounts.</p>
                <h4 className="text-3xl md:text-5xl font-black mb-6" style={{textAlign: 'center'}}>Coming Soon</h4> <br></br>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button className="w-full sm:w-auto justify-center bg-white text-blue-900 px-8 py-3 rounded-xl flex items-center gap-3 font-bold hover:bg-gray-100 transition-all">
                    <i className="fab fa-apple text-2xl"></i>
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-bold text-gray-500 leading-none">Download on</p>
                      <p className="text-lg">App Store</p>
                    </div>
                  </button>
                  <button className="w-full sm:w-auto justify-center bg-white text-blue-900 px-8 py-3 rounded-xl flex items-center gap-3 font-bold hover:bg-gray-100 transition-all">
                    <i className="fab fa-google-play text-2xl text-blue-600"></i>
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-bold text-gray-500 leading-none">Get it on</p>
                      <p className="text-lg">Google Play</p>
                    </div>
                  </button>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative flex items-center justify-center my-0 md:-my-20">
                  <img src="https://d3puhl2t51lebl.cloudfront.net/uploads/2024/07/homeservice.png?resize=850x1024&vertical=center" alt="Mobile App" className="max-w-[250px] sm:max-w-[320px] md:max-w-full h-full mx-auto rounded-[2rem] md:rounded-[3rem] shadow-2xl transform rotate-0 sm:rotate-4 border-0 md:border-14 border-gray-900" />
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
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">Booked with us without registering? You can still share your experience and help other homeowners choose with confidence.</p>
            <button
              onClick={() => setShowReviewModal(true)}
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-blue-600 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 hover:-translate-y-0.5"
            >
              <i className="fas fa-comment-dots"></i>
              Leave a Review
            </button>
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

      {showReviewModal && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 px-3 py-4 sm:items-center sm:px-4 sm:py-8">
          <div className="w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-hidden rounded-[1.5rem] bg-white shadow-2xl border border-gray-100 sm:rounded-[2rem]">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white px-5 py-4 sm:px-6 sm:py-5 lg:px-8">
              <div>
                {/*<p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Submit Your Review</p>*/}
                <h3 className="mt-2 text-xl font-black text-blue-900 sm:text-2xl">Share Your Experience</h3>
                <p className="mt-2 text-sm text-gray-500">No login required. Share feedback after any completed booking or service visit.</p>
              </div>
              <button onClick={closeReviewModal} className="shrink-0 rounded-full bg-gray-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200">
                Close
              </button>
            </div>

            <form onSubmit={submitGuestReview} className="max-h-[calc(100vh-8.5rem)] space-y-5 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Your Name</label>
                  <input
                    type="text"
                    value={guestReview.user_name}
                    onChange={(e) => setGuestReview((prev) => ({ ...prev, user_name: e.target.value }))}
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Contact Number</label>
                  <input
                    type="tel"
                    value={guestReview.contact_number}
                    onChange={(e) => setGuestReview((prev) => ({ ...prev, contact_number: e.target.value }))}
                    placeholder="e.g. +92 3XX XXXXXXX"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Service / Experience Title</label>
                <input
                  type="text"
                  value={guestReview.service_name}
                  onChange={(e) => setGuestReview((prev) => ({ ...prev, service_name: e.target.value }))}
                  placeholder="Write the service or experience name"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                <p className="text-[11px] text-gray-400">You can type the service name in your own words if it is easier.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Rating</label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setGuestReview((prev) => ({ ...prev, rating }))}
                      className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition-all ${guestReview.rating === rating ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100' : 'border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:text-blue-600'}`}
                    >
                      {rating} Star{rating > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Review</label>
                <textarea
                  rows={4}
                  value={guestReview.comment}
                  onChange={(e) => setGuestReview((prev) => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share what went well and what could be even better..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {reviewError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {reviewError}
                </div>
              )}

              {reviewSuccess && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm text-green-700">
                  {reviewSuccess}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
                <button type="button" onClick={closeReviewModal} className="rounded-2xl bg-gray-100 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={reviewSubmitting} className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700 transition-all disabled:opacity-60">
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
