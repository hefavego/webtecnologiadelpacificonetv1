import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, TrendingUp, Heart } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

const About = () => {
  const { siteContent } = useContent();

  const values = [
    {
      icon: Target,
      title: 'Misión',
      description: 'Proporcionar soluciones tecnológicas innovadoras que impulsen el éxito de nuestros clientes.'
    },
    {
      icon: TrendingUp,
      title: 'Visión',
      description: 'Ser líderes en tecnología en el sur occidente colombiano, nacional e internacional reconocidos por nuestra excelencia e innovación.'
    },
    {
      icon: Heart,
      title: 'Valores',
      description: 'Integridad, calidad, compromiso y orientación al cliente en cada proyecto.'
    },
    {
      icon: Users,
      title: 'Equipo',
      description: 'Profesionales altamente capacitados dedicados a tu éxito empresarial.'
    }
  ];

  return (
    <section id="nosotros" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">
            {siteContent['about_page_badge'] || 'Nosotros'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            {siteContent['about_page_title'] || 'Quiénes Somos'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {siteContent['about_page_description'] || 'Tecnología del Pacífico S.A.S es una empresa líder en soluciones tecnológicas, comprometida con la innovación y el éxito de nuestros clientes.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <value.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                className="w-full h-auto rounded-2xl shadow-2xl" 
                src={siteContent['about_page_image'] || '/company.jpeg'} 
                alt="Technology company team working together" 
              />
            </motion.div>
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl -z-10"></div>
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-800">
              {siteContent['about_page_exp_title'] || 'Más de 16 años de experiencia'}
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              {siteContent['about_page_exp_desc1'] || 'Hemos ayudado a cientos de empresas a alcanzar sus objetivos mediante soluciones tecnológicas personalizadas y de alta calidad.'}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              {siteContent['about_page_exp_desc2'] || 'Nuestro equipo de expertos trabaja incansablemente para garantizar que cada proyecto supere las expectativas y genere resultados medibles.'}
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">500+</div>
                <div className="text-sm text-gray-600 mt-1">Proyectos</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">98%</div>
                <div className="text-sm text-gray-600 mt-1">Satisfacción</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">24/7</div>
                <div className="text-sm text-gray-600 mt-1">Soporte</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;