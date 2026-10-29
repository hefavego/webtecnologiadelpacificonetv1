import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Download, Loader2, Globe, Phone, Mail, MapPin } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const DownloadPage = () => {
  const { toast } = useToast();
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [isGeneratingBrochure, setIsGeneratingBrochure] = useState(false);
  const cardRef = useRef(null);
  const brochureRef = useRef(null);

  const contactData = {
    name: "Héctor Vergara Góngora",
    role: "Ingeniero Electrónico",
    specialty: "Especialista en Gestión de TIC",
    company: "Tecnología del Pacífico S.A.S",
    phone: "+57 3024892307",
    email: "tecnopasas@gmail.com",
    address: "Carrera 61 #3-06 Barrio Dorado",
    city: "Buenaventura - Valle",
    website: "www.tecnologiadelpacifico.com"
  };

  const handleDownloadCard = async () => {
    setIsGeneratingCard(true);
    const element = cardRef.current;
    
    // Configura las opciones para una tarjeta de 9cm x 5cm
    const opt = {
      margin:       0,
      filename:     'Tarjeta_Hector_Vergara.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 4, useCORS: true }, // High scale for print quality
      jsPDF:        { unit: 'cm', format: [9, 5], orientation: 'landscape' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      toast({
        title: "Éxito",
        description: "Tarjeta descargada correctamente.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al generar el PDF.",
      });
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handleDownloadBrochure = async () => {
    setIsGeneratingBrochure(true);
    const element = brochureRef.current;
    
    // Configura para carta apaisada (Tríptico)
    const opt = {
      margin:       0.5,
      filename:     'Brochure_Tecnologia_Pacifico.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      toast({
        title: "Éxito",
        description: "Brochure descargado correctamente.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al generar el brochure.",
      });
    } finally {
      setIsGeneratingBrochure(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">Centro de Descargas</h1>
        <p className="text-gray-500 mb-8">Genera tus archivos PDF listos para impresión</p>

        <div className="space-y-4">
          <Button 
            onClick={handleDownloadCard} 
            disabled={isGeneratingCard}
            className="w-full h-16 text-lg bg-[#0066CC] hover:bg-[#005bb5]"
          >
            {isGeneratingCard ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
            Descargar Tarjeta (9x5 cm)
          </Button>

          <Button 
            onClick={handleDownloadBrochure} 
            disabled={isGeneratingBrochure}
            className="w-full h-16 text-lg bg-[#00A8A8] hover:bg-[#008f8f]"
          >
            {isGeneratingBrochure ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
            Descargar Brochure Tríptico
          </Button>
        </div>

        <p className="text-xs text-red-400 mt-6 italic">
          Nota: Después de descargar tus archivos, puedes solicitar eliminar esta página.
        </p>
      </div>

      {/* 
        HIDDEN TEMPLATES FOR PDF GENERATION 
        We use fixed widths in pixels that approximate print DPI for better rendering
      */}
      <div className="absolute top-0 left-0 overflow-hidden h-0 w-0">
        
        {/* ================= BUSINESS CARD TEMPLATE ================= */}
        {/* Aspect Ratio 9:5. 
            For screen rendering before canvas capture: 
            Width: 1063px (approx 9cm at 300dpi)
            Height: 591px (approx 5cm at 300dpi)
        */}
        <div ref={cardRef} style={{ width: '900px', height: '500px' }} className="bg-white flex relative overflow-hidden">
          {/* Left Side (Color Block) */}
          <div className="w-[30%] bg-[#2C3E50] h-full relative flex flex-col items-center justify-center p-8">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://horizons-cdn.hostinger.com/e6f206d8-f0b5-4fa0-9061-f36fb8d512ac/ed69614e121fb5016b4c3ce083ccc11f.png')] bg-cover opacity-5 mix-blend-overlay"></div>
             <img 
               src="https://horizons-cdn.hostinger.com/e6f206d8-f0b5-4fa0-9061-f36fb8d512ac/ed69614e121fb5016b4c3ce083ccc11f.png" 
               alt="Logo" 
               className="w-32 h-32 object-contain mb-4 z-10 bg-white rounded-full p-2"
             />
             <div className="text-center z-10">
                <h3 className="text-white font-bold text-lg leading-tight">TECNOLOGÍA</h3>
                <h3 className="text-[#00A8A8] font-bold text-lg leading-tight">DEL PACÍFICO</h3>
             </div>
          </div>

          {/* Right Side (Content) */}
          <div className="w-[70%] p-10 flex flex-col justify-center bg-white relative">
             {/* Decorative top right */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066CC]/5 rounded-bl-[100px]"></div>

             <h1 className="text-3xl font-bold text-[#2C3E50] uppercase mb-1">{contactData.name}</h1>
             <p className="text-xl text-[#0066CC] font-semibold mb-1">{contactData.role}</p>
             <p className="text-sm text-gray-500 uppercase tracking-widest mb-6">{contactData.specialty}</p>

             <div className="space-y-3">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-[#00A8A8] flex items-center justify-center text-white shrink-0">
                   <Phone size={16} />
                 </div>
                 <span className="text-lg text-gray-700 font-medium">{contactData.phone}</span>
               </div>
               
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center text-white shrink-0">
                   <Mail size={16} />
                 </div>
                 <span className="text-lg text-gray-700 font-medium">{contactData.email}</span>
               </div>

               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-[#2C3E50] flex items-center justify-center text-white shrink-0">
                   <MapPin size={16} />
                 </div>
                 <span className="text-sm text-gray-700 leading-tight font-medium w-[90%]">
                   {contactData.address}, {contactData.city}
                 </span>
               </div>
             </div>

             <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[#0066CC] font-semibold text-sm">{contactData.website}</span>
             </div>
          </div>
        </div>

        {/* ================= BROCHURE TEMPLATE ================= */}
        {/* Standard Letter Landscape: 11in x 8.5in. 
            Approx pixel width for template @ 96dpi approx 1056px, but for high res PDF capture we want larger.
            We'll use a 3-column flex layout.
        */}
        <div ref={brochureRef} style={{ width: '1300px', minHeight: '800px' }} className="bg-white flex">
          
          {/* COLUMN 1: INTRO & SERVICES (Left Fold) */}
          <div className="w-1/3 p-8 border-r border-dashed border-gray-300 bg-gray-50 flex flex-col h-full">
            <div className="mb-8">
               <h2 className="text-2xl font-bold text-[#2C3E50] uppercase mb-4 border-b-4 border-[#0066CC] inline-block pb-1">
                 Presentación
               </h2>
               <p className="text-sm text-gray-600 text-justify leading-relaxed">
                 Hacemos acompañamiento a las empresas a invertir en tecnología, ya que en muchos casos lo ven como un gasto y no como una necesidad estratégica.
                 Con soluciones integrales (redes de datos, desarrollo web, mantenimiento y consultoría TIC), su empresa mejorará la eficiencia operativa y ganará ventaja competitiva.
               </p>
            </div>

            <div className="flex-grow">
               <h2 className="text-2xl font-bold text-[#2C3E50] uppercase mb-4 border-b-4 border-[#00A8A8] inline-block pb-1">
                 Nuestros Servicios
               </h2>
               <ul className="space-y-4">
                 {[
                   "Desarrollo Web & Hosting",
                   "Soporte y Mantenimiento TIC",
                   "Redes y Conectividad (LAN/WAN)",
                   "Seguridad y Protección de Datos",
                   "Consultoría y Marketing Digital",
                   "Gestión de Bases de Datos"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-[#0066CC] rounded-full"></div>
                     <span className="text-sm font-semibold text-gray-700">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>
            
            <div className="mt-auto bg-[#e6f7f7] p-4 rounded-lg">
               <p className="text-xs text-[#0066CC] font-bold text-center">
                 "Impulsando el progreso de nuestra región"
               </p>
            </div>
          </div>

          {/* COLUMN 2: BENEFITS & TOOLS (Middle Fold / Back Cover when folded) */}
          <div className="w-1/3 p-8 border-r border-dashed border-gray-300 bg-white flex flex-col h-full">
             <div className="mb-8">
               <h2 className="text-2xl font-bold text-[#2C3E50] uppercase mb-4 border-b-4 border-[#0066CC] inline-block pb-1">
                 Herramientas Digitales
               </h2>
               <div className="space-y-4">
                 <div className="p-3 bg-green-50 border-l-4 border-green-500">
                   <h4 className="font-bold text-green-700 text-sm mb-1">A FAVOR</h4>
                   <p className="text-xs text-gray-600">El mantenimiento preventivo y la inversión tecnológica reducen fallos, garantizan continuidad y aumentan la productividad global.</p>
                 </div>
                 <div className="p-3 bg-red-50 border-l-4 border-red-500">
                   <h4 className="font-bold text-red-700 text-sm mb-1">EN CONTRA</h4>
                   <p className="text-xs text-gray-600">No invertir genera altos costos operativos por fallos imprevistos, pérdida de datos y falta de competitividad en el mercado.</p>
                 </div>
               </div>
             </div>

             <div>
               <h2 className="text-2xl font-bold text-[#2C3E50] uppercase mb-4 border-b-4 border-[#00A8A8] inline-block pb-1">
                 Beneficios Clave
               </h2>
               <ul className="space-y-3">
                 {[
                   "Procesos Automatizados",
                   "Visibilidad Global",
                   "Seguridad de Información",
                   "Infraestructura Robusta",
                   "Asesoría Especializada"
                 ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                      <div className="text-[#00A8A8] font-bold">✓</div>
                      <span className="text-xs font-bold text-gray-700 uppercase">{item}</span>
                    </li>
                 ))}
               </ul>
             </div>
          </div>

          {/* COLUMN 3: COVER & CONTACT (Right Fold / Front Cover) */}
          <div className="w-1/3 relative bg-[#2C3E50] text-white flex flex-col items-center justify-between p-8 overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066CC] rounded-bl-full opacity-20 -mr-10 -mt-10"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00A8A8] rounded-tr-full opacity-20 -ml-10 -mb-10"></div>

             <div className="z-10 text-center mt-12">
               <div className="bg-white w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                 <img 
                   src="https://horizons-cdn.hostinger.com/e6f206d8-f0b5-4fa0-9061-f36fb8d512ac/ed69614e121fb5016b4c3ce083ccc11f.png" 
                   alt="Logo" 
                   className="w-24 h-24 object-contain"
                 />
               </div>
               <h1 className="text-3xl font-black leading-none mb-2">TECNOLOGÍA</h1>
               <h1 className="text-3xl font-black leading-none text-[#00A8A8] mb-6">DEL PACÍFICO</h1>
               <p className="text-sm font-light tracking-widest uppercase border-t border-white/20 pt-4">Soluciones Integrales TIC</p>
             </div>

             <div className="z-10 w-full bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 mb-8">
               <h3 className="font-bold text-lg mb-4 text-center text-[#00A8A8]">Contacto</h3>
               
               <div className="space-y-3 text-sm">
                 <div className="flex items-center gap-3">
                   <Phone size={14} className="text-[#00A8A8]"/>
                   <span>{contactData.phone}</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <Mail size={14} className="text-[#00A8A8]"/>
                   <span className="text-xs">{contactData.email}</span>
                 </div>
                 <div className="flex items-start gap-3">
                   <MapPin size={14} className="text-[#00A8A8] mt-1"/>
                   <span className="text-xs leading-tight">{contactData.address}<br/>{contactData.city}</span>
                 </div>
                 <div className="flex items-center gap-3 pt-2 border-t border-white/10 mt-2">
                   <Globe size={14} className="text-[#00A8A8]"/>
                   <span className="text-xs">tecnologiadelpacifico.com</span>
                 </div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DownloadPage;