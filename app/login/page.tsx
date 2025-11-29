"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Logging in:", { email, password });
    // Add authentication logic here
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-12 max-w-5xl mx-auto">
        {/* Left: Login Form */}
        <div className="w-full md:w-1/2 mb-12 md:mb-0">
          <h2 className="text-2xl font-bold mb-6">Welcome Back to Pollify!</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm"
            />
            <div className="text-sm text-[#34967C] mt-2 cursor-pointer">
              Forgot Password?
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium w-full mt-4"
          >
            Login
          </button>

          <p className="text-sm text-[#7E7B7B] mt-4 text-center">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-[#34967C] font-medium">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Right: Illustration */}
        <div className="w-full md:w-1/2 flex justify-center">
          {/* Replace with actual image */}
          <div className="w-64 h-64 bg-[#F5F5F5] rounded-lg flex items-center justify-center text-[#7E7B7B] text-sm">
            Illustration Placeholder
          </div>
        </div>
      </section>
    </main>
  );
}