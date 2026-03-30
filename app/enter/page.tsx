"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EnterPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async () => {
    const res = await fetch("/api/check-password", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      router.push("/");
    } else {
      setError("Incorrect password.");
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <img src="/QTlogo.png" alt="QT Hub" className="w-32 mb-8" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Coming Soon
      </h1>
      <p className="text-gray-500 mb-6 text-sm">Enter the password to access QT Hub.</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Password"
        className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm w-full max-w-xs mb-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
      />
      {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
      <button onClick={submit} className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-8 py-3 rounded-full transition-colors">
        Enter
      </button>
    </main>
  );
}