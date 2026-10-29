import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 border-b border-gray-200 pb-4 mb-6">
          Términos y Condiciones de Uso
        </h1>
        <p className="text-sm text-gray-500 mb-8">Última actualización: 14 de junio de 2026</p>

        <div className="space-y-6 text-gray-750 leading-relaxed">
          <p>
            Bienvenido al sitio web de <strong>Tecnología del Pacífico S.A.S.</strong> Al acceder y utilizar este sitio web, usted acepta cumplir y estar sujeto a los siguientes Términos y Condiciones de uso. Si no está de acuerdo con alguna de estas condiciones, le rogamos no utilizar esta plataforma.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">1. Objeto del Sitio Web</h2>
            <p>
              Este sitio web tiene como finalidad brindar información sobre los servicios y productos tecnológicos prestados por <strong>Tecnología del Pacífico S.A.S.</strong>, tales como desarrollo de software, soluciones en la nube, ciberseguridad, soporte técnico y analítica de datos, además de permitir la generación automatizada de solicitudes de cotización comercial.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">2. Solicitudes de Cotización y Precios</h2>
            <p>
              El envío de una solicitud de cotización (bien sea por formularios del sitio o mediante nuestro asistente de WhatsApp) no representa un contrato de prestación de servicios vinculante. 
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Los precios y presupuestos presentados son estimados informativos y están sujetos a variaciones y ajustes según el alcance definitivo de cada proyecto.</li>
              <li>Toda propuesta formal será enviada por correo electrónico oficial de la empresa tras la revisión de un consultor especializado.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">3. Propiedad Intelectual</h2>
            <p>
              Todo el contenido gráfico, de software, logos, diseños, textos, código fuente, iconos y demás material presente en este sitio web es de propiedad exclusiva de <strong>Tecnología del Pacífico S.A.S.</strong> o de sus respectivos licenciantes, y está protegido por las leyes internacionales y colombianas sobre derechos de autor y propiedad intelectual. Queda prohibida su reproducción total o parcial sin consentimiento previo por escrito.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">4. Uso Permitido y Prohibiciones</h2>
            <p>
              Usted se compromete a hacer un uso correcto y legal de este sitio. Queda estrictamente prohibido:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Utilizar el sitio con fines ilícitos o fraudulentos.</li>
              <li>Intentar vulnerar los sistemas de seguridad del sitio, realizar ataques de denegación de servicio (DoS) o inyectar código malicioso (virus, malware).</li>
              <li>Extraer de forma masiva datos de contacto para campañas de spam o publicidad no autorizada.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">5. Exclusión de Responsabilidad</h2>
            <p>
              <strong>Tecnología del Pacífico S.A.S.</strong> realiza sus mejores esfuerzos para garantizar la disponibilidad continua, precisión y seguridad del sitio. No obstante, no nos hacemos responsables por:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Interrupciones temporales causadas por fallos técnicos ajenos o tareas de mantenimiento.</li>
              <li>Daños indirectos causados por malware o ataques informáticos de terceros que superen las medidas estándar de seguridad implementadas.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">6. Ley Aplicable y Jurisdicción</h2>
            <p>
              Estos Términos y Condiciones se rigen e interpretan de acuerdo con las leyes vigentes de la República de Colombia. Cualquier disputa relacionada con estas condiciones será sometida a la jurisdicción exclusiva de los tribunales competentes de Colombia.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">7. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre estos Términos, por favor póngase en contacto con nosotros a través de nuestro correo: <strong>cliente@tecnologiadelpacifico.net</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
