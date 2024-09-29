using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EAD_Backend.Models
{
    [BsonIgnoreExtraElements]
    public class User
    {
        [BsonId]
        [JsonIgnore] // Exclude from API input
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } // MongoDB ObjectId as string

        [BsonElement("email")]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; } // Email as a separate property

        public string Password { get; set; }

        public string Name { get; set; }

        public string Role { get; set; }

        [BsonIgnoreIfNull]
        public string Address { get; set; }

        [JsonIgnore]
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        [BsonIgnoreIfDefault]
        public DateTime LastActiveDate { get; set; } = DateTime.UtcNow;
    }
}
