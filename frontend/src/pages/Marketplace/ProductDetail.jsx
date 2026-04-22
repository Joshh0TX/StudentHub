import "./ProductDetail.css";
import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchProduct, fetchReviews, placeOrder, postReview } from "./marketplaceApi";

export default function ProductDetail() {
  const { productId } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [orderQty, setOrderQty] = useState(1);
  const [orderTime, setOrderTime] = useState("");
  const [orderLocation, setOrderLocation] = useState("");
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [showContacts, setShowContacts] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProduct(productId), fetchReviews(productId)])
      .then(([productData, reviewsData]) => {
        if (!productData || productData.error) {
          setNotFound(true);
        } else {
          setItem(productData);
          setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderSubmitting(true);
    try {
      await placeOrder({ productId, buyerId: user?.id, quantity: orderQty, deliveryTime: orderTime, location: orderLocation, note: orderNote });
      setOrderSuccess(true);
      setShowOrderForm(false);
      setOrderNote(""); setOrderQty(1); setOrderTime(""); setOrderLocation("");
    } catch (err) {
      console.error(err);
    } finally {
      setOrderSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setReviewSubmitting(true);
    try {
      const newReview = await postReview(productId, { userId: user?.id, text: reviewText });
      setReviews((prev) => [...prev, newReview]);
      setReviewText("");
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <main className="productDetailPage"><p style={{ padding: "2rem" }}>Loading...</p></main>;
  if (notFound) return <Navigate to="/marketplace" replace />;

  const galleryImages = item.image ? [item.image, item.image, item.image] : [];
  const contacts = item.store?.contacts || [];

  return (
    <main className="productDetailPage">
      <div className="productDetailBreadcrumb">
        <Link to="/marketplace">Marketplace</Link>
        <span>/</span>
        <span>{item.name}</span>
      </div>

      <section className="productDetailCard">
        <div className="productDetailMedia">
          {item.image ? (
            <img src={item.image} alt={item.name} />
          ) : (
            <div className="productDetailPlaceholder">No image</div>
          )}
          <div className="productDetailGallery">
            {galleryImages.length
              ? galleryImages.map((img, idx) => (
                  <img src={img} alt={`${item.name} view ${idx + 1}`} key={`${item.id}-gallery-${idx}`} />
                ))
              : Array.from({ length: 3 }).map((_, idx) => (
                  <div className="productDetailThumbPlaceholder" key={`placeholder-${idx}`}>Image</div>
                ))}
          </div>
        </div>
        <div className="productDetailInfo">
          <div className="productDetailTags">
            <span className="marketTag">{item.type}</span>
            <span className="marketTag muted">{item.category}</span>
          </div>
          <h1>{item.name}</h1>
          <p className="productDetailPrice">₦{item.price}</p>
          <p className="productDetailDesc">{item.description}</p>
          <div className="productDetailMeta">
            <div>
              <div className="metaLabel">Store</div>
              <div className="metaValue">{item.store?.name}</div>
            </div>
            <div>
              <div className="metaLabel">Category</div>
              <div className="metaValue">{item.category}</div>
            </div>
          </div>
          <div className="productDetailLocations">
            {item.locations?.map((loc) => (
              <span className="locationChip" key={loc}>{loc}</span>
            ))}
          </div>
          <div className="productDetailActions">
            <button className="mButton" type="button" onClick={() => setShowOrderForm((prev) => !prev)}>
              {showOrderForm ? "Close Order Form" : "Place Order"}
            </button>
            <button className="btnOutline" type="button" onClick={() => setShowContacts((prev) => !prev)}>
              {showContacts ? "Hide Contacts" : "Contact Seller"}
            </button>
          </div>
          {orderSuccess && <p style={{ color: "green", fontSize: "0.9rem", marginTop: "0.5rem" }}>Order placed successfully!</p>}
          {showContacts && (
            <div className="contactPanel">
              {contacts.length ? (
                contacts.map((contact) => (
                  <div className="contactRow" key={`${contact.type}-${contact.value}`}>
                    <span className="contactType">{contact.type}</span>
                    <span className="contactValue">{contact.value}</span>
                  </div>
                ))
              ) : (
                <p className="contactEmpty">No contact info posted yet.</p>
              )}
            </div>
          )}
          {showOrderForm && (
            <form className="orderForm" onSubmit={handleOrderSubmit}>
              <label>
                Quantity
                <input type="number" min="1" value={orderQty} onChange={(e) => setOrderQty(e.target.value)} />
              </label>
              <label>
                Preferred Delivery Time
                <input type="text" placeholder="e.g., Today 6pm" value={orderTime} onChange={(e) => setOrderTime(e.target.value)} />
              </label>
              <label>
                Pickup / Delivery Location
                <input type="text" placeholder="e.g., Queen Esther Hall" value={orderLocation} onChange={(e) => setOrderLocation(e.target.value)} />
              </label>
              <label>
                Buyer Note (optional)
                <textarea rows="3" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} placeholder="Any instructions for the seller?" />
              </label>
              <button type="submit" className="submitButton" disabled={orderSubmitting}>
                {orderSubmitting ? "Submitting..." : "Submit Order"}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="productDetailReviews">
        <h2>Reviews</h2>
        {reviews.length ? (
          <div className="reviewList">
            {reviews.map((review) => (
              <div className="reviewCard" key={review.id || `${review.userId}-${review.text}`}>
                <div className="reviewName">{review.user?.name || "Anonymous"}</div>
                <div className="reviewText">{review.text}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="reviewEmpty">No reviews yet.</p>
        )}
        {user && (
          <form className="orderForm" onSubmit={handleReviewSubmit} style={{ marginTop: "1rem" }}>
            <label>
              Leave a Review
              <textarea rows="3" value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your experience..." />
            </label>
            <button type="submit" className="submitButton" disabled={reviewSubmitting || !reviewText.trim()}>
              {reviewSubmitting ? "Posting..." : "Post Review"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
