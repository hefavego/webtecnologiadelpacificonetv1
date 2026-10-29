import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '@/components/Hero';
import Testimonials from '@/components/Testimonials';
import { ArrowRight, Code, Cloud, Shield, Users, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/context/ContentContext';

const Home = () => {
  const { siteContent } = useContent();

  const featuredServices = [
    {
      icon: Code,
      title: 'Desarrollo a Medida',
      desc: 'Software diseñado específicamente para tus procesos únicos.',
      color: 'text-blue-500'
    },
    {
      icon: Cloud,
      title: 'Cloud Computing',
      desc: 'Migración y gestión de infraestructura escalable y segura.',
      color: 'text-cyan-500'
    },
    {
      icon: Shield,
      title: 'Ciberseguridad',
      desc: 'Auditoría y protección avanzada para tus activos digitales.',
      color: 'text-indigo-500'
    }
  ];

  const benefits = [
    { icon: Users, title: 'Equipo Experto', desc: 'Profesionales certificados con años de experiencia en la industria.' },
    { icon: Award, title: 'Calidad Certificada', desc: 'Estándares internacionales en cada línea de código.' },
    { icon: TrendingUp, title: 'ROI Maximizado', desc: 'Soluciones enfocadas en rentabilidad y eficiencia operativa.' }
  ];

  return (
    <>
      <Hero />
      
      {/* Who We Are Section */}
      <section className="py-20 bg-white overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold text-cyan-600 uppercase tracking-wider mb-2">
                {siteContent['home_whoweare_badge'] || 'Quiénes Somos'}
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {siteContent['home_whoweare_title'] || 'Transformando visiones en realidad digital desde 2015'}
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {siteContent['home_whoweare_desc1'] || 'En Tecnología del Pacífico S.A.S, no solo escribimos código; construimos el futuro de las empresas. Nos especializamos en identificar los cuellos de botella tecnológicos y convertirlos en ventajas competitivas.'}
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {siteContent['home_whoweare_desc2'] || 'Nuestro enfoque se basa en la transparencia, la agilidad y la innovación constante, asegurando que cada solución entregada supere las expectativas.'}
              </p>
              <Link to="/about">
                <Button variant="outline" className="border-cyan-600 text-cyan-600 hover:bg-cyan-50">
                  Conoce más sobre nosotros
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                 <img 
                   className="w-full h-full object-cover" 
                   alt="Modern office team working" 
                   src={siteContent['home_whoweare_image'] || 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d'} 
                 />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-cyan-50 rounded-full -z-10"></div>
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-blue-50 rounded-full -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Servicios Destacados</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Innovación aplicada a tus necesidades empresariales.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredServices.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center mb-6 ${service.color}`}>
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.desc}</p>
                <Link to="/services" className="text-cyan-600 font-semibold flex items-center hover:gap-2 transition-all">
                  Ver detalles <ArrowRight size={16} className="ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/services">
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full px-8">Ver Todos los Servicios</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 md:p-20 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Por qué elegirnos?</h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Nos diferenciamos por nuestro compromiso inquebrantable con la excelencia y el éxito del cliente.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-12">
                {benefits.map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                      <item.icon className="text-cyan-400 w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <Testimonials />
    </>
  );
};

export default Home;