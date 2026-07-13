🌦️ Environmental Monitoring Module
📝 Overview
The Environmental Monitoring Module is a core functional unit within the Aman City Dashboard. It provides real-time tracking of meteorological conditions and air quality indices to support city-wide safety and energy automation.

⚙️ Technical Architecture
The module is built with a focus on Asynchronous Data Management and Real-time Synchronization:

Parallel Data Fetching: Utilizes Promise.all to fetch Weather and Air Quality data simultaneously, reducing the overall loading time and ensuring data consistency across components.

Auto-Polling Mechanism: Implements a custom polling logic using setInterval (5-minute frequency) to maintain live data accuracy without requiring user interaction.

Resource Management: Employs React's useEffect cleanup pattern to manage window intervals, preventing memory leaks and optimizing performance for long-running sessions.

Modular Component Design: Data is distributed across specialized sub-components (e.g., UVIndexLevel, AirQualityStats) to ensure high maintainability and clean code structure.

🛠️ Logic & Features
Dynamic Weather Services: A dedicated service layer (weatherService.ts) handles complex URL construction and error handling for external APIs.

Comprehensive Air Quality Monitoring: Tracks critical pollutants including CO (Carbon Monoxide), NO2 (Nitrogen Dioxide), and NH3 (Ammonia) to ensure public health safety.

Responsive Dashboard Layout: A complex Grid-system (Tailwind CSS) that adapts from mobile view to high-resolution desktop screens, maintaining visibility of all 7+ monitoring widgets.
