/*
 * File name : VendorDatabaseSettings.cs
 * Author - Tissera H.M.V.
 * Discription - Vendor Database Settings
*/


namespace EAD_Backend.Models.DatabaseSettings;

public class VendorDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DbName { get; set; } = null!;

    public string VendorCollectionName { get; set; } = null!;
}