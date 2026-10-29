import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = '573024892307';
  const defaultMessage = encodeURIComponent('Hola! Me gustaría solicitar información sobre sus servicios.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  useEffect(() => {
    // Show the tooltip invitation after a 2.5 second delay
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Interactive Tooltip / Invitation Bubble */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mb-3 bg-white text-gray-800 p-4 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-3 max-w-[280px] pointer-events-auto relative"
          >
            {/* Tiny arrow pointing down to the button */}
            <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100"></div>
            
            <div className="flex-grow">
              <p className="text-xs font-bold text-[#0066CC] uppercase tracking-wider mb-0.5">Soporte TIC</p>
              <p className="text-sm text-gray-600 leading-tight">¡Hola! ¿En qué podemos ayudarte hoy?</p>
            </div>
            
            <button 
              onClick={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Cerrar invitación"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white shadow-lg hover:shadow-[#25D366]/30 transition-shadow duration-300"
        title="Chat on WhatsApp"
      >
        {/* Pulsing indicator ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping opacity-75"></span>
        
        {/* Custom SVG WhatsApp Logo inside the button */}
        <svg 
          viewBox="0 0 24 24" 
          className="w-8 h-8 fill-current relative z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.01 14.069.993 11.973.993 6.538.993 2.11 5.361 2.106 10.791c-.001 1.708.46 3.376 1.336 4.836L2.4 20.25l4.247-1.096zM17.65 14.54c-.3-.15-1.782-.88-2.062-.982-.28-.102-.483-.15-.688.15c-.204.3-.787.983-.965 1.185-.177.2-.355.224-.655.074-1.2-.6-2.156-1.05-3.003-2.508-.225-.39.225-.36.643-1.199.07-.14.035-.26-.017-.365-.052-.105-.483-1.164-.662-1.6-.174-.416-.35-.36-.483-.365-.125-.005-.27-.006-.413-.006-.144 0-.376.054-.572.27-.197.216-.75.732-.75 1.787s.767 2.072.873 2.21c.106.136 1.51 2.306 3.66 3.237 1.786.772 2.15.617 2.536.58.385-.035 1.782-.73 2.032-1.434.25-.706.25-1.31.175-1.435-.074-.125-.276-.2-.577-.35z" />
        </svg>
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
