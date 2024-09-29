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

        private readonly ILogger<OrderController> _logger;

        public OrderController(IOrderService orderService, IUserService usersService, ILogger<OrderController> logger)
        {
            _orderService = orderService;
            _usersService = usersService;
            _logger = logger;
        }

        // Get all orders
        [HttpGet("all")]
        public async Task<List<Order>> Get() =>
            await _orderService.Get();

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


        [Authorize(Roles = "admin")] // Change this role as needed
        [HttpPost("place")]
        public async Task<IActionResult> Post([FromBody] Order newOrder)
        {
            // Validate that only ProductId is provided
            if (string.IsNullOrEmpty(newOrder.ProductId))
            {
                return BadRequest("ProductId is required.");
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

            // Assign the email and address to the new order
            newOrder.CustomerEmail = email;
            newOrder.CustomerAddress = customer.Address; // Ensure this property exists in your Customer model

            // Proceed to create the order
            await _orderService.Create(newOrder);

            return CreatedAtAction(nameof(GetById), new { id = newOrder.Id }, newOrder);
        }



        // Update order by id
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] Order updateOrder)
        {
            var order = await _orderService.GetById(id);

            if (order is null)
            {
                return NotFound();
            }

            updateOrder.Id = order.Id; // Retain the original ID

            await _orderService.Update(id, updateOrder); // Ensure your service updates based on ID

            return NoContent();
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
    }
}
