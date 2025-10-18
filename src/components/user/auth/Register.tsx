"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `HTTP error! status: ${res.status}`);
      }

      setSuccess("Registration successful!");
      setSubmitted(true);
      setForm({ name: "", email: "", password: "", phone: "" });
      router.push("/login");
    } catch {
      setError("Something went wrong during registration");
      console.error("Registration error:");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen  px-4 py-8">
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 border border-gray-300/20">
        {/* Left - Hero */}
        <section className="relative p-6 md:p-12 flex flex-col justify-between gap-6 bg-gradient-to-b from-amber-700/20 to-black/40">
          <div className="absolute inset-0">
            <Image
              src="/assets/auth.png"
              alt="Cricket celebration"
              fill
              className="object-cover object-center opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Join the Club
            </h1>
            <p className="mt-2 sm:mt-3 text-white text-sm sm:text-base">
              Create your account and be match-ready. Celebrate the spirit of cricket — bats, balls and bold plays.
            </p>
          </div>

          <footer className="relative z-10 mt-4 text-xs sm:text-sm text-white">
            Already have an account?{" "}
            <a href="/login" className="underline font-medium">
              Sign in
            </a>
          </footer>
        </section>

        {/* Right - Form */}
        <section className="p-6 md:p-12 text-white backdrop-blur-md flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl font-bold">Register</h2>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm">Fill in your details to start playing.</p>

          <form className="mt-4 sm:mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 sm:px-4 sm:py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-black"
                placeholder="e.g. Virat Kohli"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 sm:px-4 sm:py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-black"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 sm:px-4 sm:py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-black"
                placeholder="9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                required
                minLength={6}
                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 sm:px-4 sm:py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-black"
                placeholder="Choose a strong password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 sm:py-3 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Create account"}
            </button>

            {submitted && success && <p className="text-sm text-green-400">{success}</p>}
            {error && <p className="text-sm text-red-400">{error}</p>}
          </form>

          <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-slate-400">
            By signing up you agree to our{" "}
            <a href="#" className="underline">Terms</a> and{" "}
            <a href="#" className="underline">Privacy Policy</a>.
          </div>
        </section>
      </div>
    </main>
  );
}
