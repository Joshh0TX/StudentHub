import "./ProductDetail.css";
import { useParams, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { marketplaceItems } from "./marketplaceData";

export default function ProductDetail() {
  const { productId } = useParams();
  const item = marketplaceItems.find((p) => p.id === productId);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [orderQty, setOrderQty] = useState(1);
  const [orderTime, setOrderTime] = useState("");
  const [orderLocation, setOrderLocation] = useState("");

  if (!item) {
    return <Navigate to="/marketplace" replace />;
  }

  return (
    <main className="productDetailPage">
      <div className="productDetailBreadcrumb">
        <Link to="/marketplace">Marketplace</Link>
        <span>/</span>
        <span>{item.title}</span>
      </div>

      <section className="productDetailCard">
        <div className="productDetailMedia">
          {item.image ? (
            <img src={item.image} alt={item.title} />
          ) : (
            <div className="productDetailPlaceholder">No image</div>
          )}
        </div>
        <div className="productDetailInfo">
          <div className="productDetailTags">
            <span className="marketTag">{item.type}</span>
            <span className="marketTag muted">{item.category}</span>
            {item.frequent && <span className="marketTag hot">Frequently Bought</span>}
          </div>
          <h1>{item.title}</h1>
          <p className="productDetailPrice">{item.price}</p>
          <p className="productDetailDesc">{item.desc}</p>
          <div className="productDetailMeta">
            <div>
              <div className="metaLabel">Store</div>
              <div className="metaValue">{item.storeName}</div>
            </div>
            <div>
              <div className="metaLabel">Added</div>
              <div className="metaValue">{item.added}</div>
            </div>
            <div>
              <div className="metaLabel">Orders</div>
              <div className="metaValue">{item.orders}</div>
            </div>
            <div>
              <div className="metaLabel">Visits</div>
              <div className="metaValue">{item.visits}</div>
            </div>
          </div>
          <div className="productDetailLocations">
            {item.locations.map((loc) => (
              <span className="locationChip" key={loc}>
                {loc}
              </span>
            ))}
          </div>
          <button
            className="mButton"
            type="button"
            onClick={() => setShowOrderForm((prev) => !prev)}
          >
            {showOrderForm ? "Close Order Form" : "Place Order"}
          </button>
          {showOrderForm && (
            <form className="orderForm" onSubmit={(e) => e.preventDefault()}>
              <label>
                Quantity
                <input
                  type="number"
                  min="1"
                  value={orderQty}
                  onChange={(e) => setOrderQty(e.target.value)}
                />
              </label>
              <label>
                Preferred Delivery Time
                <input
                  type="text"
                  placeholder="e.g., Today 6pm"
                  value={orderTime}
                  onChange={(e) => setOrderTime(e.target.value)}
                />
              </label>
              <label>
                Pickup / Delivery Location
                <input
                  type="text"
                  placeholder="e.g., Queen Esther Hall"
                  value={orderLocation}
                  onChange={(e) => setOrderLocation(e.target.value)}
                />
              </label>
              <label>
                Buyer Note (optional)
                <textarea
                  rows="3"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Any instructions for the seller?"
                />
              </label>
              <button type="submit" className="submitButton">
                Submit Order
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="productDetailReviews">
        <h2>Reviews</h2>
        {item.reviews?.length ? (
          <div className="reviewList">
            {item.reviews.map((review) => (
              <div className="reviewCard" key={`${review.name}-${review.text}`}>
                <div className="reviewName">{review.name}</div>
                <div className="reviewText">{review.text}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="reviewEmpty">No reviews yet.</p>
        )}
      </section>

      <section className="popularStores">
        <div className="popularHeader">
          <h2>Popular Stores</h2>
          <p>More trusted sellers you might like.</p>
        </div>
        <div className="popularGrid">
          <div className="popularCard">
            <div className="popularTitle">Gbemi’s Kitchen</div>
            <div className="popularMeta">Food · Emerald Hall</div>
            <button className="favoriteBtn">Visit Store</button>
          </div>
          <div className="popularCard">
            <div className="popularTitle">Kemi’s Beauty Bar</div>
            <div className="popularMeta">Beauty · White Hall</div>
            <button className="favoriteBtn">Visit Store</button>
          </div>
          <div className="popularCard">
            <div className="popularTitle">Simi’s Dispatch</div>
            <div className="popularMeta">Delivery · FAD Hall</div>
            <button className="favoriteBtn">Visit Store</button>
          </div>
        </div>
      </section>
    </main>
  );
}
