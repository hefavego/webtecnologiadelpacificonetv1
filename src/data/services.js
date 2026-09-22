import { Code, Cloud, Shield, Smartphone, Database, Headphones } from 'lucide-react';

export const servicesData = [
  {
    id: 'desarrollo-software',
    icon: Code,
    title: 'Desarrollo de Software',
    shortDescription: 'Aplicaciones personalizadas que se adaptan perfectamente a las necesidades de tu negocio.',
    fullDescription: 'Creamos soluciones de software a medida que optimizan tus procesos empresariales. Desde plataformas web complejas hasta sistemas de gestión interna, nuestro equipo utiliza las últimas tecnologías para entregar código robusto, escalable y seguro.',
    color: 'from-cyan-500 to-blue-500',
    features: [
      'Arquitectura de microservicios',
      'Desarrollo Frontend y Backend',
      'Integración de APIs',
      'Metodologías Ágiles (Scrum)'
    ],
    benefits: [
      'Automatización de procesos manuales',
      'Reducción de costos operativos',
      'Mayor ventaja competitiva',
      'Escalabilidad garantizada'
    ]
  },
  {
    id: 'soluciones-cloud',
    icon: Cloud,
    title: 'Soluciones en la Nube',
    shortDescription: 'Migración y gestión de infraestructura cloud para mayor escalabilidad y eficiencia.',
    fullDescription: 'Llevamos tu infraestructura al siguiente nivel con soluciones en la nube. Gestionamos migraciones, optimizamos costos y configuramos entornos seguros en AWS, Azure o Google Cloud para garantizar que tu negocio esté siempre disponible.',
    color: 'from-blue-500 to-indigo-500',
    features: [
      'Migración Cloud',
      'Arquitectura Serverless',
      'Contenedores (Docker/Kubernetes)',
      'Backup y Recuperación'
    ],
    benefits: [
      'Alta disponibilidad (99.9%)',
      'Pago por uso',
      'Acceso global a tus datos',
      'Flexibilidad instantánea'
    ]
  },
  {
    id: 'ciberseguridad',
    icon: Shield,
    title: 'Ciberseguridad',
    shortDescription: 'Protección integral de tus datos y sistemas contra amenazas digitales.',
    fullDescription: 'Protegemos tus activos digitales más valiosos. Implementamos estrategias de seguridad defensiva y ofensiva, auditorías de vulnerabilidad y monitoreo continuo para prevenir ataques y filtraciones de datos.',
    color: 'from-indigo-500 to-purple-500',
    features: [
      'Ethical Hacking',
      'Encriptación de datos',
      'Gestión de identidad (IAM)',
      'Monitoreo 24/7'
    ],
    benefits: [
      'Protección de reputación de marca',
      'Cumplimiento normativo (GDPR, etc)',
      'Continuidad del negocio',
      'Prevención de pérdidas financieras'
    ]
  },
  {
    id: 'apps-moviles',
    icon: Smartphone,
    title: 'Apps Móviles',
    shortDescription: 'Desarrollo de aplicaciones móviles nativas y multiplataforma de alto rendimiento.',
    fullDescription: 'Conectamos con tus usuarios donde sea que estén. Diseñamos y desarrollamos aplicaciones móviles intuitivas y potentes para iOS y Android, enfocadas en brindar la mejor experiencia de usuario (UX/UI).',
    color: 'from-purple-500 to-pink-500',
    features: [
      'Desarrollo Nativo (Swift/Kotlin)',
      'Desarrollo Multiplataforma (React Native/Flutter)',
      'Diseño UX/UI centrado en usuario',
      'Notificaciones Push'
    ],
    benefits: [
      'Mayor engagement con clientes',
      'Canal de venta directo',
      'Fidelización de usuarios',
      'Presencia de marca en stores'
    ]
  },
  {
    id: 'big-data',
    icon: Database,
    title: 'Big Data & Analytics',
    shortDescription: 'Análisis de datos avanzado para tomar decisiones inteligentes basadas en información.',
    fullDescription: 'Transformamos datos brutos en insights accionables. Implementamos pipelines de datos, almacenes de datos (Data Warehouses) y tableros de visualización para que puedas tomar decisiones estratégicas basadas en evidencia.',
    color: 'from-pink-500 to-rose-500',
    features: [
      'Procesamiento ETL',
      'Business Intelligence (BI)',
      'Machine Learning',
      'Visualización de Datos'
    ],
    benefits: [
      'Toma de decisiones informada',
      'Predicción de tendencias',
      'Optimización de recursos',
      'Identificación de oportunidades'
    ]
  },
  {
    id: 'soporte-tecnico',
    icon: Headphones,
    title: 'Soporte Técnico',
    shortDescription: 'Asistencia técnica profesional 24/7 para garantizar la continuidad de tu operación.',
    fullDescription: 'No dejes que los problemas técnicos detengan tu empresa. Nuestro equipo de soporte está listo para resolver incidencias de hardware, software y redes con tiempos de respuesta rápidos y soluciones efectivas.',
    color: 'from-rose-500 to-cyan-500',
    features: [
      'Mesa de ayuda (Help Desk)',
      'Mantenimiento preventivo',
      'Soporte remoto y en sitio',
      'Gestión de inventario IT'
    ],
    benefits: [
      'Minimización de tiempos de inactividad',
      'Productividad continua',
      'Expertos a tu disposición',
      'Reducción de estrés operativo'
    ]
  }
];