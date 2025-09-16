using ArticleApi;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ArticleDb>(
    opt => opt.UseInMemoryDatabase("ArticlesDb"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "ArticleAPI";
    config.Version = "v1";
    config.Title = "ArticleAPI v1";
});
var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "ArticleAPI";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });
}

app.MapGet("/articles", 
    async (ArticleDb db) => await db.Articles.ToListAsync());
app.MapGet("/articles/{id}", async (int id, ArticleDb db) => 
    await db.Articles.FindAsync(id) 
        is Article article ?  Results.Ok(article) : Results.NotFound()
    );

app.MapPost("/articles", async (Article article, ArticleDb db) =>
{
    var exists = await db.Articles.AnyAsync(a => a.Name == article.Name);
    if (exists)
    {
        return Results.Conflict( "Article name already exists.");
    }

    if (!article.IsValid()) return Results.Conflict("Invalid fields in article");
    var newArticle = new Article
    {
        Name = article.Name,
        Quantity = article.Quantity,
        Unit = article.Unit,
    };
    db.Articles.Add(newArticle);
    await db.SaveChangesAsync();
    return Results.Created($"/articles/{article.Id}", article);
});

app.MapPut("/articles/{id}", async (int id, Article inArticle, ArticleDb db) =>
{
    var article = await db.Articles.FindAsync(id);
    if (article == null) return Results.NotFound();
    if (!article.IsValid()) return Results.Conflict("Invalid fields in article");
    article.Name = inArticle.Name;
    article.Quantity = inArticle.Quantity;
    article.Unit = inArticle.Unit;
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapPut("/articles/{id}/update_quantity", async (int id, int quantityChange, ArticleDb db) =>
{
    var article = await db.Articles.FindAsync(id);
    if (article == null) return Results.NotFound();
    if (article.Quantity + quantityChange < 0) return Results.Conflict("Invalid quantity");
    
    article.Quantity += quantityChange;
    
    if (!article.IsValid()) return Results.Conflict("Invalid fields in article");
    
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/articles/{id}", async (int id, ArticleDb db) =>
{
    if (await db.Articles.FindAsync(id) is Article article)
    {
        db.Articles.Remove(article);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    return Results.NotFound();
});


app.Run();

