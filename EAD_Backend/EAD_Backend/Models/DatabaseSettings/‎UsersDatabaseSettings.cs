/*
 * File name : UserDatabaseSettings.cs
 * Author - Tissera H.M.V.
 * Discription - User Database Settings
*/

namespace EAD_Backend.Models.DatabaseSettings;

public class UsersDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DbName { get; set; } = null!;

    public string UsersCollectionName { get; set; } = null!;
}