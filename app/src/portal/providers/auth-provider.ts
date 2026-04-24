import type { AuthProvider } from "@refinedev/core";

const API_URL = import.meta.env.VITE_MUJARRAD_API_URL ?? "https://mujarrad.onrender.com/api";
const TOKEN_KEY = "sia_token";
const USER_KEY = "sia_user";

export const authProvider: AuthProvider = {
  async login(params) {
    try {
      if (params.provider === "google" && params.credential) {
        const res = await fetch(`${API_URL}/auth/oauth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: params.credential }),
        });
        if (!res.ok) throw new Error("Google login failed");
        const { token, user } = await res.json();
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return { success: true, redirectTo: "/portal" };
      }

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: params.email, password: params.password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const { token, user } = await res.json();
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { success: true, redirectTo: "/portal" };
    } catch (err) {
      return {
        success: false,
        error: { name: "LoginError", message: (err as Error).message },
      };
    }
  },

  async logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { success: true, redirectTo: "/portal/login" };
  },

  async check() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return { authenticated: false, redirectTo: "/portal/login" };

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return { authenticated: false, redirectTo: "/portal/login" };
      }
    } catch {
      // If token can't be decoded, still treat as authenticated (mock mode)
    }

    return { authenticated: true };
  },

  async onError(error) {
    if ((error as { statusCode?: number }).statusCode === 401) {
      return { logout: true };
    }
    return { error };
  },

  async getIdentity() {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      return { id: user.id, name: user.name, email: user.email, avatar: user.avatar };
    }
    return null;
  },

  async getPermissions() {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      return { role: user.role ?? "admin" };
    }
    return { role: "admin" };
  },
};

export const mockAuthProvider: AuthProvider = {
  async login() {
    const mockUser = { id: "user-1", name: "Omar", email: "board@wider.community", avatar: "", role: "admin" };
    localStorage.setItem(TOKEN_KEY, "mock-jwt-token");
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    return { success: true, redirectTo: "/portal" };
  },

  async logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { success: true, redirectTo: "/portal/login" };
  },

  async check() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return { authenticated: false, redirectTo: "/portal/login" };
    return { authenticated: true };
  },

  async onError(error) {
    if ((error as { statusCode?: number }).statusCode === 401) {
      return { logout: true };
    }
    return { error };
  },

  async getIdentity() {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) return JSON.parse(stored);
    return { id: "user-1", name: "Omar", email: "board@wider.community", avatar: "", role: "admin" };
  },

  async getPermissions() {
    return { role: "admin" };
  },
};
