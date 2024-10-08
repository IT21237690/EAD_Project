/*
 * File name : Product.cs
 * Author - Tissera H.M.V.
 * Discription - Products Model
*/


using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EAD_Backend.Models
{
    [BsonIgnoreExtraElements]
    public class Product
    {
        [BsonId]
      // Exclude from API input
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } // MongoDB ObjectId as string

        [Required(ErrorMessage = "ProductName is required")]
        public string ProductName { get; set; }

        public double Price { get; set; }

        public string Description { get; set; }

        public string? ImageBase64 { get; set; } // Nullable to make it optional

        [JsonIgnore]
        public bool Sold { get; set; } = false;

        [JsonIgnore]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

    }

    public class ProductDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; } // Image file
        public double Price { get; set; }
    }




}
