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
        <svg className="heroOrbit heroOrbitOne" viewBox="0 0 220 220" aria-hidden="true">
          <circle cx="110" cy="110" r="84" />
        </svg>
        <svg className="heroOrbit heroOrbitTwo" viewBox="0 0 220 220" aria-hidden="true">
          <circle cx="110" cy="110" r="62" />
        </svg>
        <svg className="heroSpark heroSparkA" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2z" />
        </svg>
        <svg className="heroSpark heroSparkB" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2z" />
        </svg>
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
        <article className="featureCard">
          <svg className="featureIcon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5h16v14H4zM8 3v4M16 3v4M8 11h8M8 15h5" />
          </svg>
          <h3>Manage academics</h3>
          <p>Timetable, study groups, and resources in one flow.</p>
        </article>
        <article className="featureCard">
          <svg className="featureIcon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 7h18M6 7V5h12v2M5 7l1 12h12l1-12M10 11v5M14 11v5" />
          </svg>
          <h3>Grow your store</h3>
          <p>Sell products, track orders, and respond faster.</p>
        </article>
        <article className="featureCard">
          <svg className="featureIcon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16 19a4 4 0 0 0-8 0M12 13a4 4 0 1 0 0-8a4 4 0 0 0 0 8zM4 20h16" />
          </svg>
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
