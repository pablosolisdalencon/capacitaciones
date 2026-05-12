# Sprint Plan 2 - Dashboard Avanzado y Navegación Dual

Este plan detalla el desarrollo de la interfaz avanzada con navegación dual (Personas/Capacitaciones), cuerpo central dinámico y agenda con múltiples resoluciones.

## Sprint 2.1: Layout Base y Panel Izquierdo (Navegación)
- [ ] **Task 2.1.1: Refactor de Layout para Vista Avanzada**
  - Adecuar el contenedor principal para soportar las 3 columnas (Sidebar Izquierdo, Cuerpo Central, Sidebar Derecho/Agenda).
- [ ] **Task 2.1.2: Selector de Modo de Navegación**
  - Crear el switch o tabs para alternar entre "PERSONAS" y "CAPACITACIONES".
- [ ] **Task 2.1.3: Filtros y Listados Dinámicos**
  - Implementar el dropdown de "Servicios" (afecta a ambos modos).
  - En modo PERSONAS: Listar trabajadores filtrados por servicio.
  - En modo CAPACITACIONES: Añadir dropdown de "Categorías" y listar capacitaciones.

## Sprint 2.2: Vista de Personas (Cuerpo Central)
- [ ] **Task 2.2.1: Ficha de Trabajador y KPIs**
  - Diseñar la tarjeta superior con foto/iniciales, datos del trabajador y KPIs (Cursos completados, pendientes, etc.).
- [ ] **Task 2.2.2: Tabla de Capacitaciones Asignadas**
  - Crear la tabla con columnas: Capacitación, Relator, Estado (Semáforo), Certificado.
  - Implementar el semáforo visual (Verde: Realizada, Amarillo: Programada, Rojo: Pendiente).
  - Añadir icono de medalla/certificado si aplica.

## Sprint 2.3: Vista de Capacitaciones (Cuerpo Central)
- [ ] **Task 2.3.1: Ficha de Capacitación y KPIs**
  - Diseñar la tarjeta superior con datos de la capacitación y KPIs (Total inscritos, porcentaje de avance).
- [ ] **Task 2.3.2: Tabla de Trabajadores Asignados**
  - Crear la tabla que lista los trabajadores que deben tomar o han tomado esa capacitación, con su estado individual.

## Sprint 2.4: Agenda Dinámica (Columna Derecha)
- [ ] **Task 2.4.1: Componente de Agenda Multiresolución**
  - Crear el contenedor de la agenda.
  - Implementar el selector de resolución: 1 Semana, 1 Mes, 1 Trimestre, 1 Semestre, 1 Año.
- [ ] **Task 2.4.2: Renderizado de Eventos**
  - Mostrar las charlas agendadas en la línea de tiempo según la resolución seleccionada.

## Sprint 2.5: Pulido Estético y Efectos Aero
- [ ] **Task 2.5.1: Integración de Estilos Avanzados**
  - Asegurar que todos los nuevos componentes usen el efecto Glassmorphism (`backdrop-blur`).
  - Añadir micro-animaciones en las transiciones de navegación.
