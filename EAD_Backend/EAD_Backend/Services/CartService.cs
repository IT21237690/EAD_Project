using Microsoft.Extensions.Options;
using MongoDB.Driver;
using EAD_Backend.Models;
using EAD_Backend.Models.DatabaseSettings;
using EAD_Backend.Services.Interfaces;

namespace EAD_Backend.Services
{
    public class CartService : ICartService
    {
        private readonly IMongoCollection<Cart> _cartCollection;

        public CartService(IOptions<ProductsDatabaseSettings> productsDbSettings, IOptions<CartDatabaseSettings> cartDbSettings)
        {
            var mongoClient = new MongoClient(productsDbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(productsDbSettings.Value.DbName);
            _cartCollection = mongoDatabase.GetCollection<Cart>(cartDbSettings.Value.CartCollectionName);
        }

        // Add product to the cart
        public async Task AddToCart(string productId, string customerEmail)
        {
            if (string.IsNullOrEmpty(productId) || string.IsNullOrEmpty(customerEmail))
                throw new ArgumentNullException("Product ID and Customer Email are required.");

            var cartItem = new Cart
            {
                ProductId = productId,
                CustomerEmail = customerEmail,
                AddedDate = DateTime.Now
            };

            await _cartCollection.InsertOneAsync(cartItem);
        }

        // Get cart items by customer email
        public async Task<List<Cart>> GetCartByCustomer(string customerEmail)
        {
            if (string.IsNullOrEmpty(customerEmail))
                throw new ArgumentNullException("Customer Email is required.");

            return await _cartCollection.Find(x => x.CustomerEmail == customerEmail).ToListAsync();
        }
    }
}
