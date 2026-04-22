import "./Storefront.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchStore,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchStoreOrders,
  updateOrderStatus,
} from "./marketplaceApi";
import { categoriesByType } from "./marketplaceData";

export default function Storefront() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [product, setProduct] = useState({
    name: "", desc: "", price: "", type: "goods", category: "Food", locations: "",
  });

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchStore(user.id)
      .then((storeData) => {
        if (!storeData || storeData.error) return;
        setStore(storeData);
        return Promise.all([
          fetchProducts().then((all) =>
            setProducts(all.filter((p) => p.storeId === storeData.id || p.store?.id === storeData.id))
          ),
          fetchStoreOrders(storeData.id).then((o) => setOrders(Array.isArray(o) ? o : [])),
        ]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: product.name,
      description: product.desc,
      price: parseFloat(product.price),
      type: product.type,
      category: product.category,
      locations: product.locations.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        const updated = await updateProduct(editingId, payload);
        setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const created = await createProduct({ ...payload, storeId: store.id });
        setProducts((prev) => [created, ...prev]);
      }
      setProduct({ name: "", desc: "", price: "", type: "goods", category: "Food", locations: "" });
      setEditingId(null);
      setShowProductForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const closeProductForm = () => {
    setShowProductForm(false);
    setEditingId(null);
    setProduct({ name: "", desc: "", price: "", type: "goods", category: "Food", locations: "" });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setProduct({
      name: item.name,
      desc: item.description || "",
      price: String(item.price),
      type: item.type || "goods",
      category: item.category || "Food",
      locations: Array.isArray(item.locations) ? item.locations.join(", ") : (item.locations || ""),
    });
    setShowProductForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: updated.status || newStatus } : o)));
    } catch (err) {
      console.error(err);
    }
  };

  const allCategories = categoriesByType[product.type] || categoriesByType.goods;

  if (loading) return <main className="storefrontPage"><p style={{ padding: "2rem" }}>Loading...</p></main>;
  if (!user) return <main className="storefrontPage"><p style={{ padding: "2rem" }}>Please log in to manage your storefront.</p></main>;

  return (
    <main className="storefrontPage">
      <header className="storefrontHeader">
        <div className="storefrontBreadcrumb">
          <Link to="/marketplace">Marketplace</Link>
          <span>/</span>
          <span>Storefront</span>
        </div>
        <h1>{store?.name || "Storefront"}</h1>
        <p>{store?.description || "Post products and manage your listings."}</p>
      </header>

      <section className="storefrontStats">
        <div className="statCard">
          <div className="statValue">{products.length}</div>
          <div className="statLabel">Products</div>
        </div>
        <div className="statCard">
          <div className="statValue">{orders.length}</div>
          <div className="statLabel">Total Orders</div>
        </div>
      </section>

      <section className="storefrontGrid">
        <section className="storefrontCard">
          <div className="storefrontCardHeader">
            <h2>Your Products</h2>
            <button
              type="button"
              className="addProductBtn"
              onClick={() => { if (showProductForm) { closeProductForm(); } else { setShowProductForm(true); } }}
            >
              {showProductForm ? "Close" : "Add Product"}
            </button>
          </div>
          <div className="productList">
            {products.map((item) => (
              <div className="productRow" key={item.id}>
                <div>
                  <div className="productName">{item.name}</div>
                  <div className="productMeta">{item.category} · ₦{item.price}</div>
                </div>
                <div className="productStats">
                  <span className="productStatus">Active</span>
                </div>
                <div className="productActions">
                  <button type="button" className="btnOutline" onClick={() => handleEdit(item)}>Edit</button>
                  <button type="button" className="btnDanger" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </div>
            ))}
            {products.length === 0 && <p style={{ padding: "1rem", color: "#888" }}>No products yet. Add your first one!</p>}
          </div>
        </section>

        {showProductForm && (
          <div className="storefrontModal" role="dialog" aria-modal="true" aria-label={editingId ? "Edit product" : "Create product"}>
            <button className="storefrontModalBackdrop" type="button" aria-label="Close product form" onClick={closeProductForm} />
            <div className="storefrontModalCard" role="document">
              <button className="storefrontModalClose" type="button" aria-label="Close" onClick={closeProductForm}>×</button>
              <h2>{editingId ? "Edit Product" : "Create a Product"}</h2>
              <div className="storefrontModalBody">
                <form className="storefrontForm" onSubmit={handleSubmit}>
                  <label>
                    Product Name
                    <input name="name" type="text" value={product.name} onChange={handleChange} required />
                  </label>
                  <label>
                    Description
                    <textarea name="desc" rows="3" value={product.desc} onChange={handleChange} required />
                  </label>
                  <label>
                    Price
                    <input name="price" type="number" step="0.01" value={product.price} onChange={handleChange} required />
                  </label>
                  <label>
                    Type
                    <select name="type" value={product.type} onChange={handleChange}>
                      <option value="goods">Goods</option>
                      <option value="services">Services</option>
                    </select>
                  </label>
                  <label>
                    Category
                    <select name="category" value={product.category} onChange={handleChange}>
                      {allCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </label>
                  <label>
                    Locations (comma separated)
                    <input name="locations" type="text" value={product.locations} onChange={handleChange} required />
                  </label>
                  <div className="storefrontModalActions">
                    <button type="submit" className="submitButton">{editingId ? "Save Changes" : "Post Product"}</button>
                    <button type="button" className="btnOutline" onClick={closeProductForm}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <section className="storefrontCard">
          <h2>Orders</h2>
          <div className="orderList">
            {orders.map((order) => (
              <div className="orderRow" key={order.id}>
                <div>
                  <div className="orderTitle">{order.product?.name || order.productId}</div>
                  <div className="orderMeta">{order.id} · {order.buyer?.name || order.buyerId} · {order.location}</div>
                  {order.note && <div className="noteMeta">{order.note}</div>}
                </div>
                <select
                  className="orderStatus"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  {["Pending", "Preparing", "Ready", "Shipped"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            ))}
            {orders.length === 0 && <p style={{ padding: "1rem", color: "#888" }}>No orders yet.</p>}
          </div>
        </section>
      </section>
    </main>
  );
}
