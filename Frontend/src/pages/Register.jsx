
import { useState } from "react";
import { Link } from "react-router-dom";
import BasecampyLogo from "../assets/basecampy-logo.svg";
import "../register.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!API_BASE_URL) {
      setError(
        "Backend URL is missing. Please check your frontend .env file."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            fullName: form.name.trim(),
            username: form.username.trim().toLowerCase(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }),
        }
      );

      const contentType = response.headers.get("content-type");
      let result;

      if (contentType?.includes("application/json")) {
        result = await response.json();
      } else {
        const responseText = await response.text();
        console.error("Unexpected server response:", responseText);

        throw new Error(
          `The server returned an unexpected response (${response.status}). Check the registration API URL.`
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            `Registration failed (${response.status}).`
        );
      }

      setSuccess(
        result.message ||
          "Registration successful! Your account has been created."
      );

      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <header className="register-header">
        <Link to="/" className="register-brand">
          <img src={BasecampyLogo} alt="" />
          <span>Basecampy</span>
          <span className="register-sparkle">✳</span>
        </Link>

        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </header>

      <section className="register-layout">
        <div className="register-intro">
          <span className="register-eyebrow">
            YOUR WORKSPACE STARTS HERE
          </span>

          <h1>
            Bring your team
            <br />
            <span>into focus.</span>
          </h1>

          <p>
            Create your account to organize projects, bring
            people together, and turn shared ideas into
            measurable progress.
          </p>

          <div className="register-benefits">
            <div>
              <span className="benefit-check">✓</span>
              <span>Keep projects organized in one place</span>
            </div>

            <div>
              <span className="benefit-check">✓</span>
              <span>Bring teams and responsibilities together</span>
            </div>

            <div>
              <span className="benefit-check">✓</span>
              <span>Track progress from start to finish</span>
            </div>
          </div>

          <div className="register-note">
            <span>✳</span>
            Good work starts with a clear plan.
          </div>
        </div>

        <div className="register-card">
          <div className="register-card-heading">
            <span className="register-card-kicker">GET STARTED</span>
            <h2>Create your account</h2>
            <p>Enter your details to get started with Basecampy.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="register-field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Choose a username"
                autoComplete="username"
                minLength={3}
                value={form.username}
                onChange={handleChange}
                required
              />
              <small>Use at least 3 characters. Your username will be lowercase.</small>
            </div>

            <div className="register-field">
              <label htmlFor="email">Work email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@organization.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <p className="register-message" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="register-success" role="status">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <span aria-hidden="true"> ↗</span>}
            </button>

            <p className="register-terms">
              By creating an account, you agree to your
              organization's applicable terms and policies.
            </p>
          </form>
        </div>
      </section>

      <footer className="register-footer">
        <span>© Basecampy</span>
        <span>Thoughtful work. Together.</span>
      </footer>
    </main>
  );
}
