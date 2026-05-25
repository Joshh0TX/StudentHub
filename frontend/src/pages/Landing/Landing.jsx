import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <main className="landing">
      <header className="landingHeader">
        <div className="brand">
          <h1 className="stuudoLogo">stuudo<span>.</span></h1>
        </div>
        <nav className="headerNav">
          <a href="#features">Features</a>
          <a href="#why">Why us</a>
          <a href="#reviews">Reviews</a>
        </nav>
        <Link to="/login" className="ghostBtn">Sign in</Link>
      </header>

      <section className="hero">
        <div className="heroText">
          <p className="eyebrow">Built for campus</p>
          <h1>Run your student life from one dashboard.</h1>
          <p>
            Plan classes, buy and sell on campus, grow your profile, and stay updated with your school community.
          </p>
          <div className="heroCtas">
            <Link to="/login?mode=signup" className="primaryBtn">Create account</Link>
            <Link to="/login" className="ghostBtn">I already have an account</Link>
          </div>
        </div>
        <div className="heroPanel" aria-hidden="true">
          <div className="panelCard panelA">
            <strong>Marketplace</strong>
            <span>Orders, stores, product discovery</span>
          </div>
          <div className="panelCard panelB">
            <strong>Academics</strong>
            <span>Timetable, resources, study groups</span>
          </div>
          <div className="panelCard panelC">
            <strong>Profile & Social</strong>
            <span>Connections, feed, achievements</span>
          </div>
        </div>
      </section>

      <section className="featureBand" id="features">
        <article>
          <h3>Manage academics</h3>
          <p>Timetable, study groups, and resources in one flow.</p>
        </article>
        <article>
          <h3>Grow your store</h3>
          <p>Sell products, track orders, and respond faster.</p>
        </article>
        <article>
          <h3>Build your network</h3>
          <p>Profile visibility, updates, and community engagement.</p>
        </article>
      </section>

      <section className="stats" id="why">
        <div><strong>3</strong><span>Core modules</span></div>
        <div><strong>1</strong><span>Unified experience</span></div>
        <div><strong>24/7</strong><span>Access anywhere</span></div>
      </section>

      <section className="reviews" id="reviews">
        <h2>Students move faster with stuudo.</h2>
        <div className="reviewGrid">
          <blockquote>"The marketplace + order tracking is exactly what we needed."</blockquote>
          <blockquote>"I stopped juggling multiple apps for class planning."</blockquote>
          <blockquote>"Profile and networking features helped me find collaborators."</blockquote>
        </div>
      </section>
    </main>
  );
}
