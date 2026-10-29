import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 border-b border-gray-200 pb-4 mb-6">
          Política de Cookies
        </h1>
        <p className="text-sm text-gray-500 mb-8">Última actualización: 14 de junio de 2026</p>

        <div className="space-y-6 text-gray-750 leading-relaxed">
          <p>
            En <strong>Tecnología del Pacífico S.A.S.</strong> utilizamos cookies y tecnologías similares de seguimiento en nuestro sitio web para mejorar su experiencia de navegación, analizar el rendimiento de la plataforma y garantizar el correcto funcionamiento de todas nuestras características.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">1. ¿Qué es una Cookie?</h2>
            <p>
              Una cookie es un pequeño archivo de texto que un sitio web almacena en su ordenador, teléfono inteligente o cualquier otro dispositivo con acceso a Internet. Las cookies permiten que el sitio web recuerde sus acciones e información de navegación (como inicio de sesión, idioma y preferencias de visualización) para que no tenga que volver a configurarlas en visitas posteriores.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">2. Cookies que Utiliza este Sitio Web</h2>
            <p>
              Nuestra plataforma utiliza los siguientes tipos de cookies:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Cookies Esenciales o Técnicas:</strong> Son estrictamente necesarias para el correcto funcionamiento de nuestra plataforma. Permiten cargar las páginas rápidamente, gestionar las sesiones de inicio de sesión de los administradores y procesar el carrito de compras de productos.
              </li>
              <li>
                <strong>Cookies de Análisis (Analytics Interno):</strong> Usamos identificadores de sesión anónimos para alimentar nuestro sistema local de análisis de visitas web. Esto nos permite conocer qué páginas son las más populares y desde qué dispositivos nos visitan, con el fin exclusivo de mejorar nuestros servicios. <em>No compartimos esta información con redes de publicidad externas.</em>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">3. ¿Cómo Deshabilitar o Administrar las Cookies?</h2>
            <p>
              Usted tiene la posibilidad de aceptar, bloquear o eliminar las cookies instaladas en su dispositivo mediante la configuración de las opciones del navegador web que utilice. Tenga en cuenta que si deshabilita las cookies esenciales, es posible que algunas secciones de nuestro sitio web no funcionen correctamente.
            </p>
            <p className="mt-2 text-sm text-gray-650">
              A continuación, le facilitamos enlaces sobre cómo gestionar cookies en los navegadores principales:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm text-cyan-600">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="hover:underline">Apple Safari</a></li>
              <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="hover:underline">Microsoft Edge</a></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">4. Actualizaciones de la Política de Cookies</h2>
            <p>
              Esta política puede ser modificada en respuesta a cambios normativos o mejoras técnicas en el sitio web. Le sugerimos revisar esta sección periódicamente para estar al tanto de cualquier cambio.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
