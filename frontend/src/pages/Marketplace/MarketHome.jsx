import "./MarketHome.css";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categoriesByType } from "./marketplaceData";
import { fetchProducts, createStore, fetchFavourites, toggleFavourite, fetchStore } from "./marketplaceApi";
import { getUser } from "./testUser";

const FEATURED_STORES = [
  { id: "s1", name: "Gbemi's Kitchen", category: "Food", bg: "#1e3a5f" },
  { id: "s2", name: "Kemi's Beauty Bar", category: "Beauty", bg: "#4a1942" },
  { id: "s3", name: "Simi's Dispatch", category: "Delivery", bg: "#1a3d2b" },
  { id: "s4", name: "Josh's Tech Desk", category: "Tech", bg: "#2d1b4e" },
  { id: "s5", name: "Titi's Mini Mart", category: "Goods", bg: "#3b2a1a" },
  { id: "s6", name: "Tunde's Treats", category: "Food", bg: "#1a2e3b" },
  { id: "s7", name: "Sade's Appliances", category: "Appliances", bg: "#2a3b1a" },
  { id: "s8", name: "Mike's Bookshop", category: "Educational", bg: "#3b1a1a" },
];

export default function MarketHome() {
  const navigate = useNavigate();
  const user = getUser();
  const sliderRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [activeContactStore, setActiveContactStore] = useState(null);
  const [storeError, setStoreError] = useState("");
  const [storeLoading, setStoreLoading] = useState(false);
  const [storeForm, setStoreForm] = useState({
    storeName: "", storeDesc: "", storeType: "goods", storeImage: null,
    contactType: "WhatsApp", contactValue: "", contacts: [],
  });

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
    if (user) {
      fetchStore(user.id)
        .then((store) => { if (store && !store.error) setIsSeller(true); })
        .catch(() => {});
    }
  }, []);

  const handleStoreChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "storeImage") setStoreForm((p) => ({ ...p, storeImage: files[0] || null }));
    else setStoreForm((p) => ({ ...p, [name]: value }));
  };

  const handleAddContact = () => {
    const v = storeForm.contactValue.trim();
    if (!v) return;
    setStoreForm((p) => ({ ...p, contacts: [...p.contacts, { type: p.contactType, value: v }], contactValue: "" }));
  };

  const handleRemoveContact = (i) =>
    setStoreForm((p) => ({ ...p, contacts: p.contacts.filter((_, idx) => idx !== i) }));

  const handleCreateStore = async (e) => {
    e.preventDefault();
    if (!user) return setStoreError("You must be logged in");
    setStoreError(""); setStoreLoading(true);
    try {
      await createStore({ name: storeForm.storeName, description: storeForm.storeDesc, type: storeForm.storeType, image: storeForm.storeImage, ownerId: user.id, contacts: storeForm.contacts });
      setIsSeller(true);
      setShowStoreForm(false);
      navigate("/storefront");
    } catch (err) {
      setStoreError(err.message);
    } finally {
      setStoreLoading(false);
    }
  };

  const locations = [
    "All Locations","Diamond Hall","Sapphire Hall","Crystal Hall","Platinum Hall",
    "Queen Esther Hall","FAD Hall","White Hall","Nyberg Hall","Havillah Hall",
    "Ogden Hall","Ameyo Hall","Samuel Akande Hall","Emerald Hall","Winslow Hall",
    "Gideon Troopers Hall","Neal Wilson Hall","Welch Hall","Nelson Mandela Hall",
  ];

  const allCategories = Array.from(new Set([...categoriesByType.goods, ...categoriesByType.services]));

  const filteredItems = products.filter((item) => {
    const matchesQuery = item.name?.toLowerCase().includes(query.toLowerCase()) || item.description?.toLowerCase().includes(query.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesLocation = locationFilter === "all" || item.locations?.includes(locationFilter);
    return matchesQuery && matchesType && matchesCategory && matchesLocation;
  });

  const allStores = Array.from(new Map(products.map((p) => [p.store?.id, p.store]).filter(([id]) => id)).values());
  const contactOptions = ["WhatsApp","Phone","Instagram","Snapchat","Telegram","Email","X"];
  const getInitials = (name = "") => name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const storeImg = (store) => store?.image ? (store.image.startsWith("http") ? store.image : `http://localhost:5000${store.image}`) : null;

  return (
    <div>
      <main className="marketPage">

        {/* Hero */}
        <div className="marketHero">
          <div className="marketHeroContent">
            <h2 className="marketHeroTitle">Welcome to StudentHub<br />Marketplace</h2>
            <p className="marketHeroSub">Buy, sell and discover goods and services from fellow students on campus. Fast, easy and trusted.</p>
            <div className="marketHeroActions">
              <button className="marketHeroCta" type="button" onClick={() => document.querySelector(".marketControls")?.scrollIntoView({ behavior: "smooth" })}>Shop Now</button>
              <button className="marketHeroSecondary" type="button" onClick={() => setShowStoreForm(true)}>Create My Store</button>
            </div>
          </div>
          <div className="marketHeroIllustration">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="60" fill="rgba(255,255,255,0.07)" />
              <circle cx="60" cy="60" r="42" fill="rgba(255,255,255,0.07)" />
              <path d="M38 48h44l-6 32H44L38 48z" fill="rgba(255,255,255,0.9)" />
              <path d="M50 48V40a10 10 0 0120 0v8" stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round" />
              <circle cx="54" cy="62" r="3" fill="#3b82f6" />
              <circle cx="66" cy="62" r="3" fill="#3b82f6" />
            </svg>
          </div>
        </div>

      
        {/* Popular Stores Slider */}
        <div className="popularSliderSection">
          <div className="popularSliderHeader">
            <div>
              <h2>Popular Stores</h2>
              <p>More trusted sellers you might like.</p>
            </div>
            <div className="sliderNavBtns">
              <button type="button" className="sliderNavBtn" onClick={() => sliderRef.current?.scrollBy({ left: -200, behavior: "smooth" })}>‹</button>
              <button type="button" className="sliderNavBtn" onClick={() => sliderRef.current?.scrollBy({ left: 200, behavior: "smooth" })}>›</button>
            </div>
          </div>
          <div className="popularSliderTrack" ref={sliderRef}>
            {[...allStores, ...FEATURED_STORES.filter(f => !allStores.some(s => s.name === f.name))].map((store) => (
              <Link to={`/store/${encodeURIComponent(store.id)}`} className="popularSliderCard" key={store.id}>
                <div className="popularSliderImg">
                  {storeImg(store) ? <img src={storeImg(store)} alt={store.name} /> : <span>{getInitials(store.name)}</span>}
                </div>
                <div className="popularSliderName">{store.name}</div>
                <div className="popularSliderCat">{store.type || store.category}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Create Store Modal */}
        {showStoreForm && (
          <div className="storeModal" role="dialog" aria-modal="true" aria-label="Create store">
            <button className="storeModalBackdrop" type="button" onClick={() => setShowStoreForm(false)} />
            <div className="storeModalCard" role="document">
              <button className="storeModalClose" type="button" onClick={() => setShowStoreForm(false)}>×</button>
              <h3 className="storeModalTitle">Create Your Store</h3>
              <p className="storeModalSubtitle">Add your details and the best ways buyers can reach you.</p>
              {storeError && <p style={{ color: "red", fontSize: "0.85rem" }}>{storeError}</p>}
              <div className="storeModalBody">
                <form className="storeForm" onSubmit={handleCreateStore}>
                  <label>Store Name<input name="storeName" type="text" value={storeForm.storeName} onChange={handleStoreChange} required /></label>
                  <label>Store Description<textarea name="storeDesc" rows="3" value={storeForm.storeDesc} onChange={handleStoreChange} required /></label>
                  <label>Store Profile Photo (optional)<input name="storeImage" type="file" accept="image/*" onChange={handleStoreChange} /></label>
                  <label>
                    Store Type
                    <select name="storeType" value={storeForm.storeType} onChange={handleStoreChange}>
                      <option value="goods">Goods</option>
                      <option value="services">Services</option>
                      <option value="both">Both</option>
                    </select>
                  </label>
                  <label>
                    Contact Methods
                    <div className="storeContactRow">
                      <select name="contactType" value={storeForm.contactType} onChange={handleStoreChange}>
                        {contactOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <input name="contactValue" type="text" placeholder="Add handle, number, or email" value={storeForm.contactValue} onChange={handleStoreChange} />
                      <button type="button" className="btnSecondary" onClick={handleAddContact} disabled={!storeForm.contactValue.trim()}>Add</button>
                    </div>
                    {storeForm.contacts.length > 0 ? (
                      <div className="storeContactList">
                        {storeForm.contacts.map((c, i) => (
                          <div className="contactChip" key={i}>
                            <span className="contactChipLabel">{c.type}: {c.value}</span>
                            <button type="button" className="contactRemove" onClick={() => handleRemoveContact(i)}>Remove</button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="contactHint">Add at least one way buyers can reach you.</p>
                    )}
                  </label>
                  <div className="storeModalActions">
                    <button className="submitButton" type="submit" disabled={storeLoading}>{storeLoading ? "Creating..." : "Create Store"}</button>
                    <button className="btnOutline" type="button" onClick={() => setShowStoreForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        <div className="marketSearch" style={{ margin: "16px 0 20px" }}>
          <input type="text" placeholder="Search items, locations..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {/* Filters */}
        <div className="marketControls">
          <div className="marketFilters">
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCategoryFilter("all"); }}>
              <option value="all">All Types</option>
              <option value="goods">Goods</option>
              <option value="services">Services</option>
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {(typeFilter === "all" ? allCategories : categoriesByType[typeFilter]).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              {locations.map((loc) => (
                <option key={loc} value={loc === "All Locations" ? "all" : loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="itemNumber">{filteredItems.length} items available</p>
        <section className="markettopGird">
          {filteredItems.map((item) => (
            <div className="marketCard" key={item.id}>
              {item.images?.[0] && <img src={item.images[0].startsWith("http") ? item.images[0] : `http://localhost:5000${item.images[0]}`} alt={item.name} className="marketImage" />}
              <div className="marketMeta">
                <span className="marketTag">{item.type}</span>
                <span className="marketTag muted">{item.category}</span>
              </div>
              <p className="cardTitle">
                <Link to={`/marketplace/${item.id}`} className="productLink">{item.name}</Link>
              </p>
              <p className="itemDesc">{item.description}</p>
              <p className="marketPrice">₦{item.price}</p>
              <div className="locationChips">
                {item.locations?.map((loc) => <span className="locationChip" key={loc}>{loc}</span>)}
              </div>
              <Link to={`/store/${encodeURIComponent(item.store?.id)}`} className="sellerName">{item.store?.name}</Link>
              <button className="mButton" type="button" onClick={() => setActiveContactStore((prev) => prev === item.store?.id ? null : item.store?.id)}>
                {activeContactStore === item.store?.id ? "Hide Contacts" : "Contact Seller"}
              </button>
              {activeContactStore === item.store?.id && (
                <div className="contactPanel">
                  {item.store?.contacts?.length ? (
                    item.store.contacts.map((c) => (
                      <div className="contactRow" key={`${c.type}-${c.value}`}>
                        <span className="contactType">{c.type}</span>
                        <span className="contactValue">{c.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="contactEmpty">No contact info posted yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
