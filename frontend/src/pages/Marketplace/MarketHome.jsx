import "./MarketHome.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categoriesByType } from "./marketplaceData";
import { fetchProducts, createStore, fetchFavourites, toggleFavourite } from "./marketplaceApi";

export default function MarketHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [products, setProducts] = useState([]);
  const [favouriteStores, setFavouriteStores] = useState([]);
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
    storeName: "",
    storeDesc: "",
    storeType: "goods",
    contactType: "WhatsApp",
    contactValue: "",
    contacts: [],
  });

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
    if (user) {
      fetchFavourites(user.id).then(setFavouriteStores).catch(console.error);
    }
  }, []);

  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setStoreForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddContact = () => {
    const nextValue = storeForm.contactValue.trim();
    if (!nextValue) return;
    setStoreForm((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { type: prev.contactType, value: nextValue }],
      contactValue: "",
    }));
  };

  const handleRemoveContact = (index) => {
    setStoreForm((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, idx) => idx !== index),
    }));
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    if (!user) return setStoreError("You must be logged in");
    setStoreError("");
    setStoreLoading(true);
    try {
      await createStore({
        name: storeForm.storeName,
        description: storeForm.storeDesc,
        type: storeForm.storeType,
        ownerId: user.id,
        contacts: storeForm.contacts,
      });
      setIsSeller(true);
      setShowStoreForm(false);
      navigate("/storefront");
    } catch (err) {
      setStoreError(err.message);
    } finally {
      setStoreLoading(false);
    }
  };

  const handleToggleFavourite = async (storeId) => {
    if (!user) return;
    const res = await toggleFavourite(storeId, user.id);
    if (res.favourited) {
      const store = products.find((p) => p.store?.id === storeId)?.store;
      if (store) setFavouriteStores((prev) => [...prev, store]);
    } else {
      setFavouriteStores((prev) => prev.filter((s) => s.id !== storeId));
    }
  };

  const locations = [
    "All Locations","Diamond Hall","Sapphire Hall","Crystal Hall","Platinum Hall",
    "Queen Esther Hall","FAD Hall","White Hall","Nyberg Hall","Havillah Hall",
    "Ogden Hall","Ameyo Hall","Samuel Akande Hall","Emerald Hall","Winslow Hall",
    "Gideon Troopers Hall","Neal Wilson Hall","Welch Hall","Nelson Mandela Hall",
  ];

  const allCategories = Array.from(
    new Set([...categoriesByType.goods, ...categoriesByType.services])
  );

  const filteredItems = products.filter((item) => {
    const matchesQuery =
      item.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesLocation =
      locationFilter === "all" || item.locations?.includes(locationFilter);
    return matchesQuery && matchesType && matchesCategory && matchesLocation;
  });

  // unique stores from products
  const allStores = Array.from(
    new Map(products.map((p) => [p.store?.id, p.store]).filter(([id]) => id)).values()
  );

  const contactOptions = ["WhatsApp","Phone","Instagram","Snapchat","Telegram","Email","X"];

  const getInitials = (name = "") =>
    name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();

  return (
    <div>
      <main className="marketPage">
        <div className="marketHeaderBar">
          <Link to="/marketplace" className="marketLogo">
            <div className="marketLogoMark">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
            </div>
            <span className="marketLogoText">Student<span>Hub</span></span>
          </Link>
        </div>

        <div className="marketHeadings">
          <h1 className="marketHeading">Marketplace</h1>
          <p className="marketSubheading">Welcome to the marketplace! Advertise your business or browse available items.</p>
          <button
            type="button"
            className="marketToggle"
            onClick={() => {
              if (isSeller) { navigate("/storefront"); return; }
              setShowStoreForm((prev) => !prev);
            }}
          >
            {isSeller ? "Storefront" : "Create My Store"}
          </button>
        </div>

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
                    <button className="submitButton" type="submit" disabled={storeLoading}>
                      {storeLoading ? "Creating..." : "Create Store"}
                    </button>
                    <button className="btnOutline" type="button" onClick={() => setShowStoreForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <section className="storeRow">
          <section className="favoriteStores">
            <div className="favoriteHeader">
              <h2>Favourite Stores</h2>
              <p>Your starred spots and quick buy-again picks.</p>
            </div>
            <div className="storeIconGrid">
              {favouriteStores.map((store) => (
                <div className="storeIconItem" key={store.id}>
                  <Link to={`/store/${encodeURIComponent(store.id)}`} className="storeIconLink">
                    <div className="storeIconCircle">{getInitials(store.name)}</div>
                    <div className="storeIconName">{store.name}</div>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="popularStores">
            <div className="popularHeader">
              <h2>Popular Stores</h2>
              <p>More trusted sellers you might like.</p>
            </div>
            <div className="storeIconGrid">
              {allStores.map((store) => (
                <div className="storeIconItem" key={store.id}>
                  <Link to={`/store/${encodeURIComponent(store.id)}`} className="storeIconLink">
                    <div className="storeIconCircle">{getInitials(store.name)}</div>
                    <div className="storeIconName">{store.name}</div>
                  </Link>
                  <button type="button" className="favoriteBtn" onClick={() => handleToggleFavourite(store.id)}>
                    {favouriteStores.some((f) => f.id === store.id) ? "Favourited" : "Favourite"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </section>

        <div className="marketControls">
          <div className="marketSearch">
            <input type="text" placeholder="Search items, locations..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
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
              {item.image && <img src={item.image} alt={item.name} className="marketImage" />}
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
              <Link to={`/store/${encodeURIComponent(item.store?.id)}`} className="sellerName">
                {item.store?.name}
              </Link>
              <button
                className="mButton"
                type="button"
                onClick={() => setActiveContactStore((prev) => prev === item.store?.id ? null : item.store?.id)}
              >
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
