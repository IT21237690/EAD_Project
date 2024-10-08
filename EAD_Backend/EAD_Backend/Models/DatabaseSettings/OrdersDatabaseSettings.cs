
/*
 * File name : OrdersDatabaseSettings.cs
 * Author - Tissera H.M.V.
 * Discription - Order Database Settings
*/

namespace EAD_Backend.Models.DatabaseSettings
{
    public class OrdersDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DbName { get; set; } = null!;
        public string OrdersCollectionName { get; set; } = null!;
    }
}
