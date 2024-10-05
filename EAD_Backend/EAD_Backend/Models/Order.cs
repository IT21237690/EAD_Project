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

        // Changed quantity to an integer for validation and arithmetic
        [Required(ErrorMessage = "Quantity is required")]
        public int Quantity { get; set; }

        // Keep these properties private or simply ignore them in JSON serialization
        [JsonIgnore]
        public string CustomerEmail { get; set; }

        [JsonIgnore]
        public string CustomerAddress { get; set; }

        [JsonIgnore]
        public string Status { get; set; } = "pending";

        // Total amount calculated based on product price * quantity
        [JsonIgnore]
        public double TotalAmount { get; set; }

        [JsonIgnore]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Allow this property to be set from the API input
        [Required(ErrorMessage = "ProductId is required")]
        public string ProductId { get; set; } // Reference to the product being ordered
    }


    public class OrderDto
    {
        public string Id { get; set; }
        public int Quantity { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerAddress { get; set; }
        public string Status { get; set; }
        public double TotalAmount { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ProductId { get; set; }
    }


}
