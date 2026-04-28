using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200", "http://localhost:4300")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngularApp");

// Contact API
app.MapPost("/api/contact", ([FromBody] ContactRequest request) =>
{
    // In a real app, you would send an email or save to a database here.
    // For now, we just return a success response.
    if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email))
    {
        return Results.BadRequest(new { Message = "Name and Email are required." });
    }

    // Simulate saving or emailing
    Console.WriteLine($"New contact request from: {request.Name} ({request.Email}) - Message: {request.Message}");

    return Results.Ok(new { Message = "Message received successfully. We will get back to you soon!" });
})
.WithName("ContactForm");

app.Run();

// Contact Request Model
public class ContactRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
