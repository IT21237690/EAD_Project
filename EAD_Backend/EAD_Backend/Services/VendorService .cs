using Microsoft.Extensions.Options;
using MongoDB.Driver;
using EAD_Backend.Models;
using EAD_Backend.Models.DatabaseSettings;
using EAD_Backend.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EAD_Backend.Services
{
    public class VendorService : IVendorService
    {
        private readonly IMongoCollection<Vendor> _vendorCollection;

        public VendorService(IOptions<ProductsDatabaseSettings> productsDbSettings, IOptions<VendorDatabaseSettings> vendorDbSettings)
        {
            var mongoClient = new MongoClient(productsDbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(productsDbSettings.Value.DbName);
            _vendorCollection = mongoDatabase.GetCollection<Vendor>(vendorDbSettings.Value.VendorCollectionName);
        }

        // Create a new vendor
        public async Task CreateVendor(Vendor vendor)
        {
            await _vendorCollection.InsertOneAsync(vendor);
        }

        // Get all vendors for a specific customer by email
        public async Task<List<Vendor>> GetVendorsByCustomerEmail(string email)
        {
            // Filter vendors by customer email
            return await _vendorCollection.Find(v => v.CustomerEmail == email).ToListAsync();
        }


    }
}
