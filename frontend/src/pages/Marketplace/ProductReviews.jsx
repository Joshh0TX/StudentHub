import "./ProductReviews.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProduct, fetchReviews, postReview, deleteReview } from "./marketplaceApi";
import { getUser } from "./testUser";
import { StarRatingInput, StarRatingDisplay } from "./StarRating";

export default function ProductReviews() {
  const { productId } = useParams();
  const user = getUser();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchProduct(productId), fetchReviews(productId)])
      .then(([p, r]) => {
        setProduct(p);
        setReviews(Array.isArray(r) ? r : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  const isOwnProduct = user?.id && product?.store?.ownerId === user.id;
  const hasReviewed = reviews.some((r) => r.userId === user?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const newReview = await postReview(productId, { userId: user?.id, rating: reviewRating, text: reviewText || undefined });
      if (newReview.error) throw new Error(newReview.error);
      setReviews((prev) => [newReview, ...prev]);
      setReviewText("");
      setReviewRating(5);
    } catch (err) {
      setError(err.message || "Failed to post review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <main className="reviewsPage"><p style={{ padding: "2rem" }}>Loading...</p></main>;

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <main className="reviewsPage">
      <div className="reviewsBreadcrumb">
        <Link to="/marketplace">Marketplace</Link>
        <span>/</span>
        <Link to={`/marketplace/${productId}`}>{product?.name || "Product"}</Link>
        <span>/</span>
        <span>Reviews</span>
      </div>

      <div className="reviewsHeader">
        <h1>Reviews</h1>
        <span className="reviewsCount">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
        {avgRating && (
          <span className="reviewsAvg">
            <StarRatingDisplay value={Math.round(avgRating)} size="sm" />
            <span style={{ marginLeft: "6px", fontWeight: 700 }}>{avgRating}</span>
          </span>
        )}
      </div>

      {/* Write a review */}
      {user && !isOwnProduct && !hasReviewed && (
        <form className="reviewWriteForm" onSubmit={handleSubmit}>
          <label style={{ fontWeight: 600, fontSize: "0.95rem" }}>Your Rating</label>
          <StarRatingInput value={reviewRating} onChange={setReviewRating} />
          <textarea
            rows="3"
            placeholder="Share your experience... (optional)"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}
          <button type="submit" className="submitButton" disabled={submitting}>
            {submitting ? "Posting..." : "Post Review"}
          </button>
        </form>
      )}

      {/* Reviews list */}
      <div className="reviewsFullList">
        {reviews.length === 0 && <p className="reviewEmpty">No reviews yet. Be the first!</p>}
        {reviews.map((review) => (
          <div className="reviewFullCard" key={review.id}>
            <div className="reviewFullTop">
              <div className="reviewFullAvatar">
                {review.user ? `${review.user.f_name?.[0] || ""}${review.user.l_name?.[0] || ""}`.toUpperCase() : "?"}
              </div>
              <div>
                <div className="reviewFullName">
                  {review.user ? `${review.user.f_name} ${review.user.l_name}` : "Anonymous"}
                </div>
                <StarRatingDisplay value={review.rating} size="sm" />
                <div className="reviewFullDate">
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}
                </div>
              </div>
              {user?.id === review.userId && (
                <button type="button" className="reviewDeleteBtn" onClick={() => handleDelete(review.id)}>✕</button>
              )}
            </div>
            {review.text && <p className="reviewFullText">{review.text}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}
