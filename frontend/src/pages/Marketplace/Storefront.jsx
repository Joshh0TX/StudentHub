import "./Storefront.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchStore, fetchProducts, createProduct, updateProduct,
  deleteProduct, fetchStoreOrders, updateOrderStatus, updateStore,
} from "./marketplaceApi";
import { categoriesByType } from "./marketplaceData";
import { getUser } from "./testUser";

export default function Storefront() {
  const user = getUser();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [product, setProduct] = useState({
    name: "", desc: "", price: "", type: "goods", category: "Food", locations: "", images: [],
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
    const { name, value, files } = e.target;
    if (name === "images") {
      setProduct((prev) => ({ ...prev, images: Array.from(files).slice(0, 3) }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const payload = {
      name: product.name,
      description: product.desc,
      price: parseFloat(product.price),
      type: product.type,
      category: product.category,
      locations: product.locations.split(",").map((s) => s.trim()).filter(Boolean),
      images: product.images,
    };
    try {
      if (editingId) {
        const updated = await updateProduct(editingId, payload);
        if (updated.error) throw new Error(updated.error);
        setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const created = await createProduct({ ...payload, storeId: store.id });
        if (created.error) throw new Error(created.error);
        setProducts((prev) => [created, ...prev]);
      }
      setProduct({ name: "", desc: "", price: "", type: "goods", category: "Food", locations: "", images: [] });
      setEditingId(null);
      setShowProductForm(false);
    } catch (err) {
      setFormError(err.message || "Something went wrong");
    }
  };

  const closeProductForm = () => {
    setShowProductForm(false);
    setEditingId(null);
    setProduct({ name: "", desc: "", price: "", type: "goods", category: "Food", locations: "", images: [] });
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
      images: [],
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

  const handleStoreImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !store) return;
    try {
      const updated = await updateStore(store.id, { image: file });
      setStore((prev) => ({ ...prev, image: updated.image }));
    } catch (err) {
      console.error(err);
    }
  };

  const allCategories = categoriesByType[product.type] || categoriesByType.goods;
  const allProductCategories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts = categoryFilter === "all" ? products : products.filter((p) => p.category === categoryFilter);

  const storeImgUrl = store?.image
    ? (store.image.startsWith("http") ? store.image : `http://localhost:5000${store.image}`)
    : null;

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
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginTop: "0.5rem" }}>
          <label className="storeAvatarEdit" title="Change profile photo">
            <div className="storeViewAvatar" style={{ width: "72px", height: "72px", fontSize: "1.5rem", overflow: "hidden", flexShrink: 0 }}>
              {storeImgUrl
                ? <img src={storeImgUrl} alt={store?.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                : (store?.name || "S").split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
            </div>
            <div className="storeAvatarOverlay">Change photo</div>
            <input type="file" accept="image/*" onChange={handleStoreImageChange} style={{ display: "none" }} />
          </label>
          <div>
            <h1 style={{ margin: 0 }}>{store?.name || "Storefront"}</h1>
            <p style={{ margin: "0.2rem 0 0", color: "#888", fontSize: "0.9rem" }}>{store?.description || "Post products and manage your listings."}</p>
          </div>
        </div>
      </header>

      <section className="storefrontStats">
        <div className="statCard">
          <div className="statValue">{products.length}</div>
          <div className="statLabel">Products</div>
        </div>
        <div className="statCard">
          <div className="statValue">{orders.length}</div>
          <div className="statLabel">Orders</div>
        </div>
        <div className="statCard">
          <div className="statValue">{orders.filter((o) => o.status === "Pending").length}</div>
          <div className="statLabel">Pending</div>
        </div>
        <div className="statCard">
          <div className="statValue">{store?.visits ?? 0}</div>
          <div className="statLabel">Store Visits</div>
        </div>
      </section>

      <section className="storefrontGrid">
        {/* ── Products ── */}
        <section className="storefrontCard">
          <div className="storefrontCardHeader">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <h2 style={{ margin: 0 }}>Your Products</h2>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ fontSize: "0.85rem", padding: "4px 8px", borderRadius: "6px", border: "1px solid #ddd" }}
              >
                {allProductCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="addProductBtn"
              onClick={() => { if (showProductForm) { closeProductForm(); } else { setShowProductForm(true); } }}
            >
              {showProductForm ? "Close" : "+ Add Product"}
            </button>
          </div>
          <div className="productList">
            {filteredProducts.map((item) => {
              const thumb = item.images?.[0]
                ? (item.images[0].startsWith("http") ? item.images[0] : `http://localhost:5000${item.images[0]}`)
                : null;
              return (
                <div className="productRow" key={item.id}>
                  {thumb && <img src={thumb} alt={item.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />}
                  <div style={{ flex: 1 }}>
                    <div className="productName">{item.name}</div>
                    <div className="productMeta">{item.category} · ₦{item.price}</div>
                    {item.locations?.length > 0 && (
                      <div style={{ fontSize: "0.75rem", color: "#999", marginTop: "2px" }}>{item.locations.join(", ")}</div>
                    )}
                    <div style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "2px" }}>
                      {item.visits ?? 0} views
                    </div>
                  </div>
                  <div className="productActions">
                    <button type="button" className="btnOutline" onClick={() => handleEdit(item)}>Edit</button>
                    <button type="button" className="btnDanger" onClick={() => handleDelete(item.id)}>Delete</button>
                  </div>
                </div>
              );
            })}
            {filteredProducts.length === 0 && (
              <p style={{ padding: "1rem", color: "#888" }}>
                {products.length === 0 ? "No products yet. Add your first one!" : "No products in this category."}
              </p>
            )}
          </div>
        </section>

        {/* ── Product Form Modal ── */}
        {showProductForm && (
          <div className="storefrontModal" role="dialog" aria-modal="true" aria-label={editingId ? "Edit product" : "Create product"}>
            <button className="storefrontModalBackdrop" type="button" aria-label="Close" onClick={closeProductForm} />
            <div className="storefrontModalCard" role="document">
              <button className="storefrontModalClose" type="button" aria-label="Close" onClick={closeProductForm}>×</button>
              <h2>{editingId ? "Edit Product" : "Create a Product"}</h2>
              {formError && <p style={{ color: "red", fontSize: "0.85rem", padding: "0 1rem" }}>{formError}</p>}
              <div className="storefrontModalBody">
                <form className="storefrontForm" onSubmit={handleSubmit}>
                  <label>Product Name<input name="name" type="text" value={product.name} onChange={handleChange} required /></label>
                  <label>Description<textarea name="desc" rows="3" value={product.desc} onChange={handleChange} required /></label>
                  <label>Price (₦)<input name="price" type="number" step="0.01" value={product.price} onChange={handleChange} required /></label>
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
                  <label>Locations (comma separated)<input name="locations" type="text" value={product.locations} onChange={handleChange} required /></label>
                  <label>
                    Product Images (up to 3)
                    <input name="images" type="file" accept="image/*" multiple onChange={handleChange} />
                    {product.images.length > 0 && (
                      <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "4px" }}>
                        {product.images.length} image{product.images.length > 1 ? "s" : ""} selected
                      </p>
                    )}
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

        {/* ── Orders ── */}
        <section className="storefrontCard">
          <h2>Orders</h2>
          <div className="orderList">
            {orders.map((order) => (
              <div className="orderRow" key={order.id}>
                <div style={{ flex: 1 }}>
                  <div className="orderTitle">{order.product?.name || "Product"}</div>
                  <div className="orderMeta">
                    {order.buyer?.name || "Buyer"} · {order.location || "No location"} · Qty: {order.quantity}
                  </div>
                  {order.note && <div className="noteMeta" style={{ fontStyle: "italic", color: "#888", fontSize: "0.8rem" }}>"{order.note}"</div>}
                  {order.deliveryTime && <div style={{ fontSize: "0.78rem", color: "#aaa" }}>Delivery: {order.deliveryTime}</div>}
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
