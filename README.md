# Surveillance Dashboard

A real-time surveillance dashboard built with React, Vite, and TypeScript.

## Project Structure

The project is divided into three parts:

- `frontend/`: Contains the React application
- `mock-api/`: Contains a mock API with json-server
- `mock-ws/`: Contains a mock WebSocket service

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)

## Setup Instructions

### Using Docker (Recommended)

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd surveillance-dashboard
   ```

2. Build and run the Docker containers:

   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:3000

### Manual Setup (Alternative)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd surveillance-dashboard
   ```

2. Set up and start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. In a new terminal, set up and start the mock API:
   ```bash
   cd mock-api
   npm install
   npm start
   ```

4. In another terminal, set up and start the mock WebSocket service:
   ```bash
   cd mock-ws
   npm install
   npm start
   ```

5. Access the application:
   - Frontend: http://localhost:3000

## Technical Choices

- **React**: Chosen for its component-based architecture and large ecosystem.
- **TypeScript**: Adds static typing to improve code quality and developer experience.
- **Vite**: Used as a build tool for its fast development server and efficient builds.
- **React Query**: Manages server state and provides caching capabilities.
- **React Router**: Handles routing within the application.
- **React Grid Layout**: Allows for a customizable, draggable dashboard layout.
- **Recharts**: Provides responsive and customizable charts.
- **HLS.js**: Enables HLS video streaming in the browser.
- **Docker**: Ensures consistent development and deployment environments.

## Assumptions and Simplifications

- The mock API and WebSocket services simulate real-time data and events.
- User authentication and authorization are not implemented in this version.
- The dashboard layout is saved locally and not persisted to a backend.
- Video streams are simulated and not connected to real camera feeds.

## Future Improvements

1. Implement user authentication and role-based access control.
2. Add backend persistence for user preferences and dashboard layouts.
3. Integrate with real camera feeds and detection systems.
4. Implement more advanced filtering and search capabilities.
5. Add unit and integration tests for improved reliability.
6. Optimize performance for handling larger datasets.
7. Implement real-time collaboration features.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
