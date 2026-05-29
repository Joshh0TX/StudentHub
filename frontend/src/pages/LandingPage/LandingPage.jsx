import React from 'react'
import './LandingPage.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


const LandingPage = () => {

  const navigate = useNavigate()


  return (
    <div className="landing-page">

      <nav className="nav">
        <a href="#" style={{ textDecoration: 'none' }}>
          <h1 style={{ color: 'white' }}>stuudo<span style={{ color: 'blue' }}>.</span></h1>
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#signup">Join us</a>
        </div>
        <div className="nav-cta">
          <button className="btn-outline" onClick={() => navigate('/login')}>Log in</button>
          <button className="btn-solid" onClick={() => navigate('/login?mode=signup')}>Sign up</button>
        </div>
      </nav>

      <div className="hero-wrap">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-tag">Built for students</div>
          <h1>Your campus life, <span>all in one place</span></h1>
          <p>Connect with classmates, stay on top of academics, grow your hustle and never miss what's happening on campus.</p>
          <div className="hero-btns">
            <button className="btn-hero" onClick={() => navigate('/login?mode=signup')}>Get started free</button>
            <button className="btn-hero-ghost">See how it works</button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-num">12k+</div>
              <div className="stat-label">students</div>
            </div>
            <div className="stat">
              <div className="stat-num">40+</div>
              <div className="stat-label">universities</div>
            </div>
            <div className="stat">
              <div className="stat-num">4.8★</div>
              <div className="stat-label">rated</div>
            </div>
          </div>
        </div>
      </div>

      <section className="features" id="features">
        <div className="section-label">everything you need</div>
        <div className="section-title">One platform, four superpowers</div>
        <div className="section-sub">Everything a student needs — academics, social, business and networking — in one place.</div>
        <div className="features-grid">
          <div className="feat-card">

            <h3>Newsroom</h3>
            <p>Share updates, follow trends and stay connected with your campus community.</p>
          </div>
          <div className="feat-card">

            <h3>Academic</h3>
            <p>Join study groups, manage your timetable and collaborate with coursemates.</p>
          </div>
          <div className="feat-card">

            <h3>Marketplace</h3>
            <p>Buy, sell and promote your business to thousands of students.</p>
          </div>
          <div className="feat-card">

            <h3>Connect</h3>
            <p>Build your network, message peers and grow your circle on campus.</p>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="section-label">who we are</div>
        <div className="section-title">Built by students, for students</div>
        <div className="section-sub">We know campus life is more than just lectures. StudentHub brings everything together so you can focus on what matters.</div>
        <div className="about-grid">
          <div className="about-point">

            <h3>Student first</h3>
            <p>Every feature is designed around how students actually live and work on campus.</p>
          </div>
          <div className="about-point">

            <h3>Safe space</h3>
            <p>A verified student community — no strangers, just your campus network.</p>
          </div>
          <div className="about-point">

            <h3>All in one</h3>
            <p>Stop switching between five different apps. Everything you need lives here.</p>
          </div>
        </div>
      </section>

      <section className="cta-section" id="signup">
        <h2>Ready to join your campus hub?</h2>
        <p>Sign up free with your school email and get started in seconds.</p>
        <div className="cta-form">
          <input type="email" placeholder="your school email" />
          <button className="btn-solid" onClick={() => navigate('/login?mode=signup')}>Join now</button>
        </div>
      </section>

    </div>
  )
}

export default LandingPage