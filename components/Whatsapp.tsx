
import React from 'react';

const Whatsapp: React.FC = () => {
  const phoneNumber = "923214605210";
  const message = encodeURIComponent("Hello Home Protection! I am interested in your maintenance services and would like more information.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] group">
      {/* Pulse Animation Effect */}
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20 group-hover:opacity-0 transition-opacity"></span>
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-xl shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Support Online</p>
        <p className="text-sm font-bold text-blue-900">Chat with an Expert</p>
      </div>

      {/* Main Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl shadow-green-200 hover:scale-110 active:scale-95 transition-all duration-300 overflow-hidden"
        aria-label="Contact us on WhatsApp"
      >
        <i className="fab fa-whatsapp text-3xl"></i>
        
        {/* Hover Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </a>
    </div>
  );
};

export default Whatsapp;
