/*
 * File name : Vendor.cs
 * Author - Tissera H.M.V.
 * Description - Vendor Model
*/

using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json.Serialization;

namespace EAD_Backend.Models
{
    public class Vendor
    {
        [BsonId]
        [JsonIgnore]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Name { get; set; }

        public string Rating { get; set; }

        public string Comment { get; set; }

        [JsonIgnore]
        public string CustomerEmail { get; set; }
    }
}
