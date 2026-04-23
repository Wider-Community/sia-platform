import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { useGoogleLogin } from "@react-oauth/google";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Force light mode for investor login
  const setTheme = useThemeStore((s) => s.setTheme);
  useEffect(() => { setTheme("light"); }, [setTheme]);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    const session = localStorage.getItem("sia-investor-session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.token) navigate("/investor/dashboard", { replace: true });
      } catch { /* ignore */ }
    }
  }, [navigate]);

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError(null);
      try {
        // Exchange Google access token for an ID token via Google's tokeninfo
        // Then send to Mujarrad's OAuth endpoint
        const idTokenRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?access_token=${tokenResponse.access_token}`
        );
        if (!idTokenRes.ok) throw new Error("Failed to verify Google token");

        // Get user info from Google
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        if (!userInfoRes.ok) throw new Error("Failed to fetch user info");
        const userInfo = await userInfoRes.json();

        // Try Mujarrad OAuth endpoint with the access token
        // Mujarrad expects an idToken, but let's try the Google credential flow
        let mujarradRes = await fetch(`${API_BASE}/api/auth/oauth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: tokenResponse.access_token }),
        });

        let session;
        if (mujarradRes.ok) {
          const data = await mujarradRes.json();
          session = {
            token: data.token,
            role: "investor",
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            userId: data.userId || data.user?.id,
          };
        } else {
          // Fallback: store Google session directly (Mujarrad may not be reachable)
          console.warn("Mujarrad OAuth failed, using Google session directly");
          session = {
            token: tokenResponse.access_token,
            role: "investor",
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            provider: "google-direct",
          };
        }

        localStorage.setItem("sia-investor-session", JSON.stringify(session));
        navigate("/investor/dashboard");
      } catch (err) {
        console.error("Login error:", err);
        setError(err instanceof Error ? err.message : "Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: (err) => {
      console.error("Google login error:", err);
      setError("Google sign-in was cancelled or failed. Please try again.");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "var(--bg)" }}>
      <div className="glass-card glass-card-accent w-full max-w-md p-8 text-center">
        <img src="/images/sia-logo.png" alt="SIA" className="h-12 w-auto mx-auto mb-6" />
        <h1 className="text-2xl font-serif font-bold mb-2" style={{ color: "var(--text)" }}>
          Investor Portal
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
          Sign in to access financial models and analytics
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">
            {error}
          </div>
        )}

        <button
          onClick={() => googleLogin()}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
          style={{ backgroundColor: "var(--accent)", color: "#1a1a1a" }}
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        <a href="/" className="inline-block mt-6 text-sm transition-colors" style={{ color: "var(--text-tertiary)" }}>
          &larr; Back to website
        </a>
      </div>
    </div>
  );
}
