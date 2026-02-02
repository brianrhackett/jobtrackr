import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCookie = (name) => {
	const match = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
	return match ? match[2] : null;
  };
  // Always include cookies
  const fetchWithCredentials = (url, options = {}) => {
	const xsrf = getCookie("XSRF-TOKEN"); // set by /sanctum/csrf-cookie

	return fetch(url, {
	  ...options,
	  credentials: "include",
	  headers: {
	    Accept: "application/json",
		"Content-Type": "application/json",
		"X-Requested-With": "XMLHttpRequest",
		...(xsrf ? { "X-XSRF-TOKEN": decodeURIComponent(xsrf) } : {}),
		...(options.headers || {}),
	  },
	});
  };

  // Get logged-in user
  const fetchUser = async () => {
    try {
      const res = await fetchWithCredentials("/api/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("fetchUser error", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (form) => {
    await fetch("/sanctum/csrf-cookie", { credentials: "include" });

    const res = await fetchWithCredentials("/api/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json();
      throw err;
    }

    const data = await res.json();
    setUser(data);
    return data;
  };

  // Login
  const login = async (form) => {
    await fetch("/sanctum/csrf-cookie", { credentials: "include" });

    const res = await fetchWithCredentials("/api/login", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json();
      throw err;
    }

    const data = await res.json();
    setUser(data);
    return data;
  };

  // Logout
  const logout = async () => {
    await fetchWithCredentials("/api/logout", { method: "POST" });
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
