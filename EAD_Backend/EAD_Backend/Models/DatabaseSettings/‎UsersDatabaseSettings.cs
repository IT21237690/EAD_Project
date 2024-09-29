namespace EAD_Backend.Models.DatabaseSettings;

public class UsersDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DbName { get; set; } = null!;

    public string UsersCollectionName { get; set; } = null!;
}