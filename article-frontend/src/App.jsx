import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css';



const API_URL = import.meta.env.VITE_REACT_API_URL;

function App() {
  const [articles, setArticles] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: "", quantity: 0, unit: "" });

  const loadArticles = async () => {
    fetch(`${API_URL}/articles`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        setArticles(data);
      })
      .catch((err) => {
        alert(`Error fetching articles: ${err.message}`);
      })
  }


  const deleteArticle = async (article) => {
    const confirmed = window.confirm(`Vill du ta bort ${article.quantity} ${article.unit} ${article.name}?`);
    if (!confirmed) return;
    await fetch(`${API_URL}/articles/${article.id}`, {
      method: "DELETE",
    })
      .then(_ => {
        loadArticles();
      })
      .catch((err) => {
        alert(`Error deleting article: ${err.message}`);
      })
  };

  const updateQuantity = async (id, quantityChange) => {
    setFormData({ id: null, name: "", quantity: 0, unit: "" });
    await fetch(
      `${API_URL}/articles/${id}/update_quantity?quantityChange=${quantityChange}`,
      { method: "PUT" })
      .catch((err) => {
        alert(`Error updating article quantity: ${err.message}`);
      });
    loadArticles();
  };

  const editArticle = async (article) => {
    setFormData(article);
  };

  const saveArticle = async (e) => {
    e.preventDefault();
    const method = formData.id ? "PUT" : "POST";
    const url = formData.id
      ? `${API_URL}/articles/${formData.id}`
      : `${API_URL}/articles`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(_ => {
        setFormData({ id: null, name: "", quantity: 0, unit: "" });
        loadArticles();
      })
      .catch((err) => {
        alert(`Error saving article: ${err.message}`);
      });
  };

  useEffect(() => {
    loadArticles();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-center p-2">
        <div className="w-75">
          <h2 className="p1">Artiklar</h2>

          <div className="align-left">
            <h4>{!formData.id ? "Skapa Artikel" : "Redigera Artikel"}</h4>
            <form className="mb-3 p-2" onSubmit={saveArticle}>
              <div className="form-group row">
                <label htmlFor="name" className="col-sm-1 form-label">Namn</label>
                <div className="col-sm">
                  <input
                    type="text"
                    id="name"
                    placeholder="Ange ett namn"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="quantity" className="col-sm-1 form-label">Antal</label>
                <div className="col-sm">
                  <input
                    type="number"
                    inputMode="numeric"
                    id="quantity"
                    placeholder="Ange ett antal"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="unit" className="col-sm-1 form-label">Enhet</label>
                <div className="col-sm">
                  <input
                    type="text"
                    id="unit"
                    placeholder="Enhet"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <button className="btn btn-success btn-sm ms-2" type="submit">
                {formData.id ? "Uppdatera" : "Skapa"}
              </button>
              {formData.id && (
                <button
                  className="btn btn-secondary btn-sm ms-2"
                  onClick={() => setFormData({ id: null, name: "", quantity: 0, unit: "" })}
                  type="button"
                >
                  Avbryt
                </button>
              )}
            </form>
          </div>


          <div>
            <table className="table table-sm table-hover">
              <thead>
                <tr>
                  <th scope="col">Artnr</th>
                  <th scope="col">Namn</th>
                  <th scope="col">Antal</th>
                  <th scope="col">Enhet</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className={article.quantity <= 5 ? "table-warning" : ""}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="align-middle">{article.id}</td>
                    <td className="align-middle">{article.name}</td>
                    <td className="align-middle">
                      <button
                        className="m-1 btn btn-sm"
                        onClick={() => updateQuantity(article.id, -1)}
                      >
                        ➖
                      </button>
                      {article.quantity}
                      <button
                        className="m-1 btn btn-sm"
                        onClick={() => updateQuantity(article.id, 1)}
                      >
                        ➕
                      </button>
                    </td>
                    <td className="align-middle">{article.unit}</td>
                    <td className="align-middle">
                      <div>
                        <button
                          className="btn btn-sm"
                          onClick={() => editArticle(article)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => deleteArticle(article)}
                        >
                          ✖
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div >
      </div >
    </>
  );
}

export default App
