import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <main className="landingPage">
      <section className="landingShell">
        <div className="landingContent">
          <header className="landingTopbar">
            <div className="landingBrand">StudentHub</div>
            <nav className="landingNav">
              <a href="#services">Services</a>
              <a href="#community">Community</a>
              <a href="#cases">Case Studies</a>
            </nav>
            <Link className="landingTopButton" to="/login?mode=signup">Get Started</Link>
          </header>

          <section className="landingHero">
          <div>
            <h1>Navigate campus life with clarity and speed.</h1>
            <p className="landingLead">
              One place for academics, student marketplace, social feed, and profile growth.
              Built for students who need things done.
            </p>
            <div className="landingActions">
              <Link className="landingPrimary" to="/login?mode=signup">Create account</Link>
              <Link className="landingSecondary" to="/login">Sign in</Link>
            </div>
          </div>
          <div className="landingHeroArt" aria-hidden="true">
            <div className="heroBadge heart">&hearts;</div>
            <div className="heroBadge play">&#9654;</div>
            <div className="heroBadge share">&#8599;</div>
            <div className="orb orbA" />
            <div className="orb orbB" />
            <div className="ring" />
            <div className="ring ringB" />
            <div className="rocket">*</div>
          </div>
          </section>

          <section className="landingLogos" id="community">
          <span>Timetable</span>
          <span>Marketplace</span>
          <span>Study Groups</span>
          <span>Newsroom</span>
          <span>Profile</span>
          <span>Resources</span>
          </section>

          <section className="landingSectionTitle" id="services">
          <h2><span>Services</span></h2>
          <p>Everything students use every week, unified in one platform.</p>
          </section>

          <section className="landingServiceGrid">
          <article className="serviceCard light">
            <h3><span>Academic</span> planning</h3>
            <p>Build class timetables, exam schedule reminders, and study routines.</p>
            <a href="#!">Learn more</a>
          </article>
          <article className="serviceCard dark">
            <h3><span>Campus</span> marketplace</h3>
            <p>Buy and sell goods, manage stores, and track buyer or seller orders.</p>
            <a href="#!">Learn more</a>
          </article>
          <article className="serviceCard dark">
            <h3><span>Student</span> network</h3>
            <p>Connect with students, discover profiles, and grow your community.</p>
            <a href="#!">Learn more</a>
          </article>
          <article className="serviceCard light">
            <h3><span>Resource</span> hub</h3>
            <p>Access academic resources, group activities, and school updates fast.</p>
            <a href="#!">Learn more</a>
          </article>
          </section>

          <section className="landingCtaBand">
          <div>
            <h3>Ready to simplify your student workflow?</h3>
            <p>Join now and get your dashboard set up in minutes.</p>
          </div>
          <Link className="landingPrimary" to="/login?mode=signup">Start free</Link>
          </section>

          <section className="landingSectionTitle" id="cases">
          <h2><span>Case study</span></h2>
          <p>Real outcomes from students and campus creators using StudentHub.</p>
          </section>

          <section className="landingCaseRow">
          <article>
            <p>Marketplace sellers processed repeat orders faster with live order status tracking.</p>
            <span>Learn more</span>
          </article>
          <article>
            <p>Students improved weekly planning by combining timetable and reminders in one flow.</p>
            <span>Learn more</span>
          </article>
          <article>
            <p>Campus groups increased collaboration using shared updates and quick profile discovery.</p>
            <span>Learn more</span>
          </article>
          </section>
        </div>
      </section>
    </main>
  );
}
