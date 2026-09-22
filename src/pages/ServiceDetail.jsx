import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { servicesData } from '@/data/services';

const ServiceDetail = () => {
  const { id } = useParams();
  const service = servicesData.find(s => s.id === id);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const Icon = service.icon;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`relative py-20 md:py-32 bg-gradient-to-br ${service.color} text-white overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <Link 
            to="/services" 
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a Servicios
          </Link>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/20"
            >
              <Icon className="w-20 h-20 text-white" />
            </motion.div>
            
            <div>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold mb-4"
              >
                {service.title}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-white/90 max-w-2xl"
              >
                {service.shortDescription}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Main Description */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Descripción del Servicio</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {service.fullDescription}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-yellow-500" />
                  Características Principales
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start"
                    >
                      <div className={`mt-1 w-2 h-2 rounded-full bg-gradient-to-r ${service.color} mr-3 shrink-0`} />
                      <span className="font-medium text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Benefits Sidebar */}
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Beneficios</h3>
                <ul className="space-y-4">
                  {service.benefits.map((benefit, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (index * 0.1) }}
                      className="flex items-start"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                      <span className="text-gray-600">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white text-center">
                <h3 className="text-xl font-bold mb-4">¿Te interesa este servicio?</h3>
                <p className="text-white/70 mb-6">
                  Contáctanos hoy mismo para obtener una cotización personalizada.
                </p>
                <Link to="/contact">
                  <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold">
                    Solicitar Cotización
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;