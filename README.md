# CodeProjects

A modern full-stack web application combining a responsive Angular frontend with a robust ASP.NET Core backend. This project showcases a professional architecture for building scalable web applications with real-time communication capabilities.

## 🎯 Project Overview

CodeProjects is designed as a collaborative platform with:
- **Modern Frontend**: Built with Angular 17 for a responsive, dynamic user experience
- **Robust Backend**: Built with ASP.NET Core 10 for secure, scalable API services
- **RESTful API**: Contact management and data services via REST endpoints
- **CORS-Enabled**: Secure cross-origin communication between frontend and backend

## 🏗️ Tech Stack

### Frontend
- **Framework**: Angular 17.3
- **Language**: TypeScript 5.4
- **Build Tool**: Angular CLI 17.3.17
- **Package Manager**: npm
- **Testing**: Jasmine & Karma
- **Styling**: CSS3

### Backend
- **Framework**: ASP.NET Core 10
- **Language**: C# 13
- **Platform**: .NET 10.0
- **Build Tool**: MSBuild (via `dotnet` CLI)
- **API Documentation**: OpenAPI/Swagger

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### For Frontend Development
- **Node.js** v18.0 or higher - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### For Backend Development
- **.NET SDK 10.0** or higher - [Download](https://dotnet.microsoft.com/download)

### Verify Installation
```bash
# Check Node.js and npm
node --version
npm --version

# Check .NET SDK
dotnet --version
```

## 🚀 Quick Start

### Option 1: Run Both Services (Recommended)

**Terminal 1 - Frontend:**
```bash
cd Frontend
npm install
npm start
```
Frontend available at: **http://localhost:4200**

**Terminal 2 - Backend:**
```bash
cd Backend
dotnet build
dotnet run
```
Backend available at: **https://localhost:7001** or **http://localhost:5000**

### Option 2: Run Frontend Only
```bash
cd Frontend
npm install
npm start
```

### Option 3: Run Backend Only
```bash
cd Backend
dotnet build
dotnet run
```

## 📁 Project Structure

```
CodeProjects/
├── Frontend/                    # Angular application
│   ├── src/
│   │   ├── app/                # Application components & services
│   │   ├── assets/             # Static resources
│   │   ├── index.html          # Main HTML file
│   │   ├── main.ts             # Entry point
│   │   └── styles.css          # Global styles
│   ├── angular.json            # Angular CLI configuration
│   ├── package.json            # Dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   └── README.md               # Frontend-specific documentation
│
├── Backend/                     # ASP.NET Core API
│   ├── Program.cs              # Application startup & configuration
│   ├── CodeProjectsBackend.csproj
│   ├── CodeProjectsBackend.http  # HTTP requests for testing
│   ├── appsettings.json        # App configuration
│   ├── appsettings.Development.json
│   ├── bin/                    # Compiled binaries
│   ├── obj/                    # Build artifacts
│   └── Properties/
│       └── launchSettings.json # Launch profiles
│
└── README.md                   # This file
```

## 🔌 API Endpoints

### Contact Form
- **Endpoint**: `POST /api/contact`
- **Description**: Submit a contact request
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```
- **Response**: 
```json
{
  "message": "Message received successfully. We will get back to you soon!"
}
```

### OpenAPI Documentation
When running the backend in development mode, access API documentation at:
- **http://localhost:5000/openapi/v1.json** (OpenAPI spec)

## 🔄 Communication Between Frontend & Backend

The frontend communicates with the backend through HTTP requests:
- Frontend runs on **port 4200**
- Backend runs on **port 5000** (HTTP) or **port 7001** (HTTPS)
- CORS is configured to allow requests from the frontend to the backend
- Base API URL: `https://localhost:7001/api` or `http://localhost:5000/api`

## 👨‍💻 Development Workflow

### Frontend Development

Navigate to the Frontend directory and start development:
```bash
cd Frontend
npm install        # Install dependencies (first time only)
npm start          # Start dev server with hot-reload
npm run build      # Build for production
npm test           # Run tests
```

**Available Commands**:
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm run watch` - Build in watch mode
- `npm test` - Run unit tests
- `ng generate component <name>` - Generate new component

**Create a New Component**:
```bash
ng generate component components/my-component
```

### Backend Development

Navigate to the Backend directory and start development:
```bash
cd Backend
dotnet build       # Build the project
dotnet run         # Run the application
dotnet watch run   # Run with file watching
dotnet test        # Run tests (if test project exists)
```

**Available Commands**:
- `dotnet build` - Compile the project
- `dotnet run` - Run the application
- `dotnet watch run` - Run with automatic restart on file changes
- `dotnet clean` - Remove build artifacts
- `dotnet test` - Run unit tests

## 🐛 Troubleshooting

### Frontend Issues

**Port 4200 Already in Use**
```bash
ng serve --port 4300
```

**Dependencies Not Installing**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Module Not Found Errors**
Ensure all dependencies are installed:
```bash
npm install
```

### Backend Issues

**Build Fails with AppHost Error**
If you encounter `Access to the path 'apphost.exe' is denied`:
1. The file may be locked by antivirus software
2. Solution: Add `<UseAppHost>false</UseAppHost>` to `CodeProjectsBackend.csproj` (temporary fix)
3. Permanent fix: Exclude `obj/` and `bin/` directories from antivirus scanning

**Port Already in Use**
Check which process is using the port and terminate it, or modify `launchSettings.json`

**HTTPS Certificate Issues**
For development, you can ignore HTTPS certificate warnings or generate a development certificate:
```bash
dotnet dev-certs https --trust
```

## 📦 Building for Production

### Frontend Production Build
```bash
cd Frontend
npm run build
# Output will be in dist/ directory
# Deploy dist/ directory to a web server
```

### Backend Production Build
```bash
cd Backend
dotnet publish -c Release -o ./publish
# Output will be in Backend/publish/ directory
# Deploy the publish directory to your server
```

## 🤝 Contributing

### Guidelines

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the existing code style and conventions
   - Write meaningful commit messages
   - Keep commits focused and atomic

3. **Test Your Changes**
   - Frontend: `npm test`
   - Backend: `dotnet test` or `dotnet build`

4. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Ensure all tests pass

### Code Standards

- **Frontend**: Follow Angular style guide and TypeScript best practices
- **Backend**: Follow C# naming conventions and .NET guidelines
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and single-responsibility

### Commit Message Format
```
type: subject

body (optional)
footer (optional)
```

Example:
```
feat: add contact form validation
body: Implements email and name validation on contact form submission
fix: resolve CORS header issue with backend
```

## 📚 Documentation

For detailed information about each part of the project:
- **Frontend Details**: See [Frontend/README.md](Frontend/README.md)
- **Backend Details**: See [Backend/README.md](Backend/README.md) (if available)

## 🔗 Useful Links

- [Angular Documentation](https://angular.io/docs)
- [Angular CLI Documentation](https://angular.io/cli)
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [C# Documentation](https://docs.microsoft.com/en-us/dotnet/csharp/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📧 Support

For questions or issues, please:
1. Check existing issues on the repository
2. Create a new issue with detailed description
3. Include error messages, logs, and steps to reproduce

---

**Last Updated**: April 2026
**Version**: 1.0.0

Happy coding! 🎉
