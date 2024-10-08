/*
 * File name : ProductsDatabaseSettings.cs
 * Author - Tissera H.M.V.
 * Discription - Products Database Settings
*/


namespace EAD_Backend.Models.DatabaseSettings;

public class ProductsDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DbName { get; set; } = null!;

    public string ProductsCollectionName { get; set; } = null!;
}