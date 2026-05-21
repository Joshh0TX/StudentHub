import "./MyOrders.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBuyerOrders } from "./marketplaceApi";
import { getUser } from "./testUser";
import API_BASE from "../../config";

const statusClass = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "completed") return "completed";
  if (s === "cancelled") return "cancelled";
  return "pending";
};

const resolveImage = (images) => {
  const img = Array.isArray(images) ? images[0] : images;
  if (!img) return null;
  if (img.startsWith("http")) return img;
  return `${API_BASE}${img}`;
};

export default function MyOrders() {
  const user = getUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="myOrdersPage">
      <div className="myOrdersHeader">
        <h1>My Orders</h1>
        <p>Track every order you placed and its current status.</p>
      </div>

      <section className="myOrdersGrid">
        {orders.map((order) => {
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
                <p className="myOrderMeta">Qty: {order.quantity || 1} · NGN {order.product?.price ?? "-"}</p>
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
      </section>
    </main>
  );
}
