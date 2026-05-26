import "./MyOrders.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBuyerOrders } from "./marketplaceApi";
import { getUser } from "./testUser";
import API_BASE from "../../config";

const ORDER_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const statusClass = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "completed") return "completed";
  if (s === "cancelled") return "cancelled";
  return "pending";
};

const normalizeStatus = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "completed" || s === "cancelled" || s === "pending") return s;
  return "pending";
};

const resolveImage = (images) => {
  const img = Array.isArray(images) ? images[0] : images;
  if (!img) return null;
  if (img.startsWith("http")) return img;
  return `${API_BASE}${img}`;
};

const formatPlacedTime = (order) => {
  const raw = order?.createdAt || order?.created_at || order?.placedAt || order?.placed_at;
  if (!raw) return "Unknown time";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function MyOrders() {
  const user = getUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    fetchBuyerOrders(user.id)
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) return <main className="myOrdersPage"><p style={{ padding: "2rem" }}>Loading...</p></main>;
  if (!user) return <main className="myOrdersPage"><p style={{ padding: "2rem" }}>Please sign in to view your orders.</p></main>;

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return normalizeStatus(order.status) === activeTab;
  });

  return (
    <main className="myOrdersPage">
      <div className="myOrdersHeader">
        <h1>My Orders</h1>
        <p>Track every order you placed and its current status.</p>
      </div>

      <div className="myOrdersTabs" role="tablist" aria-label="Order status tabs">
        {ORDER_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`myOrdersTab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="myOrdersGrid">
        {filteredOrders.map((order) => {
          const img = resolveImage(order.product?.images);
          return (
            <article className="myOrderCard" key={order.id}>
              <Link to={`/marketplace/${order.productId}`} className="myOrderImgWrap">
                {img ? <img src={img} alt={order.product?.name || "Product"} /> : <div className="myOrderImgFallback">No Image</div>}
              </Link>
              <div className="myOrderInfo">
                <Link to={`/marketplace/${order.productId}`} className="myOrderTitle">
                  {order.product?.name || "Product"}
                </Link>
                <p className="myOrderMeta">Qty: {order.quantity || 1} | NGN {order.product?.price ?? "-"}</p>
                <p className="myOrderMeta">Placed: {formatPlacedTime(order)}</p>
                <p className="myOrderMeta">
                  Store:{" "}
                  {order.product?.store?.id ? (
                    <Link to={`/store/${order.product.store.id}`}>{order.product.store.name}</Link>
                  ) : (
                    order.product?.store?.name || "Unknown"
                  )}
                </p>
                <div className={`myOrderStatus ${statusClass(order.status)}`}>{order.status || "Pending"}</div>
              </div>
            </article>
          );
        })}
        {orders.length === 0 && <p className="myOrdersEmpty">You have not placed any orders yet.</p>}
        {orders.length > 0 && filteredOrders.length === 0 && (
          <p className="myOrdersEmpty">No orders in this category yet.</p>
        )}
      </section>
    </main>
  );
}
