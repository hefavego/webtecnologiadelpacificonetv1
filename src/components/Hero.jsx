import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/context/ContentContext';

const Hero = () => {
  const { siteContent } = useContent();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover" 
          alt="Digital transformation background"
          src={siteContent['hero_image'] || '/edificios-de-la-ciudad.jpg'}
        />
        <div className="absolute inset-0 bg-gray-900/75 backdrop-blur-[2px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md border border-white/20 text-cyan-300 text-sm font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            {siteContent['hero_badge'] || 'Líderes en Innovación Digital'}
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            {siteContent['hero_title'] || 'Impulsamos el Futuro de'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {siteContent['hero_title_highlight'] || 'Tu Empresa'}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {siteContent['hero_description'] || 'Soluciones tecnológicas integrales que transforman desafíos en oportunidades de crecimiento.'}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/contact">
              <Button 
                size="lg"
                className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white border-0 text-lg px-8 py-6 h-auto rounded-full shadow-[0_0_20px_rgba(8,145,178,0.5)] transition-all hover:scale-105"
              >
                Solicitar Cotización
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <Link to="/services">
              <Button 
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 bg-transparent text-lg px-8 py-6 h-auto rounded-full backdrop-blur-sm transition-all hover:scale-105"
              >
                Nuestros Servicios
              </Button>
            </Link>
          </motion.div>

          <div className="pt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-cyan-400 w-5 h-5" />
              <span>Soporte 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-cyan-400 w-5 h-5" />
              <span>Tecnología de Punta</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-cyan-400 w-5 h-5" />
              <span>Resultados Garantizados</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;