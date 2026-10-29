import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'Nosotros', href: '/about' },
      { name: 'Servicios', href: '/services' },
      { name: 'Productos', href: '/products' },
      { name: 'Contacto', href: '/contact' }
    ],
    services: [
      { name: 'Desarrollo de Software', href: '/services' },
      { name: 'Soluciones Cloud', href: '/services' },
      { name: 'Ciberseguridad', href: '/services' },
      { name: 'Apps Móviles', href: '/services' }
    ],
    legal: [
      { name: 'Política de Privacidad', to: '/privacy' },
      { name: 'Términos y Condiciones', to: '/terms' },
      { name: 'Política de Cookies', to: '/cookies' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://horizons-cdn.hostinger.com/e6f206d8-f0b5-4fa0-9061-f36fb8d512ac/ed69614e121fb5016b4c3ce083ccc11f.png" 
                alt="Tecnología del Pacífico logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Tecnología del Pacífico
            </p>
            <p className="text-gray-400 leading-relaxed">
              Transformando ideas en soluciones tecnológicas innovadoras que impulsan el éxito empresarial.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="bg-gray-800 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 p-3 rounded-lg transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <p className="text-lg font-bold mb-4 text-white">Empresa</p>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <p className="text-lg font-bold mb-4 text-white">Servicios</p>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <p className="text-lg font-bold mb-4 text-white">Contacto</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <Phone className="w-5 h-5 flex-shrink-0 mt-1 text-cyan-400" />
                <span>+57 3024892307 </span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Mail className="w-5 h-5 flex-shrink-0 mt-1 text-cyan-400" />
                <span>cliente@tecnologiadelpacifico.net</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1 text-cyan-400" />
                <span>Buenaventura/Cali, Valle del Cauca, Colombia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Tecnología del Pacífico S.A.S. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap gap-6">
              {footerLinks.legal.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;