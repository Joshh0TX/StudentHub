import "./ProductDetail.css";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchProduct, fetchReviews, placeOrder, postReview } from "./marketplaceApi";
import { dummyProducts } from "./marketplaceData";
import { getUser } from "./testUser";
import API_BASE from "../../config";

const DEFAULT_PRODUCT_IMG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Crect x='150' y='90' width='100' height='80' rx='8' fill='%23d0d0d0'/%3E%3Ccircle cx='175' cy='115' r='12' fill='%23b0b0b0'/%3E%3Cpolygon points='150,170 185,130 215,155 240,125 270,170' fill='%23c0c0c0'/%3E%3Ctext x='200' y='220' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E`;

export default function ProductDetail() {
  const { productId } = useParams();
  const user = getUser();

  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

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
    setActiveImg(0);
    Promise.all([fetchProduct(productId), fetchReviews(productId)])
      .then(([productData, reviewsData]) => {
        if (!productData || productData.error) {
          const dummy = dummyProducts.find((d) => d.id === productId);
          if (dummy) setItem(dummy);
        } else {
          setItem(productData);
          setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        }
      })
      .catch(() => {
        const dummy = dummyProducts.find((d) => d.id === productId);
        if (dummy) setItem(dummy);
      })
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
  if (!item) return <main className="productDetailPage"><p style={{ padding: "2rem" }}>Product not found.</p></main>;

  const resolveImg = (img) => {
    if (!img) return null;
    if (typeof img !== "string") return img;
    if (img.startsWith("http") || img.startsWith("/assets")) return img;
    return `${API_BASE}${img}`;
  };

  const isOwnStore = user?.id && item?.store?.ownerId === user.id;

  const rawImages = item.images?.length ? item.images.map(resolveImg).filter(Boolean) : [];
  // pad to 4 slots with default image
  const images = rawImages.length > 0
    ? [...rawImages, ...Array(Math.max(0, 4 - rawImages.length)).fill(DEFAULT_PRODUCT_IMG)]
    : [DEFAULT_PRODUCT_IMG, DEFAULT_PRODUCT_IMG, DEFAULT_PRODUCT_IMG, DEFAULT_PRODUCT_IMG];

  const prev = () => setActiveImg((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveImg((i) => (i + 1) % images.length);

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
          {/* Main image with arrows */}
          <div className="productMainImgWrap">
            <img src={images[activeImg]} alt={item.name} className="productMainImg" />
            {images.length > 1 && (
              <>
                <button type="button" className="imgArrow imgArrowLeft" onClick={prev} aria-label="Previous image">‹</button>
                <button type="button" className="imgArrow imgArrowRight" onClick={next} aria-label="Next image">›</button>
              </>
            )}
          </div>
          {/* Thumbnails — clicking rotates active to that slot */}
          <div className="productDetailGallery">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${item.name} view ${idx + 1}`}
                className={`productThumb${idx === activeImg ? " productThumbActive" : ""}`}
                onClick={() => setActiveImg(idx)}
              />
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
            {!isOwnStore && (
              <button className="mButton" type="button" onClick={() => setShowOrderForm(true)}>Place Order</button>
            )}
            {!isOwnStore && (
              <button className="btnOutline" type="button" onClick={() => setShowContacts((prev) => !prev)}>
                {showContacts ? "Hide Contacts" : "Contact Seller"}
              </button>
            )}
            {isOwnStore && <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)" }}>This is your product</p>}
          </div>

          {orderSuccess && <p style={{ color: "green", fontSize: "0.9rem", marginTop: "0.5rem" }}>Order placed successfully!</p>}

          {showContacts && (
            <div className="contactPanel" style={{ marginTop: "12px" }}>
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
        </div>
      </section>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="storeModal" role="dialog" aria-modal="true" aria-label="Place order">
          <button className="storeModalBackdrop" type="button" onClick={() => setShowOrderForm(false)} />
          <div className="storeModalCard" role="document">
            <button className="storeModalClose" type="button" onClick={() => setShowOrderForm(false)}>×</button>
            <h3 className="storeModalTitle">Place Order</h3>
            <p className="storeModalSubtitle">Fill in your order details below.</p>
            <div className="storeModalBody">
              <form className="storeForm" onSubmit={handleOrderSubmit}>
                <label>Quantity<input type="number" min="1" value={orderQty} onChange={(e) => setOrderQty(e.target.value)} /></label>
                <label>Preferred Delivery Time<input type="text" placeholder="e.g., Today 6pm" value={orderTime} onChange={(e) => setOrderTime(e.target.value)} /></label>
                <label>Pickup / Delivery Location<input type="text" placeholder="e.g., Queen Esther Hall" value={orderLocation} onChange={(e) => setOrderLocation(e.target.value)} /></label>
                <label>Buyer Note (optional)<textarea rows="3" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} placeholder="Any instructions for the seller?" /></label>
                <div className="storeModalActions">
                  <button type="submit" className="submitButton" disabled={orderSubmitting}>{orderSubmitting ? "Submitting..." : "Submit Order"}</button>
                  <button type="button" className="btnOutline" onClick={() => setShowOrderForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
        {user && !isOwnStore && (
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