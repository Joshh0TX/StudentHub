import { useState } from "react";

export default function MarketHome() {
  const [showForm, setShowForm] = useState(false);
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

  const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Form data:", form);
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
            <button className="submitButton" type="submit" onClick={() => setShowForm((prev) => !prev)}>Submit</button>
          </form>
        )}
        <p className="itemNumber">6 items available</p>
        <section className="markettopGird">
            <div className="marketCard">
                <p className="cardTitle">BGH delivery</p>
                <p className="itemDesc">Delivery from BGH to rooms.</p>
                <p className="marketPrice">N1200</p>
                <p className="mTime">50 mins ago</p>
                <p className="placeText">Diamond, Sapphire, Crystal and Platinum Halls</p>
                <p className="sellerName">Casey Luo</p>
                <button className="mButton">Contact Seller</button>
            </div>
            <div className="marketCard">
                <p className="cardTitle">Rice and Chicken</p>
                <p className="itemDesc">One plate of jollof rice with one piece of chicken.</p>
                <p className="marketPrice">N4000</p>
                <p className="mTime">2 hours ago</p>
                <p className="placeText">Emerald Hall</p>
                <p className="sellerName">Gbemi Oduselu</p>
                <button className="mButton">Contact Seller</button>
            </div>
            <div className="marketCard">
                <p className="cardTitle">Drinks</p>
                <p className="itemDesc">Fanta, Sprite, Schweppes and Coke</p>
                <p className="marketPrice">N500</p>
                <p className="mTime">Yesterday</p>
                <p className="placeText">Queen Esther Hall</p>
                <p className="sellerName">Titi Akinyemi</p>
                <button className="mButton">Contact Seller</button>
            </div>
        </section>
        <section className="markettopGird">
            <div className="marketCard">
                <p className="cardTitle">BUSA Delivery</p>
                <p className="itemDesc">Delivery from BUSA to rooms.</p>
                <p className="marketPrice">N700</p>
                <p className="mTime">1 hour ago</p>
                <p className="placeText">FAD and Queen Esther Halls</p>
                <p className="sellerName">Simi Folami</p>
                <button className="mButton">Contact Seller</button>
            </div>
            <div className="marketCard">
                <p className="cardTitle">Fab Biscuit</p>
                <p className="itemDesc">Chocolate fab</p>
                <p className="marketPrice">N650</p>
                <p className="mTime">2 mins ago</p>
                <p className="placeText">Samuel Akande Hall</p>
                <p className="sellerName">Tunde Alabi</p>
                <button className="mButton">Contact Seller</button>
            </div>
            <div className="marketCard">
                <p className="cardTitle">Perfume</p>
                <p className="itemDesc">1 bottle of perfume 100ml, top notes coffee and vanilla</p>
                <p className="marketPrice">N25000</p>
                <p className="mTime">8 hours ago</p>
                <p className="placeText">White Hall</p>
                <p className="sellerName">Kemi Adebayo</p>
                <button className="mButton">Contact Seller</button>
            </div>
        </section>
      </main>
    </div>
  );
}
