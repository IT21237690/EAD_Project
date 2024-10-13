/*
 * File name : CartDatabaseSettings.cs
 * Author - Tissera H.M.V.
 * Discription - Cart Database Settings
*/


namespace EAD_Backend.Models.DatabaseSettings;

public class CartDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DbName { get; set; } = null!;

    public string CartCollectionName { get; set; } = null!;
}