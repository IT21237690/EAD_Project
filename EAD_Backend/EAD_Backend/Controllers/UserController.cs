using Microsoft.AspNetCore.Mvc;
using EAD_Backend.Models;
using EAD_Backend.Services;
using EAD_Backend.Services.Interfaces;


namespace EAD_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            try
            {
                // Call the Login method in UsersService which returns the JWT token
                var token = await _userService.Login(loginRequest.Email, loginRequest.Password);

                if (token == null)
                {
                    return Unauthorized("Invalid credentials");
                }

                return Ok(new { Token = token });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid credentials");
            }
        }

        // Get all users
        [HttpGet("all")]
        public async Task<List<User>> Get()
        {
            var users = await _userService.Get();
            return users;
        }

        // Get user by email
        [HttpGet("email/{email}")]
        public async Task<ActionResult<User>> GetByEmail(string email)
        {
            var user = await _userService.GetByEmail(email);

            if (user is null)
            {
                return NotFound();
            }

            return user;
        }

        // Create new user
        [HttpPost("add")]
        public async Task<IActionResult> Post([FromBody] User newUser)
        {
            Random rnd = new Random();
            int year = rnd.Next(1950, 2005);
            int month = rnd.Next(1, 13);
            int day = rnd.Next(1, 28);

            await _userService.Create(newUser);

            return CreatedAtAction(nameof(GetByEmail), new { email = newUser.Email }, newUser);
        }

        // Update user by email
        [HttpPut("update/{email}")]
        public async Task<IActionResult> Update(string email, User updateUser)
        {
            var user = await _userService.GetByEmail(email);

            if (user is null)
            {
                return NotFound();
            }

            updateUser.Id = user.Id; // Retain the original ID

            await _userService.Update(email, updateUser); // Ensure your service updates based on email

            return NoContent();
        }

        // Delete user by email
        [HttpDelete("delete/{email}")]
        public async Task<IActionResult> Delete(string email)
        {
            var user = await _userService.GetByEmail(email);

            if (user is null)
            {
                return NotFound();
            }

            await _userService.Remove(user.Email); // Assuming you still need the ID to remove

            return NoContent();
        }
    }

}