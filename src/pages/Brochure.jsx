import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Server, ShieldCheck, Database, Headphones, Zap, 
  ThumbsUp, ThumbsDown, CheckCircle2, TrendingUp, MonitorSmartphone,
  Briefcase, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Brochure = () => {
  // Data matching Image 5
  const services = [
    { 
      icon: Globe, 
      title: 'Desarrollo Web', 
      items: ['Diseño y desarrollo de aplicaciones web', 'Hosting y gestión de dominios', 'Copias de seguridad']
    },
    { 
      icon: Headphones, 
      title: 'Soporte y Mantenimiento', 
      items: ['Mantenimiento preventivo/correctivo', 'Soporte remoto y presencial']
    },
    { 
      icon: Server, 
      title: 'Redes y Conectividad', 
      items: ['LAN, WLAN, WAN', 'Configuración de infraestructura']
    },
    { 
      icon: TrendingUp, 
      title: 'Consultoría y Marketing Digital', 
      items: ['Transformación digital', 'Estrategias digitales']
    },
    { 
      icon: ShieldCheck, 
      title: 'Seguridad y Protección', 
      items: ['Implementación de firewalls', 'Ciberseguridad']
    },
    { 
      icon: Database, 
      title: 'Bases de Datos', 
      items: ['Administración y diseño', 'Servicios gestionados']
    }
  ];

  // Data matching Image 7
  const benefits = [
    { title: 'Procesos Automatizados', desc: 'La automatización de tareas repetitivas aumenta la productividad y reduce costos operativos.' },
    { title: 'Visibilidad y Competitividad', desc: 'Un sitio web profesional y estrategias digitales amplían su alcance, llegando a más clientes y fortaleciendo su marca.' },
    { title: 'Seguridad y Continuidad', desc: 'El mantenimiento preventivo y los planes de ciberseguridad protegen sus datos y evitan paradas no planificadas.' },
    { title: 'Infraestructura y Soporte Técnico', desc: 'Redes de datos robustas y soporte constante optimizan recursos, minimizan el tiempo de inactividad y reducen costos operativos.' },
    { title: 'Asesoría TIC Especializada', desc: 'Diseñamos estrategias digitales a medida, impulsando la innovación y asegurando el retorno de la inversión en su transformación tecnológica.' }
  ];

  const projects = [
    {
      title: 'Sitio Web Fabio',
      category: 'Desarrollo Web',
      desc: 'Diseño y desarrollo de sitio web corporativo responsivo, rápido y optimizado para SEO.',
      img: '/img/web_fabio.jpeg'
    },
    {
      title: 'EcoReporter',
      category: 'Aplicaciones Web',
      desc: 'Monitoreo inteligente para proteger el medio ambiente y los ecosistemas costeros.',
      img: '/img/eco_repo.png'
    },
    {
      title: 'Crmpro',
      category: 'Aplicaciones Web',
      desc: 'Administra clientes, procesos y operaciones desde una sola plataforma moderna y segura.',
      img: '/img/crm_pro.png'
    },
    {
      title: 'Portal web',
      category: 'Desarrollo Web',
      desc: 'Rediseño y actualización del portal Web institucional del Concejo Distrital de Buenaventura.',
      img: '/img/concej.png'
    },
    {
      title: 'Configuración de Servidores y Redes',
      category: 'Infraestructura & Conectividad',
      desc: 'Instalación y configuración de switches, routers y firewalls para garantizar seguridad y velocidad de red.',
      img: '/img/configuración.jpeg'
    },
    {
      title: 'Mantenimiento y Soporte Técnico',
      category: 'Soporte TIC',
      desc: 'Soporte técnico integral, preventivo y correctivo de hardware y sistemas críticos para empresas.',
      img: '/img/soporte.jpeg'
    }
  ];

  return (
    <div className="bg-white font-sans text-[#2C3E50]">
      
      {/* 1. PORTADA / COVER (Image 2 style) */}
      <section className="min-h-screen flex flex-col justify-center items-center bg-gray-50 relative overflow-hidden px-4 py-20">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0066CC] to-[#00A8A8]"></div>
        
        <div className="max-w-4xl w-full mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-block px-4 py-2 bg-[#00A8A8]/10 rounded-lg"
          >
            <p className="text-sm md:text-base font-semibold text-[#0066CC]">
              Por: Héctor Vergara Góngora - Ingeniero Electrónico | Especialista en Gestión de TIC
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-2 text-[#2C3E50] leading-none">
              TECNOLOGIA DEL
            </h1>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-12 text-[#2C3E50] leading-none">
              PACIFICO S.A.S
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-8 text-[#00A8A8] opacity-60"
          >
             {/* Decorative Icons representing the bottom of Image 2 */}
             <MonitorSmartphone size={48} />
             <Server size={48} />
             <Zap size={48} />
          </motion.div>
        </div>
      </section>

      {/* 2. PRESENTACIÓN (Image 3 style) */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-[#2C3E50]">
              Presentacion
            </h2>
            <div className="w-24 h-1 bg-[#00A8A8] mx-auto mt-4"></div>
          </div>
          
          <div className="bg-gray-50 p-8 md:p-12 rounded-3xl shadow-sm border-l-4 border-[#0066CC]">
             <p className="text-lg md:text-xl text-gray-600 leading-relaxed text-justify md:text-center">
              Hacemos acompañamiento a las empresas a invertir en tecnología, ya que en muchos casos lo ven como un gasto, y no como una necesidad estratégica para competir y crecer en el mercado actual.
              <br/><br/>
              Con soluciones integrales (redes de datos, desarrollo web, mantenimiento y consultoría TIC), su empresa mejorará la eficiencia operativa, reforzará la seguridad informática y ganará ventaja competitiva.
             </p>
          </div>
        </div>
      </section>

      {/* 3. TECNOLOGIA Y ACTUALIZACIÓN (Image 4 style) */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white border-y border-gray-100">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold uppercase text-[#2C3E50] mb-8 leading-tight">
            Tecnología y <br/><span className="text-[#0066CC]">Actualización</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            La transformación digital permite automatizar tareas y optimizar recursos, liberando tiempo para enfocarse en objetivos estratégicos. Además, una presencia web profesional y redes sociales confiables amplían su visibilidad y mejoran la atención al cliente.
          </p>
        </div>
      </section>

      {/* 4. SERVICIOS (Image 5 style) */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
           <div className="text-center mb-16">
             <div className="inline-block p-4 rounded-full bg-[#00A8A8]/10 mb-4">
                <Zap className="w-12 h-12 text-[#00A8A8]" />
             </div>
             <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-[#2C3E50]">
              Servicios
            </h2>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {services.map((service, idx) => (
               <motion.div 
                 key={idx}
                 whileHover={{ y: -5 }}
                 className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
               >
                 <div className="flex items-center gap-3 mb-4">
                   <service.icon className="text-[#0066CC] w-6 h-6" />
                   <h3 className="text-lg font-bold text-[#0066CC] uppercase">{service.title}</h3>
                 </div>
                 <ul className="space-y-2">
                   {service.items.map((item, i) => (
                     <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#00A8A8] mt-1.5 flex-shrink-0"></span>
                       {item}
                     </li>
                   ))}
                 </ul>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* 5. HERRAMIENTAS DIGITALES (Image 6 style) */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center uppercase tracking-tight text-[#2C3E50] mb-16">
            Herramientas <span className="text-[#00A8A8]">Digitales</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* A FAVOR */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border-t-4 border-green-500">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <ThumbsUp className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-[#2C3E50] uppercase">A Favor</h3>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-600 text-sm md:text-base">El mantenimiento preventivo de sistemas reduce fallos costosos y garantiza operaciones continuas.</p>
                </li>
                <li className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-600 text-sm md:text-base">En resumen, invertir en tecnología impulsa la productividad y fortalece su empresa en un mercado global.</p>
                </li>
              </ul>
            </div>

            {/* EN CONTRA */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border-t-4 border-red-500">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <ThumbsDown className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-bold text-[#2C3E50] uppercase">En Contra</h3>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                   <p className="text-gray-600 text-sm md:text-base">No realizar mantenimiento en las redes y sistemas informáticos maximiza el riesgo de fallos, genera costos elevados en operaciones e interrumpe la continuidad del servicio.</p>
                </li>
                <li className="flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                   <p className="text-gray-600 text-sm md:text-base">La falta de inversión en tecnología limita la eficiencia de los procesos internos, provocando una disminución en la productividad. Dificulta la optimización de recursos, la toma de decisiones y la competitividad.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 PORTAFOLIO / PROYECTOS REALIZADOS */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block p-4 rounded-full bg-[#0066CC]/10 mb-4">
              <Briefcase className="w-12 h-12 text-[#0066CC]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-[#2C3E50]">
              Trabajos Realizados
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-4 text-base md:text-lg">
              Una muestra de nuestra experiencia entregando soluciones tecnológicas confiables, a la medida y con altos estándares de calidad.
            </p>
            <div className="w-24 h-1 bg-[#0066CC] mx-auto mt-6"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group"
              >
                {/* Image Container with zoom effect */}
                <div className="relative aspect-video overflow-hidden bg-gray-200">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#00A8A8] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {project.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[#2C3E50] mb-2 uppercase tracking-tight group-hover:text-[#0066CC] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                    {project.desc}
                  </p>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                    <span className="font-semibold uppercase text-[#00A8A8] tracking-widest">
                      Tecnología del Pacífico
                    </span>
                    <Briefcase className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BENEFICIOS (Image 7 style) */}
      <section className="py-20 px-4 bg-[#2C3E50] text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* List */}
            <div className="lg:w-3/5">
              <h2 className="text-4xl md:text-6xl font-bold uppercase mb-12 tracking-wider">
                Beneficios
              </h2>
              <div className="space-y-8">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="mt-1.5 w-2 h-2 bg-[#00A8A8] rotate-45 group-hover:bg-white transition-colors flex-shrink-0"></div>
                    <div>
                      <h4 className="text-lg font-bold mb-1 text-white">{benefit.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Profile Sidebar (Image 7 right side) */}
            <div className="lg:w-2/5">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10 sticky top-24">
                <div className="text-center mb-6">
                   <div className="w-20 h-20 bg-[#0066CC] rounded-full mx-auto flex items-center justify-center mb-4 text-2xl font-bold">
                     HV
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-1">Héctor Vergara</h3>
                   <p className="text-[#00A8A8] font-medium">Ingeniero Electrónico</p>
                   <p className="text-sm text-gray-400">Especialista en Gestión de TIC</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-[#2C3E50] p-3 rounded-lg border border-gray-700">
                    <div className="text-green-500 font-bold bg-white/10 w-8 h-8 rounded flex items-center justify-center">W</div>
                    <span className="text-sm">+57 3024892307</span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#2C3E50] p-3 rounded-lg border border-gray-700">
                    <div className="text-red-500 font-bold bg-white/10 w-8 h-8 rounded flex items-center justify-center">@</div>
                    <span className="text-sm break-all">cliente@tecnologiadelpacifico.net</span>
                  </div>
                </div>

                <div className="mt-8 text-center">
                   <Link to="/contact">
                     <Button className="w-full bg-[#0066CC] hover:bg-[#005bb5] text-white">
                       Solicitar Asesoría
                     </Button>
                   </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-white text-center border-t border-gray-100">
        <p className="text-gray-500 text-sm mb-4">© Tecnología del Pacífico S.A.S</p>
        <Link to="/contact">
           <Button className="bg-[#0066CC] hover:bg-[#005bb5] text-white px-8 rounded-full">
             Contáctanos Hoy Mismo
           </Button>
        </Link>
      </section>

    </div>
  );
};

export default Brochure;