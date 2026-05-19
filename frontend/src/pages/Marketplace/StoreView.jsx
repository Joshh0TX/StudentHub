import "./StoreView.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchFavourites, toggleFavourite, fetchStoreById } from "./marketplaceApi";
import { getUser } from "./testUser";
import API_BASE from "../../config";

const DEFAULT_PRODUCT_IMG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Crect x='150' y='90' width='100' height='80' rx='8' fill='%23d0d0d0'/%3E%3Ccircle cx='175' cy='115' r='12' fill='%23b0b0b0'/%3E%3Cpolygon points='150,170 185,130 215,155 240,125 270,170' fill='%23c0c0c0'/%3E%3Ctext x='200' y='220' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E`;

export default function StoreView() {
  const { storeId } = useParams();
  const decodedStore = decodeURIComponent(storeId || "");
  const user = getUser();

  const [items, setItems] = useState([]);
  const [storeData, setStoreData] = useState(null);
  const [isFavourited, setIsFavourited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchStoreById(decodedStore)
      .then((store) => {
        if (store && !store.error) {
          setStoreData(store);
          setItems(store.products || []);
          if (user) {
            fetchFavourites(user.id)
              .then((favs) => setIsFavourited(favs.some((f) => f.id === store.id)))
              .catch(console.error);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [decodedStore]);

  const handleToggleFavourite = async () => {
    if (!user || !storeData) return;
    try {
      const res = await toggleFavourite(storeData.id, user.id);
      setIsFavourited(res.favourited);
    } catch (err) {
      console.error(err);
    }
  };

  const getImgSrc = (images) => {
    const img = Array.isArray(images) ? images[0] : images;
    if (!img) return DEFAULT_PRODUCT_IMG;
    return img.startsWith("http") ? img : `${API_BASE}${img}`;
  };

  if (loading) return <main className="storeViewPage"><p style={{ padding: "2rem" }}>Loading...</p></main>;

  const storeName = storeData?.name || decodedStore || "Store";
  const storeImage = storeData?.image;
  const topSelling = [...items].sort((a, b) => (b.orders || 0) - (a.orders || 0)).slice(0, 3);

  const isOwnStore = user?.id && storeData?.ownerId === user.id;
  const categories = ["all", ...Array.from(new Set(items.map((p) => p.category).filter(Boolean)))];
  const filteredItems = categoryFilter === "all" ? items : items.filter((p) => p.category === categoryFilter);

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
            {storeImage
              ? <img src={storeImage.startsWith("http") ? storeImage : `${API_BASE}${storeImage}`} alt={storeName} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              : storeName.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
          </div>
          <div>
            <h1>{storeName}</h1>
            {storeData?.description && <p className="storeViewDesc">{storeData.description}</p>}
            <p className="storeViewStatLine">
              <strong>{storeData?.visits ?? 0}</strong> visits
              <span className="statDot"> · </span>
              <strong>{items.length}</strong> products
            </p>
            {storeData?.owner && (
              <Link
                to={`/profile/${storeData.owner.id}`}
                className="storeOwnerChip"
                title="View seller profile"
              >
                <span className="storeOwnerInitials">
                  {storeData.owner.profileImage
                    ? <img src={storeData.owner.profileImage} alt={storeData.owner.f_name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                    : `${storeData.owner.f_name[0]}${storeData.owner.l_name[0]}`}
                </span>
                <span className="storeOwnerName">{storeData.owner.f_name} {storeData.owner.l_name}</span>
              </Link>
            )}
          </div>
        </div>
        {!isOwnStore && (
          <button
            type="button"
            className="favouriteBtn"
            onClick={handleToggleFavourite}
            aria-label={isFavourited ? "Unfavourite store" : "Favourite store"}
            title={isFavourited ? "Remove from favourites" : "Add to favourites"}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill={isFavourited ? "#e53e3e" : "none"} stroke={isFavourited ? "#e53e3e" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
      </header>

      <section className="storeViewSection">
        <h2>Top Selling</h2>
        <div className="storeViewGrid">
          {topSelling.map((item) => (
            <Link to={`/marketplace/${item.id}`} className="storeProductCard storeProductCardLink" key={item.id}>
              <img src={getImgSrc(item.images)} alt={item.name} />
              <div className="storeProductInfo">
                <div className="storeProductTitle">{item.name}</div>
                <div className="storeProductMeta">₦{item.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="storeViewSection">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
          <h2 style={{ margin: 0 }}>All Products</h2>
          {categories.length > 2 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ fontSize: "0.85rem", padding: "4px 24px 4px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", appearance: "none", WebkitAppearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23717182' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", outline: "none", cursor: "pointer" }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>
              ))}
            </select>
          )}
        </div>
        <div className="storeViewGrid">
          {filteredItems.map((item) => (
            <Link to={`/marketplace/${item.id}`} className="storeProductCard storeProductCardLink" key={`all-${item.id}`}>
              <img src={getImgSrc(item.images)} alt={item.name} />
              <div className="storeProductInfo">
                <div className="storeProductTitle">{item.name}</div>
                <div className="storeProductMeta">₦{item.price} · {item.category}</div>
              </div>
            </Link>
          ))}
          {filteredItems.length === 0 && <p style={{ color: "#888" }}>No products in this category.</p>}
        </div>
      </section>
    </main>
  );
}
