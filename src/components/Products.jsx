
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ShoppingCart, Star, Check, Plus, Image as ImageIcon, ExternalLink, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useContent } from '@/context/ContentContext';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

const Products = () => {
  const { toast } = useToast();
  const { products } = useContent();
  const { addToCart, cartItems, removeFromCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeScreenshot, setActiveScreenshot] = useState(null);

  const handleToggleCart = (product) => {
    const isInCart = cartItems.some(item => item.id === product.id);
    
    if (isInCart) {
      removeFromCart(product.id);
      toast({
        title: "Producto eliminado",
        description: `${product.name} se ha eliminado del carrito.`,
        variant: "destructive"
      });
    } else {
      addToCart(product);
      toast({
        title: "¡Agregado al carrito! 🛒",
        description: `${product.name} se ha añadido a tu cotización.`,
      });
    }
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    if (product.screenshots && product.screenshots.length > 0) {
      setActiveScreenshot(product.screenshots[0]);
    } else {
      setActiveScreenshot(null);
    }
  };

  return (
    <section id="productos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">Catálogo</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Nuestros Productos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Soluciones tecnológicas listas para implementar. Agrega los productos que te interesan y solicita una cotización formal.
          </p>
          
          {cartItems.length > 0 && (
            <Link to="/contact">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center bg-green-50 text-green-700 px-6 py-3 rounded-full border border-green-200 shadow-sm cursor-pointer hover:bg-green-100 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                <span className="font-bold">{cartItems.length}</span>
                <span className="ml-1">productos seleccionados. Ir a finalizar cotización →</span>
              </motion.div>
            </Link>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => {
             const isInCart = cartItems.some(item => item.id === product.id);
             const hasScreenshotsOrLinks = (product.screenshots && product.screenshots.length > 0) || (product.links && product.links.length > 0);
             
             return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border ${isInCart ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-gray-100'} bg-white flex flex-col`}
              >
                <div className="relative overflow-hidden h-56 shrink-0">
                  <img
                    className={`w-full h-full object-cover hover:scale-110 transition-transform duration-500 ${hasScreenshotsOrLinks ? 'cursor-pointer' : ''}`}
                    title={product.links?.[0]?.url ? `Abrir ${product.links[0].label || 'aplicación'}` : undefined}
                    onClick={hasScreenshotsOrLinks ? () => {
                      // Si el producto tiene enlace, la imagen abre la app web; si no, muestra las capturas
                      const appUrl = product.links?.[0]?.url;
                      if (appUrl) window.open(appUrl, '_blank', 'noopener,noreferrer');
                      else openProductDetails(product);
                    } : undefined}
                    alt={product.name}
                    src={product.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'} 
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Software
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>

                  {/* Feature List */}
                  {product.features && product.features.length > 0 && (
                    <ul className="space-y-2 mb-4 flex-grow">
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <Check className="w-4 h-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="truncate">{feature}</span>
                        </li>
                      ))}
                      {product.features.length > 3 && (
                        <li className="text-xs text-cyan-600 font-semibold pl-6">
                          + {product.features.length - 3} características más
                        </li>
                      )}
                    </ul>
                  )}

                  {/* Ver capturas y enlaces */}
                  {hasScreenshotsOrLinks && (
                    <button
                      onClick={() => openProductDetails(product)}
                      className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold mb-6 flex items-center gap-1.5 hover:underline focus:outline-none w-fit"
                    >
                      <ImageIcon size={16} />
                      Ver capturas y enlaces
                    </button>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                    <div>
                      <div className="text-sm text-gray-500">Precio estimado</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                        ${product.price}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleToggleCart(product)}
                      variant={isInCart ? "outline" : "default"}
                      className={`rounded-full shadow-lg transition-all duration-300 ${
                        isInCart 
                          ? 'border-cyan-600 text-cyan-600 hover:bg-cyan-50' 
                          : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white'
                      }`}
                    >
                      {isInCart ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Agregado
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-12 shadow-lg border border-gray-200">
            <Package className="w-16 h-16 mx-auto mb-6 text-cyan-600" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Desarrollamos soluciones a medida. Contáctanos para una propuesta personalizada.
            </p>
            <Link to="/contact">
              <Button
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Solicitar Cotización Personalizada
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Modal de Detalles del Producto (Capturas y Enlaces) */}
      <Dialog open={Boolean(selectedProduct)} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
          {selectedProduct && (
            <>
              <DialogHeader className="mb-4">
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  {selectedProduct.name}
                </DialogTitle>
                <DialogDescription className="text-gray-600 text-base pt-2">
                  {selectedProduct.description}
                </DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-5 gap-6 mt-4">
                {/* Columna Izquierda: Capturas de Pantalla (3/5 de ancho) */}
                <div className="md:col-span-3 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <ImageIcon size={18} className="text-cyan-600" />
                    Capturas de Pantalla
                  </h4>
                  
                  {selectedProduct.screenshots && selectedProduct.screenshots.length > 0 ? (
                    <div className="space-y-3">
                      {/* Imagen Activa */}
                      <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner flex items-center justify-center">
                        <img 
                          src={activeScreenshot || selectedProduct.screenshots[0]} 
                          alt="Captura activa"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      {/* Miniaturas */}
                      {selectedProduct.screenshots.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                          {selectedProduct.screenshots.map((screen, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveScreenshot(screen)}
                              className={`w-20 aspect-video rounded-md overflow-hidden border-2 shrink-0 transition-all ${
                                (activeScreenshot === screen || (!activeScreenshot && idx === 0))
                                  ? 'border-cyan-600 scale-105 shadow-md'
                                  : 'border-gray-200 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={screen} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-6">
                      <ImageIcon size={48} className="mb-2 stroke-1" />
                      <p className="text-sm">No se han subido capturas de pantalla para este producto.</p>
                    </div>
                  )}
                </div>

                {/* Columna Derecha: Características y Enlaces (2/5 de ancho) */}
                <div className="md:col-span-2 space-y-6">
                  {/* Características */}
                  {selectedProduct.features && selectedProduct.features.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-gray-800">Características</h4>
                      <ul className="space-y-2">
                        {selectedProduct.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Enlaces de Interés */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <ExternalLink size={18} className="text-cyan-600" />
                      Enlaces y Demostraciones
                    </h4>
                    
                    {selectedProduct.links && selectedProduct.links.length > 0 ? (
                      <div className="space-y-2">
                        {selectedProduct.links.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl border border-cyan-100 bg-cyan-50/50 hover:bg-cyan-50 text-cyan-700 font-semibold text-sm transition-colors group"
                          >
                            <span>{link.label}</span>
                            <ExternalLink size={16} className="text-cyan-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No hay enlaces de demostración disponibles.</p>
                    )}
                  </div>

                  {/* Precio y Añadir */}
                  <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400 uppercase font-medium">Precio estimado</div>
                      <div className="text-2xl font-bold text-gray-800">${selectedProduct.price}</div>
                    </div>
                    
                    <Button
                      onClick={() => {
                        handleToggleCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl shadow-lg px-6 py-2"
                    >
                      {cartItems.some(item => item.id === selectedProduct.id) ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Quitar Cotización
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Añadir a Cotización
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Products;
