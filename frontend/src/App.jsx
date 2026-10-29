
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Home from '@/pages/Home';
import About from '@/components/About';
import Services from '@/components/Services';
import Products from '@/components/Products';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AdminPage from '@/pages/AdminPage';
import DownloadPage from '@/pages/DownloadPage';
import ServiceDetail from '@/pages/ServiceDetail';
import Brochure from '@/pages/Brochure';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsAndConditions from '@/pages/TermsAndConditions';
import CookiePolicy from '@/pages/CookiePolicy';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { ContentProvider } from '@/context/ContentContext';
import { trackPageVisit } from '@/lib/analytics';

// Scroll to top + track visit on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Track visit (exclude admin to keep analytics clean)
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/download')) {
      trackPageVisit(pathname);
    }
  }, [pathname]);
  return null;
};

// Page Wrappers to ensure proper SEO and spacing
const PageWrapper = ({ children, title, description, noPadding = false }) => (
  <>
    <Helmet>
      <title>{title} | Tecnología del Pacífico S.A.S</title>
      <meta name="description" content={description} />
    </Helmet>
    {/* Apply pt-20 for spacing below the fixed header, unless noPadding is true */}
    <div className={noPadding ? "" : "pt-20 min-h-screen"}>
      {children}
    </div>
  </>
);

function App() {
  return (
    <ContentProvider>
      <CartProvider>
        <div className="min-h-screen bg-white flex flex-col font-sans">
          <ScrollToTop />
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route 
                path="/" 
                element={
                  <>
                    <Helmet>
                      <title>Tecnología del Pacífico S.A.S - Transformación Digital</title>
                      <meta name="description" content="Soluciones tecnológicas innovadoras para tu empresa: Software, Cloud, Ciberseguridad y más." />
                    </Helmet>
                    <Home />
                  </>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <PageWrapper 
                    title="Nosotros" 
                    description="Conoce más sobre nuestra misión, visión y equipo experto."
                  >
                    <About />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/services" 
                element={
                  <PageWrapper 
                    title="Servicios" 
                    description="Desarrollo de software, nube, ciberseguridad y más."
                  >
                    <Services />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/service/:id" 
                element={
                  <PageWrapper 
                    title="Detalles del Servicio" 
                    description="Información detallada sobre nuestros servicios tecnológicos."
                  >
                    <ServiceDetail />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/products" 
                element={
                  <PageWrapper 
                    title="Productos" 
                    description="Catálogo de productos tecnológicos y servicios empresariales."
                  >
                    <Products />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <PageWrapper 
                    title="Contacto" 
                    description="Solicita una cotización o ponte en contacto con nosotros."
                  >
                    <Contact />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <PageWrapper 
                    title="Administración" 
                    description="Panel de administración de cotizaciones."
                  >
                    <AdminPage />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/download" 
                element={
                  <PageWrapper 
                    title="Descargas" 
                    description="Descarga tu material digital: Tarjeta de presentación y Brochure."
                  >
                    <DownloadPage />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/brochure" 
                element={
                  <PageWrapper 
                    title="Brochure Digital" 
                    description="Brochure digital de Servicios de Tecnología del Pacífico S.A.S."
                    noPadding={true}
                  >
                    <Brochure />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/privacy" 
                element={
                  <PageWrapper 
                    title="Política de Privacidad" 
                    description="Política de privacidad y protección de datos personales."
                  >
                    <PrivacyPolicy />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/terms" 
                element={
                  <PageWrapper 
                    title="Términos y Condiciones" 
                    description="Términos y condiciones de uso de la plataforma."
                  >
                    <TermsAndConditions />
                  </PageWrapper>
                } 
              />
              <Route 
                path="/cookies" 
                element={
                  <PageWrapper 
                    title="Política de Cookies" 
                    description="Uso de cookies y almacenamiento web."
                  >
                    <CookiePolicy />
                  </PageWrapper>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
          <Toaster />
        </div>
      </CartProvider>
    </ContentProvider>
  );
}

// Wrap App with Router outside to allow useLocation hook to work
export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
