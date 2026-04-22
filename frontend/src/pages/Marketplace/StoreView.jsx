import "./StoreView.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProducts, fetchFavourites, toggleFavourite } from "./marketplaceApi";

export default function StoreView() {
  const { storeId } = useParams();
  const decodedStore = decodeURIComponent(storeId || "");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [items, setItems] = useState([]);
  const [isFavourited, setIsFavourited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((allProducts) => {
        const filtered = allProducts.filter(
          (p) => String(p.store?.id) === decodedStore || p.store?.name?.toLowerCase() === decodedStore.toLowerCase()
        );
        setItems(filtered);
        if (user && filtered.length > 0) {
          const storeIdToCheck = filtered[0].store?.id;
          if (storeIdToCheck) {
            fetchFavourites(user.id)
              .then((favs) => setIsFavourited(favs.some((f) => f.id === storeIdToCheck)))
              .catch(console.error);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [decodedStore]);

  const handleToggleFavourite = async () => {
    if (!user || items.length === 0) return;
    const storeIdToToggle = items[0]?.store?.id;
    if (!storeIdToToggle) return;
    try {
      const res = await toggleFavourite(storeIdToToggle, user.id);
      setIsFavourited(res.favourited);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <main className="storeViewPage"><p style={{ padding: "2rem" }}>Loading...</p></main>;

  const storeName = items[0]?.store?.name || decodedStore || "Store";
  const topSelling = [...items].sort((a, b) => (b.orders || 0) - (a.orders || 0)).slice(0, 3);

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
            {storeName.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
          </div>
          <div>
            <h1>{storeName}</h1>
            <p className="storeViewSub">Trusted campus seller · Fast delivery · Great reviews</p>
          </div>
        </div>
        <button
          type="button"
          className={isFavourited ? "btnSecondary" : "btnOutline"}
          onClick={handleToggleFavourite}
        >
          {isFavourited ? "Favourited" : "Favourite Store"}
        </button>
      </header>

      <section className="storeViewStats">
        <div className="storeStat">
          <div className="storeStatValue">{items.length}</div>
          <div className="storeStatLabel">Products</div>
        </div>
      </section>

      <section className="storeViewSection">
        <h2>Top Selling</h2>
        <div className="storeViewGrid">
          {topSelling.map((item) => (
            <div className="storeProductCard" key={item.id}>
              {item.image && <img src={item.image} alt={item.name} />}
              <div className="storeProductInfo">
                <div className="storeProductTitle">{item.name}</div>
                <div className="storeProductMeta">₦{item.price}</div>
                <Link to={`/marketplace/${item.id}`} className="storeProductLink">View Product</Link>
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
              {item.image && <img src={item.image} alt={item.name} />}
              <div className="storeProductInfo">
                <div className="storeProductTitle">{item.name}</div>
                <div className="storeProductMeta">₦{item.price} · {item.category}</div>
                <Link to={`/marketplace/${item.id}`} className="storeProductLink">View Product</Link>
              </div>
            </div>
          ))}
          {items.length === 0 && <p style={{ color: "#888" }}>No products in this store yet.</p>}
        </div>
      </section>
    </main>
  );
}
