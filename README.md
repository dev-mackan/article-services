
Frontend och backend för lagerhantering av artiklar.
Tjänsten gör det möjligt att skapa, hämta, uppdatera och ta bort artiklar.
Frontend är byggd med React och Backend är byggd med .NET ASP.NET Core.

API endpoints:

```
GET     /articles
POST    /articles/{id}
PUT     /articles/{id}
DELETE  /articles/{id}
PUT     /articles/{id}/update_quantity
```

#### Installationsinstruktioner

**Backend:**

```bash
cd Artiklar-Uppgift/ArticleBackend
dotnet restore
dotnet build
dotnet run
```

Swagger: `http://localhost:5184/swagger`

**Frontend:**

```bash
cd Artiklar-Uppgift/ArticleFrontend
echo "VITE_REACT_API_URL = "http://localhost:5184"" >> .env
npm install
npm run dev
```

#### Antaganden

- "Antal" för en artikel är ett heltal
- Endpointen för uppdatering av antal tar emot ett heltal som representerar
förändringen av saldot
- Lågt saldo är ett antal lägre än 6

