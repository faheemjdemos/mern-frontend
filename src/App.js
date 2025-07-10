import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:8080/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({ product_name: "", price: "", stock: "" });

  useEffect(() => {
    axios.get(API_URL).then(response => setProducts(response.data));
  }, []);

  const handleEdit = (id) => setEditingId(id);
  const handleCancel = () => setEditingId(null);

  const handleSave = (id) => {
    const product = products.find(p => p.product_id === id);
    axios.put(`${API_URL}/${id}`, product).then(() => {
      setEditingId(null);
    });
  };

  const handleAdd = () => {
    const newId = products.length > 0 ? products[products.length - 1].product_id + 1 : 1;
    const productToAdd = { product_id: newId, ...newProduct };

    axios.post(API_URL, productToAdd).then(() => {
      setProducts([...products, productToAdd]);
      setNewProduct({ product_name: "", price: "", stock: "" });
    });
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      setProducts(products.filter(p => p.product_id !== id));
    });
  };

  return (
    <div className="container">
      <header>
        <h1>Product Management</h1>
      </header>

      <main>
        <h2>Product List</h2>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.product_id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                <td>
                  {editingId === product.product_id ? (
                    <input
                      value={product.product_name}
                      onChange={e => setProducts(
                        products.map(p => p.product_id === product.product_id ? { ...p, product_name: e.target.value } : p)
                      )}
                    />
                  ) : (
                    product.product_name
                  )}
                </td>
                <td>
                  {editingId === product.product_id ? (
                    <input
                      value={product.price}
                      onChange={e => setProducts(
                        products.map(p => p.product_id === product.product_id ? { ...p, price: e.target.value } : p)
                      )}
                    />
                  ) : (
                    `$${product.price}`
                  )}
                </td>
                <td>
                  {editingId === product.product_id ? (
                    <input
                      value={product.stock}
                      onChange={e => setProducts(
                        products.map(p => p.product_id === product.product_id ? { ...p, stock: e.target.value } : p)
                      )}
                    />
                  ) : (
                    product.stock
                  )}
                </td>
                <td>
                  {editingId === product.product_id ? (
                    <>
                      <button onClick={() => handleSave(product.product_id)}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(product.product_id)}>Edit</button>
                      <button onClick={() => handleDelete(product.product_id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            <tr className="even-row">
              <td>
                <input value={newProduct.product_name} onChange={e => setNewProduct({ ...newProduct, product_name: e.target.value })} />
              </td>
              <td>
                <input value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
              </td>
              <td>
                <input value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
              </td>
              <td>
                <button onClick={handleAdd}>Add</button>
              </td>
            </tr>
          </tbody>
        </table>
      </main>

      <footer>
        <p>© 2025 Product Management System</p>
      </footer>
    </div>
  );
}

export default App;