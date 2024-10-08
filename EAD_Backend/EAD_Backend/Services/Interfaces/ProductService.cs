/*
 * File name : ProductService.cs
 * Author - Tissera H.M.V.
 * Discription - Product Service Class
*/

using EAD_Backend.Models;

namespace EAD_Backend.Services.Interfaces;

public interface IProductService
{
    // Get all products
    Task<List<Product>> Get();

    // Get product by id
    Task<Product?> GetById(string id);

    // Update product by id
    Task Update(string id, ProductDto updateProductDto);

    // Create new product using ProductDto
    Task Create(ProductDto newProductDto);

    // Remove product by id
    Task Remove(string id);
    Task Update(string id, Product product);
}
