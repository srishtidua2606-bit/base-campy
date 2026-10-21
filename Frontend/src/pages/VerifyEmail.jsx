
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function VerifyEmail() {
  const { token } = useParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  // Prevent duplicate verification requests during React's
  // development-only Strict Mode effect check.
  const requestStarted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("The verification link is missing its token.");
      return;
    }

    if (requestStarted.current) return;
    requestStarted.current = true;

    async function verifyEmail() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/auth/verify-email/${encodeURIComponent(token)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Email verification failed.");
        }

        setStatus("success");
        setMessage(data.message || "Your email has been verified!");
      } catch (error) {
        setStatus("error");
        setMessage(
          error.message || "Something went wrong. Please try again."
        );
      }
    }

    verifyEmail();
  }, [token]);

  return (
    <main className="verification-page">
      <section className="verification-card">
        {status === "loading" && <h1>Verifying your email...</h1>}

        {status === "success" && <h1>Email verified!</h1>}

        {status === "error" && <h1>Verification unsuccessful</h1>}

        <p>{message}</p>

        {status === "success" && (
          <Link to="/login">Continue to login</Link>
        )}

        {status === "error" && (
          <Link to="/register">Back to registration</Link>
        )}
      </section>
    </main>
  );
}
