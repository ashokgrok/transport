export type Language = 'es' | 'en';

export interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

export const I18N_DICT: Translations = {
  // Brand & General
  'portal.title': {
    es: 'Portal Torre de Control CITRAM',
    en: 'CITRAM Control Tower Portal',
  },
  'portal.tagline': {
    es: 'Centro de Innovación y Gestión del Transporte Público de Madrid',
    en: 'Innovation and Public Transport Management Centre of Madrid',
  },
  'demo.badge': {
    es: 'MODO DEMOSTRACIÓN · SIMULACIÓN ACTIVA',
    en: 'DEMO MODE · SIMULATION ACTIVE',
  },
  'open_mode.banner': {
    es: 'MODO ABIERTO (DEMO): Todos los usuarios tienen permisos completos concedidos por dispensa temporal.',
    en: 'OPEN DEMO MODE: All signed-in accounts hold full permissions by temporary administrative waiver.',
  },

  // Navigation Items
  'nav.tower': { es: 'Torre de Control', en: 'Control Tower' },
  'nav.alerts': { es: 'Torrente de Alertas', en: 'Alert Flood' },
  'nav.cases': { es: 'Gestión de Casos', en: 'Case Workspace' },
  'nav.video': { es: 'Cámaras y CCTV', en: 'CCTV & Video' },
  'nav.messages': { es: 'Comunicaciones', en: 'Passenger Comms' },
  'nav.shift_log': { es: 'Libro de Turno', en: 'Shift Logbook' },
  'nav.team_board': { es: 'Panel de Equipo', en: 'Team Board' },
  'nav.sla_board': { es: 'Panel de SLAs', en: 'SLA Board' },
  'nav.handover': { es: 'Relevo de Turno', en: 'Shift Handover' },
  'nav.runbooks': { es: 'Biblioteca de Runbooks', en: 'Runbooks' },
  'nav.comms': { es: 'Canales de Información', en: 'Channel Previews' },
  'nav.connections': { es: 'Protección de Enlaces', en: 'Connections' },
  'nav.accessibility': { es: 'Accesibilidad y PMR', en: 'Accessibility & PMR' },
  'nav.debrief': { es: 'Debrief y Lecciones', en: 'Debrief' },
  'nav.schedules': { es: 'Horario Teórico y Fechado', en: 'Dated Schedule' },
  'nav.change_requests': { es: 'Peticiones de Cambio', en: 'Change Requests' },
  'nav.supply': { es: 'Oferta Realizada', en: 'Realised Supply' },
  'nav.inspections': { es: 'Mis Inspecciones', en: 'My Inspections' },
  'nav.findings': { es: 'Hallazgos de Red', en: 'Findings' },
  'nav.compliance': { es: 'Supervisión Concesional', en: 'Concessions' },
  'nav.kpis': { es: 'Indicadores Técnicos', en: 'Technical KPIs' },
  'nav.penalties': { es: 'Liquidación y Penalizaciones', en: 'Penalties' },
  'nav.dashboards': { es: 'Paneles de Datos', en: 'Data Dashboards' },
  'nav.data_quality': { es: 'Calidad de Datos', en: 'Data Quality' },
  'nav.models': { es: 'Modelos Predictivos', en: 'AI Models' },
  'nav.overview': { es: 'Resumen Ejecutivo', en: 'Executive Overview' },
  'nav.punctuality': { es: 'Puntualidad por Modo', en: 'Punctuality' },
  'nav.briefing': { es: 'Dossier Ejecutivo (PDF)', en: 'Executive Briefing' },
  'nav.complaints': { es: 'Reclamaciones y CRM', en: 'Complaints Queue' },
  'nav.admin_users': { es: 'Usuarios y Cuentas', en: 'Users & Accounts' },
  'nav.admin_roles': { es: 'Matriz de Permisos (RBAC)', en: 'Role Permissions' },
  'nav.admin_verification': { es: 'Verificación y Test Cases', en: 'Verification & Test Cases' },
  'nav.admin_modules': { es: 'Módulos y Licencias', en: 'Modules & Features' },
  'nav.admin_feeds': { es: 'Integraciones y Feeds', en: 'Feeds & Health' },
  'nav.admin_params': { es: 'Parámetros del Sistema', en: 'Site Parameters' },
  'nav.audit_history': { es: 'Registro de Auditoría', en: 'Audit Log' },
  'nav.operator_services': { es: 'Mi Flota en Servicio', en: 'My Fleet' },
  'nav.operator_inbox': { es: 'Buzón de Instrucciones', en: 'Instructions Inbox' },
  'nav.connections_risk': { es: 'Enlaces en Riesgo', en: 'Connections at Risk' },
  'nav.interchange_view': { es: 'Intercambiador en Vivo', en: 'Interchange Live' },
  'nav.mobile_tasks': { es: 'Órdenes de Trabajo', en: 'Work Orders' },
  'nav.shared_situations': { es: 'Emergencias 112', en: '112 Situations' },
  'nav.traffic_calendar': { es: 'Cortes y Eventos DGT', en: 'Traffic & Events' },
  'nav.live_departures': { es: 'Próximas Salidas', en: 'Live Departures' },
  'nav.api_catalogue': { es: 'Catálogo de APIs', en: 'API Catalogue' },
  'nav.portfolio_sites': { es: 'Cartera Multi-Sitio', en: 'Site Portfolio' },
  'nav.sites_in_progress': { es: 'Asistente de Onboarding', en: 'Onboarding Wizard' },
  'nav.site_onboarding': { es: 'Onboarding de Sitio', en: 'Site Onboarding' },
  'nav.onboarding_wizard': { es: 'Asistente de Configuración', en: 'Onboarding Wizard' },
  'nav.feed_validator': { es: 'Validador de Feeds', en: 'Feed Validator' },
  'nav.connectors': { es: 'Conectores Regionales', en: 'Regional Connectors' },
  'nav.releases': { es: 'Versiones y Despliegues', en: 'Releases & Versions' },
  'nav.operators': { es: 'Operadores y Flotas', en: 'Operators & Fleets' },
  'nav.disputes': { es: 'Alegaciones y Disputas', en: 'Disputes & Claims' },
  'nav.reports': { es: 'Informes y Actas', en: 'Reports & Certificates' },
  'nav.change_request': { es: 'Peticiones de Cambio', en: 'Change Requests' },
  'nav.docks': { es: 'Dársenas y Andenes', en: 'Bays & Docks' },
  'nav.passenger_flow': { es: 'Flujo de Pasajeros', en: 'Passenger Flow' },
  'nav.local_alerts': { es: 'Alertas Locales', en: 'Local Alerts' },
  'nav.explore': { es: 'Explorador Multimodal', en: 'Network Explorer' },
  'nav.exports': { es: 'Exportaciones de Datos', en: 'Data Exports' },
  'nav.drafts': { es: 'Borradores de Avisos', en: 'Draft Notices' },
  'nav.channels': { es: 'Canales y Redes', en: 'Channels & Broadcast' },
  'nav.preview': { es: 'Vista Previa en Canales', en: 'Channel Preview' },
  'nav.templates': { es: 'Plantillas de Mensajes', en: 'Message Templates' },
  'nav.assets': { es: 'Inventario de Activos', en: 'Asset Inventory' },
  'nav.checklist_mobile': { es: 'Lista de Control Móvil', en: 'Mobile Checklist' },
  'nav.enquiries': { es: 'Consultas de Usuarios', en: 'User Enquiries' },
  'nav.known_issues': { es: 'Incidencias Frecuentes', en: 'Known Issues' },
  'nav.access_logs': { es: 'Registros de Acceso', en: 'Access Logs' },
  'nav.evidence_pack': { es: 'Paquete de Evidencias', en: 'Evidence Pack' },
  'nav.emergency_contacts': { es: 'Contactos de Emergencia', en: 'Emergency Contacts' },
  'nav.status_board': { es: 'Tablero de Coordinación', en: 'Coordination Board' },
  'nav.submit_event': { es: 'Registrar Evento / Ocupación', en: 'Submit Event' },
  'nav.my_submissions': { es: 'Mis Solicitudes de Eventos', en: 'My Event Requests' },
  'nav.planner_mobile': { es: 'Planificador de Viaje', en: 'Trip Planner' },
  'nav.disruptions': { es: 'Avisos y Desvíos', en: 'Disruptions' },
  'nav.my_keys': { es: 'Claves de API y Tokens', en: 'API Keys' },
  'nav.api_sandbox': { es: 'Entorno de Pruebas API', en: 'API Sandbox' },
  'nav.feed_status': { es: 'Estado de Alimentadores', en: 'Feed Health Status' },

  // Control Tower
  'tower.headline.health': { es: 'Salud de la Red Regional', en: 'Regional Network Health' },
  'tower.headline.cases': { es: 'Casos que Requieren Decisión', en: 'Cases Needing Decision' },
  'tower.headline.slas': { es: 'SLAs en Riesgo Inminente', en: 'SLAs at Risk' },
  'kpi.summary_title': { es: 'Resumen de KPIs Operativos', en: 'KPI Summary' },
  'kpi.incidents_active': { es: 'Incidencias Activas', en: 'Incidents Active' },
  'kpi.average_latency': { es: 'Latencia Media', en: 'Average Latency' },
  'kpi.health_score': { es: 'Puntuación de Salud del Sistema', en: 'System Health Score' },
  'tower.all_clear.title': { es: 'Red de Transporte en Régimen Nominal', en: 'Transport Network Operating Nominally' },
  'tower.all_clear.desc': {
    es: 'No existen disrupciones críticas sin asignar. El sistema vigila 5.120 vehículos, 23 alimentadores y 5 intercambiadores.',
    en: 'No unassigned critical disruptions. System actively monitoring 5,120 vehicles, 23 external feeds, and 5 interchanges.',
  },
  'tower.all_clear.next': { es: 'Próximos eventos programados', en: 'Upcoming scheduled network events' },
  'tower.since_last': { es: 'Novedades desde tu última conexión', en: 'Since you last looked' },
  'tower.explore_toggle': { es: 'Modo Exploración', en: 'Explore Mode' },
  'tower.glance_toggle': { es: 'Modo Decisión Rápida', en: 'Glance Mode' },
  'tower.layer.calm': { es: 'Capa Serena', en: 'Calm Layer' },
  'tower.layer.ops': { es: 'Operaciones', en: 'Operations' },
  'tower.layer.interchanges': { es: 'Intercambiadores', en: 'Interchanges' },
  'tower.layer.everything': { es: 'Todo', en: 'Everything' },

  // Common Actions
  'action.signin': { es: 'Iniciar Sesión', en: 'Sign In' },
  'action.signout': { es: 'Cerrar Sesión', en: 'Sign Out' },
  'action.switch_role': { es: 'Cambiar de Rol', en: 'Switch Role' },
  'action.switch_site': { es: 'Cambiar de Sitio', en: 'Switch Site' },
  'action.acknowledge': { es: 'Reconocer Alerta', en: 'Acknowledge' },
  'action.claim': { es: 'Reclamar Caso', en: 'Claim Case' },
  'action.promote': { es: 'Promover a Caso Crítico', en: 'Promote to Critical Case' },
  'action.approve_hold': { es: 'Aprobar Retención de Enlace', en: 'Approve Connection Hold' },
  'action.resolve': { es: 'Resolver Incidencia', en: 'Resolve Incident' },
  'action.close': { es: 'Cerrar Caso', en: 'Close Case' },
  'action.apply': { es: 'Aplicar Sugerencia IA', en: 'Apply AI Suggestion' },
  'action.dismiss': { es: 'Descartar', en: 'Dismiss' },
  'action.search_placeholder': { es: 'Buscar caso, estación, línea, runbook o persona (Ctrl+K)...', en: 'Search case, station, line, runbook, or person (Ctrl+K)...' },
  'action.panic_reset': { es: 'Reinicio de Emergencia (Pánico)', en: 'Panic Reset' },
  'action.reset_seed': { es: 'Restablecer Estado Semilla', en: 'Reset to Seed' },

  // Theme & Density
  'theme.light': { es: 'Tema Claro', en: 'Light Theme' },
  'theme.dark': { es: 'Tema Sala Oscura', en: 'Dark Control Room' },
  'theme.wall': { es: 'Modo Videowall 4K', en: '4K Wall Display' },
  'theme.sound': { es: 'Sonidos Operativos', en: 'Operational Audio' },

  // Data Trust
  'trust.why_i_trust': { es: '¿Por qué confío en este dato?', en: 'Why I trust this' },
  'trust.rule_applied': { es: 'Regla de Selección y Arbitraje Aplicada (CRTM DAT-04):', en: 'Applied Selection and Arbitration Rule (CRTM DAT-04):' },
  'trust.candidate_sources': { es: 'Fuentes Candidatas Comparadas:', en: 'Candidate Sources Evaluated:' },
  'trust.provenance_header': { es: 'MOTOR DE PROCEDENCIA Y ARBITRAJE', en: 'PROVENANCE & ARBITRATION ENGINE' },
  'trust.selected_fact': { es: 'Dato Operativo Seleccionado:', en: 'Selected Operational Data Point:' },
  'trust.type_measured': { es: 'Tipo: Medido en Tiempo Real', en: 'Type: Real-Time Measured' },
  'trust.freshness_live': { es: 'Frescura: Live · 2 segundos', en: 'Freshness: Live · 2 seconds' },
  'trust.selected_source': { es: 'Fuente Seleccionada: Telemetría Directa SAE On-Board (N06)', en: 'Selected Source: Direct On-Board CAD/AVL Telemetry (N06)' },
  'trust.discarded_source': { es: 'Fuente Descartada: Sistema Central Operador Interurbano (N05)', en: 'Discarded Source: Interurban Operator Back Office (N05)' },
  'trust.winner': { es: 'GANADORA', en: 'WINNER' },
  'trust.discarded': { es: 'Descartada (Stale)', en: 'Discarded (Stale)' },
  'trust.position': { es: 'Posición:', en: 'Position:' },
  'trust.position_val': { es: 'A 900 m del andén (08:40:12)', en: '900 m from platform (08:40:12)' },
  'trust.reported_pos': { es: 'Posición reportada:', en: 'Reported position:' },
  'trust.reported_pos_val': { es: 'En parada Atocha (hace 58 s)', en: 'At Atocha bay (58 s ago)' },
  'trust.age': { es: 'Antigüedad (Age):', en: 'Age:' },
  'trust.quality_score': { es: 'Índice de Calidad:', en: 'Quality Score:' },
  'trust.protocol': { es: 'Protocolo:', en: 'Protocol:' },
  'trust.audit_footer': { es: 'Trazabilidad auditada e inmutable', en: 'Audited, immutable provenance trace' },
  'trust.understood': { es: 'Entendido', en: 'Understood' },

  // Admin & Integrations
  'admin.feeds_desc': {
    es: 'Supervisión técnica de los 23 conectores e interfaces operativas del sitio activo.',
    en: 'Technical supervision of the 23 connectors and operational interfaces for the active site.',
  },
  'admin.feeds_button': {
    es: 'Abrir Fichas de Conectores (N01-N23)',
    en: 'Open Connector Cards (N01-N23)',
  },
  'admin.rbac_title': {
    es: 'Gestión de Control de Acceso y Permisos (RBAC)',
    en: 'Role-Based Access Control (RBAC) Management',
  },
  'admin.rbac_notice': {
    es: 'Los cambios se propagan a las sesiones abiertas en menos de 2 segundos sin cerrar sesión.',
    en: 'Changes propagate to active sessions in under 2 seconds without requiring re-login.',
  },
  'admin.filter_capabilities': {
    es: 'Filtrar capacidades o módulos...',
    en: 'Filter capabilities or modules...',
  },
  'admin.th_module': { es: 'Módulo', en: 'Module' },
  'admin.th_capability': { es: 'Capacidad / Acción', en: 'Capability / Action' },
  'admin.th_description': { es: 'Descripción Operativa', en: 'Operational Description' },

  // Network Explorer
  'network.topology_title': {
    es: 'Topología y Red Multimodal de Madrid',
    en: 'Madrid Multimodal Transport Topology',
  },
  'network.topology_desc': {
    es: 'Datos maestros de Metro, Cercanías, EMT, Interurbanos e Intercambiadores regionales.',
    en: 'Master reference data for Metro, Cercanías Rail, EMT buses, Interurban concessions, and regional Interchanges.',
  },
  'network.active_vehicles': { es: 'Vehículos Activos en Red', en: 'Active Vehicles on Network' },
  'network.interchanges': { es: 'Intercambiadores Multimodales', en: 'Multimodal Interchanges' },
  'network.coverage': { es: 'Cobertura Territorial CRTM', en: 'CRTM Regional Coverage' },
  'network.operators': { es: 'Operadores Públicos y Privados', en: 'Public & Private Operators' },
  'network.lines_corridors': { es: 'Líneas y Corredores', en: 'Lines & Corridors' },
  'network.lines_in_circulation': { es: 'Vehículos en Circulación:', en: 'Vehicles in Service:' },
  'network.bus_docks': { es: 'Dársenas de Autobús:', en: 'Bus Bays:' },
  'network.connected_lines': { es: 'Líneas en Conexión:', en: 'Connecting Lines:' },

  // Explore Mode & CCTV
  'explore.title': { es: 'Modo Exploración Integral (Explore Mode - CTW-11)', en: 'Comprehensive Explore Mode (Explore Mode - CTW-11)' },
  'explore.all_active': { es: 'Todas las Capas Activas', en: 'All Layers Active' },
  'explore.desc': {
    es: 'Replay histórico desde inicio de jornada (04:30), mosaico CCTV en directo y tablas completas de oferta.',
    en: 'Historical replay from start of service (04:30), live CCTV mosaic, and complete supply ledger.',
  },
  'explore.replay_time': { es: 'Hora de Replay:', en: 'Replay Time:' },
  'explore.replay_reset_tooltip': { es: 'Volver a 04:30 (Inicio de Jornada)', en: 'Reset to 04:30 (Start of Day)' },
  'explore.history_indexed': { es: '24 meses histórico indexado', en: '24 months indexed history' },
  'explore.cctv_mosaic': { es: 'Mosaico CCTV Multimodal en Tiempo Real (4 Cámaras de N10)', en: 'Real-Time Multimodal CCTV Mosaic (4 N10 Feeds)' },
  'explore.cctv_active_feeds': { es: '● 4 feeds activos a 25 FPS', en: '● 4 active feeds at 25 FPS' },
  'explore.table_title': { es: 'Tabla Integral de Líneas y Frecuencias Observadas (CRTM GESTRA + SAE)', en: 'Comprehensive Observed Lines and Frequencies (CRTM GESTRA + CAD/AVL)' },
  'explore.th_line': { es: 'Línea', en: 'Line' },
  'explore.th_mode': { es: 'Modo', en: 'Mode' },
  'explore.th_route': { es: 'Itinerario', en: 'Route' },
  'explore.th_operator': { es: 'Operador', en: 'Operator' },
  'explore.th_frequency': { es: 'Frecuencia Teórica', en: 'Scheduled Headway' },
  'explore.th_vehicles': { es: 'Vehículos Activos', en: 'Active Vehicles' },
  'explore.th_status': { es: 'Estado Operativo', en: 'Operational Status' },
  'explore.footer_remembered': { es: 'Configuración recordada para el usuario activo (CTW-11)', en: 'Configuration remembered for active user (CTW-11)' },
  'explore.footer_back': { es: 'Volver a Modo Decisión (Glance)', en: 'Return to Decision Mode (Glance)' },

  // Presenter Tools
  'presenter.laser_title': { es: 'Activar Puntero Láser Virtual (Para presentaciones)', en: 'Toggle Virtual Laser Pointer (Presentations)' },
  'presenter.laser_label': { es: 'Láser', en: 'Laser' },
  'presenter.spotlight_title': { es: 'Activar Foco de Atención (Spotlight)', en: 'Toggle Spotlight Focus' },
  'presenter.sound_test_title': { es: 'Probar Chime de Notificación Sonora (Web Audio API)', en: 'Test Audio Notification Chime (Web Audio API)' },

  // Since You Last Looked Drawer
  'delta.title': { es: 'Novedades desde tu última conexión', en: 'Since you last looked' },
  'delta.subtitle': { es: 'RESUMEN DELTA OPERATIVO (CTW-08)', en: 'OPERATIONAL DELTA SUMMARY (CTW-08)' },
  'delta.p1_critical': { es: '1 Incidencia Crítica Declarada', en: '1 Critical Incident Declared' },
  'delta.p1_desc': {
    es: 'Caída de tensión en catenaria de vías 3 y 4 en Atocha Cercanías. Afección sobre corredores C-3, C-4 y C-5.',
    en: 'Catenary overhead voltage drop on tracks 3 & 4 at Atocha Cercanías. Impact on corridors C-3, C-4, and C-5.',
  },
  'delta.p2_hold': { es: 'Protección de Enlace Activada', en: 'Connection Protection Activated' },
  'delta.p2_desc': {
    es: 'Se recomendó retención de 5 minutos para el autobús interurbano 352 en Atocha, protegiendo el transbordo de 21 viajeros.',
    en: '5-minute holding window recommended for interurban bus 352 at Atocha, protecting 21 passenger transfers.',
  },
  'delta.p3_avail': { es: 'Disponibilidad Global: 99.85%', en: 'Global Availability: 99.85%' },
  'delta.p3_desc': {
    es: 'Puntualidad en Metro se sitúa en 99.2%, EMT en 97.8% y Cercanías en 94.1% debido a la avería eléctrica de Atocha.',
    en: 'Metro punctuality stands at 99.2%, EMT buses at 97.8%, and Cercanías rail at 94.1% due to the electrical outage at Atocha.',
  },
  'delta.all_clear': { es: 'Todo al día', en: 'All up to date' },
  'delta.examine_case': { es: 'Examinar caso INC-2026-0929', en: 'Inspect case INC-2026-0929' },

  // Connection Protection
  'conn.title': { es: 'Motor de Protección de Conexiones Intermodales', en: 'Intermodal Connection Protection Engine' },
  'conn.desc': {
    es: 'Arbitraje en tiempo real de retención de salidas de autobuses para salvaguardar transbordos de trenes demorados.',
    en: 'Real-time multi-criteria arbitration of departing bus holds to safeguard delayed rail passenger transfers.',
  },
  'conn.reset': { es: 'Reiniciar Simulación', en: 'Reset Simulation' },
  'conn.holding_window': { es: 'Ajuste del Tiempo de Retención Autorizado (Holding Window)', en: 'Authorized Holding Window Adjustment' },
  'conn.holding_min': { es: '1 min (Mínimo)', en: '1 min (Minimum)' },
  'conn.holding_opt': { es: '4 min (Óptimo CRTM)', en: '4 min (CRTM Optimal)' },
  'conn.holding_max': { es: '7 min (Límite Confort)', en: '7 min (Comfort Limit)' },
  'conn.cost_penalty': { es: 'Coste Operativo / Penalización', en: 'Operating Cost / Penalty' },
  'conn.cost_penalty_sub': { es: 'Penalización contractual concesión', en: 'Contractual concession penalty' },
  'conn.net_utility': { es: 'Puntuación Neta de Utilidad', en: 'Net Utility Score' },
  'conn.net_utility_sub': { es: 'Balance satisfacción global', en: 'Overall traveler satisfaction balance' },
  'conn.history_title': { es: 'Historial de Decisiones de Conexión en la Red CRTM (Últimas 24h)', en: 'Connection Decision History across CRTM Network (Last 24h)' },
  'conn.th_feeder': { es: 'Línea Alimentadora', en: 'Feeder Service' },
  'conn.th_connecting': { es: 'Línea Conectora', en: 'Connecting Service' },
  'conn.th_hold_time': { es: 'Tiempo Retención', en: 'Hold Duration' },
  'conn.th_status': { es: 'Estado', en: 'Status' },

  // Accessibility
  'access.title': { es: 'Monitor de Accesibilidad Universal y Encaminamiento PMR (PRD ACC-01)', en: 'Universal Accessibility & PRM Routing Monitor (PRD ACC-01)' },
  'access.desc': {
    es: 'Monitor de telemetría de ascensores, cálculo de itinerarios 100% libres de barreras arquitectónicas y despacho de equipos de asistencia Atendo.',
    en: 'Lift telemetry monitoring, 100% barrier-free routing computation, and on-ground PRM assistance dispatching.',
  },
  'access.evacuation_banner': { es: 'Evacuación y Transbordo PMR: Andén 4 Atocha → Dársena 14 Intercambiador Bus', en: 'PRM Transfer & Evacuation: Atocha Platform 4 → Interchange Bus Bay 14' },
  'access.detour_badge': { es: 'Desvío Accesible', en: 'Accessible Detour' },
  'access.telemetry_title': { es: 'Telemetría de Ascensores e Itinerarios Mecánicos', en: 'Lift & Step-Free Asset Telemetry' },
  'access.telemetry_subtitle': { es: 'Monitoreo en tiempo real de 1.420 dispositivos de elevación en la red CRTM.', en: 'Real-time monitoring of 1,420 vertical mobility assets across CRTM.' },
  'access.new_request': { es: 'Nueva Petición de Asistencia Inmediata', en: 'New Immediate Assistance Request' },

  // Operator Inbox
  'inbox.title': { es: 'Buzón de Despacho e Instrucciones Operativas (PRD OPS-05)', en: 'Operator Dispatch & Instructions Inbox (PRD OPS-05)' },
  'inbox.desc': {
    es: 'Recepción bidireccional de órdenes mandatorias, acuses de recibo en 1 clic y solicitudes de desviación entre CITRAM y operadores.',
    en: 'Two-way mandatory orders, 1-click acknowledgements, and deviation requests between CITRAM and transport operators.',
  },
  'inbox.request_clarification': { es: 'Solicitar Aclaración / Desviación', en: 'Request Clarification / Deviation' },
  'inbox.acknowledged_status': { es: 'Instrucción Acusada y en Ejecución', en: 'Instruction Acknowledged & Under Execution' },
  'inbox.deviation_modal_title': { es: 'Solicitud de Desviación Operativa', en: 'Operational Deviation Request' },
  'inbox.deviation_modal_desc': {
    es: 'Indique el motivo técnico por el cual no se puede ejecutar la orden según la propuesta de CITRAM.',
    en: 'Specify the technical constraint preventing execution according to CITRAM proposal.',
  },
  'inbox.operator_justification': { es: 'Justificación Técnica del Operador:', en: 'Operator Technical Justification:' },
};

export function t(key: string, lang: Language): string {
  if (I18N_DICT[key] && I18N_DICT[key][lang]) {
    return I18N_DICT[key][lang];
  }
  return key;
}
