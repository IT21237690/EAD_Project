/*
 * File name : User.cs
 * Author - Tissera H.M.V.
 * Discription - User Model
*/

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
        [JsonIgnore]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("email")]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }

        public string Password { get; set; }

        public string Name { get; set; }

        public string Role { get; set; }

        [BsonIgnoreIfNull]
        public string Address { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        [BsonIgnoreIfDefault]
        public DateTime LastActiveDate { get; set; } = DateTime.UtcNow;
    }
}
