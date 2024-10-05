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
            var product = await _productService.GetById(newOrder.ProductId)
                          ?? throw new InvalidOperationException("Product does not exist.");

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

        // Update order quantity
        public async Task<Order> UpdateOrderQuantity(string id, int newQuantity)
        {
            if (string.IsNullOrEmpty(id))
                throw new ArgumentNullException(nameof(id), "Order ID cannot be null or empty.");

            if (newQuantity <= 0)
                throw new ArgumentException("Quantity must be greater than zero.", nameof(newQuantity));

            // Retrieve the order by ID
            var order = await _ordersCollection.Find(o => o.Id == id).FirstOrDefaultAsync();
            if (order == null)
            {
                throw new KeyNotFoundException("Order not found.");
            }

            // Check if the order status is "pending"
            if (order.Status != "pending")
            {
                throw new InvalidOperationException("Order quantity can only be updated if the order status is pending.");
            }

            // Retrieve the product by ID
            var product = await _productService.GetById(order.ProductId);
            if (product == null)
            {
                throw new KeyNotFoundException("Product not found.");
            }

            // Update the order quantity
            order.Quantity = newQuantity;

            // Update the total amount based on the new quantity
            order.TotalAmount = product.Price * newQuantity;

            // Save the updated order
            await _ordersCollection.ReplaceOneAsync(o => o.Id == id, order);

            return order;
        }

        // Update order status
        public async Task UpdateStatus(string id, Order updateOrder)
        {
            var existingOrder = await GetById(id);
            if (existingOrder == null)
            {
                throw new KeyNotFoundException("Order not found.");
            }

            // Only update the status, keep other properties unchanged
            existingOrder.Status = updateOrder.Status;

            // Update the order in the database
            await _ordersCollection.ReplaceOneAsync(x => x.Id == id, existingOrder);
        }

        // Cancel order by id
        public async Task Cancel(string id)
        {
            var order = await GetById(id);
            if (order == null)
            {
                throw new KeyNotFoundException("Order not found.");
            }

            // If the order is already processed, it can't be canceled
            if (order.Status != "pending")
            {
                throw new InvalidOperationException("Only pending orders can be canceled.");
            }

            // If the order is canceled, mark the product as available again
            var product = await _productService.GetById(order.ProductId);
            if (product != null)
            {
                product.Sold = false;
                await _productService.Update(product.Id, product);
            }

            // Delete the order
            await _ordersCollection.DeleteOneAsync(x => x.Id == id);
        }

        // Get orders by customer email
        public async Task<List<Order>> GetOrdersByCustomerEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentNullException(nameof(email), "Email cannot be null or empty.");
            }

            return await _ordersCollection.Find(order => order.CustomerEmail == email).ToListAsync();
        }


    }
}
