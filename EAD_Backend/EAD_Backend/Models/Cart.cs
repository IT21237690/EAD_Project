/*
 * File name : Cart.cs
 * Author - Tissera H.M.V.
 * Discription - Cart Model
*/

using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace EAD_Backend.Models
{
    public class Cart
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string ProductId { get; set; } 
        public string CustomerEmail { get; set; }
        public DateTime AddedDate { get; set; } 
    }
}

