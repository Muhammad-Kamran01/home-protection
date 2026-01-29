
import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-blue-800 py-24 text-center text-white">
        <h1 className="text-5xl font-black mb-6">Contact Us</h1>
        <p className="text-blue-100 max-w-xl mx-auto">Have a question or need an emergency repair? We are here to help you.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Availability Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-gray-100 text-center">
            <div className="flex items-center justify-center gap-4 mb-6 flex-col">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl">
                <i className="fas fa-calendar-days"></i>
              </div>
              <div>
                <h3 className="text-xl font-black text-blue-900">Available Days</h3>
                <p className="text-gray-500 text-sm">Monday to Sunday</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">We are available to serve you throughout the week. Our team operates on weekdays as well as weekends to ensure maximum availability for all your home maintenance needs.</p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-gray-100 text-center">
            <div className="flex items-center justify-center gap-4 mb-6 flex-col">
              <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center text-2xl">
                <i className="fas fa-clock"></i>
              </div>
              <div>
                <h3 className="text-xl font-black text-blue-900">Available Time</h3>
                <br></br>
                <p className="text-gray-500 text-sm">Mon-Fri : 10:00 AM - 08:00 PM</p>
                <p className="text-gray-500 text-sm">Sat-Sun : 11:00 AM - 06:00 PM</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">Extended working hours to accommodate your schedule. Emergency services are available for urgent repairs and critical maintenance issues.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl p-10 md:p-16 border border-gray-100">
            {submitted ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                  <i className="fas fa-check"></i>
                </div>
                <h2 className="text-3xl font-black text-blue-900 mb-4">Message Sent!</h2>
                <p className="text-gray-500">We have received your inquiry and will get back to you within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Full Name</label>
                    <input required type="text" className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <input required type="email" className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Phone Number</label>
                    <input required type="tel" className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50" placeholder="+92 3XX XXXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Subject</label>
                    <select className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50">
                      <option>General Inquiry</option>
                      <option>Emergency Service</option>
                      <option>Billing Question</option>
                      <option>Career Opportunity</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Your Message</label>
                  <textarea required rows={5} className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-gray-100">
              <h3 className="text-xl font-black text-blue-900 mb-8">Head Office</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="text-blue-600 text-xl"><i className="fas fa-map-marker-alt"></i></div>
                  <p className="text-gray-600 text-sm">132-1-D1, Town Ship, Lahore, Punjab, Pakistan</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-blue-600 text-xl"><i className="fas fa-phone-alt"></i></div>
                  <p className="text-gray-600 text-sm font-bold">+92 321 4605210</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-blue-600 text-xl"><i className="fas fa-envelope"></i></div>
                  <p className="text-gray-600 text-sm">info@homeprotection.pk</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-900 p-10 rounded-[2.5rem] shadow-lg text-white">
              <h3 className="text-xl font-bold mb-4">Emergency Help?</h3>
              <p className="text-blue-200 text-sm mb-8">Our rapid response team is available 12 hours a day for electrical and plumbing emergencies.</p>
              <a href="tel:+923214605210" className="block text-center bg-yellow-400 text-blue-900 py-4 rounded-2xl font-black hover:bg-yellow-500 transition-all">
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
