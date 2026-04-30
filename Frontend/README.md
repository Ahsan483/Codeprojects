# Frontend - CodeProjects

The frontend application built with **Angular 17.3**, providing a modern, responsive user interface for the CodeProjects platform.

## Tech Stack

- **Framework**: Angular 17.3
- **Language**: TypeScript 5.4
- **Build Tool**: Angular CLI 17.3.17
- **Package Manager**: npm
- **Testing**: Jasmine & Karma
- **Styling**: CSS

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Angular CLI** (optional, but recommended)

To verify installation, run:
```bash
node --version
npm --version
```

## Installation

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Development Server

Start the development server with automatic hot-reload:

```bash
npm start
```

or

```bash
ng serve
```

The application will be available at **http://localhost:4200/**

The app will automatically reload whenever you modify any source files.

## Project Structure

```
Frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts       # Root component
│   │   ├── app.component.html     # Root template
│   │   ├── app.component.css      # Root styles
│   │   ├── app.routes.ts          # Route definitions
│   │   ├── app.config.ts          # App configuration
│   ├── index.html                 # Main HTML file
│   ├── main.ts                    # Application entry point
│   ├── styles.css                 # Global styles
│   └── assets/                    # Static assets (images, etc.)
├── angular.json                   # Angular CLI configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies & scripts
```

## Available npm Scripts

- **`npm start`** - Start development server
- **`npm run build`** - Build for production (output in `dist/`)
- **`npm run watch`** - Build in watch mode with development configuration
- **`npm test`** - Run unit tests via Karma
- **`ng generate component <name>`** - Generate a new component

## Building for Production

Create an optimized production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory. This output is ready to be deployed.

## Code Generation

Generate new Angular components, services, pipes, and more:

```bash
# Generate a new component
ng generate component component-name

# Generate a new service
ng generate service service-name

# Other options: directive, pipe, guard, interface, enum, class
ng generate [schematic] [name]
```

## Running Unit Tests

Execute unit tests via Karma:

```bash
npm test
```

Tests will run in watch mode by default. Press `q` to exit.

## Connecting to Backend

The frontend communicates with the backend API. By default, the backend runs on:
- **Development**: `https://localhost:7001` or `http://localhost:5000`

Ensure the backend is running before testing API calls. The backend has CORS enabled for `http://localhost:4200`.

## Troubleshooting

**Port Already in Use**
If port 4200 is already in use, specify a different port:
```bash
ng serve --port 4300
```

**Dependencies Installation Issues**
Clear npm cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors**
Ensure you're using the correct Node.js version (v18+):
```bash
node --version
```

## Environment Configuration

Configure environment-specific variables in `src/environments/`:
- `environment.ts` - Development configuration
- `environment.prod.ts` - Production configuration

## Learning Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular CLI Documentation](https://angular.io/cli)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Contributing

Please refer to the main project [README](../README.md) for contribution guidelines.
