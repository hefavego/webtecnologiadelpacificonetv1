import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch, API, isAuthenticated } from '@/lib/api';
import { productsData } from '@/data/products';

const ContentContext = createContext(null);

// Datos por defecto para toda la página como plan de contingencia
const DEFAULT_SITE_CONTENT = {
  // Hero section
  'hero_badge': 'Líderes en Innovación Digital',
  'hero_title': 'Impulsamos el Futuro de',
  'hero_title_highlight': 'Tu Empresa',
  'hero_description': 'Soluciones tecnológicas integrales que transforman desafíos en oportunidades de crecimiento.',
  'hero_image': '/edificios-de-la-ciudad.jpg',
  
  // Who We Are section (Home)
  'home_whoweare_badge': 'Quiénes Somos',
  'home_whoweare_title': 'Transformando visiones en realidad digital desde 2015',
  'home_whoweare_desc1': 'En Tecnología del Pacífico S.A.S, no solo escribimos código; construimos el futuro de las empresas. Nos especializamos en identificar los cuellos de botella tecnológicos y convertirlos en ventajas competitivas.',
  'home_whoweare_desc2': 'Nuestro enfoque se basa en la transparencia, la agilidad y la innovación constante, asegurando que cada solución entregada supere las expectativas.',
  'home_whoweare_image': 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d',
  
  // About page text
  'about_page_badge': 'Nosotros',
  'about_page_title': 'Quiénes Somos',
  'about_page_description': 'Tecnología del Pacífico S.A.S es una empresa líder en soluciones tecnológicas, comprometida con la innovación y el éxito de nuestros clientes.',
  'about_page_exp_title': 'Más de 16 años de experiencia',
  'about_page_exp_desc1': 'Hemos ayudado a cientos de empresas a alcanzar sus objetivos mediante soluciones tecnológicas personalizadas y de alta calidad.',
  'about_page_exp_desc2': 'Nuestro equipo de expertos trabaja incansablemente para garantizar que cada proyecto supere las expectativas y genere resultados medibles.',
  'about_page_image': '/company.jpeg',
  
  // Contact details
  'contact_email': 'contacto@tecnologiadelpacifico.com',
  'contact_phone': '+57 (2) 123-4567',
  'contact_whatsapp': '+57 311 234 5678',
  'contact_address': 'Av. Principal #12-34, Cali, Colombia'
};

export const ContentProvider = ({ children }) => {
  const [products, setProducts] = useState(productsData);
  const [siteContent, setSiteContent] = useState(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);

  // Cargar contenido desde la API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Intentar cargar contenido estático
      try {
        const contentData = await apiFetch(API.siteContent);
        if (contentData && Object.keys(contentData).length > 0) {
          // Fusionar con el default por si faltan llaves
          setSiteContent(prev => ({ ...prev, ...contentData }));
        }
      } catch (err) {
        console.warn('⚠️ No se pudo cargar site_content de la API, usando datos locales:', err.message);
      }

      // Intentar cargar productos
      try {
        const productsList = await apiFetch(API.products);
        if (productsList && Array.isArray(productsList)) {
          // Si la API devuelve productos, los usamos. Si no, mantenemos el fallback.
          if (productsList.length > 0) {
            setProducts(productsList);
          }
        }
      } catch (err) {
        console.warn('⚠️ No se pudieron cargar productos de la API, usando datos locales:', err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Actualizar contenido clave-valor masivamente
  const updateSiteContent = async (updates) => {
    try {
      const updatedData = await apiFetch(API.siteContent, {
        method: 'PUT',
        body: updates
      });
      setSiteContent(prev => ({ ...prev, ...updatedData }));
      return updatedData;
    } catch (err) {
      console.error('Error al actualizar contenido del sitio:', err);
      throw err;
    }
  };

  // Crear producto
  const createProduct = async (productData) => {
    try {
      const newProduct = await apiFetch(API.products, {
        method: 'POST',
        body: productData
      });
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      console.error('Error al crear producto:', err);
      throw err;
    }
  };

  // Actualizar producto
  const updateProduct = async (id, productData) => {
    try {
      const updatedProduct = await apiFetch(API.product(id), {
        method: 'PUT',
        body: productData
      });
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      throw err;
    }
  };

  // Eliminar producto
  const deleteProduct = async (id) => {
    try {
      await apiFetch(API.product(id), {
        method: 'DELETE'
      });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      throw err;
    }
  };

  return (
    <ContentContext.Provider value={{
      products,
      siteContent,
      loading,
      refreshContent: loadData,
      updateSiteContent,
      createProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent debe usarse dentro de un ContentProvider');
  }
  return context;
};
