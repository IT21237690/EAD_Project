using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Identity;
using EAD_Backend.Controllers;
using EAD_Backend.Models;
using EAD_Backend.Models.DatabaseSettings;
using EAD_Backend.Services;
using EAD_Backend.Services.Interfaces;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "EAD Backend API",
        Description = "API for EAD Backend Services"
    });
});


//builder.Services.AddSingleton<ICartsService, MongoCartsService>();
//builder.Services.AddSingleton<ICategoriesService, MongoCategoriesService>();
builder.Services.AddSingleton<IUserService, UsersService>();
//builder.Services.AddSingleton<IOrdersService, MongoOrdersService>();
//builder.Services.AddSingleton<IProductsService, MongoProductsService>();
//builder.Services.AddSingleton<ISellersService, MongoSellersService>();
//builder.Services.AddSingleton<IOrderedProductService, MongoOrderedProductService>();

// Add services to the container.
//builder.Services.Configure<CartsDbSettings>(
//    builder.Configuration.GetSection("CartsDb"));
//builder.Services.Configure<CategoriesDbSettings>(
//    builder.Configuration.GetSection("CategoriesDb"));
builder.Services.Configure<UsersDatabaseSettings>(
    builder.Configuration.GetSection("UsersDb"));
//builder.Services.Configure<OrdersDbSettings>(
//    builder.Configuration.GetSection("OrdersDb"));
//var productsDbSettings = builder.Services.Configure<ProductsDbSettings>(
//    builder.Configuration.GetSection("ProductsDb"));
//builder.Services.Configure<SellersDbSettings>(
//    builder.Configuration.GetSection("SellersDb"));

builder.Services.AddControllers
        (options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true).
    AddJsonOptions(options =>
        options.JsonSerializerOptions.PropertyNamingPolicy = null);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();

    // Enable middleware to serve generated Swagger as a JSON endpoint
    app.UseSwagger();

    // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
    // specifying the Swagger JSON endpoint.
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "EAD Backend API v1");
        options.RoutePrefix = "swagger";  // Ensure this is correct
    });

}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();