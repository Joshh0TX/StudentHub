import "./StoreView.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProducts, fetchFavourites, toggleFavourite, fetchStoreById } from "./marketplaceApi";
import { getUser } from "./testUser";

export default function StoreView() {
  const { storeId } = useParams();
  const decodedStore = decodeURIComponent(storeId || "");
  const user = getUser();

  const [items, setItems] = useState([]);
  const [storeData, setStoreData] = useState(null);
  const [isFavourited, setIsFavourited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // decodedStore could be a store ID or store name
    Promise.all([
      fetchProducts(),
      fetchStoreById(decodedStore).catch(() => null),
    ])
      .then(([allProducts, store]) => {
        const filtered = allProducts.filter(
          (p) => String(p.store?.id) === decodedStore || p.store?.name?.toLowerCase() === decodedStore.toLowerCase()
        );
        setItems(filtered);
        if (store && !store.error) setStoreData(store);
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

  const storeName = storeData?.name || items[0]?.store?.name || decodedStore || "Store";
  const storeImage = storeData?.image || items[0]?.store?.image;
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
            {(storeImage || items[0]?.store?.image)
              ? (() => { const img = (storeImage || items[0]?.store?.image); const src = img.startsWith("http") ? img : `http://localhost:5000${img}`; return <img src={src} alt={storeName} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />; })()
              : storeName.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
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
          <div className="storeStatValue">{storeData?.visits ?? 0}</div>
          <div className="storeStatLabel">Visits</div>
        </div>
        <div className="storeStat">
          <div className="storeStatValue">{items.length}</div>
          <div className="storeStatLabel">Products</div>
        </div>
      </section>

      <section className="storeViewSection">
        <h2>Top Selling</h2>
        <div className="storeViewGrid">
          {topSelling.map((item) => {
            const img = item.images?.[0] ? (item.images[0].startsWith("http") ? item.images[0] : `http://localhost:5000${item.images[0]}`) : null;
            return (
              <div className="storeProductCard" key={item.id}>
                {img && <img src={img} alt={item.name} />}
                <div className="storeProductInfo">
                  <div className="storeProductTitle">{item.name}</div>
                  <div className="storeProductMeta">₦{item.price}</div>
                  <Link to={`/marketplace/${item.id}`} className="storeProductLink">View Product</Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="storeViewSection">
        <h2>All Products</h2>
        <div className="storeViewGrid">
          {items.map((item) => {
            const img = item.images?.[0] ? (item.images[0].startsWith("http") ? item.images[0] : `http://localhost:5000${item.images[0]}`) : null;
            return (
              <div className="storeProductCard" key={`all-${item.id}`}>
                {img && <img src={img} alt={item.name} />}
                <div className="storeProductInfo">
                  <div className="storeProductTitle">{item.name}</div>
                  <div className="storeProductMeta">₦{item.price} · {item.category}</div>
                  <Link to={`/marketplace/${item.id}`} className="storeProductLink">View Product</Link>
                </div>
              </div>
            );
          })}
          {items.length === 0 && <p style={{ color: "#888" }}>No products in this store yet.</p>}
        </div>
      </section>
    </main>
  );
}
