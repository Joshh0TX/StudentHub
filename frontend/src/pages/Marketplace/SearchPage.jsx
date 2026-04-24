import "./MarketHome.css";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchProducts } from "./marketplaceApi";
import { categoriesByType } from "./marketplaceData";
import API_BASE from "../../config";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const locations = [
    "All Locations","Diamond Hall","Sapphire Hall","Crystal Hall","Platinum Hall",
    "Queen Esther Hall","FAD Hall","White Hall","Nyberg Hall","Havillah Hall",
    "Ogden Hall","Ameyo Hall","Samuel Akande Hall","Emerald Hall","Winslow Hall",
    "Gideon Troopers Hall","Neal Wilson Hall","Welch Hall","Nelson Mandela Hall",
  ];

  const allCategories = Array.from(new Set([...categoriesByType.goods, ...categoriesByType.services]));

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((item) => {
    const matchesQuery = !query ||
      item.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()) ||
      item.store?.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.locations?.join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesLocation = locationFilter === "all" || item.locations?.includes(locationFilter);
    return matchesQuery && matchesType && matchesCategory && matchesLocation;
  });

  return (
    <main className="marketPage">
      <div style={{ marginBottom: "16px" }}>
        <Link to="/marketplace" style={{ color: "var(--primary)", fontSize: "0.9rem", textDecoration: "none" }}>← Back to Marketplace</Link>
      </div>

      <div className="marketSearch" style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search items, locations..."
          defaultValue={query}
          onChange={(e) => setSearchParams({ q: e.target.value })}
        />
      </div>

      <div className="marketControls" style={{ marginBottom: "16px" }}>
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

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="itemNumber">{filtered.length} result{filtered.length !== 1 ? "s" : ""} {query ? `for "${query}"` : ""}</p>
          <section className="markettopGird">
            {filtered.map((item) => (
              <Link to={`/marketplace/${item.id}`} key={item.id} className="marketCard" style={{ textDecoration: "none", color: "inherit" }}>
                {item.images?.[0] && <img src={item.images[0].startsWith("http") ? item.images[0] : `${API_BASE}${item.images[0]}`} alt={item.name} className="marketImage" />}
                <div className="marketMeta">
                  <span className="marketTag">{item.type}</span>
                  <span className="marketTag muted">{item.category}</span>
                </div>
                <p className="cardTitle">{item.name}</p>
                <p className="itemDesc">{item.description}</p>
                <p className="marketPrice">₦{item.price}</p>
                <div className="locationChips">
                  {item.locations?.map((loc) => <span className="locationChip" key={loc}>{loc}</span>)}
                </div>
                <span className="sellerName">{item.store?.name}</span>
              </Link>
            ))}
            {filtered.length === 0 && <p style={{ color: "var(--muted-foreground)" }}>No results found.</p>}
          </section>
        </>
      )}
    </main>
  );
}
