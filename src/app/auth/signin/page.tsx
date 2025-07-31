"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if already signed in
  React.useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.replace('/');
    } else {
      // Show a more helpful error if available
      setError(res?.error || "Invalid credentials");
    }
  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center bg-gradient-to-br from-black via-red-900/20 to-black">
    <div className="w-full max-w-md p-8 bg-black/80 rounded-xl backdrop-blur-sm border border-gray-800">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Sign In</h1>
      {error && (
        <div className="mb-4 text-red-500 text-center font-semibold bg-red-100/10 rounded p-2 border border-red-400">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder="Email or phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none text-lg"
          />
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none text-lg pr-12"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              // Eye-off SVG
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm0 0a9.956 9.956 0 01-2.125 6.125M9.88 9.88l4.24 4.24M6.1 6.1l11.8 11.8" />
              </svg>
            ) : (
              // Eye SVG
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.5 0c-1.74-4.14-5.64-7-10.5-7S3.24 7.86 1.5 12c1.74 4.14 5.64 7 10.5 7s8.76-2.86 10.5-7z" />
              </svg>
            )}
          </button>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition duration-200 text-lg"
        >
          Sign In
        </button>
      </form>
      <div className="mt-4 text-gray-400 text-center">
          Don&apos;t have an account?{' '}
          <a href="/auth/register" className="text-red-400 hover:underline">Register</a>
        </div>
    </div>
  </div>
  );
}
