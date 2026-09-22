import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Share2, Download, Globe, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const BusinessCard = () => {
  const { toast } = useToast();

  const contactData = {
    name: "Héctor Vergara Góngora",
    role: "Ingeniero Electrónico",
    specialty: "Especialista en Gestión de TIC",
    company: "Tecnología del Pacífico S.A.S",
    slogan: "Impulsando el progreso de nuestra región",
    focus: "DISEÑO Y DESARROLLO WEB",
    phone: "+57 3024892307",
    email: "tecnopasas@gmail.com",
    address: "Carrera 61 #3-06 Barrio Dorado",
    city: "Buenaventura - Valle",
    website: "www.tecnologiadelpacifico.com"
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tarjeta Digital - Héctor Vergara',
          text: `Contacta a ${contactData.name} - ${contactData.company}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Enlace copiado",
        description: "El enlace a la tarjeta ha sido copiado al portapapeles.",
      });
    }
  };

  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contactData.name}
N:Vergara Góngora;Héctor;;;
TITLE:${contactData.role} - ${contactData.specialty}
ORG:${contactData.company}
TEL;TYPE=CELL:${contactData.phone}
EMAIL:${contactData.email}
ADR;TYPE=WORK:;;${contactData.address};${contactData.city};;;
URL:${window.location.origin}
NOTE:${contactData.focus}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Hector_Vergara.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Contacto descargado",
      description: "Guardando en tu agenda...",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20 md:pt-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
      >
        {/* Visual Header matching Image 1 style */}
        <div className="bg-white p-8 pb-0 text-center relative overflow-hidden">
          {/* Decorative Circle from logo style */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00A8A8]/10 rounded-full blur-2xl"></div>
          <div className="absolute top-20 -left-10 w-32 h-32 bg-[#0066CC]/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 mb-4">
               <img 
                src="https://horizons-cdn.hostinger.com/e6f206d8-f0b5-4fa0-9061-f36fb8d512ac/ed69614e121fb5016b4c3ce083ccc11f.png" 
                alt="Logo Tecnología del Pacífico"
                className="w-full h-full object-contain"
              />
            </div>
            
            <h1 className="text-xl font-bold text-[#2C3E50] tracking-wide uppercase">
              Tecnología del Pacífico
            </h1>
            <p className="text-sm text-gray-500 italic mb-6">
              "{contactData.slogan}"
            </p>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>

            <h2 className="text-xl font-bold text-[#0066CC] mb-1">
              {contactData.name}
            </h2>
            <p className="text-sm font-medium text-[#00A8A8]">
              {contactData.role}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              {contactData.specialty}
            </p>

            <div className="bg-[#0066CC]/5 px-4 py-2 rounded-lg mb-6">
              <span className="text-sm font-bold text-[#0066CC] tracking-widest uppercase">
                {contactData.focus}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info List */}
        <div className="px-6 py-2 space-y-2">
          <a href={`https://wa.me/${contactData.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100">
            <div className="w-10 h-10 rounded-full bg-[#00A8A8]/10 flex items-center justify-center text-[#00A8A8] group-hover:bg-[#00A8A8] group-hover:text-white transition-colors">
              <MessageCircle size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">WhatsApp</p>
              <p className="text-[#2C3E50] font-medium">{contactData.phone}</p>
            </div>
          </a>

          <a href={`mailto:${contactData.email}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100">
            <div className="w-10 h-10 rounded-full bg-[#0066CC]/10 flex items-center justify-center text-[#0066CC] group-hover:bg-[#0066CC] group-hover:text-white transition-colors">
              <Mail size={20} />
            </div>
            <div>
               <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email</p>
               <p className="text-[#2C3E50] font-medium">{contactData.email}</p>
            </div>
          </a>

          <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-[#2C3E50] group-hover:text-white transition-colors">
              <MapPin size={20} />
            </div>
            <div>
               <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Dirección</p>
               <p className="text-[#2C3E50] font-medium text-sm leading-tight">
                 {contactData.address}<br/>{contactData.city}
               </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 mt-2 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={handleSaveContact}
              className="bg-[#0066CC] hover:bg-[#005bb5] text-white shadow-md hover:shadow-lg transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button 
              onClick={handleShare}
              variant="outline"
              className="border-[#00A8A8] text-[#00A8A8] hover:bg-[#00A8A8] hover:text-white bg-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
          <div className="mt-6 text-center">
            <a href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#0066CC] text-sm transition-colors">
              <Globe size={14} />
              {contactData.website}
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BusinessCard;