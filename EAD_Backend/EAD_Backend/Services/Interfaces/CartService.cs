using EAD_Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EAD_Backend.Services.Interfaces
{
    public interface ICartService
    {
        Task AddToCart(string productId, string customerEmail);
        Task<List<Cart>> GetCartByCustomer(string customerEmail);
    }
}
