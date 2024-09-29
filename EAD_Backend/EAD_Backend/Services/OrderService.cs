using Microsoft.Extensions.Options;
using MongoDB.Driver;
using EAD_Backend.Models;
using EAD_Backend.Models.DatabaseSettings;
using EAD_Backend.Services.Interfaces;

namespace EAD_Backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly IMongoCollection<Order> _ordersCollection;
        private readonly IProductService _productService;

        public OrderService(IOptions<OrdersDatabaseSettings> ordersDbSettings, IProductService productService)
        {
            var mongoClient = new MongoClient(ordersDbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(ordersDbSettings.Value.DbName);
            _ordersCollection = mongoDatabase.GetCollection<Order>(ordersDbSettings.Value.OrdersCollectionName);
            _productService = productService;
        }

        // Get all orders
        public async Task<List<Order>> Get() =>
            await _ordersCollection.Find(_ => true).ToListAsync();

        // Get order by id
        public async Task<Order?> GetById(string id)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentNullException(nameof(id), "Order ID cannot be null or empty.");

            return await _ordersCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        // Create new order
        public async Task Create(Order newOrder)
        {
            if (newOrder == null)
                throw new ArgumentNullException(nameof(newOrder), "Order cannot be null.");

            // Check if the product is available for ordering
            var product = await _productService.GetById(newOrder.ProductId) ?? throw new InvalidOperationException("Product does not exist.");

            // If product is sold
            if (product.Sold)
            {
                throw new InvalidOperationException($"Product '{product.Id}' has already been sold and cannot be ordered again.");
            }

            // Insert the new order
            await _ordersCollection.InsertOneAsync(newOrder);

            // Set the product's Sold property to true
            product.Sold = true;

            // Update the product in the database
            await _productService.Update(product.Id, product);
        }



        // Update order by id
        public async Task Update(string id, Order updateOrder)
        {
            var existingOrder = await GetById(id);
            if (existingOrder == null)
                throw new KeyNotFoundException("Order not found.");

            updateOrder.Id = existingOrder.Id; // Keep the original ID
            await _ordersCollection.ReplaceOneAsync(x => x.Id == id, updateOrder);
        }

        // Cancel order by id
        public async Task Cancel(string id)
        {
            var order = await GetById(id);
            if (order == null)
                throw new KeyNotFoundException("Order not found.");

            await _ordersCollection.DeleteOneAsync(x => x.Id == id);
        }
    }
}
