namespace ArticleApi;

public class Article
{
    public int? Id { get; set; }
    public string Name { get; set; }
    public int Quantity { get; set; }
    public string Unit { get; set; }

    public bool IsValid()
    {
        if (this.Quantity < 0) return false;
        if (this.Unit.Length < 1) return false;
        if (this.Name.Length < 1) return false;
        
        return true;
    }
}