/*
 * File name : Program.cs
 * Author - Tissera H.M.V.
 * Discription - Main file
*/


using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Identity;
using EAD_Backend.Controllers;
using EAD_Backend.Models;
using EAD_Backend.Models.DatabaseSettings;
using EAD_Backend.Services;
using EAD_Backend.Services.Interfaces;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy to allow all domains
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader());
});

// Add Swagger services
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
    c.OperationFilter<AddFileParametersOperationFilter>(); // Custom operation filter

    // Define the security scheme
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    // Add the Authorization requirement to all endpoints
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Register application services
builder.Services.AddSingleton<IUserService, UsersService>();
builder.Services.AddSingleton<IOrderService, OrderService>();
builder.Services.AddSingleton<IProductService, ProductService>();
builder.Services.AddSingleton<ICartService, CartService>();


builder.Services.Configure<UsersDatabaseSettings>(
    builder.Configuration.GetSection("UsersDb"));
builder.Services.Configure<ProductsDatabaseSettings>(
    builder.Configuration.GetSection("ProductsDb"));
builder.Services.Configure<OrdersDatabaseSettings>(
    builder.Configuration.GetSection("OrdersDb"));
builder.Services.Configure<CartDatabaseSettings>(
    builder.Configuration.GetSection("CartDb"));

// Configure controllers and JSON options
builder.Services.AddControllers(options =>
{
    options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
})
.AddJsonOptions(options =>
    options.JsonSerializerOptions.PropertyNamingPolicy = null);

// Add authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Secret"])),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "EAD Backend API v1");
    options.RoutePrefix = "swagger"; // or string.Empty for root
});

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// Custom operation filter for handling file parameters
public class AddFileParametersOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var parameters = operation.Parameters;

        // Iterate through all parameters in the API description
        foreach (var param in context.ApiDescription.ParameterDescriptions)
        {
            // Check if the parameter type is IFormFile
            if (param.ModelMetadata.ModelType == typeof(IFormFile))
            {
                parameters.Add(new OpenApiParameter
                {
                    Name = param.Name,
                    In = ParameterLocation.Query, // Change this line
                    Required = param.IsRequired,
                    Schema = new OpenApiSchema
                    {
                        Type = "string",
                        Format = "binary" // Indicates file upload
                    }
                });
            }
        }
    }
}
