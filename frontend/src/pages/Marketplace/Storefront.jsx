import "./Storefront.css";
import { useState } from "react";

export default function Storefront() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Rice and Chicken",
      price: "N4000",
      category: "Food",
      orders: 18,
      visits: 210,
      status: "Active",
    },
    {
      id: 2,
      name: "Drinks Pack",
      price: "N500",
      category: "Food",
      orders: 42,
      visits: 340,
      status: "Active",
    },
    {
      id: 3,
      name: "Perfume",
      price: "N25000",
      category: "Beauty",
      orders: 7,
      visits: 95,
      status: "Low stock",
    },
  ]);
  const [product, setProduct] = useState({
    name: "",
    desc: "",
    price: "",
    type: "goods",
    category: "Food",
    locations: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: product.name,
                price: product.price,
                category: product.category,
              }
            : p
        )
      );
    } else {
      const nextId = Math.max(0, ...products.map((p) => p.id)) + 1;
      setProducts((prev) => [
        {
          id: nextId,
          name: product.name,
          price: product.price,
          category: product.category,
          orders: 0,
          visits: 0,
          status: "Active",
        },
        ...prev,
      ]);
    }
    setProduct({
      name: "",
      desc: "",
      price: "",
      type: "goods",
      category: "Food",
      locations: "",
    });
    setEditingId(null);
    setShowProductForm(false);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setProduct((prev) => ({
      ...prev,
      name: item.name,
      price: item.price,
      category: item.category,
    }));
    setShowProductForm(true);
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const orders = [
    {
      id: "ORD-1021",
      item: "Rice and Chicken",
      buyer: "Ayo O.",
      location: "Emerald Hall",
      status: "Preparing",
    },
    {
      id: "ORD-1033",
      item: "Drinks Pack",
      buyer: "Tomi J.",
      location: "Queen Esther Hall",
      status: "Ready",
    },
    {
      id: "ORD-1055",
      item: "Perfume",
      buyer: "Mira K.",
      location: "White Hall",
      status: "Shipped",
    },
  ];

  const notes = [
    {
      buyer: "Gbemi O.",
      note: "Please add extra pepper, thank you!",
      item: "Rice and Chicken",
    },
    {
      buyer: "Ruth A.",
      note: "Deliver after 6pm, I have class.",
      item: "Drinks Pack",
    },
    {
      buyer: "Tunde A.",
      note: "Gift wrap if possible.",
      item: "Perfume",
    },
  ];

  const stats = [
    { label: "Store Visits", value: "1,248" },
    { label: "Orders This Week", value: "36" },
    { label: "Repeat Buyers", value: "18" },
    { label: "Avg Rating", value: "4.7" },
  ];

  return (
    <main className="storefrontPage">
      <header className="storefrontHeader">
        <h1>Storefront</h1>
        <p>Post products and manage your listings.</p>
      </header>

      <section className="storefrontStats">
        {stats.map((stat) => (
          <div className="statCard" key={stat.label}>
            <div className="statValue">{stat.value}</div>
            <div className="statLabel">{stat.label}</div>
          </div>
        ))}
      </section>

      <section className="storefrontGrid">
        <section className="storefrontCard">
          <div className="storefrontCardHeader">
            <h2>Your Products</h2>
            <button
              type="button"
              className="addProductBtn"
              onClick={() => {
                setShowProductForm((prev) => !prev);
                if (showProductForm) {
                  setEditingId(null);
                }
              }}
            >
              {showProductForm ? "Close" : "Add Product"}
            </button>
          </div>
          <div className="productList">
            {products.map((item) => (
              <div className="productRow" key={item.id}>
                <div>
                  <div className="productName">{item.name}</div>
                  <div className="productMeta">
                    {item.category} · {item.price}
                  </div>
                </div>
                <div className="productStats">
                  <span>{item.visits} visits</span>
                  <span>{item.orders} orders</span>
                  <span className="productStatus">{item.status}</span>
                </div>
                <div className="productActions">
                  <button
                    type="button"
                    className="btnOutline"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btnDanger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {showProductForm && (
          <section className="storefrontCard">
            <h2>{editingId ? "Edit Product" : "Create a Product"}</h2>
            <form className="storefrontForm" onSubmit={handleSubmit}>
              <label>
                Product Name
                <input
                  name="name"
                  type="text"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Description
                <textarea
                  name="desc"
                  rows="3"
                  value={product.desc}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Price
                <input
                  name="price"
                  type="text"
                  value={product.price}
                  onChange={handleChange}
                  required
                />
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
                <input
                  name="category"
                  type="text"
                  value={product.category}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Locations (comma separated)
                <input
                  name="locations"
                  type="text"
                  value={product.locations}
                  onChange={handleChange}
                  required
                />
              </label>
              <button type="submit">
                {editingId ? "Save Changes" : "Post Product"}
              </button>
            </form>
          </section>
        )}

        <section className="storefrontCard">
          <h2>Orders</h2>
          <div className="orderList">
            {orders.map((order) => (
              <div className="orderRow" key={order.id}>
                <div>
                  <div className="orderTitle">{order.item}</div>
                  <div className="orderMeta">
                    {order.id} · {order.buyer} · {order.location}
                  </div>
                </div>
                <span className="orderStatus">{order.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="storefrontCard">
          <h2>Buyer Notes</h2>
          <div className="noteList">
            {notes.map((note) => (
              <div className="noteRow" key={`${note.buyer}-${note.item}`}>
                <div className="noteBuyer">{note.buyer}</div>
                <div className="noteText">{note.note}</div>
                <div className="noteMeta">{note.item}</div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
