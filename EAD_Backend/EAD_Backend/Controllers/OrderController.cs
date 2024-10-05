using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using EAD_Backend.Models;
using EAD_Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using EAD_Backend.Services;
using System.Security.Claims;

namespace EAD_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        private readonly IUserService _usersService;

        private readonly IProductService _productsService;

        private readonly ILogger<OrderController> _logger;

        public OrderController(IOrderService orderService, IUserService usersService, IProductService productsService, ILogger<OrderController> logger)
        {
            _orderService = orderService;
            _usersService = usersService;
            _productsService = productsService;
            _logger = logger;
        }

        [Authorize(Roles = "admin")]
        // Get all orders
        [HttpGet("all")]
        public async Task<List<OrderDto>> Get()
        {
            var orders = await _orderService.Get();

            // Map Order to OrderDto
            var orderDtos = orders.Select(order => new OrderDto
            {
                Id = order.Id,
                Quantity = order.Quantity,
                CustomerEmail = order.CustomerEmail,
                CustomerAddress = order.CustomerAddress,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                CreatedDate = order.CreatedDate,
                ProductId = order.ProductId
            }).ToList();

            return orderDtos;
        }

        // Get order by id
        [HttpGet("id/{id}")]
        public async Task<ActionResult<Order>> GetById(string id)
        {
            var order = await _orderService.GetById(id);

            if (order is null)
            {
                return NotFound();
            }

            return order;
        }


        [HttpPost("place")]
        public async Task<IActionResult> Post([FromBody] Order newOrder)
        {
            // Validate that only ProductId is provided
            if (string.IsNullOrEmpty(newOrder.ProductId))
            {
                return BadRequest("ProductId is required.");
            }

            // Validate that quantity is provided
            if (newOrder.Quantity <= 0)
            {
                return BadRequest("Quantity must be greater than zero.");
            }

            // Get email from the authenticated user using claims
            var emailClaim = User.FindFirst(ClaimTypes.Email); // Use ClaimTypes.Email to get the email claim
            var email = emailClaim?.Value; // This will give you the email or null if not found

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email not found in the token.");
            }

            // Fetch customer details (including address) from the database
            var customer = await _usersService.GetByEmail(email);

            if (customer == null)
            {
                return NotFound("Customer not found.");
            }

            // Get product details to calculate total amount
            var product = await _productsService.GetById(newOrder.ProductId);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            // Assign the email and address to the new order
            newOrder.CustomerEmail = email;
            newOrder.CustomerAddress = customer.Address; // Ensure this property exists in your Customer model

            // Calculate the total amount
            newOrder.TotalAmount = product.Price * newOrder.Quantity; // Assuming Price is a decimal property in the Product model

            // Proceed to create the order
            await _orderService.Create(newOrder);

            return CreatedAtAction(nameof(GetById), new { id = newOrder.Id }, newOrder);
        }




        [HttpPut("update-quantity/{id}")]
        public async Task<IActionResult> UpdateOrderQuantity(string id, [FromBody] int quantity)
        {
            // Validate that quantity is positive
            if (quantity <= 0)
            {
                return BadRequest("Quantity must be greater than zero.");
            }

            try
            {
                // Call the service method to update the order quantity
                await _orderService.UpdateOrderQuantity(id, quantity);
                return Ok(new { message = "Order quantity and total amount updated successfully." });
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Order not found.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }




        // Cancel order by id
        [HttpDelete("cancel/{id}")]
        public async Task<IActionResult> Cancel(string id)
        {
            var order = await _orderService.GetById(id);

            if (order is null)
            {
                return NotFound();
            }

            await _orderService.Cancel(order.Id); // Assuming you need the ID to cancel

            return NoContent();
        }


        [Authorize(Roles = "admin")] // Ensure only admins can access this route
        [HttpPut("{id}/status/{status}")]
        public async Task<IActionResult> UpdateOrderStatus(string id, string status)
        {
            // Validate status input
            if (string.IsNullOrEmpty(status) ||
                (status != "dispatched" && status != "delivered"))
            {
                return BadRequest("Status must be either 'dispatched' or 'delivered'.");
            }

            // Fetch the existing order by ID
            var existingOrder = await _orderService.GetById(id);
            if (existingOrder == null)
            {
                return NotFound("Order not found.");
            }

            // Update the status of the existing order
            existingOrder.Status = status;

            // Call the Update method in the service to update the order
            await _orderService.UpdateStatus(id, existingOrder);

            // Return a success message with the updated order status
            return Ok(new { message = "Order status updated successfully.", status = existingOrder.Status });
        }

        // Get orders by user email
        [HttpGet("cutomerOrders")]
        public async Task<IActionResult> GetOrdersByCustomerEmail()
        {
            // Get email from the authenticated user using claims
            var emailClaim = User.FindFirst(ClaimTypes.Email);
            var email = emailClaim?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email not found in the token.");
            }

            var orders = await _orderService.GetOrdersByCustomerEmail(email);

            if (orders == null || !orders.Any())
            {
                return NotFound("No orders found for this customer.");
            }

            // Return only the specified fields for each order
            var orderResponse = orders.Select(order => new
            {
                order.Id,
                order.Quantity,
                order.CustomerEmail,
                order.CustomerAddress,
                order.Status,
                order.TotalAmount,
                order.CreatedDate
            });

            return Ok(orderResponse);
        }





    }
}
