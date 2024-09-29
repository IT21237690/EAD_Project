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
        [JsonIgnore] // Exclude from API input
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } // MongoDB ObjectId as string

        [Required(ErrorMessage = "ProductName is required")]
        public string ProductName { get; set; }

        public double Price { get; set; }

        public string Description { get; set; }

        [JsonIgnore]
        public bool Sold { get; set; } = false;

        [JsonIgnore]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

    }
}
