using Microsoft.Extensions.Options;
using MongoDB.Driver;
using BCrypt.Net;
using EAD_Backend.Models;
using EAD_Backend.Models.DatabaseSettings;
using EAD_Backend.Services.Interfaces;

namespace EAD_Backend.Services;

public class UsersService : IUserService
{
    private readonly IMongoCollection<User> _usersCollection;

    public UsersService(IOptions<UsersDatabaseSettings> usersDbSettings)
    {
        var mongoClient = new MongoClient(
            usersDbSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            usersDbSettings.Value.DbName);

        _usersCollection = mongoDatabase.GetCollection<User>(
            usersDbSettings.Value.UsersCollectionName);
    }

    // Get all users
    public async Task<List<User>> Get() =>
        await _usersCollection.Find(_ => true).ToListAsync();

    // Get user by email
    public async Task<User?> GetByEmail(string email) =>
        await _usersCollection.Find(x => x.Email == email).FirstOrDefaultAsync();

    // Create new user
    public async Task Create(User newUser)
    {
        newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);
        await _usersCollection.InsertOneAsync(newUser);
    }

    // Update user by email
    public async Task Update(string email, User updateUser)
    {
        // Update the user object with the ID of the existing user
        var existingUser = await GetByEmail(email);
        if (existingUser != null)
        {
            updateUser.Id = existingUser.Id; // Keep the original ID
        }
        await _usersCollection.ReplaceOneAsync(x => x.Email == email, updateUser);
    }

    // Remove user by email
    public async Task Remove(string email)
    {
        var user = await GetByEmail(email);
        if (user != null)
        {
            await _usersCollection.DeleteOneAsync(x => x.Email == email);
        }
    }

    public async Task Login(string username, string password)
    {
        throw new NotImplementedException();
    }
}
