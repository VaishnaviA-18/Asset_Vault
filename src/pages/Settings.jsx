import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiCheckCircle,
  FiCalendar,
  FiInfo,
  FiX,
  FiMenu,
  FiHardDrive,
  FiActivity,
  FiSliders,
  FiAlertCircle,
  FiUnlock,
  FiFolder
} from "react-icons/fi";

function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile tab states (synced with localStorage) - removed all fake placeholders
  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const [phone, setPhone] = useState(localStorage.getItem("userPhone") || "");
  const [role, setRole] = useState(localStorage.getItem("userRole") || "Student");

  // Preferences tab states
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState("Email");
  const [defaultCategory, setDefaultCategory] = useState("Auto-detect");
  const [compactLayout, setCompactLayout] = useState(false);

  // Storage data fetched from backend
  const [assets, setAssets] = useState([]);
  const [loadingStorage, setLoadingStorage] = useState(true);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    if (activeTab === "Billing") {
      setLoadingStorage(true);
      fetch(`${import.meta.env.VITE_API_URL}/assets`)
        .then((res) => {
          if (!res.ok) throw new Error("API Offline");
          return res.json();
        })
        .then((data) => {
          setAssets(data);
          setLoadingStorage(false);
          setStorageError(false);
        })
        .catch((err) => {
          console.error(err);
          setLoadingStorage(false);
          setStorageError(true);
        });
    }
  }, [activeTab]);

  // Compute live storage stats
  const totalAssetsCount = assets.length;
  const totalUsedBytes = assets.reduce((sum, f) => sum + (f.fileSize || 0), 0);
  const CAPACITY_BYTES = 100 * 1024 * 1024; // 100 MB Capacity
  const remainingBytes = Math.max(CAPACITY_BYTES - totalUsedBytes, 0);
  const capacityPercentage = Math.min((totalUsedBytes / CAPACITY_BYTES) * 100, 100).toFixed(1);

  // Recent Uploads count (uploaded in the last 7 days)
  const recentUploadsCount = assets.filter(asset => {
    if (!asset.uploadDate) return false;
    const uploadDate = new Date(asset.uploadDate);
    const diffTime = Math.abs(new Date() - uploadDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  // Format Helper
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);
    
    if (phone.trim()) {
      localStorage.setItem("userPhone", phone);
    } else {
      localStorage.removeItem("userPhone");
    }

    // Dispatch update event to sync sidebar and dashboard in real-time
    window.dispatchEvent(new Event("profileUpdate"));

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const tabs = ["Profile", "Security", "Preferences", "Billing"];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex font-sans selection:bg-accent-cyan/30 selection:text-white">
      
      {/* Background Grids & Radial Glow */}
      <div className="absolute inset-0 bg-mesh-grid opacity-20 pointer-events-none z-0" />
      <div className="radial-glow top-0 right-1/4 opacity-25 pointer-events-none z-0" />

      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Sidebar Mobile slide drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm">
          <div className="w-64 h-full relative">
            <Sidebar />
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-5 right-[-50px] w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-white"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 min-w-0 flex flex-col z-10">
        
        {/* Mobile Header Bar */}
        <header className="md:hidden glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-cyan to-accent-sky flex items-center justify-center shadow-md">
              <FiFolder className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold font-display tracking-tight text-white">
              AssetVault
            </span>
          </div>
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-300 hover:text-white"
          >
            <FiMenu />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-10 lg:p-12 space-y-8 max-w-4xl mx-auto w-full overflow-y-auto">
          
          {/* Header Panel */}
          <div>
            <p className="text-xs font-bold font-mono tracking-[0.25em] text-accent-cyan uppercase mb-1.5">
              Control Panel
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight">
              Settings
            </h1>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/5 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSaved(false);
                }}
                className={`px-4.5 py-2.5 text-xs font-semibold tracking-wide transition relative cursor-pointer ${
                  activeTab === tab 
                    ? "text-white" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <span>{tab}</span>
                {activeTab === tab && (
                  <span className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-sky shadow-[0_0_10px_rgba(6,182,212,0.7)]" />
                )}
              </button>
            ))}
          </div>

          {/* Settings Saved Notification Alert */}
          {saved && (
            <div className="p-4.5 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-3.5 transition animate-float">
              <FiCheckCircle className="text-lg flex-shrink-0" />
              <div className="text-sm font-medium">
                Profile updated successfully. Sidebar and dashboard values synced in localStorage!
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "Profile" && (
            <div className="space-y-6">
              <form onSubmit={handleProfileSave} className="glass-panel border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                
                <h2 className="text-xl font-bold font-display text-white border-b border-white/5 pb-4">
                  Profile Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono ml-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                        <FiUser />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 glass-input text-white rounded-2xl outline-none placeholder:text-slate-500 text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono ml-1">
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

                  {/* Phone field */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono ml-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                        <FiPhone />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 glass-input text-white rounded-2xl outline-none placeholder:text-slate-500 text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Role dropdown selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono ml-1">
                      User Role
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                        <FiShield />
                      </div>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-dark-900 border border-white/8 text-white rounded-2xl outline-none text-sm font-medium cursor-pointer focus:border-accent-cyan/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.25)] transition duration-200 appearance-none"
                      >
                        <option value="Student">Student</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Developer">Developer</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-xs">
                        ▼
                      </div>
                    </div>
                  </div>

                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-sky hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-accent-cyan/20 text-white font-bold text-xs transition duration-200 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>

              </form>

              {/* Account Status Card Section */}
              <section className="glass-panel border border-white/10 rounded-3xl p-6 md:p-8 space-y-5">
                <h3 className="text-lg font-bold font-display text-white border-b border-white/5 pb-3">
                  Account Metrics
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="glass-panel border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Vault Status
                      </p>
                      <h4 className="text-xl font-bold font-display text-green-400 mt-1">
                        Active Mode
                      </h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/25 flex items-center justify-center">
                      <FiCheckCircle className="text-green-400 text-lg" />
                    </div>
                  </div>

                  <div className="glass-panel border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Member Since
                      </p>
                      <h4 className="text-xl font-bold font-display text-white mt-1">
                        June 2026
                      </h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                      <FiCalendar className="text-slate-400 text-lg" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "Security" && (
            <div className="space-y-6 animate-float">
              
              {/* AES encryption */}
              <div className="glass-panel border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
                <h2 className="text-xl font-bold font-display text-white border-b border-white/5 pb-4 flex items-center gap-2">
                  <FiShield className="text-accent-cyan" /> Encryption Standards
                </h2>
                <div className="space-y-3 text-sm font-light text-slate-300">
                  <p>
                    All asset details registered are managed securely in local SQL services. Under production builds, payload data is encrypted in-transit and mapped via Spring Boot rest connectors.
                  </p>
                  <div className="p-4 rounded-xl bg-dark-900/50 border border-white/5 flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">Encryption Status</span>
                    <span className="text-[10px] font-bold font-mono tracking-wider text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/25 px-2.5 py-0.5 rounded-full">AES-256 GCM ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Password update cards */}
              <div className="glass-panel border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
                <h2 className="text-xl font-bold font-display text-white border-b border-white/5 pb-4 flex items-center gap-2">
                  <FiUnlock className="text-accent-cyan" /> Session Security
                </h2>
                
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                    <div>
                      <p className="font-semibold text-white">Browser Connection</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">Chrome on Windows (Current session)</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan font-mono text-[9px]">ACTIVE</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-white">Two-Factor Authentication</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">Multi-factor phone alerts</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-500 font-mono text-[9px] border border-white/5">COMING SOON</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === "Preferences" && (
            <form onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="glass-panel border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-float">
              
              <h2 className="text-xl font-bold font-display text-white border-b border-white/5 pb-4 flex items-center gap-2">
                <FiSliders className="text-accent-cyan" /> Dashboard Preferences
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                
                {/* Language selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 bg-dark-900 border border-white/8 text-white rounded-2xl outline-none"
                  >
                    <option value="English">English (US)</option>
                    <option value="Spanish">Spanish (ES)</option>
                    <option value="French">French (FR)</option>
                  </select>
                </div>

                {/* Notifications */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Notification Alert Channels</label>
                  <select
                    value={notifications}
                    onChange={(e) => setNotifications(e.target.value)}
                    className="w-full p-3 bg-dark-900 border border-white/8 text-white rounded-2xl outline-none"
                  >
                    <option value="Email">Email Alerts</option>
                    <option value="Desktop">Desktop Banners</option>
                    <option value="None">Mute Notifications</option>
                  </select>
                </div>

                {/* Default upload target */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Default Upload Type</label>
                  <select
                    value={defaultCategory}
                    onChange={(e) => setDefaultCategory(e.target.value)}
                    className="w-full p-3 bg-dark-900 border border-white/8 text-white rounded-2xl outline-none"
                  >
                    <option value="Auto-detect">Auto-detect categories</option>
                    <option value="Documents">Force Documents</option>
                    <option value="Images">Force Images</option>
                  </select>
                </div>

                {/* Compact Toggle */}
                <div className="space-y-2 flex flex-col justify-end pb-1.5">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-dark-900/50 border border-white/5">
                    <span className="text-xs text-slate-300 font-medium">Compact Table Layout</span>
                    <input
                      type="checkbox"
                      checked={compactLayout}
                      onChange={(e) => setCompactLayout(e.target.checked)}
                      className="w-4 h-4 text-accent-cyan accent-accent-cyan cursor-pointer"
                    />
                  </div>
                </div>

              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-sky text-white font-bold text-xs transition duration-200 cursor-pointer hover:scale-[1.01]"
                >
                  Save Preferences
                </button>
              </div>

            </form>
          )}

          {/* BILLING & STORAGE TAB */}
          {activeTab === "Billing" && (
            <div className="space-y-6">
              
              {/* Status Alert if Server offline */}
              {storageError && (
                <div className="glass-panel border-red-500/20 bg-red-500/5 rounded-2xl p-5 flex items-start gap-4 text-red-400">
                  <FiAlertCircle className="text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Database Metrics Unavailable</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Live storage calculations cannot be computed because the Spring Boot REST API is offline.
                    </p>
                  </div>
                </div>
              )}

              {/* Storage Overview card panel */}
              <div className="glass-panel border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-cyan to-accent-sky flex items-center justify-center">
                    <FiHardDrive className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display text-white">Billing & Storage</h2>
                    <p className="text-[10px] text-slate-500 font-mono">Enterprise Plan Allocation</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2 border-t border-white/5 pt-6">
                  <div className="flex justify-between items-baseline text-xs font-mono text-slate-400">
                    <span>Usage: {storageError ? "0" : capacityPercentage}%</span>
                    <span>{loadingStorage ? "Calculating..." : storageError ? "0 B" : formatSize(totalUsedBytes)} / 100 MB</span>
                  </div>
                  
                  <div className="h-3 w-full bg-dark-900 rounded-full overflow-hidden border border-white/5 p-[1px]">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-sky transition-all duration-500"
                      style={{ width: `${loadingStorage || storageError ? 0 : capacityPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Capacity stats details list */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 border-t border-white/5 pt-6">
                  
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider font-mono text-slate-500">Total Capacity</p>
                    <p className="text-lg font-bold text-white mt-1">100.0 MB</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider font-mono text-slate-500">Storage Used</p>
                    <p className="text-lg font-bold text-white mt-1">{loadingStorage ? "..." : storageError ? "0 B" : formatSize(totalUsedBytes)}</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider font-mono text-slate-500">Remaining</p>
                    <p className="text-lg font-bold text-white mt-1">{loadingStorage ? "..." : storageError ? "100.0 MB" : formatSize(remainingBytes)}</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider font-mono text-slate-500">Assets Stored</p>
                    <p className="text-lg font-bold text-white mt-1">{loadingStorage ? "..." : storageError ? "0" : totalAssetsCount}</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider font-mono text-slate-500">Upload Activity</p>
                    <p className="text-lg font-bold text-white mt-1">{loadingStorage ? "..." : storageError ? "0 files" : `${recentUploadsCount} files`}</p>
                  </div>

                </div>

              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}

export default Settings;