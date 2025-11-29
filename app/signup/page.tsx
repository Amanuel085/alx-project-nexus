"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSignup = () => {
    if (!name || !email || !password || password !== confirm) return;
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-12 max-w-5xl mx-auto">
        <div className="w-full md:w-1/2 mb-12 md:mb-0">
          <h2 className="text-2xl font-bold mb-6">Create your Pollify account</h2>

          {!submitted ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-md shadow-sm text-sm bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-md shadow-sm text-sm bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-md shadow-sm text-sm bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-md shadow-sm text-sm bg-background"
                />
              </div>

              <button
                onClick={handleSignup}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium w-full mt-2"
              >
                Sign Up
              </button>

              <p className="text-sm text-muted-foreground mt-4 text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium">Sign In</Link>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Verify your email</h3>
              <p className="text-sm text-muted-foreground">
                We sent a verification link to <span className="font-medium text-foreground">{email}</span>. Please click the link to activate your account and continue.
              </p>
              <p className="text-sm text-muted-foreground">
                Didn’t get the email? Check your spam folder or <button className="underline text-primary">resend</button>.
              </p>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
            Illustration Placeholder
          </div>
        </div>
      </section>
    </main>
  );
}