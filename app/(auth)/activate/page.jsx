"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const AUTH_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL;

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!AUTH_URL) {
      setStatus("error");
      setMessage("Configuration error: NEXT_PUBLIC_USER_SERVICE_URL is not defined.");
      return;
    }

    if (!token) {
      setStatus("error");
      setMessage("Activation token is missing.");
      return;
    }

    let mounted = true;
    const ACTIVATION_URL = `${AUTH_URL}/auth/activate/?token=${encodeURIComponent(token)}`;

    async function activate() {
      try {
        setStatus("loading");
        const res = await fetch(ACTIVATION_URL, { method: "GET", cache: "no-store" });

        if (!mounted) return;

        if (res.ok) {
          setStatus("success");
          // Immediately navigate to login on success
          router.push("/login");
          return;
        }

        const body = await res.text();
        setStatus("error");
        setMessage(`Activation failed (status ${res.status}): ${body || "No response body"}`);
      } catch (err) {
        if (!mounted) return;
        setStatus("error");
        setMessage(err?.message || "Unexpected error");
      }
    }

    activate();

    return () => {
      mounted = false;
    };
  }, [AUTH_URL, token, router]);

  // Simple UI
  if (status === "loading" || status === "idle") {
    return (
      <div>
        <h2>Verifying your account…</h2>
        <p>Please wait while we activate your account.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div>
        <h2>Activated — redirecting to login…</h2>
      </div>
    );
  }

  // error
  return (
    <div>
      <h2>Activation error</h2>
      <p>{message}</p>
    </div>
  );
}
