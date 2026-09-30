
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Agrega o edita los testimonios aquí ─────────────────────────────────────
const testimonials = [
  {
    id: 1,
    text: 'Tecnología del Pacífico transformó completamente nuestro portal institucional. La eficiencia operativa aumentó un 90% en los primeros meses',
    name: 'Concejo Distrital',
    role: 'de Buenaventura',
    avatar: 'concejo.ico',
    logo: true,
  },
  {
    id: 2,
    text: 'Gracias a su equipo logramos reducir los fallos en la red de la red de empresa en tiempo récord, con un rendimento en producción de un 90%.',
    name: 'Laura Martínez',
    role: 'Directora de TI, FinGroup S.A.',
    avatar: 'LOGO-EN-PNG-DE-CAPITAL-8.png',
    logo: true,
  },
  {
    id: 3,
    text: 'Gracias a su solución cloud, redujimos costos operativos en un 35% y ganamos la agilidad que necesitábamos para escalar nuestro negocio.',
    name: 'Andrés Gómez',
    role: 'Gerente General, LogiMax',
    avatar: 'insol.ico',
    logo: true,
  },
  // ─── Testimonios con foto de cliente (desactivados por ahora) ───
  // {
  //   id: 4,
  //   text: 'La auditoría de ciberseguridad que realizaron nos salvó de una vulnerabilidad crítica. Profesionales de primer nivel, sin duda.',
  //   name: 'Sofía Herrera',
  //   role: 'CTO, BancaSoft',
  //   avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=96&h=96&fit=crop&crop=face',
  // },
  // {
  //   id: 5,
  //   text: 'Implementaron nuestro ERP en menos tiempo del esperado. La migración fue transparente y sin interrupciones para nuestro negocio.',
  //   name: 'Miguel Torres',
  //   role: 'COO, RetailPro',
  //   avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face',
  // },
  // {
  //   id: 6,
  //   text: 'Su soporte post-lanzamiento es excepcional. Siempre disponibles y con soluciones rápidas. Mejor decisión haber contratado a este equipo.',
  //   name: 'Valentina Cruz',
  //   role: 'Fundadora, EduTech Colombia',
  //   avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face',
  // },
];

// Cuántas tarjetas mostrar según el ancho de pantalla
function useVisibleCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) setCount(1);
      else if (window.innerWidth < 1024) setCount(2);
      else setCount(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return count;
}

const AUTOPLAY_MS = 4500;

const Testimonials = () => {
  const visibleCount = useVisibleCount();
  const [current, setCurrent]   = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const timerRef = useRef(null);

  const maxIndex = testimonials.length - visibleCount;

  const go = useCallback((dir) => {
    setDirection(dir);
    setCurrent(prev => {
      const next = prev + dir;
      if (next < 0) return maxIndex;
      if (next > maxIndex) return 0;
      return next;
    });
  }, [maxIndex]);

  // Auto-play
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => go(1), AUTOPLAY_MS);
  }, [go]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  // Reset current if visibleCount changes
  useEffect(() => {
    setCurrent(c => Math.min(c, Math.max(0, testimonials.length - visibleCount)));
  }, [visibleCount]);

  const handleNav = (dir) => { go(dir); resetTimer(); };
  const handleDot = (i) => { setDirection(i > current ? 1 : -1); setCurrent(i); resetTimer(); };

  const visible = testimonials.slice(current, current + visibleCount);

  const variants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">
            Testimonios
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            La confianza de nuestros clientes es nuestro mayor logro.
          </p>
        </div>

        {/* Slider */}
        <div className="relative">

          {/* Cards */}
          <div className="overflow-hidden">
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className={`grid gap-8 ${
                  visibleCount === 1 ? 'grid-cols-1' :
                  visibleCount === 2 ? 'grid-cols-2' :
                  'grid-cols-3'
                }`}
              >
                {visible.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
                  >
                    <Quote className="text-cyan-200 w-10 h-10 mb-4 shrink-0" />
                    <p className="text-gray-600 italic mb-6 flex-1 leading-relaxed">
                      "{t.text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className={t.logo
                        ? 'w-44 h-24 shrink-0 flex items-center justify-center'
                        : 'w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0'}>
                        <img
                          className={t.logo ? 'max-w-full max-h-full object-contain' : 'w-full h-full object-cover'}
                          alt={t.name}
                          src={t.avatar}
                          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=0891b2&color=fff`; }}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{t.name}</h4>
                        <p className="text-sm text-gray-500">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev / Next buttons */}
          <button
            onClick={() => handleNav(-1)}
            aria-label="Anterior testimonio"
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-cyan-600 hover:border-cyan-300 hover:shadow-lg transition-all z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => handleNav(1)}
            aria-label="Siguiente testimonio"
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-cyan-600 hover:border-cyan-300 hover:shadow-lg transition-all z-10"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dot navigation */}
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              aria-label={`Ir al testimonio ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-8 h-2.5 bg-cyan-500'
                  : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Counter */}
        <p className="text-center text-xs text-gray-400 mt-4">
          {current + 1} – {Math.min(current + visibleCount, testimonials.length)} de {testimonials.length} clientes
        </p>
      </div>
    </section>
  );
};

export default Testimonials;
