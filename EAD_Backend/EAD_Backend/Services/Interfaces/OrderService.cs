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

        // Update order quantity by id (only if status is pending)
        Task<Order> UpdateOrderQuantity(string id, int newQuantity);

        // Update status of an order by id
        Task UpdateStatus(string id, Order updateOrder);

        // Cancel order by id (only if status is pending)
        Task Cancel(string id);

        Task<List<Order>> GetOrdersByCustomerEmail(string email);

    }
}
