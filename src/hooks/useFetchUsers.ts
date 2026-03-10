// src/hooks/useFetchUsers.ts

import { useState, useEffect } from "react";
import { fetchUsers } from "../services/userService";
import type { User } from "../services/userService";

export function useFetchUsers() {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const controller = new AbortController();

    // reset states when hook runs
    setLoading(true);
    setError(null);

    fetchUsers(controller.signal)
      .then((data) => {
        setUsers(data);           // data already normalized
        setLoading(false);
      })
      .catch((err: any) => {

        // ✅ Ignore cancelled requests (component unmount / navigation)
        if (err.name === "AbortError" || err.message === "canceled") {
          return;
        }

        // ✅ Handle timeout errors
        if (err.code === "ECONNABORTED") {
          setError("⚠️ Request timeout. Please try again.");
        } else {
          setError(err.message || "⚠️ Unable to load users.");
        }

        setLoading(false);
      });

    // cleanup
    return () => {
      controller.abort();
    };

  }, []);

  return { users, loading, error };
}