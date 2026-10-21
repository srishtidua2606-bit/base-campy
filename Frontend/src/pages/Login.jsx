
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BasecampyLogo from "../assets/basecampy-logo.svg";

import "./login.css";
  

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "username" ? value.toLowerCase().trim() : value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!API_BASE_URL) {
      setError(
        "Backend URL is not configured. Add VITE_API_BASE_URL to your frontend .env file."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({
    email: form.email.trim(),
    username: form.username,
    password: form.password,
  }),
});

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to sign in. Check your details and try again."
        );
      }

      // The backend returns an accessToken in its response.
      // Keep it in memory for now; we'll implement shared auth state
      // when we build the dashboard and protected routes.
      navigate("/dashboard", {
        replace: true,
        state: {
          user: result.data?.user,
          accessToken: result.data?.accessToken,
        },
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to Basecampy. Check whether your backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <header className="login-header">
        <Link to="/" className="login-brand">
          <img src={BasecampyLogo} alt="" />
          <span>Basecampy</span>
          <span className="login-sparkle" aria-hidden="true">
            ✳
          </span>
        </Link>

        <p>
          New to Basecampy? <Link to="/register">Create an account</Link>
        </p>
      </header>

      <section className="login-layout">
        <div className="login-intro">
          <span className="login-eyebrow">WELCOME BACK</span>

          <h1>
            Your team.
            <br />
            <span>Your next move.</span>
          </h1>

          <p>
            Pick up where your team left off. Your projects,
            responsibilities, and progress are all in one place.
          </p>

          <div className="login-workspace-preview">
            <div className="login-preview-top">
              <div>
                <span className="preview-label">WORKSPACE OVERVIEW</span>
                <h3>Work in motion</h3>
              </div>
              <span className="preview-status">● On track</span>
            </div>

            <div className="preview-progress-row">
              <div>
                <span>Project planning</span>
                <strong>72%</strong>
              </div>
              <div className="preview-progress">
                <span style={{ width: "72%" }} />
              </div>
            </div>

            <div className="preview-progress-row">
              <div>
                <span>Team deliverables</span>
                <strong>48%</strong>
              </div>
              <div className="preview-progress">
                <span style={{ width: "48%" }} />
              </div>
            </div>

            <p className="preview-footnote">
              A shared view of what matters next.
            </p>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-heading">
            <span className="login-card-kicker">YOUR WORKSPACE AWAITS</span>
            <h2>Sign in to Basecampy</h2>
            <p>Enter your account details to continue.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@organization.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-username">Username</label>
              <input
                id="login-username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="yourusername"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <div className="login-password-label">
                <label htmlFor="login-password">Password</label>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              <div className="login-password-wrap">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <span aria-hidden="true">↗</span>}
            </button>

            <p className="login-security-note">
              Your workspace is ready when you are.
            </p>
          </form>
        </div>
      </section>

      <footer className="login-footer">
        <span>© Basecampy</span>
        <span>Thoughtful work. Together.</span>
      </footer>
    </main>
  );
}
