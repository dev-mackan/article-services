using Microsoft.EntityFrameworkCore;

namespace ArticleApi;

public class ArticleDb : DbContext
{
    public ArticleDb(DbContextOptions<ArticleDb> options) 
        : base(options) {}
    public DbSet<Article> Articles => Set<Article>();
}