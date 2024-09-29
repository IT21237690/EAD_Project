using EAD_Backend.Models;

namespace EAD_Backend.Services.Interfaces
{
    public interface IOrderService
    {
        // Get all orders
        Task<List<Order>> Get();

        // Get order by id
        Task<Order?> GetById(string id);

        // Create new order
        Task Create(Order newOrder);

        // Update order by id
        Task Update(string id, Order updateOrder);

        // Cancel order by id
        Task Cancel(string id);
    }
}
