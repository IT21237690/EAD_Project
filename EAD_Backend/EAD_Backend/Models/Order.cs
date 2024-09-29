using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EAD_Backend.Models
{
    [BsonIgnoreExtraElements]
    public class Order
    {
        [BsonId]
        [JsonIgnore] // Exclude from API input
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } // MongoDB ObjectId as string

        // Keep these properties private or simply ignore them in JSON serialization
        [JsonIgnore]
        public string CustomerEmail { get; set; }

        [JsonIgnore]
        public string CustomerAddress { get; set; }

        [JsonIgnore]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Allow this property to be set from the API input
        [Required(ErrorMessage = "ProductId is required")]
        public string ProductId { get; set; } // Reference to the product being ordered
    }
}
