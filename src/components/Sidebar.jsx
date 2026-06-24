import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLayout, FiFolder, FiUploadCloud, FiSettings, FiDatabase, FiLogOut } from "react-icons/fi";

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [profile, setProfile] = useState({
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || ""
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfile({
        name: localStorage.getItem("userName") || "",
        email: localStorage.getItem("userEmail") || ""
      });
    };

    window.addEventListener("profileUpdate", handleProfileUpdate);
    window.addEventListener("storage", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdate", handleProfileUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
    };
  }, []);

  const getInitials = (fullName) => {
    if (!fullName) return "GU";
    const cleanName = fullName.trim();
    if (!cleanName) return "GU";
    const parts = cleanName.split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: FiLayout },
    { name: "Assets", path: "/assets", icon: FiFolder },
    { name: "Uploads", path: "/uploads", icon: FiUploadCloud },
    { name: "Settings", path: "/settings", icon: FiSettings },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 glass-panel border-r border-white/5 flex flex-col justify-between z-30 select-none bg-dark-900/50">
      
      {/* Top Section */}
      <div className="p-6">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 mb-10 group px-2">
          <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-tr from-accent-cyan to-accent-sky flex items-center justify-center shadow-md shadow-accent-cyan/15 group-hover:scale-105 transition-transform duration-300">
            <FiDatabase className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-white leading-tight">
              AssetVault
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider">
              ENTERPRISE DAM
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-sm font-medium transition duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-accent-cyan/15 to-accent-sky/10 border border-accent-cyan/20 text-white shadow-sm shadow-accent-cyan/5"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent hover:border-white/5"
                }`}
              >
                <Icon className={`text-base transition-colors ${isActive ? "text-accent-cyan" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-white/5 bg-dark-800/40">
        
        {/* User Profile Widget */}
        <div className="flex items-center gap-3 mb-4.5 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent-cyan/20 to-accent-sky/20 flex items-center justify-center border border-white/10 text-white font-bold text-xs select-none">
            {getInitials(profile.name)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-300 truncate">{profile.name || "Guest User"}</p>
            <p className="text-[10px] text-slate-500 truncate font-mono">{profile.email || "Offline Session"}</p>
          </div>
        </div>

        {/* Logout Link */}
        <Link
          to="/"
          onClick={() => {
            // Optional: clear active session on logout
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            window.dispatchEvent(new Event("profileUpdate"));
          }}
          className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold text-red-400/80 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition duration-200 w-full"
        >
          <FiLogOut className="text-sm" />
          <span>Sign Out</span>
        </Link>

      </div>

    </aside>
  );
}

export default Sidebar;
