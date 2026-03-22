import { useState, useEffect } from "react";
import { fetchUsers } from "../services/userService";
import type { User } from "../services/userService";

export function useFetchUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchUsers(controller.signal)
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && (err.name === "AbortError" || err.message === "canceled")) return;

        if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "ECONNABORTED") {
          setError("⚠️ Request timeout. Please try again.");
        } else {
          setError(err instanceof Error ? err.message : "⚠️ Unable to load users.");
        }
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { users, loading, error };
}