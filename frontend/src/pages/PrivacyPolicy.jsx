import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 border-b border-gray-200 pb-4 mb-6">
          Política de Privacidad
        </h1>
        <p className="text-sm text-gray-500 mb-8">Última actualización: 14 de junio de 2026</p>
        
        <div className="space-y-6 text-gray-750 leading-relaxed">
          <p>
            En <strong>Tecnología del Pacífico S.A.S.</strong> nos tomamos muy en serio la privacidad y seguridad de sus datos personales. De conformidad con lo establecido en la <strong>Ley 1581 de 2012</strong> de Colombia (Régimen General de Protección de Datos Personales o Habeas Data) y sus decretos reglamentarios, le informamos acerca de nuestras políticas de recopilación y tratamiento de información.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">1. Responsable del Tratamiento de Datos</h2>
            <p>
              El responsable del tratamiento de sus datos personales es:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Razón Social:</strong> Tecnología del Pacífico S.A.S.</li>
              <li><strong>Dirección:</strong> Carrera 61 #3-06 Barrio Dorado, Buenaventura - Valle del Cauca, Colombia</li>
              <li><strong>Correo electrónico de contacto:</strong> cliente@tecnologiadelpacifico.net</li>
              <li><strong>Teléfono:</strong> +57 3024892307</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">2. Datos Personales Recopilados</h2>
            <p>
              Recopilamos información a través de nuestro sitio web y nuestro asistente automatizado de WhatsApp cuando usted interactúa con nuestros servicios. Los datos incluyen:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Datos de contacto:</strong> Nombre completo, correo electrónico y número de teléfono.</li>
              <li><strong>Datos del proyecto:</strong> Descripción de sus necesidades, servicio seleccionado y presupuesto estimado.</li>
              <li><strong>Datos de navegación (Analytics):</strong> Páginas visitadas, tipo de dispositivo, navegador, dirección IP y cookies.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">3. Finalidad del Tratamiento de Datos</h2>
            <p>
              Los datos personales recolectados serán utilizados únicamente para las siguientes finalidades:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Gestionar y procesar sus solicitudes de cotización técnica.</li>
              <li>Establecer contacto comercial para responder a sus dudas o requerimientos.</li>
              <li>Monitorear y optimizar el rendimiento y la seguridad de nuestro sitio web.</li>
              <li>Cumplir con las obligaciones legales y normativas aplicables.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">4. Autorización y Consentimiento</h2>
            <p>
              Al diligenciar nuestros formularios web o interactuar con nuestro asistente de WhatsApp, usted otorga su consentimiento expreso e informado a <strong>Tecnología del Pacífico S.A.S.</strong> para el tratamiento de sus datos personales de acuerdo con las finalidades descritas en este documento.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">5. Sus Derechos (Derechos ARCO)</h2>
            <p>
              Como titular de los datos personales, de acuerdo con la legislación colombiana, usted tiene derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Conocer, actualizar y rectificar</strong> sus datos personales frente a Tecnología del Pacífico S.A.S.</li>
              <li><strong>Solicitar prueba</strong> de la autorización otorgada.</li>
              <li><strong>Ser informado</strong> respecto del uso que se les ha dado a sus datos.</li>
              <li><strong>Revocar la autorización</strong> o solicitar la supresión de sus datos cuando no se respeten los principios, derechos y garantías constitucionales.</li>
              <li><strong>Acceder en forma gratuita</strong> a sus datos personales que hayan sido objeto de tratamiento.</li>
            </ul>
            <p className="mt-2">
              Para ejercer cualquiera de estos derechos, puede enviar una solicitud formal por escrito al correo <strong>cliente@tecnologiadelpacifico.net</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">6. Seguridad de la Información</h2>
            <p>
              Implementamos medidas de seguridad técnicas, administrativas y físicas idóneas para evitar el acceso no autorizado, alteración, pérdida o divulgación de sus datos personales. Entre estas medidas se incluyen protocolos HTTPS de encriptación y firewalls de última generación.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">7. Cambios en la Política de Privacidad</h2>
            <p>
              Nos reservamos el derecho de modificar esta política en cualquier momento para adaptarla a novedades legislativas o corporativas. Le recomendamos revisar este enlace periódicamente.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
