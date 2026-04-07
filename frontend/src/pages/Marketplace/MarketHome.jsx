import { useState } from "react";

export default function MarketHome() {
  const [form, setForm] = useState({
    name: "",
    desc: "",
    price: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <header></header>
      <main className="marketPage">
        <div className="marketHeadings">
          <h1 className="marketHeading">Marketplace</h1>
          <p className="marketSubheading">
            Welcome to the marketplace! Advertise your business or browse available items.
          </p>
        </div>
        <form className="marketForm">
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
        </form>
        {/* rest */}
      </main>
    </div>
  );
}
