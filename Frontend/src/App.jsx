
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import BasecampyLogo from "./assets/basecampy-logo.svg";
import Login from "./pages/Login";

const features = [
  {
    number: "01",
    title: "Projects, organized",
    description:
      "Bring your projects, plans, and important information together in one place.",
    icon: "▦",
  },
  {
    number: "02",
    title: "People, connected",
    description:
      "Keep your team aligned, share responsibilities, and work toward common goals.",
    icon: "♧",
  },
  {
    number: "03",
    title: "Progress, visible",
    description:
      "See what is moving forward and make the next step feel a little simpler.",
    icon: "↗",
  },
];

function Brand({ light = false }) {
  return (
    <a
      className={`brand ${light ? "brand-light" : ""}`}
      href="#home"
      aria-label="Basecampy home"
    >
  <img
  src={BasecampyLogo}
  alt=""
  className="brand-mark"
/>
      <span>Basecampy</span>
      <span className="brand-sparkle" aria-hidden="true">✳</span>
    </a>
  );
}

function MiniTask({ title, color, status }) {
  return (
    <div className="mini-task">
      <span className={`mini-task-dot ${color}`} />
      <span className="mini-task-title">{title}</span>
      <span className={`mini-task-status ${color}`}>{status}</span>
    </div>
  );
}

function ProductIllustration() {
  return (
    <div className="illustration" aria-label="Illustration of a project management workspace">
      <span className="float-shape shape-one" />
      <span className="float-shape shape-two" />
      <span className="float-shape shape-three" />
      <span className="drawn-star star-one">✳</span>
      <span className="drawn-star star-two">✧</span>
      <span className="drawn-arrow">〰</span>

      <div className="illustration-orbit orbit-one" />
      <div className="illustration-orbit orbit-two" />

      <div className="laptop">
        <div className="laptop-screen">
          <div className="screen-topbar">
            <div className="screen-brand">
              <span className="screen-brand-icon">◆</span>
              basecampy
            </div>
            <div className="screen-top-actions">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="screen-content">
            <aside className="screen-sidebar">
              <div className="screen-avatar">B</div>
              <span className="screen-side-line active" />
              <span className="screen-side-line" />
              <span className="screen-side-line" />
              <span className="screen-side-line short" />
              <span className="screen-side-line" />
            </aside>

            <div className="screen-board">
              <div className="screen-heading-row">
                <div>
                  <span className="screen-eyebrow">YOUR WORKSPACE</span>
                  <div className="screen-heading">Website redesign</div>
                </div>
                <span className="screen-add">+</span>
              </div>

              <div className="mini-board">
                <div className="mini-column">
                  <div className="mini-column-heading">
                    <span className="status-dot todo" />
                    To do
                    <span>2</span>
                  </div>
                  <MiniTask title="Design homepage" color="rose" status="High" />
                  <MiniTask title="Write copy" color="amber" status="Next" />
                </div>

                <div className="mini-column">
                  <div className="mini-column-heading">
                    <span className="status-dot progress" />
                    In progress
                    <span>1</span>
                  </div>
                  <MiniTask title="Create wireframes" color="mauve" status="Live" />
                </div>

                <div className="mini-column">
                  <div className="mini-column-heading">
                    <span className="status-dot done" />
                    Done
                    <span>2</span>
                  </div>
                  <MiniTask title="Project kickoff" color="green" status="Done" />
                  <MiniTask title="Team brief" color="green" status="Done" />
                </div>
              </div>

              <div className="screen-footer">
                <div className="avatar-stack">
                  <span>A</span>
                  <span>M</span>
                  <span>S</span>
                </div>
                <span>Working together, beautifully.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="laptop-bottom">
          <div className="laptop-notch" />
        </div>
        <div className="laptop-shadow" />
      </div>

      <div className="floating-note note-left">
        <span className="note-check">✓</span>
        <span>
          <strong>Teamwork</strong>
          <small>Everyone in sync</small>
        </span>
      </div>

      <div className="floating-note note-right">
        <span className="note-sparkle">✳</span>
        <span>
          <strong>Little steps.</strong>
          <small>Lovely progress.</small>
        </span>
      </div>

      <div className="plant">
        <span className="plant-leaf leaf-one" />
        <span className="plant-leaf leaf-two" />
        <span className="plant-leaf leaf-three" />
        <span className="plant-leaf leaf-four" />
        <span className="plant-stem" />
        <span className="plant-pot" />
      </div>

      <div className="paper-note">
        <span>ideas</span>
        <span>in progress</span>
        <span>✳</span>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="/" className="brand">
  <img
    src={BasecampyLogo}
    alt=""
    className="brand-mark"
  />
  <span>Basecampy</span>
  <span className="brand-sparkle" aria-hidden="true">✳</span>
</a>
      

        <nav className="nav-links" aria-label="Main navigation">
          <a className="nav-link active" href="#home">Home</a>
          <a className="nav-link" href="#features">Features</a>
          <a className="nav-link" href="#about">About</a>
        </nav>

        <a className="button button-small" href="/register">
          Get Started <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero page-container" id="home">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          A calmer way to get things done
        </div>

        
<h1>
  Great teams.
  <br />
  <span>Clear goals.</span>
  <br />
  Real progress<span className="heading-period">.</span>
</h1>

<p className="hero-description">
  Bring your organization, projects, and people together in one
  workspace. Plan work, assign responsibilities, share ideas,
  and track progress — from kickoff to completion.
</p>


        <div className="hero-actions">
          <a className="button" href="/register">
            Get Started <span aria-hidden="true">↗</span>
          </a>
          <a className="button button-secondary" href="#features">
            Explore Features <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="hero-social-proof">
          <div className="proof-avatars" aria-hidden="true">
            <span>S</span>
            <span>A</span>
            <span>M</span>
          </div>
        
<p>
  One workspace. <strong>Every team moving forward.</strong>
</p>

          <span className="proof-heart" aria-hidden="true">♡</span>
        </div>
      </div>

      <div className="hero-art">
        <ProductIllustration />
        <div className="art-caption">
          <span className="caption-line" />
          <span>Good things happen when we work together.</span>
        </div>
      </div>
    </section>
  );
}

function FeatureStrip() {
  return (
    <section className="features-section" id="features">
      <div className="page-container">
        <div className="features-intro" id="about">
         
<div>
  <span className="section-kicker">Built for teams that get things done</span>
  <h2>
    From shared ideas
    <br />
    <span>to measurable progress.</span>
  </h2>
</div>

<p>
  Give every team a shared view of priorities, responsibilities,
  deadlines, and project progress. Keep everyone aligned without
  scattering work across disconnected tools.
</p>

        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <div className="feature-card-top">
                <span className={`feature-icon icon-${feature.number}`}>
                  {feature.icon}
                </span>
                <span className="feature-number">{feature.number}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className="feature-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="page-container footer-inner">
        <Brand />
        <p>Thoughtful work. Together.</p>
        <span>Made for the work that matters <span aria-hidden="true">♡</span></span>
      </div>
    </footer>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <main>
                <Hero />
                <FeatureStrip />
              </main>
              <Footer />
            </>
          }
        />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="*"
          element={
            <main style={{ padding: "48px", textAlign: "center" }}>
              <h1>Page not found</h1>
              <a href="/">Return to Basecampy</a>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

