/*
 * File name : ProductController.cs
 * Author - Tissera H.M.V.
 * Discription - Product Controller class
*/



using Microsoft.AspNetCore.Mvc;
using EAD_Backend.Models;
using EAD_Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.IO;
using System.Threading.Tasks;
using EAD_Backend.Services;
using System.Security.Claims;

namespace EAD_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ICartService _cartService;

        public ProductController(IProductService productService, ICartService cartService)
        {
            _productService = productService;
            _cartService = cartService;
        }

        // Get all products
        [HttpGet("all")]
        public async Task<List<Product>> Get() =>
            await _productService.Get();

        // Get product by id
        [HttpGet("id/{id}")]
        public async Task<ActionResult<Product>> GetById(string id)
        {
            var product = await _productService.GetById(id);

            if (product is null)
            {
                return NotFound();
            }

            return product;
        }

        // Create new product
        [HttpPost("add")]
        [Authorize(Roles = "vendor,admin")]
        public async Task<IActionResult> AddProduct([FromForm] ProductDto productDto)
        {
            if (productDto == null || productDto.Image == null)
            {
                return BadRequest("Product data or image is missing.");
            }

            // Save the product to the database using the ProductService
            await _productService.Create(productDto);

            return Ok(new { message = "Product added successfully." });
        }

        // Update product by id
        [Authorize(Roles = "vendor,admin")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateProduct(string id, [FromForm] ProductDto productDto)
        {
            var existingProduct = await _productService.GetById(id);

            if (existingProduct == null)
            {
                return NotFound();
            }

            await _productService.Update(id, productDto);

            return NoContent();
        }

        // Delete product by id
        [Authorize(Roles = "vendor,admin")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var product = await _productService.GetById(id);

            if (product is null)
            {
                return NotFound();
            }

            await _productService.Remove(product.Id);

            return NoContent();
        }

        // Add to Cart API
        [HttpPost("add-to-cart/{productId}")]
        [Authorize]
        public async Task<IActionResult> AddToCart(string productId)
        {
            // Extract customer email from JWT token
            var customerEmail = User.FindFirst(ClaimTypes.Email);
            var email = customerEmail?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized("Customer email not found in token.");
            }

            try
            {
                await _cartService.AddToCart(productId, email);
                return Ok("Product added to cart successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("cart")]
        public async Task<IActionResult> GetCartByCustomer()
        {
            // Extract the customer email from the JWT token's claims
            var customerEmail = User.FindFirst(ClaimTypes.Email);
            var email = customerEmail?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Customer email not found in token.");
            }

            try
            {
                var cartItems = await _cartService.GetCartByCustomer(email);
                return Ok(cartItems); // Return the list of cart items
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
