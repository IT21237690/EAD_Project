using UserAPI.Data;

var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<UserDatabaseSettings>(builder.Configuration.GetSection("EADDatabaseSettings"));
builder.Services.AddSingleton<UserService>();
var app = builder.Build();

/// <summary>
/// 
/// </summary>
app.MapGet("/", () => "Users API!");

/// <summary>
/// Get all movies
/// </summary>
app.MapGet("/api/users", async (UserService userService) => await userService.Get());

/// <summary>
/// Get a movie by id
/// </summary>
app.MapGet("/api/users/{id}", async (UserService userService, string id) =>
{
    var user = await userService.Get(id);
    return user is null ? Results.NotFound() : Results.Ok(user);
});

/// <summary>
/// Create a new movie
/// </summary>
app.MapPost("/api/users/add", async (UserService userService, User user) =>
{
    await userService.Create(user);
    return Results.Ok();
});

/// <summary>
/// Update a movie
/// </summary>
app.MapPut("/api/users/{id}", async (UserService userService, string id, User updatedUser) =>
{
    var user = await userService.Get(id);
    if (user is null) return Results.NotFound();

    updatedUser.Id = user.Id;
    await userService.Update(id, updatedUser);

    return Results.NoContent();
});

/// <summary>
/// Delete a movie
/// </summary>
app.MapDelete("/api/users/{id}", async (UserService userService, string id) =>
{
    var user = await userService.Get(id);
    if (user is null) return Results.NotFound();

    await userService.Remove(user.Id);

    return Results.NoContent();
});

app.Run();