/*
 * File name : ProductService.cs
 * Author - Tissera H.M.V.
 * Discription - Product Service Class
*/

using Microsoft.Extensions.Options;
using MongoDB.Driver;
using EAD_Backend.Models;
using EAD_Backend.Models.DatabaseSettings;
using EAD_Backend.Services.Interfaces;
using System.IO;

namespace EAD_Backend.Services
{
    public class ProductService : IProductService
    {
        private readonly IMongoCollection<Product> _productsCollection;

        public ProductService(IOptions<ProductsDatabaseSettings> productsDbSettings)
        {
            var mongoClient = new MongoClient(productsDbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(productsDbSettings.Value.DbName);
            _productsCollection = mongoDatabase.GetCollection<Product>(productsDbSettings.Value.ProductsCollectionName);
        }

        // Get all products
        public async Task<List<Product>> Get() =>
            await _productsCollection.Find(_ => true).ToListAsync();

        // Get product by id
        public async Task<Product?> GetById(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentNullException(nameof(id), "Product ID cannot be null or empty.");

            return await _productsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        // Create new product using ProductDto
        public async Task Create(ProductDto newProductDto)
        {
            if (newProductDto == null)
                throw new ArgumentNullException(nameof(newProductDto), "Product data cannot be null.");

            // Convert image to Base64
            string base64Image = null;
            if (newProductDto.Image != null)
            {
                using var memoryStream = new MemoryStream();
                await newProductDto.Image.CopyToAsync(memoryStream);
                base64Image = Convert.ToBase64String(memoryStream.ToArray());
            }

            var newProduct = new Product
            {
                ProductName = newProductDto.Name,
                Description = newProductDto.Description,
                Category = newProductDto.Category,
                ImageBase64 = base64Image,
                Price = newProductDto.Price,
                Sold = false,
                CreatedDate = DateTime.Now
            };

            await _productsCollection.InsertOneAsync(newProduct);
        }

        // Update product by id using ProductDto
        public async Task Update(string id, ProductDto updateProductDto)
        {
            var existingProduct = await GetById(id);
            if (existingProduct == null)
                throw new KeyNotFoundException("Product not found.");

            existingProduct.ProductName = updateProductDto.Name;
            existingProduct.Price = updateProductDto.Price;
            existingProduct.Description = updateProductDto.Description;
            existingProduct.Category = updateProductDto.Category;

            // Update image if provided
            if (updateProductDto.Image != null)
            {
                using var memoryStream = new MemoryStream();
                await updateProductDto.Image.CopyToAsync(memoryStream);
                existingProduct.ImageBase64 = Convert.ToBase64String(memoryStream.ToArray());
            }

            await _productsCollection.ReplaceOneAsync(x => x.Id == id, existingProduct);
        }

        // Remove product by id
        public async Task Remove(string id)
        {
            var product = await GetById(id);
            if (product == null)
                throw new KeyNotFoundException("Product not found.");

            await _productsCollection.DeleteOneAsync(x => x.Id == id);
        }

        public async Task Update(string id, Product updateProduct)
        {
            var existingProduct = await GetById(id);
            if (existingProduct == null)
                throw new KeyNotFoundException("Product not found.");

            updateProduct.Id = existingProduct.Id; // Keep the original ID
            await _productsCollection.ReplaceOneAsync(x => x.Id == id, updateProduct);
        }
    }
}
