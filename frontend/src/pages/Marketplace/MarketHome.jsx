import "./MarketHome.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categoriesByType, marketplaceItems, storeContacts } from "./marketplaceData";

export default function MarketHome() {
  const formEnabled = false;
  const isSeller = false;
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [activeContactStore, setActiveContactStore] = useState(null);
  const [form, setForm] = useState({
    name: "",
    desc: "",
    price: "",
    location: "",
    type: "goods",
    category: "Food",
  });
  const [storeForm, setStoreForm] = useState({
    storeName: "",
    storeDesc: "",
    storeType: "goods",
    contactType: "WhatsApp",
    contactValue: "",
    contacts: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setStoreForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddContact = () => {
    const nextValue = storeForm.contactValue.trim();
    if (!nextValue) {
      return;
    }
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

  const closeStoreForm = () => setShowStoreForm(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", form);
  };

  const locations = [
    "All Locations",
    "Diamond Hall",
    "Sapphire Hall",
    "Crystal Hall",
    "Platinum Hall",
    "Queen Esther Hall",
    "FAD Hall",
    "White Hall",
    "Nyberg Hall",
    "Havillah Hall",
    "Ogden Hall",
    "Ameyo Hall",
    "Samuel Akande Hall",
    "Emerald Hall",
    "Winslow Hall",
    "Gideon Troopers Hall",
    "Neal Wilson Hall",
    "Welch Hall",
    "Nelson Mandela Hall",
  ];

  const items = marketplaceItems;

  const categoryOptions = categoriesByType[form.type] || [];
  const allCategories = Array.from(
    new Set([...categoriesByType.goods, ...categoriesByType.services])
  );

  const handleFormTypeChange = (e) => {
    const nextType = e.target.value;
    const nextCategory = categoriesByType[nextType]?.[0] || "Other";
    setForm((prev) => ({
      ...prev,
      type: nextType,
      category: nextCategory,
    }));
  };

  const filteredItems = items.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase()) ||
      item.locations.join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesLocation =
      locationFilter === "all" || item.locations.includes(locationFilter);
    return matchesQuery && matchesType && matchesCategory && matchesLocation;
  });

  const favoriteStores = Array.from(
    new Map(
      items
        .filter((item) => item.frequent)
        .map((item) => [
          item.storeName,
          {
            storeName: item.storeName,
            category: item.category,
            locations: item.locations,
            storeRating: item.storeRating,
            storeReviews: item.storeReviews,
          },
        ])
    ).values()
  );

  const [favoriteSet, setFavoriteSet] = useState(
    new Set(favoriteStores.map((s) => s.storeName))
  );

  const toggleFavorite = (storeName) => {
    setFavoriteSet((prev) => {
      const next = new Set(prev);
      if (next.has(storeName)) {
        next.delete(storeName);
      } else {
        next.add(storeName);
      }
      return next;
    });
  };

  const favoriteList = favoriteStores.filter((s) =>
    favoriteSet.has(s.storeName)
  );

  const contactOptions = [
    "WhatsApp",
    "Phone",
    "Instagram",
    "Snapchat",
    "Telegram",
    "Email",
    "X",
  ];

  const getInitials = (name) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  return (
    <div>
      <header></header>
      <main className="marketPage">
        <div className="marketHeaderBar">
          <Link to="/marketplace" className="marketLogo">
            <div className="marketLogoMark">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
            </div>
            <span className="marketLogoText">
              Student<span>Hub</span>
            </span>
          </Link>
        </div>
        <div className="marketHeadings">
          <h1 className="marketHeading">Marketplace</h1>
          <p className="marketSubheading">
            Welcome to the marketplace! Advertise your business or browse available items.
          </p>
          <button
            type="button"
            className="marketToggle"
            onClick={() => {
              if (isSeller) {
                navigate("/storefront");
                return;
              }
              setShowStoreForm((prev) => !prev);
            }}
          >
            {isSeller ? "Storefront" : "Create My Store"}
          </button>
        </div>

        {showStoreForm && (
          <div
            className="storeModal"
            role="dialog"
            aria-modal="true"
            aria-label="Create store"
          >
            <button
              className="storeModalBackdrop"
              type="button"
              aria-label="Close create store form"
              onClick={closeStoreForm}
            />
            <div className="storeModalCard" role="document">
              <button
                className="storeModalClose"
                type="button"
                aria-label="Close"
                onClick={closeStoreForm}
              >
                ×
              </button>
              <h3 className="storeModalTitle">Create Your Store</h3>
              <p className="storeModalSubtitle">
                Add your details and the best ways buyers can reach you.
              </p>
              <div className="storeModalBody">
                <form className="storeForm" onSubmit={(e) => e.preventDefault()}>
                  <label>
                    Store Name
                    <input
                      name="storeName"
                      type="text"
                      value={storeForm.storeName}
                      onChange={handleStoreChange}
                      required
                    />
                  </label>
                  <label>
                    Store Description
                    <textarea
                      name="storeDesc"
                      rows="3"
                      value={storeForm.storeDesc}
                      onChange={handleStoreChange}
                      required
                    />
                  </label>
                  <label>
                    Store Type
                    <select
                      name="storeType"
                      value={storeForm.storeType}
                      onChange={handleStoreChange}
                      required
                    >
                      <option value="goods">Goods</option>
                      <option value="services">Services</option>
                      <option value="both">Both</option>
                    </select>
                  </label>
                  <label>
                    Contact Methods
                    <div className="storeContactRow">
                      <select
                        name="contactType"
                        value={storeForm.contactType}
                        onChange={handleStoreChange}
                      >
                        {contactOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <input
                        name="contactValue"
                        type="text"
                        placeholder="Add handle, number, or email"
                        value={storeForm.contactValue}
                        onChange={handleStoreChange}
                      />
                      <button
                        type="button"
                        className="btnSecondary"
                        onClick={handleAddContact}
                        disabled={!storeForm.contactValue.trim()}
                      >
                        Add
                      </button>
                    </div>
                    {storeForm.contacts.length > 0 ? (
                      <div className="storeContactList">
                        {storeForm.contacts.map((contact, index) => (
                          <div className="contactChip" key={`${contact.type}-${index}`}>
                            <span className="contactChipLabel">
                              {contact.type}: {contact.value}
                            </span>
                            <button
                              type="button"
                              className="contactRemove"
                              onClick={() => handleRemoveContact(index)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="contactHint">
                        Add at least one way buyers can reach you.
                      </p>
                    )}
                  </label>
                  <div className="storeModalActions">
                    <button className="submitButton" type="submit">
                      Create Store
                    </button>
                    <button
                      className="btnOutline"
                      type="button"
                      onClick={closeStoreForm}
                    >
                      Cancel
                    </button>
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
              {favoriteList.map((store) => (
                <div className="storeIconItem" key={store.storeName}>
                  <Link
                    to={`/store/${encodeURIComponent(store.storeName)}`}
                    className="storeIconLink"
                  >
                    <div className="storeIconCircle">
                      {getInitials(store.storeName)}
                    </div>
                    <div className="storeIconName">{store.storeName}</div>
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
              {favoriteStores.map((store) => (
                <div className="storeIconItem" key={`popular-${store.storeName}`}>
                  <Link
                    to={`/store/${encodeURIComponent(store.storeName)}`}
                    className="storeIconLink"
                  >
                    <div className="storeIconCircle">
                      {getInitials(store.storeName)}
                    </div>
                    <div className="storeIconName">{store.storeName}</div>
                  </Link>
                  <button
                    type="button"
                    className="favoriteBtn"
                    onClick={() => toggleFavorite(store.storeName)}
                  >
                    {favoriteSet.has(store.storeName)
                      ? "Favourited"
                      : "Favourite"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </section>

        <div className="marketControls">
          <div className="marketSearch">
            <input
              type="text"
              placeholder="Search items, locations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="marketFilters">
            <select
              value={typeFilter}
              onChange={(e) => {
                const nextType = e.target.value;
                setTypeFilter(nextType);
                setCategoryFilter("all");
              }}
            >
              <option value="all">All Types</option>
              <option value="goods">Goods</option>
              <option value="services">Services</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {(typeFilter === "all"
                ? allCategories
                : categoriesByType[typeFilter]
              ).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc === "All Locations" ? "all" : loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {formEnabled && showForm && (
          <form className="marketForm" onSubmit={handleSubmit}>
            <label>
              Item Name
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Item Description
              <input
                name="desc"
                type="text"
                value={form.desc}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Item Price
              <input
                name="price"
                type="text"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Where is your item/service available?
              <input
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Type
              <select
                name="type"
                value={form.type}
                onChange={handleFormTypeChange}
                required
              >
                <option value="goods">Goods</option>
                <option value="services">Services</option>
              </select>
            </label>
            <label>
              Category
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
            <button className="submitButton" type="submit">
              Submit
            </button>
          </form>
        )}

        <p className="itemNumber">{filteredItems.length} items available</p>
        <section className="markettopGird">
          {filteredItems.map((item) => (
            <div className="marketCard" key={`${item.title}-${item.storeName}`}>
              {item.image && (
                <img src={item.image} alt={item.title} className="marketImage" />
              )}
              <div className="marketMeta">
                <span className="marketTag">{item.type}</span>
                <span className="marketTag muted">{item.category}</span>
                {item.frequent && <span className="marketTag hot">Frequently Bought</span>}
              </div>
              <p className="cardTitle">
                <Link to={`/marketplace/${item.id}`} className="productLink">
                  {item.title}
                </Link>
              </p>
              <p className="itemDesc">{item.desc}</p>
              <p className="marketPrice">{item.price}</p>
              <p className="mTime">{item.time}</p>
              <div className="locationChips">
                {item.locations.map((loc) => (
                  <span className="locationChip" key={loc}>
                    {loc}
                  </span>
                ))}
              </div>
              <Link
                to={`/store/${encodeURIComponent(item.storeName)}`}
                className="sellerName"
              >
                {item.storeName}
              </Link>
              <button
                className="mButton"
                type="button"
                onClick={() =>
                  setActiveContactStore((prev) =>
                    prev === item.storeName ? null : item.storeName
                  )
                }
                aria-expanded={activeContactStore === item.storeName}
              >
                {activeContactStore === item.storeName
                  ? "Hide Contacts"
                  : "Contact Seller"}
              </button>
              {activeContactStore === item.storeName && (
                <div className="contactPanel">
                  {storeContacts[item.storeName]?.length ? (
                    storeContacts[item.storeName].map((contact) => (
                      <div
                        className="contactRow"
                        key={`${item.storeName}-${contact.type}-${contact.value}`}
                      >
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
          ))}
        </section>
      </main>
    </div>
  );
}
