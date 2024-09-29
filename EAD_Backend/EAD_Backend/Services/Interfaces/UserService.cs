using EAD_Backend.Models;

namespace EAD_Backend.Services.Interfaces;

public interface IUserService
{

    Task<List<User>> Get();


    Task<User?> GetByEmail(string email);


    Task Update(string email, User updateUser);


    Task Create(User newUser);


    Task Remove(string email);


    Task<string> Login(string email, string password);
}
