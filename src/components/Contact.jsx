
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Trash2, ShoppingCart, MessageCircle, DollarSign, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/context/CartContext';
import { API, apiFetch } from '@/lib/api';
import { servicesData } from '@/data/services';

const Contact = () => {
  const { toast } = useToast();
  const { cartItems, removeFromCart, clearCart, total } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    service: '',
    budget: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Construir mensaje con ítems del carrito
    let finalMessage = formData.message;
    let budgetValue  = formData.budget || 'Por definir';

    if (cartItems.length > 0) {
      finalMessage += '\n\n--- PEDIDO ADJUNTO ---\n';
      cartItems.forEach(item => {
        finalMessage += `- ${item.name}: $${item.price}\n`;
      });
      finalMessage += `\nTotal Estimado: $${total}`;
      budgetValue = `$${total}`;
    }

    try {
      await apiFetch(API.quotations, {
        method: 'POST',
        body: {
          name:        formData.name,
          email:       formData.email,
          phone:       formData.phone,
          whatsapp:    formData.whatsapp,
          service:     cartItems.length > 0 ? cartItems.map(i => i.name).join(', ') : (formData.service || 'Consulta General'),
          description: finalMessage,
          budget:      budgetValue,
        },
      });

      toast({
        title: '¡Solicitud enviada!',
        description: 'Hemos recibido tu cotización. Te contactaremos pronto.',
      });

      setFormData({ name: '', email: '', phone: '', whatsapp: '', service: '', budget: '', message: '' });
      clearCart();
    } catch (error) {
      toast({
        title: 'Error al enviar',
        description: error.message || 'Hubo un problema. Intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section id="contacto" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">Contacto</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-gray-900">
            Hablemos de tu Proyecto
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ¿Tienes una idea en mente? Estamos aquí para ayudarte a hacerla realidad.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Información</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-cyan-50 p-3 rounded-lg mr-4 text-cyan-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ubicación</h4>
                    <p className="text-gray-600">Barrio el Dorado/Buenaventura con sede en Cali/Colombia</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-cyan-50 p-3 rounded-lg mr-4 text-cyan-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">cliente@tecnologiadelpacifico.net</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-cyan-50 p-3 rounded-lg mr-4 text-cyan-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Teléfono</h4>
                    <p className="text-gray-600">+57 (302) 4892307</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Form & Cart Area */}
          <div className="lg:col-span-2 grid gap-8">
            
            {/* Cart Summary Section */}
            {cartItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-cyan-100"
              >
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                  <ShoppingCart className="text-cyan-600" />
                  <h3 className="text-xl font-bold text-gray-900">Resumen de Cotización</h3>
                </div>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-4">
                        <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                          <span className="text-cyan-600 font-semibold text-sm">${item.price}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => removeFromCart(item.id)} 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-gray-500">Total Estimado</span>
                  <span className="text-2xl font-bold text-gray-900">${total}</span>
                </div>
              </motion.div>
            )}

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                      placeholder="juan@empresa.com"
                    />
                  </div>
                </div>

                {/* Fila 2: Teléfono + WhatsApp */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" /> Teléfono
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-whatsapp" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                      WhatsApp
                      <span className="text-xs text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">
                        <MessageCircle className="w-4 h-4" />
                      </span>
                      <input
                        id="contact-whatsapp"
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all"
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Fila 3: Servicio a Consultar + Presupuesto Estimado */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-service" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400" /> Servicio a Consultar
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all bg-white text-gray-700"
                    >
                      <option value="">Selecciona un servicio</option>
                      {servicesData.map((s) => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                      <option value="Consulta General">Consulta General / Otro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-budget" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-gray-400" /> Presupuesto Estimado
                    </label>
                    <input
                      id="contact-budget"
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                      placeholder="Ej: $1,000,000 COP o Por definir"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Cuéntanos más sobre tu proyecto..."
                  ></textarea>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white h-12 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                  {!isSubmitting && <Send className="w-5 h-5 ml-2" />}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
