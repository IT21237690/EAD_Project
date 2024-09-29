using EAD_Backend.Models;

namespace EAD_Backend.Services.Interfaces;

public interface IProductService
{
    // Get all products
    Task<List<Product>> Get();

    // Get product by id
    Task<Product?> GetById(string id);

    // Update product by id
    Task Update(string id, Product updateProduct);

    // Create new product
    Task Create(Product newProduct);

    // Remove product by id
    Task Remove(string id);

    // Placeholder for any additional functionality (optional)
    Task Login(string username, string password);
}
