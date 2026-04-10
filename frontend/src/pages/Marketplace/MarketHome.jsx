import "./MarketHome.css";
import { useState } from "react";

export default function MarketHome() {
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [form, setForm] = useState({
    name: "",
    desc: "",
    price: "",
    location: "",
    type: "goods",
    category: "Food",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", form);
  };

  const categoriesByType = {
    goods: [
      "Food",
      "Educational Materials",
      "Appliances",
      "Beauty",
      "Clothing",
      "Tech",
      "Accessories",
      "Health",
      "Home & Decor",
      "Sports",
      "Stationery",
      "Other",
    ],
    services: [
      "Delivery",
      "Hair",
      "Lashes",
      "Tutoring",
      "Laundry",
      "Cleaning",
      "Photography",
      "Design",
      "Repairs",
      "Transport",
      "Events",
      "Other",
    ],
  };

  const locations = [
    "All",
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

  const items = [
    {
      title: "BGH delivery",
      desc: "Delivery from BGH to rooms.",
      price: "N1200",
      time: "50 mins ago",
      locations: ["Diamond Hall", "Sapphire Hall", "Crystal Hall", "Platinum Hall"],
      seller: "Casey Luo",
      type: "services",
      category: "Delivery",
    },
    {
      title: "Rice and Chicken",
      desc: "One plate of jollof rice with one piece of chicken.",
      price: "N4000",
      time: "2 hours ago",
      locations: ["Emerald Hall"],
      seller: "Gbemi Oduselu",
      type: "goods",
      category: "Food",
    },
    {
      title: "Drinks",
      desc: "Fanta, Sprite, Schweppes and Coke",
      price: "N500",
      time: "Yesterday",
      locations: ["Queen Esther Hall", "FAD Hall"],
      seller: "Titi Akinyemi",
      type: "goods",
      category: "Food",
    },
    {
      title: "Calculus Textbook Bundle",
      desc: "3 books, good condition. Includes worked examples.",
      price: "N8500",
      time: "3 hours ago",
      locations: ["Nyberg Hall", "Winslow Hall"],
      seller: "Mike R.",
      type: "goods",
      category: "Educational Materials",
    },
    {
      title: "Room Fan",
      desc: "Standing fan, barely used.",
      price: "N18000",
      time: "1 day ago",
      locations: ["Platinum Hall"],
      seller: "Sade A.",
      type: "goods",
      category: "Appliances",
    },
    {
      title: "Laptop Cleanup",
      desc: "PC cleanup, antivirus, and speed boost.",
      price: "N3000",
      time: "5 hours ago",
      locations: ["Ogden Hall", "Gideon Troopers Hall"],
      seller: "Josh T.",
      type: "services",
      category: "Repairs",
    },
    {
      title: "Hair Braiding",
      desc: "Neat braids with extensions. Book ahead.",
      price: "N8000",
      time: "Yesterday",
      locations: ["Queen Esther Hall", "Welch Hall"],
      seller: "Titi Akinyemi",
      type: "services",
      category: "Hair",
    },
    {
      title: "Sneakers",
      desc: "Size 42, clean and comfy.",
      price: "N15000",
      time: "2 days ago",
      locations: ["White Hall", "Nelson Mandela Hall"],
      seller: "Kemi Adebayo",
      type: "goods",
      category: "Clothing",
    },
    {
      title: "BUSA Delivery",
      desc: "Delivery from BUSA to rooms.",
      price: "N700",
      time: "1 hour ago",
      locations: ["FAD Hall", "Queen Esther Hall"],
      seller: "Simi Folami",
      type: "services",
      category: "Delivery",
    },
    {
      title: "Fab Biscuit",
      desc: "Chocolate fab",
      price: "N650",
      time: "2 days ago",
      locations: ["Samuel Akande Hall", "Ameyo Hall"],
      seller: "Tunde Alabi",
      type: "goods",
      category: "Food",
    },
    {
      title: "Perfume",
      desc: "1 bottle of perfume 100ml, top notes coffee and vanilla",
      price: "N25000",
      time: "8 hours ago",
      locations: ["White Hall", "Neal Wilson Hall"],
      seller: "Kemi Adebayo",
      type: "goods",
      category: "Beauty",
    },
  ];

  const categoryOptions = categoriesByType[form.type] || [];

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

  return (
    <div>
      <header></header>
      <main className="marketPage">
        <div className="marketHeadings">
          <h1 className="marketHeading">Marketplace</h1>
          <p className="marketSubheading">
            Welcome to the marketplace! Advertise your business or browse available items.
          </p>
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
                disabled={typeFilter === "all"}
              >
                <option value="all">All Categories</option>
                {typeFilter !== "all" &&
                  categoriesByType[typeFilter].map((cat) => (
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
                  <option
                    key={loc}
                    value={loc === "All" ? "all" : loc}
                  >
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            className="marketToggle"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Hide Form" : "Post an Item"}
          </button>
        </div>
        {showForm && (
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
            <button className="submitButton" type="submit" onClick={() => setShowForm((prev) => !prev)}>Submit</button>
          </form>
        )}
        <p className="itemNumber">{filteredItems.length} items available</p>
        <section className="markettopGird">
          {filteredItems.map((item) => (
            <div className="marketCard" key={`${item.title}-${item.seller}`}>
              <div className="marketMeta">
                <span className="marketTag">{item.type}</span>
                <span className="marketTag muted">{item.category}</span>
              </div>
              <p className="cardTitle">{item.title}</p>
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
              <p className="sellerName">{item.seller}</p>
              <button className="mButton">Contact Seller</button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
