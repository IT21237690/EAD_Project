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

namespace EAD_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
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
        [Authorize(Roles = "vendor")]
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
        [Authorize(Roles = "vendor")]
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
        [Authorize(Roles = "vendor")]
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

    }
}
