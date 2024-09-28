using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace UserAPI.Data
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IOptions<UserDatabaseSettings> options)
        {
            var mongoClient = new MongoClient(options.Value.ConnectionString);

            _users = mongoClient.GetDatabase(options.Value.DatabaseName)
                .GetCollection<User>(options.Value.UserCollectionName);
        }

        public async Task<List<User>> Get() =>
            await _users.Find(_ => true).ToListAsync();

        public async Task<User> Get(string id) =>
            await _users.Find(m => m.Id == id).FirstOrDefaultAsync();

        public async Task Create(User newUser) =>
            await _users.InsertOneAsync(newUser);

        public async Task Update(string id, User updateUser) =>
            await _users.ReplaceOneAsync(m => m.Id == id, updateUser);

        public async Task Remove(string id) =>
            await _users.DeleteOneAsync(m => m.Id == id);
    }
}