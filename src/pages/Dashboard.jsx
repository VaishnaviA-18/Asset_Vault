import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { 
  FiFolder, 
  FiTrendingUp, 
  FiHardDrive, 
  FiClock, 
  FiFileText, 
  FiImage, 
  FiVideo, 
  FiFile, 
  FiArrowRight,
  FiMenu,
  FiX,
  FiAlertCircle
} from "react-icons/fi";

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Read name from localStorage, default to empty to allow correct conditional greetings
  const [profileName, setProfileName] = useState(localStorage.getItem("userName") || "");

  useEffect(() => {
    // Sync name if updated externally
    const handleProfileUpdate = () => {
      setProfileName(localStorage.getItem("userName") || "");
    };
    window.addEventListener("profileUpdate", handleProfileUpdate);
    window.addEventListener("storage", handleProfileUpdate);

    // Fetch actual statistics from Spring Boot REST API
    fetch(`${import.meta.env.VITE_API_URL}/assets`)
      .then((res) => {
        if (!res.ok) throw new Error("API rejection");
        return res.json();
      })
      .then((data) => {
        setAssets(data);
        setLoading(false);
        setApiError(false);
      })
      .catch((err) => {
        console.error("API Fetch Error:", err);
        setLoading(false);
        setApiError(true);
      });

    return () => {
      window.removeEventListener("profileUpdate", handleProfileUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
    };
  }, []);

  // Compute Statistics
  const totalAssets = assets.length;
  
  // Storage size formatted in Bytes
  const totalUsedBytes = assets.reduce((sum, asset) => sum + (asset.fileSize || 0), 0);
  
  // 100 MB capacity
  const CAPACITY_BYTES = 100 * 1024 * 1024;
  const remainingBytes = Math.max(CAPACITY_BYTES - totalUsedBytes, 0);
  const capacityPercentage = Math.min((totalUsedBytes / CAPACITY_BYTES) * 100, 100).toFixed(1);

  // Formatter helper
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  // Recent Uploads count (uploaded in the last 7 days)
  const recentUploadsCount = assets.filter(asset => {
    if (!asset.uploadDate) return false;
    const uploadDate = new Date(asset.uploadDate);
    const diffTime = Math.abs(new Date() - uploadDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  // Dynamic Greeting Generator
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      return "Good Morning";
    } else if (hours >= 12 && hours < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const isDoc = (type) => type?.includes("document") || type?.includes("pdf") || type?.includes("sheet") || type?.includes("presentation") || type?.includes("text");

  const getFileIcon = (fileType) => {
    if (fileType?.includes("image")) return <FiImage className="text-pink-400" />;
    if (fileType?.includes("video")) return <FiVideo className="text-red-400" />;
    if (isDoc(fileType)) return <FiFileText className="text-cyan-400" />;
    return <FiFile className="text-amber-400" />;
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex font-sans selection:bg-accent-cyan/30 selection:text-white">
      
      {/* Background Grids & Radial Glow */}
      <div className="absolute inset-0 bg-mesh-grid opacity-20 pointer-events-none z-0" />
      <div className="radial-glow top-0 right-1/4 opacity-25 pointer-events-none z-0" />
      
      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Slide-out Sidebar for Mobile */}
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

      {/* Main Dashboard Content */}
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

        {/* Dashboard Main Content */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 space-y-8 max-w-7xl mx-auto w-full overflow-y-auto">
          
          {/* Header section title */}
          <div className="flex justify-between items-center">
            <div />
            
            {/* Dynamic API status badge */}
            <div className="text-xs font-mono bg-white/5 border border-white/5 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                loading ? "bg-amber-400 animate-pulse" : apiError ? "bg-red-500" : "bg-accent-cyan animate-pulse"
              }`} />
              <span className="text-slate-400">API Status:</span>
              <span className={loading ? "text-amber-400 font-semibold" : apiError ? "text-red-400 font-semibold" : "text-accent-cyan font-semibold"}>
                {loading ? "Connecting" : apiError ? "Offline" : "Online"}
              </span>
            </div>
          </div>

          {/* Connection Error Banner */}
          {apiError && (
            <div className="glass-panel border-red-500/20 bg-red-500/5 rounded-2xl p-5 flex items-start gap-4 text-red-400 animate-float">
              <FiAlertCircle className="text-xl flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-white">Spring Boot Connection Failed</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  The frontend is currently unable to communicate with the REST API at <code className="bg-black/30 px-1.5 py-0.5 rounded text-[11px] font-mono text-red-300">fetch(`${import.meta.env.VITE_API_URL}/assets`)</code>. Please verify that your Spring Boot application is running and MySQL database service is active.
                </p>
              </div>
            </div>
          )}

          {/* Hero Banner Section */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent-cyan/15 to-transparent p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-accent-cyan/5">
            <div className="absolute inset-0 bg-mesh-grid opacity-10 pointer-events-none" />
            <div className="absolute right-[-100px] top-[-100px] w-64 h-64 rounded-full bg-accent-cyan/20 blur-[80px] pointer-events-none" />

            <div className="relative z-10 max-w-xl space-y-3">
              <h3 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight flex items-center gap-2">
                {getGreeting()}{profileName ? `, ${profileName}` : ""}
              </h3>
              <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed">
                Manage and organize your digital assets securely from one place. Upload and review stats instantly.
              </p>
            </div>
          </section>

          {/* Grid Layout: Stats & Storage capacity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Stats cards grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Card 1: Total Assets */}
              <div className="glass-panel-interactive rounded-2xl p-6 flex flex-col justify-between group">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                    Total Assets
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/10 flex items-center justify-center group-hover:bg-accent-cyan/20 transition duration-300">
                    <FiFolder className="text-accent-cyan text-lg" />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-3xl font-bold font-display text-white tracking-tight">
                    {loading ? "..." : apiError ? "0" : totalAssets}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                    <FiTrendingUp className="text-accent-cyan" /> Active database records
                  </p>
                </div>
              </div>

              {/* Card 2: Storage Used */}
              <div className="glass-panel-interactive rounded-2xl p-6 flex flex-col justify-between group">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                    Storage Used
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/10 flex items-center justify-center group-hover:bg-accent-cyan/20 transition duration-300">
                    <FiHardDrive className="text-accent-cyan text-lg" />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-3xl font-bold font-display text-white tracking-tight">
                    {loading ? "..." : apiError ? "0 Bytes" : formatSize(totalUsedBytes)}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    Calculated from file sizes
                  </p>
                </div>
              </div>

              {/* Card 3: Recent Uploads */}
              <div className="glass-panel-interactive rounded-2xl p-6 flex flex-col justify-between group">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                    Recent Uploads
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/10 flex items-center justify-center group-hover:bg-accent-cyan/20 transition duration-300">
                    <FiClock className="text-accent-cyan text-lg" />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-3xl font-bold font-display text-white tracking-tight">
                    {loading ? "..." : apiError ? "0" : recentUploadsCount}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    Uploaded in last 7 days
                  </p>
                </div>
              </div>

            </div>

            {/* Right: Storage usage details card */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/10 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-cyan to-accent-sky flex items-center justify-center">
                  <FiHardDrive className="text-white text-sm" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Storage Capacity</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Standard Storage Allocation</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-baseline text-xs font-mono text-slate-400">
                  <span>Usage: {apiError ? "0" : capacityPercentage}%</span>
                  <span>{loading ? "..." : apiError ? "0 B" : formatSize(totalUsedBytes)} / 100 MB</span>
                </div>
                
                <div className="h-2.5 w-full bg-dark-900 rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-sky transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    style={{ width: `${loading || apiError ? 0 : capacityPercentage}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>Remaining: {loading ? "..." : apiError ? "100 MB" : formatSize(remainingBytes)}</span>
                <span className="text-accent-cyan hover:underline cursor-pointer">Storage limits</span>
              </div>
            </div>

          </div>



          {/* Recent Assets Section */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                Recent Assets
              </h3>
              <Link to="/assets" className="text-xs font-semibold text-accent-cyan hover:text-accent-sky flex items-center gap-1 transition">
                Manage files <FiArrowRight />
              </Link>
            </div>

            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-lg">
              
              {loading ? (
                <div className="p-8 space-y-4">
                  <div className="h-6 w-1/4 bg-white/5 rounded-full shimmer" />
                  <div className="h-10 w-full bg-white/5 rounded-2xl shimmer" />
                </div>
              ) : apiError ? (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-400">
                    <FiAlertCircle className="text-xl" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">Database Offline</h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Recent assets list is unavailable because the server connection failed. Please ensure the Spring Boot service is active.
                  </p>
                </div>
              ) : assets.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4 text-slate-400">
                    <FiFolder className="text-2xl" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">No Assets Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mb-4">
                    Your digital vault is empty. Get started by uploading your first document or image.
                  </p>
                  <Link to="/uploads" className="px-4 py-2 rounded-xl bg-accent-cyan text-white text-xs font-bold hover:bg-accent-cyan/85 transition">
                    Upload File
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {assets
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map((asset) => (
                      <div 
                        key={asset.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-white/[0.015] transition"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0">
                            {getFileIcon(asset.fileType)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate max-w-[250px] md:max-w-[400px]">
                              {asset.fileName}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                              Size: {formatSize(asset.fileSize)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 mt-3 sm:mt-0 text-xs font-mono text-slate-400">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold tracking-wider text-slate-300 uppercase">
                            {asset.fileType?.includes("image")
                              ? "IMAGE"
                              : asset.fileType?.includes("pdf")
                              ? "PDF"
                              : isDoc(asset.fileType)
                              ? "DOCX"
                              : asset.fileType?.includes("video")
                              ? "VIDEO"
                              : "FILE"}
                          </span>
                          
                          <span className="text-slate-500 text-[11px]">
                            {asset.uploadDate || "N/A"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

            </div>
          </section>

        </main>
      </div>

    </div>
  );
}

export default Dashboard;
