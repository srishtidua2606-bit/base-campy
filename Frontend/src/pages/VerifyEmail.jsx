
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BasecampyLogo from "../assets/basecampy-logo.svg";
import "./VerifyEmail.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function VerifyEmail() {
  const { token } = useParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("We're checking your verification link.");
  const [retryCount, setRetryCount] = useState(0);

  const requestStarted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing its token. Please open the complete link from your email.");
      return;
    }

    if (requestStarted.current) return;
    requestStarted.current = true;

    async function verifyEmail() {
      setStatus("loading");
      setMessage("We're checking your verification link.");

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/auth/verify-email/${encodeURIComponent(token)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "We couldn't verify this email address."
          );
        }

        setStatus("success");
        setMessage(data.message || "Your email has been verified successfully.");
      } catch (error) {
        setStatus("error");
        setMessage(
          "Something went wrong. Please try again."
        );
      }
    }

    verifyEmail();
  }, [token, retryCount]);

  function handleRetry() {
    requestStarted.current = false;
    setStatus("loading");
    setMessage("Let's try checking your verification link again.");
    setRetryCount((count) => count + 1);
  }

  return (
    <main className={`verification-page verification-${status}`}>
      <header className="verification-header">
        <Link className="verification-brand" to="/" aria-label="Basecampy home">
          <img src={BasecampyLogo} alt="" />
          <span>Basecampy</span>
          <span className="verification-sparkle" aria-hidden="true">✳</span>
        </Link>

        <Link className="verification-header-link" to="/login">
          Already verified? <span>Log in ↗</span>
        </Link>
      </header>

      <section className="verification-main">
        <div className="verification-decoration decoration-one" />
        <div className="verification-decoration decoration-two" />

        <article className="verification-card" aria-live="polite">
          <div className={`verification-visual visual-${status}`}>
            <div className="verification-orbit orbit-outer" />
            <div className="verification-orbit orbit-inner" />

            <div className="verification-icon-circle">
              {status === "loading" && (
                <span className="verification-mail-icon" aria-hidden="true">
                  <svg viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="13" width="32" height="23" rx="5" />
                    <path d="m10 16 14 11 14-11" />
                  </svg>
                </span>
              )}

              {status === "success" && (
                <svg
                  className="verification-check"
                  viewBox="0 0 48 48"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="m12 25 8 8 17-18" />
                </svg>
              )}

              {status === "error" && (
                <svg
                  className="verification-error-icon"
                  viewBox="0 0 48 48"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M24 14v13" />
                  <circle cx="24" cy="34" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              )}
            </div>

            <span className="verification-spark verification-spark-one" />
            <span className="verification-spark verification-spark-two" />
            <span className="verification-spark verification-spark-three" />
          </div>

          <p className="verification-eyebrow">
            {status === "loading" && "ONE MOMENT, PLEASE"}
            {status === "success" && "YOU'RE ALL SET"}
            {status === "error" && "LET'S SORT THIS OUT"}
          </p>

          <h1>
            {status === "loading" && (
              <>Making sure it's <span>really you.</span></>
            )}
            {status === "success" && (
              <>You're <span>verified!</span></>
            )}
            {status === "error" && (
              <>We hit a <span>little snag.</span></>
            )}
          </h1>

          <p className="verification-message">{message}</p>

          {status === "loading" && (
            <div className="verification-progress">
              <span />
            </div>
          )}

          {status === "success" && (
            <div className="verification-next-step">
              <span className="next-step-icon" aria-hidden="true">✦</span>
              <div>
                <strong>Your workspace journey starts here.</strong>
                <p>Your email is confirmed. You're ready for the next step.</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="verification-help">
              <strong>Here's what you can try</strong>
              <p>The link may have expired, already been used, or the connection may have failed.</p>
            </div>
          )}

          <div className="verification-actions">
            {status === "success" && (
              <Link className="verification-primary-button" to="/login">
                Continue to login <span aria-hidden="true">↗</span>
              </Link>
            )}

            {status === "error" && (
              <>
                <button
                  className="verification-primary-button"
                  onClick={handleRetry}
                  type="button"
                >
                  Try again <span aria-hidden="true">↻</span>
                </button>
                <Link className="verification-secondary-link" to="/register">
                  Back to registration
                </Link>
              </>
            )}

            {status === "loading" && (
              <span className="verification-wait-note">
                <span className="verification-live-dot" />
                Securely checking with Basecampy
              </span>
            )}
          </div>

          <div className="verification-divider" />

          <p className="verification-security">
            <span aria-hidden="true">♧</span>
            Your account security matters to us.
          </p>
        </article>

        <p className="verification-bottom-note">
          Thoughtful work. Together. <span aria-hidden="true">♡</span>
        </p>
      </section>
    </main>
  );
}
