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
        <section className="markettopGird">
            <div className="marketCard">
                <p className="cardTitle">BGH delivery</p>
                <p className="itemDesc">Delivery from BGH to rooms.</p>
                <p className="marketPrice">N1200</p>
                <p className="placeText">Diamond, Sapphire, Crystal and Platinum Halls</p>
            </div>
            <div className="marketCard">
                <p className="cardTitle">Rice and Chicken</p>
                <p className="itemDesc">One plate of jollof rice with one piece of chicken.</p>
                <p className="marketPrice">N4000</p>
                <p className="placeText">Emerald Hall</p>
            </div>
            <div className="marketCard">
                <p className="cardTitle">Drinks</p>
                <p className="itemDesc">Fanta, Sprite, Schweppes and Coke</p>
                <p className="marketPrice">N500</p>
                <p className="placeText">Queen Esther Hall</p>
            </div>
        </section>
      </main>
    </div>
  );
}
