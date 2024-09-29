using Microsoft.Extensions.Options;
using MongoDB.Driver;
using BCrypt.Net;
using EAD_Backend.Models;
using EAD_Backend.Models.DatabaseSettings;
using EAD_Backend.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EAD_Backend.Services;

public class UsersService : IUserService
{
    private readonly IMongoCollection<User> _usersCollection;
    private readonly IConfiguration _configuration;

    public UsersService(IOptions<UsersDatabaseSettings> usersDbSettings, IConfiguration configuration)
    {
        var mongoClient = new MongoClient(usersDbSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(usersDbSettings.Value.DbName);
        _usersCollection = mongoDatabase.GetCollection<User>(usersDbSettings.Value.UsersCollectionName);
        _configuration = configuration;
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


    public async Task<string> Login(string email, string password)
    {
        // 1. Check if the user exists
        var user = await _usersCollection.Find(x => x.Email == email).FirstOrDefaultAsync();
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        // 2. Create JWT Token
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]); // Secret key from appsettings.json

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role) // Assuming Role is a string in your User class
        }),
            Expires = DateTime.UtcNow.AddDays(1), // Token expiration set to 24 hours
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token); // Return the generated token
    }

}
