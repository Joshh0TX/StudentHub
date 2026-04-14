import "./StoreView.css";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { marketplaceItems } from "./marketplaceData";

export default function StoreView() {
  const { storeId } = useParams();
  const decodedStore = decodeURIComponent(storeId || "");
  const [isFavourited, setIsFavourited] = useState(false);

  const items = marketplaceItems.filter(
    (item) => item.storeName.toLowerCase() === decodedStore.toLowerCase()
  );

  const storeName = items[0]?.storeName || decodedStore || "Store";
  const totalOrders = items.reduce((sum, item) => sum + (item.orders || 0), 0);
  const totalVisits = items.reduce((sum, item) => sum + (item.visits || 0), 0);
  const topSelling = [...items].sort((a, b) => (b.orders || 0) - (a.orders || 0)).slice(0, 3);
  const storeRating = items[0]?.storeRating;
  const storeFavorites = items[0]?.storeFavorites;
  const storeReviews = items[0]?.storeReviews || [];

  return (
    <main className="storeViewPage">
      <div className="storeViewBreadcrumb">
        <Link to="/marketplace">Marketplace</Link>
        <span>/</span>
        <span>{storeName}</span>
      </div>

      <header className="storeViewHeader">
        <div className="storeViewHeaderMain">
          <div className="storeViewAvatar">
            {storeName
              .split(" ")
              .slice(0, 2)
              .map((p) => p[0])
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <h1>{storeName}</h1>
            <p className="storeViewSub">
              Trusted campus seller · Fast delivery · Great reviews
            </p>
          </div>
        </div>
        <button
          type="button"
          className={isFavourited ? "btnSecondary" : "btnOutline"}
          onClick={() => setIsFavourited((prev) => !prev)}
        >
          {isFavourited ? "Favourited" : "Favourite Store"}
        </button>
      </header>

      <section className="storeViewStats">
        <div className="storeStat">
          <div className="storeStatValue">{totalVisits}</div>
          <div className="storeStatLabel">Visits</div>
        </div>
        <div className="storeStat">
          <div className="storeStatValue">{totalOrders}</div>
          <div className="storeStatLabel">Orders</div>
        </div>
        <div className="storeStat">
          <div className="storeStatValue">{items.length}</div>
          <div className="storeStatLabel">Products</div>
        </div>
        {storeRating && (
          <div className="storeStat">
            <div className="storeStatValue">{storeRating}</div>
            <div className="storeStatLabel">Store Rating</div>
          </div>
        )}
        {storeFavorites && (
          <div className="storeStat">
            <div className="storeStatValue">{storeFavorites}</div>
            <div className="storeStatLabel">Favourites</div>
          </div>
        )}
      </section>

      <section className="storeViewSection">
        <h2>Top Selling</h2>
        <div className="storeViewGrid">
          {topSelling.map((item) => (
            <div className="storeProductCard" key={item.id}>
              {item.image && <img src={item.image} alt={item.title} />}
              <div className="storeProductInfo">
                <div className="storeProductTitle">{item.title}</div>
                <div className="storeProductMeta">
                  {item.price} · {item.orders} orders
                </div>
                <Link to={`/marketplace/${item.id}`} className="storeProductLink">
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="storeViewSection">
        <h2>All Products</h2>
        <div className="storeViewGrid">
          {items.map((item) => (
            <div className="storeProductCard" key={`all-${item.id}`}>
              {item.image && <img src={item.image} alt={item.title} />}
              <div className="storeProductInfo">
                <div className="storeProductTitle">{item.title}</div>
                <div className="storeProductMeta">
                  {item.price} · {item.category}
                </div>
                <Link to={`/marketplace/${item.id}`} className="storeProductLink">
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="storeViewSection">
        <h2>Store Reviews</h2>
        {storeReviews.length ? (
          <div className="storeReviewGrid">
            {storeReviews.map((review) => (
              <div
                className="storeReviewCard"
                key={`${review.name}-${review.text}`}
              >
                <div className="storeReviewName">{review.name}</div>
                <div className="storeReviewText">{review.text}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="storeReviewEmpty">No store reviews yet.</p>
        )}
      </section>
    </main>
  );
}
