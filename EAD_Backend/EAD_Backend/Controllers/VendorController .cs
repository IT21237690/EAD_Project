using Microsoft.AspNetCore.Mvc;
using EAD_Backend.Models;
using EAD_Backend.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;  // Required to extract email from token

namespace EAD_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VendorController : ControllerBase
    {
        private readonly IVendorService _vendorService;

        public VendorController(IVendorService vendorService)
        {
            _vendorService = vendorService;
        }

        // POST: api/vendor/rate
        [HttpPost("rate")]
        public async Task<IActionResult> CreateVendor([FromBody] Vendor newVendor)
        {
            if (newVendor == null || string.IsNullOrEmpty(newVendor.Name))
            {
                return BadRequest("Vendor name is required.");
            }

            // Extract customer email from the token
            var emailClaim = User.FindFirst(ClaimTypes.Email);
            var email = emailClaim?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Customer email not found in the token.");
            }

            // Set the customer email in the Vendor model
            newVendor.CustomerEmail = email;

            await _vendorService.CreateVendor(newVendor);
            return CreatedAtAction(nameof(GetAllVendors), new { id = newVendor.Id }, newVendor);
        }

        // GET: api/vendor/all
        [HttpGet("all")]
        public async Task<ActionResult<List<Vendor>>> GetAllVendors()
        {
            // Extract customer email from the token
            var emailClaim = User.FindFirst(ClaimTypes.Email);
            var email = emailClaim?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Customer email not found in the token.");
            }

            // Get vendors for the specific customer
            var vendors = await _vendorService.GetVendorsByCustomerEmail(email);

            if (vendors == null || vendors.Count == 0)
            {
                return NotFound("No vendors found for this customer.");
            }

            return Ok(vendors);
        }
    }
}
