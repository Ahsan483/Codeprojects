# Backend - CodeProjects

The backend API service built with **ASP.NET Core 10**, providing secure and scalable REST endpoints for the CodeProjects platform.

## Tech Stack

- **Framework**: ASP.NET Core 10
- **Language**: C# 13
- **Platform**: .NET 10.0
- **Build Tool**: dotnet CLI (MSBuild)
- **Package Manager**: NuGet
- **API Documentation**: OpenAPI/Swagger

## Prerequisites

Before you begin, ensure you have the following installed:

- **.NET SDK 10.0** or higher - [Download](https://dotnet.microsoft.com/download)
- **Visual Studio 2022** or **Visual Studio Code** (optional, recommended)

To verify installation, run:
```bash
dotnet --version
```

## Installation

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Restore NuGet packages:
```bash
dotnet restore
```

3. Build the project:
```bash
dotnet build
```

## Running the Development Server

Start the development server:

```bash
dotnet run
```

The API will be available at:
- **HTTP**: `http://localhost:5000`
- **HTTPS**: `https://localhost:7001`

### Watch Mode (Auto-Reload)

For automatic restart when files change:

```bash
dotnet watch run
```

## Project Structure

```
Backend/
├── Program.cs                          # Application entry point & configuration
├── CodeProjectsBackend.csproj         # Project file
├── CodeProjectsBackend.http           # HTTP request examples for testing
├── appsettings.json                   # Default configuration
├── appsettings.Development.json       # Development-specific configuration
├── Properties/
│   └── launchSettings.json            # Launch profiles (ports, environment)
├── bin/                               # Compiled binaries (generated)
├── obj/                               # Build artifacts (generated)
└── [Models/Controllers - as you add them]
```

## Configuration

### appsettings.json
Contains default application settings:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

### appsettings.Development.json
Development-specific settings (overrides defaults):
- Enables detailed error messages
- Debug logging enabled
- More verbose output

### Launch Settings (Properties/launchSettings.json)
Defines port configuration and environment profiles:
- **Development Profile**: Runs on `https://localhost:7001` and `http://localhost:5000`
- Enables CORS for Angular frontend at `http://localhost:4200` and `http://localhost:4300`

## 🔌 API Endpoints

### Contact Form Endpoint
- **Method**: `POST`
- **Route**: `/api/contact`
- **Description**: Submit a contact request

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I have a question about your platform."
}
```

**Success Response** (200 OK):
```json
{
  "message": "Message received successfully. We will get back to you soon!"
}
```

**Error Response** (400 Bad Request):
```json
{
  "message": "Name and Email are required."
}
```

### OpenAPI/Swagger Documentation
When running in development mode, OpenAPI documentation is available at:
- **Spec JSON**: `http://localhost:5000/openapi/v1.json`

## 🔐 CORS Configuration

CORS is configured to allow requests from the Angular frontend:
- **Allowed Origins**: `http://localhost:4200`, `http://localhost:4300`
- **Allowed Methods**: Any (`*`)
- **Allowed Headers**: Any (`*`)

This enables the frontend to make API calls without cross-origin restrictions during development.

## 🛠️ Available Commands

### Build
```bash
dotnet build
```
Compiles the project and dependencies.

### Run
```bash
dotnet run
```
Builds and runs the application.

### Watch Mode
```bash
dotnet watch run
```
Runs the application with file watching; automatically restarts on changes.

### Clean
```bash
dotnet clean
```
Removes build artifacts and compiled binaries.

### Publish
```bash
dotnet publish -c Release
```
Creates a production-ready build.

### Add Package
```bash
dotnet add package PackageName
```
Installs a NuGet package.

## 📝 Development Workflow

### Creating New API Endpoints

1. **Define Models** (if needed):
```csharp
public class YourModel
{
    public string Property { get; set; }
}
```

2. **Create Endpoint in Program.cs**:
```csharp
app.MapPost("/api/your-endpoint", ([FromBody] YourModel request) =>
{
    // Your logic here
    return Results.Ok(new { /* response */ });
})
.WithName("YourEndpointName");
```

3. **Organize with Controllers** (recommended for larger projects):
Create a `Controllers` folder and implement controllers inheriting from `ControllerBase`.

### Testing Endpoints

Use the included `CodeProjectsBackend.http` file to test endpoints:
```http
POST http://localhost:5000/api/contact
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "message": "This is a test message"
}
```

You can test HTTP requests directly in:
- **Visual Studio Code** (with REST Client extension)
- **Postman** or **Insomnia**
- **curl** command line

## 🐛 Troubleshooting

### Build Fails with "apphost.exe" Access Denied

**Cause**: Antivirus or security software blocking file access

**Solution**:
1. Temporarily disable antivirus
2. Or add to `CodeProjectsBackend.csproj`:
```xml
<UseAppHost>false</UseAppHost>
```
3. Permanent fix: Exclude `obj/` and `bin/` directories from antivirus scanning

### Port Already in Use

Modify `Properties/launchSettings.json`:
```json
"applicationUrl": "https://localhost:7002;http://localhost:5001"
```

### HTTPS Certificate Issues

Generate a development certificate:
```bash
dotnet dev-certs https --trust
```

### NuGet Package Restoration Issues

Clear the NuGet cache:
```bash
dotnet nuget locals all --clear
dotnet restore
```

## 🚀 Deployment

### Publish for Production

```bash
dotnet publish -c Release -o ./publish
```

This creates a self-contained or framework-dependent deployment package in the `publish/` directory.

### Environment Setup

Before deployment, ensure:
1. Set environment to `Production` (not `Development`)
2. Update `appsettings.Production.json` with production settings
3. Configure CORS for production domain
4. Update database connection strings (when applicable)

## 📚 Learning Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [C# Documentation](https://docs.microsoft.com/en-us/dotnet/csharp/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/) (for database operations)
- [Dependency Injection in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection)

## 🤝 Contributing

### Code Standards

1. **Follow C# Naming Conventions**
   - Classes and methods: `PascalCase`
   - Variables and parameters: `camelCase`
   - Constants: `UPPER_CASE` or `PascalCase`

2. **Use Async/Await**
   - Prefer async endpoints for scalability
   - Use `async Task` or `async ValueTask` for operations

3. **Error Handling**
   - Always validate input
   - Return appropriate HTTP status codes
   - Log errors appropriately

4. **Documentation**
   - Add XML comments to public methods
   - Use meaningful names
   - Document complex logic

### Example Endpoint with Comments

```csharp
/// <summary>
/// Processes a contact form submission
/// </summary>
/// <param name="request">Contact form request data</param>
/// <returns>Success or error message</returns>
app.MapPost("/api/contact", ([FromBody] ContactRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email))
    {
        return Results.BadRequest(new { Message = "Name and Email are required." });
    }

    // Process the contact request
    Console.WriteLine($"New contact: {request.Name} ({request.Email})");

    return Results.Ok(new { Message = "Message received successfully." });
})
.WithName("SubmitContact");
```

## 📋 Current Features

- ✅ Contact form API
- ✅ CORS support for Angular frontend
- ✅ OpenAPI documentation
- ✅ Development configuration

## 🔮 Future Enhancements

- Database integration (Entity Framework Core)
- Authentication & Authorization
- Email notifications
- Logging & Monitoring
- API versioning
- Unit tests

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review error messages carefully
3. Create a GitHub issue with detailed information
4. Include error logs and reproduction steps

---

**Last Updated**: April 2026
**Version**: 1.0.0
**Framework**: .NET 10.0
