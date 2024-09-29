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

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });

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



//builder.Services.AddSingleton<ICartsService, MongoCartsService>();
//builder.Services.AddSingleton<ICategoriesService, MongoCategoriesService>();
builder.Services.AddSingleton<IUserService, UsersService>();
builder.Services.AddSingleton<IOrderService, OrderService>();
builder.Services.AddSingleton<IProductService, ProductService>();
//builder.Services.AddSingleton<ISellersService, MongoSellersService>();
//builder.Services.AddSingleton<IOrderedProductService, MongoOrderedProductService>();

// Add services to the container.
//builder.Services.Configure<CartsDbSettings>(
//    builder.Configuration.GetSection("CartsDb"));
//builder.Services.Configure<CategoriesDbSettings>(
//    builder.Configuration.GetSection("CategoriesDb"));
builder.Services.Configure<UsersDatabaseSettings>(
    builder.Configuration.GetSection("UsersDb"));
builder.Services.Configure<ProductsDatabaseSettings>(
    builder.Configuration.GetSection("ProductsDb"));
builder.Services.Configure<OrdersDatabaseSettings>(
    builder.Configuration.GetSection("OrdersDb"));
//var productsDbSettings = builder.Services.Configure<ProductsDbSettings>(
//    builder.Configuration.GetSection("ProductsDb"));
//builder.Services.Configure<SellersDbSettings>(
//    builder.Configuration.GetSection("SellersDb"));

builder.Services.AddControllers
        (options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true).
    AddJsonOptions(options =>
        options.JsonSerializerOptions.PropertyNamingPolicy = null);


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

// Configure the HTTP request pipeline.
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

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

