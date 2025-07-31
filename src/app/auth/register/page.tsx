"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !password || !name) {
      setError("All fields are required.");
      return;
    }
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) throw new Error("Registration failed");
      setSuccess("Registration successful! Redirecting to sign in...");
      setTimeout(() => router.push("/auth/signin"), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center bg-gradient-to-br from-black via-red-900/20 to-black">
      <div className="w-full max-w-md p-8 bg-black/80 rounded-xl backdrop-blur-sm border border-gray-800">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Register</h1>
        {error && (
          <div className="mb-4 text-red-500 text-center font-semibold bg-red-100/10 rounded p-2 border border-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-green-500 text-center font-semibold bg-green-100/10 rounded p-2 border border-green-400">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none text-lg"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none text-lg"
              required
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none text-lg pr-12"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm0 0a9.956 9.956 0 01-2.125 6.125M9.88 9.88l4.24 4.24M6.1 6.1l11.8 11.8" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.5 0c-1.74-4.14-5.64-7-10.5-7S3.24 7.86 1.5 12c1.74 4.14 5.64 7 10.5 7s8.76-2.86 10.5-7z" />
                </svg>
              )}
            </button>
          </div>
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition duration-200 text-lg">Register</button>
        </form>
        <div className="mt-4 text-gray-400 text-center">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-red-400 hover:underline">Sign In</a>
        </div>
      </div>
    </div>
  );
}
