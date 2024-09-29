using Microsoft.Extensions.Options;
using MongoDB.Driver;
using EAD_Backend.Models;
using EAD_Backend.Models.DatabaseSettings;
using EAD_Backend.Services.Interfaces;

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

        // Create new product
        public async Task Create(Product newProduct)
        {
            if (newProduct == null)
                throw new ArgumentNullException(nameof(newProduct), "Product cannot be null.");

            await _productsCollection.InsertOneAsync(newProduct);
        }

        // Update product by id
        public async Task Update(string id, Product updateProduct)
        {
            var existingProduct = await GetById(id);
            if (existingProduct == null)
                throw new KeyNotFoundException("Product not found.");

            updateProduct.Id = existingProduct.Id; // Keep the original ID
            await _productsCollection.ReplaceOneAsync(x => x.Id == id, updateProduct);
        }

        // Remove product by id
        public async Task Remove(string id)
        {
            var product = await GetById(id);
            if (product == null)
                throw new KeyNotFoundException("Product not found.");

            await _productsCollection.DeleteOneAsync(x => x.Id == id);
        }

        // Placeholder for any product-related functionality like Login, if needed
        public async Task Login(string username, string password)
        {
            throw new NotImplementedException();
        }
    }
}
