# Surveillance Dashboard

A real-time surveillance dashboard application that displays detection data from multiple cameras.

## Features

- Real-time updates of detection data via WebSocket
- Live camera streams using HLS
- Interactive dashboard with customizable charts
- Detailed view of individual camera detections
- Responsive and draggable layout

## Technologies Used

- React
- TypeScript
- React Query
- React Router
- Recharts
- React Grid Layout
- HLS.js
- JSON Server (for mock API)
- WebSocket (for real-time updates)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/surveillance-dashboard.git
   cd surveillance-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

   This command will concurrently start:
   - React application
   - Mock API server (JSON Server)
   - WebSocket server

4. Open your browser and navigate to `http://localhost:3000`

## Technical Choices and Optimizations

1. **TypeScript**: Ensures type safety and improves developer experience.

2. **React Query**: Manages server state, provides caching, and handles real-time updates efficiently.

3. **Custom Hooks**: 
   - `useHLSStream`: Manages HLS video streaming.
   - `useWebSocket`: Handles WebSocket connections and reconnection logic.

4. **Reusable Components**: Atomic design pattern with reusable UI components (e.g., Button, Table, TableCell).

5. **Performance Optimizations**:
   - Debouncing search input in DetectionTable to reduce unnecessary re-renders.
   - Memoization of expensive calculations and component re-renders using `useMemo` and `React.memo`.

6. **Responsive Design**: Using React Grid Layout for a customizable, responsive dashboard.

7. **Real-time Updates**: WebSocket integration for live detection updates.

8. **Error Handling**: Implemented retry logic for WebSocket connections and user-friendly error messages.

## Assumptions and Simplifications

1. Mock API: Using JSON Server to simulate backend API calls.
2. Limited historical data: The application assumes a finite set of historical data for simplicity.
3. Basic authentication: The current version doesn't include user authentication.

## Ideas for Future Improvements

1. Implement user authentication and role-based access control.
5. Add unit and integration tests for improved reliability.
6. Implement dark/light theme toggle.
7. Add more chart types and customization options.
8. Implement data export functionality (CSV, PDF).
9. Add support for multiple languages (i18n).
10. Improve accessibility (a11y) compliance.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
