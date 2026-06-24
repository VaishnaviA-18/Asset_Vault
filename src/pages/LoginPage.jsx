import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight, FiDatabase, FiAlertCircle } from "react-icons/fi";
import { useState } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Simple validation checks
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Load or initialize user profile. Avoid dummy hardcoded names like "Asset Vault User"
    const registeredEmail = localStorage.getItem("userEmail");
    if (registeredEmail !== email) {
      // If logging in with a new email, initialize it
      localStorage.setItem("userEmail", email);
      const prefix = email.split("@")[0];
      const capitalized = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      localStorage.setItem("userName", capitalized);
      localStorage.setItem("userRole", "Student");
    } else {
      // Keep existing name or capitalize email prefix if empty
      const existingName = localStorage.getItem("userName");
      if (!existingName) {
        const prefix = email.split("@")[0];
        const capitalized = prefix.charAt(0).toUpperCase() + prefix.slice(1);
        localStorage.setItem("userName", capitalized);
      }
    }
    
    // Ensure no fake phone numbers are set
    localStorage.removeItem("userPhone");

    // Dispatch update event to sync headers/sidebar
    window.dispatchEvent(new Event("profileUpdate"));

    // Route to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen bg-dark-950 flex items-center justify-center px-6 overflow-hidden selection:bg-accent-cyan/30 selection:text-white">
      {/* Background grids & glows */}
      <div className="absolute inset-0 bg-mesh-grid opacity-25 z-0" />
      <div className="radial-glow top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-35 z-0" />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 justify-center group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-cyan to-accent-sky flex items-center justify-center shadow-lg shadow-accent-cyan/25 group-hover:scale-105 transition-transform duration-300">
              <FiDatabase className="text-white text-2xl" />
            </div>
            <span className="text-3xl font-bold font-display tracking-tight text-white">
              AssetVault
            </span>
          </Link>
          <p className="text-slate-400 text-sm font-light">
            Enter your credentials to access your secure vault
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/80">
          
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2.5">
              <FiAlertCircle className="text-base flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email input group */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <FiMail />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 glass-input text-white rounded-2xl outline-none placeholder:text-slate-500 text-sm font-medium"
                />
              </div>
            </div>

            {/* Password input group */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-accent-cyan hover:text-accent-sky transition">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <FiLock />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 glass-input text-white rounded-2xl outline-none placeholder:text-slate-500 text-sm font-medium"
                />
              </div>
            </div>

            {/* Sign in Button */}
            <button
              type="submit"
              className="w-full relative group overflow-hidden bg-gradient-to-r from-accent-cyan to-accent-sky text-white py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md shadow-accent-cyan/20 hover:scale-[1.01] active:scale-[0.99] transition duration-200"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 cursor-pointer">
                Sign In <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

          </form>

          {/* Return link */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition">
              &larr; Back to Landing Page
            </Link>
          </div>

          {/* Account swap footer */}
          <p className="text-center text-sm text-slate-400 mt-8 font-light border-t border-white/5 pt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-accent-cyan hover:text-accent-sky transition decoration-2 underline-offset-4 hover:underline"
            >
              Create Account
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}

export default LoginPage;