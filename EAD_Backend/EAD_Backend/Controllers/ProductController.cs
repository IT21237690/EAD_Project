using Microsoft.AspNetCore.Mvc;
using EAD_Backend.Models;
using EAD_Backend.Services;
using EAD_Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

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
        [Authorize(Roles = "admin")]
        [HttpPost("add")]
        public async Task<IActionResult> Post([FromBody] Product newProduct)
        {
            await _productService.Create(newProduct);

            return CreatedAtAction(nameof(GetById), new { id = newProduct.Id }, newProduct);
        }

        // Update product by id
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(string id, Product updateProduct)
        {
            var product = await _productService.GetById(id);

            if (product is null)
            {
                return NotFound();
            }

            updateProduct.Id = product.Id; // Retain the original ID

            await _productService.Update(id, updateProduct); // Ensure your service updates based on ID

            return NoContent();
        }

        // Delete product by id
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var product = await _productService.GetById(id);

            if (product is null)
            {
                return NotFound();
            }

            await _productService.Remove(product.Id); // Assuming you need the ID to remove

            return NoContent();
        }
    }
}
