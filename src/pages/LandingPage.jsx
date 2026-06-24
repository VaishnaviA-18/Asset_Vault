import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  FiArrowRight, 
  FiFolder, 
  FiSearch, 
  FiShield, 
  FiDatabase, 
  FiLayout, 
  FiCheckCircle, 
  FiFileText, 
  FiImage, 
  FiVideo, 
  FiFile, 
  FiHardDrive, 
  FiClock, 
  FiSettings, 
  FiActivity,
  FiUploadCloud,
  FiSliders
} from "react-icons/fi";

function LandingPage() {
  const [stats, setStats] = useState({ totalAssets: "---", storageUsed: "---", recentUploads: "---", pct: 0 });
  const [recentFiles, setRecentFiles] = useState([]);
  const [profileName, setProfileName] = useState(localStorage.getItem("userName") || "");
  const [profileEmail, setProfileEmail] = useState(localStorage.getItem("userEmail") || "");

  useEffect(() => {
    // Sync profile
    setProfileName(localStorage.getItem("userName") || "");
    setProfileEmail(localStorage.getItem("userEmail") || "");

    // Fetch actual statistics for realistic mockup
    fetch(import.meta.env.VITE_API_URL)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        const total = data.length;
        const bytes = data.reduce((sum, f) => sum + (f.fileSize || 0), 0);
        const kb = bytes / 1024;
        const mb = kb / 1024;
        const formattedStorage = mb < 1 ? `${kb.toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
        
        // standard plan capacity 100MB
        const cap = 100 * 1024 * 1024;
        const percentage = Math.min((bytes / cap) * 100, 100).toFixed(1);

        setStats({
          totalAssets: total,
          storageUsed: formattedStorage,
          recentUploads: data.filter(asset => {
            if (!asset.uploadDate) return false;
            const uploadDate = new Date(asset.uploadDate);
            const diffTime = Math.abs(new Date() - uploadDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
          }).length,
          pct: percentage
        });

        // Load the last 2 files
        setRecentFiles(data.slice().reverse().slice(0, 2));
      })
      .catch(() => {
        // Keep standard neutral placeholders "---"
      });
  }, []);

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

  const getFileIcon = (fileType) => {
    if (fileType?.includes("image")) return <FiImage className="text-pink-400" />;
    if (fileType?.includes("video")) return <FiVideo className="text-red-400" />;
    if (fileType?.includes("document") || fileType?.includes("pdf")) return <FiFileText className="text-cyan-400" />;
    return <FiFile className="text-amber-400" />;
  };

  return (
    <div className="relative min-h-screen bg-dark-950 overflow-hidden text-slate-100 selection:bg-accent-cyan/30 selection:text-white font-sans">
      
      {/* Background Mesh and Radial Glows */}
      <div className="absolute inset-0 bg-mesh-grid opacity-30 z-0 pointer-events-none" />
      <div className="radial-glow top-[-100px] left-[-100px] opacity-40 z-0 pointer-events-none" />
      <div className="radial-glow-pink bottom-[-100px] right-[-100px] opacity-40 z-0 pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 backdrop-blur-md px-6 py-4 md:px-12 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-cyan to-accent-sky flex items-center justify-center shadow-lg shadow-accent-cyan/20">
            <FiDatabase className="text-white text-xl" />
          </div>
          <span className="text-2xl font-bold font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            AssetVault
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#demo" className="hover:text-white transition">Product</a>
          <a href="#security" className="hover:text-white transition">Security</a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white border border-transparent hover:border-white/10 hover:bg-white/5 transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-sky text-white text-sm font-bold shadow-md shadow-accent-cyan/20 hover:scale-[1.02] transition duration-200"
          >
            <span className="relative z-10 flex items-center gap-1.5 cursor-pointer">
              Create Account <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-8 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-white/5 text-xs text-accent-cyan font-medium mb-8 select-none">
          <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
          <span>Enterprise Digital Asset Management</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold font-display leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300">
          Manage, Organize and Secure
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan via-accent-sky to-white">
            Digital Assets
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mt-8 font-light leading-relaxed">
          Professional asset management platform for documents, images, videos and business files. Streamlined, performant, and cloud ready.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full sm:w-auto">
          <Link
            to="/register"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-sky text-white font-bold text-base shadow-lg shadow-accent-cyan/25 hover:scale-[1.03] active:scale-[0.98] transition duration-200 flex items-center justify-center gap-2"
          >
            Get Started <FiArrowRight />
          </Link>

          <a
            href="#demo"
            className="px-8 py-4 rounded-2xl glass-panel border border-white/10 text-slate-200 font-bold text-base hover:bg-white/5 hover:border-white/20 active:scale-[0.98] transition duration-200 flex items-center justify-center gap-2"
          >
            <FiLayout /> View Platform
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-8 border-t border-white/5 w-full max-w-4xl mx-auto select-none">
          <p className="text-[10px] font-bold font-mono uppercase tracking-[0.25em] text-slate-500 mb-6">
            SECURED & OPTIMIZED FOR SCALE
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-400 text-xs md:text-sm font-medium">
            <div className="flex items-center justify-center gap-2.5">
              <FiCheckCircle className="text-accent-cyan text-sm" />
              <span>Secure File Management</span>
            </div>
            <div className="flex items-center justify-center gap-2.5">
              <FiCheckCircle className="text-accent-cyan text-sm" />
              <span>Real-Time Search</span>
            </div>
            <div className="flex items-center justify-center gap-2.5">
              <FiCheckCircle className="text-accent-cyan text-sm" />
              <span>Cloud Ready</span>
            </div>
            <div className="flex items-center justify-center gap-2.5">
              <FiCheckCircle className="text-accent-cyan text-sm" />
              <span>Fast Uploads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Realistic Product Preview */}
      <section id="demo" className="relative z-10 px-6 max-w-6xl mx-auto pb-24">
        <div className="relative p-1 rounded-3xl bg-gradient-to-br from-white/15 via-white/5 to-white/0 border border-white/10 shadow-2xl shadow-accent-cyan/5 overflow-hidden">
          
          {/* Main Visual Dashboard Mock */}
          <div className="glass-panel border border-white/10 rounded-[1.4rem] overflow-hidden flex min-h-[460px] text-slate-200 text-left text-xs select-none bg-dark-950">
            
            {/* Sidebar Mock */}
            <div className="w-48 border-r border-white/5 bg-dark-900/40 p-4 flex flex-col justify-between flex-shrink-0">
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-accent-cyan to-accent-sky flex items-center justify-center shadow-md">
                    <FiDatabase className="text-white text-xs" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs leading-none">AssetVault</h4>
                    <span className="text-[7px] text-slate-500 font-mono">ENTERPRISE</span>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-white font-semibold">
                    <FiLayout className="text-accent-cyan text-xs" />
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400">
                    <FiFolder className="text-xs" />
                    <span>Assets</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400">
                    <FiUploadCloud className="text-xs" />
                    <span>Uploads</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400">
                    <FiSettings className="text-xs" />
                    <span>Settings</span>
                  </div>
                </nav>
              </div>
              
              <div className="pt-3 border-t border-white/5 flex items-center gap-2 px-1">
                <div className="w-7 h-7 rounded-full bg-accent-cyan/20 flex items-center justify-center text-[10px] text-white border border-white/10 font-bold">
                  {profileName ? getInitials(profileName) : "GU"}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-bold truncate text-white">{profileName || "Guest User"}</p>
                  <p className="text-[8px] text-slate-500 font-mono truncate">{profileEmail || "Offline Session"}</p>
                </div>
              </div>
            </div>

            {/* Content Mock */}
            <div className="flex-1 p-6 space-y-5 overflow-hidden">
              <div className="flex justify-between items-center">
                <div />
                <span className="text-[8px] text-green-400 font-mono px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">CONNECTED</span>
              </div>

              {/* Banner */}
              <div className="rounded-xl border border-white/10 bg-gradient-to-r from-accent-cyan/15 to-transparent p-4">
                <h4 className="font-bold text-white text-sm">{getGreeting()}{profileName ? `, ${profileName}` : ""}</h4>
                <p className="text-[10px] text-slate-300 font-light mt-0.5">Manage and organize your digital assets securely from one place.</p>
              </div>

              {/* Stats & capacity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 grid grid-cols-3 gap-3">
                  <div className="glass-panel rounded-xl p-3 flex flex-col justify-between">
                    <span className="text-[8px] font-mono uppercase text-slate-400">Total Assets</span>
                    <span className="text-xl font-bold text-white mt-1">{stats.totalAssets}</span>
                  </div>
                  <div className="glass-panel rounded-xl p-3 flex flex-col justify-between">
                    <span className="text-[8px] font-mono uppercase text-slate-400">Storage Used</span>
                    <span className="text-xl font-bold text-white mt-1">{stats.storageUsed}</span>
                  </div>
                  <div className="glass-panel rounded-xl p-3 flex flex-col justify-between">
                    <span className="text-[8px] font-mono uppercase text-slate-400">Recent Uploads</span>
                    <span className="text-xl font-bold text-white mt-1">{stats.recentUploads}</span>
                  </div>
                </div>
                
                <div className="glass-panel rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-baseline text-[8px] font-mono text-slate-400">
                    <span>Usage: {stats.pct}%</span>
                    <span>{stats.storageUsed} / 100 MB</span>
                  </div>
                  <div className="h-1.5 w-full bg-dark-900 rounded-full overflow-hidden border border-white/5 mt-2">
                    <div className="h-full bg-gradient-to-r from-accent-cyan to-accent-sky rounded-full" style={{ width: `${stats.pct}%` }} />
                  </div>
                </div>
              </div>

              {/* Recent list */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">Recent Assets</h4>
                <div className="glass-panel rounded-xl overflow-hidden divide-y divide-white/5 border border-white/5">
                  {recentFiles.length === 0 ? (
                    <div className="p-3 text-center text-slate-500 text-[10px] font-mono">
                      No files stored in active database.
                    </div>
                  ) : (
                    recentFiles.map((file) => (
                      <div key={file.id} className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {getFileIcon(file.fileType)}
                          <span className="font-semibold text-white truncate max-w-[150px]">{file.fileName}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[9px] font-mono text-slate-400">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 uppercase">
                            {file.fileType?.includes("image") ? "IMAGE" : file.fileType?.includes("pdf") ? "PDF" : "FILE"}
                          </span>
                          <span>{(file.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                          <span>{file.uploadDate || "N/A"}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-24 bg-dark-900/40 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold font-mono tracking-[0.2em] text-accent-cyan uppercase mb-2 block">
              Core Principles
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-white">
              Enterprise Grade Trust
            </h2>
            <p className="text-slate-400 mt-4 font-light">
              Designed from the ground up to support secure, reliable, and swift database management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Secure Storage */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 text-left space-y-4">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                <FiShield className="text-accent-cyan text-lg" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Secure Storage</h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                Vault resources are encrypted and kept safe using Spring Security protocols and database credentials.
              </p>
            </div>

            {/* Smart Search */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 text-left space-y-4">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                <FiSearch className="text-accent-cyan text-lg" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Smart Search</h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                Filter documents, photos, movies, and other formats instantly with character matching queries.
              </p>
            </div>

            {/* Fast Uploads */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 text-left space-y-4">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                <FiUploadCloud className="text-accent-cyan text-lg" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Fast Uploads</h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                Upload metadata to endpoints with progress feedback, verifying database details accurately.
              </p>
            </div>

            {/* Asset Organization */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 text-left space-y-4">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                <FiFolder className="text-accent-cyan text-lg" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Asset Organization</h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                Sort assets dynamically into Documents, Images, Videos, or Misc items based on type tags.
              </p>
            </div>

            {/* Metadata Tracking */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 text-left space-y-4">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                <FiFileText className="text-accent-cyan text-lg" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Metadata Tracking</h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                Access precise timestamps, format details, and calculated file sizes via clean dashboard overlays.
              </p>
            </div>

            {/* Cloud Ready */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 text-left space-y-4">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                <FiDatabase className="text-accent-cyan text-lg" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Cloud Ready</h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                Tailored for backend REST integrations in standard cloud or local container deployment modules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Features Section */}
      <section id="features" className="relative z-10 px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold font-mono tracking-[0.2em] text-accent-cyan uppercase mb-2 block">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white">
            All-In-One Assets Manager
          </h2>
          <p className="text-slate-400 mt-4 font-light">
            Streamlined controls designed for rapid file uploading, detailed cataloging, and precise audits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Document Management */}
          <div className="glass-panel-interactive rounded-3xl p-8 flex flex-col justify-between items-start text-left group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-accent-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mb-6">
                <FiFileText className="text-accent-cyan text-xl" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3 text-white">Document Management</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                Catalog reports, contracts, spreadsheets, and PDFs in a single search index.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 border-t border-white/5 pt-4 w-full">
              <li>&bull; Full size calculation</li>
              <li>&bull; Format type badges</li>
              <li>&bull; Detail modal summaries</li>
            </ul>
          </div>

          {/* Image & Media Catalog */}
          <div className="glass-panel-interactive rounded-3xl p-8 flex flex-col justify-between items-start text-left group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-accent-sky/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-sky/10 border border-accent-sky/20 flex items-center justify-center mb-6">
                <FiImage className="text-accent-sky text-xl" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3 text-white">Image Management</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                Securely store marketing collaterals, vectors, graphics, and branding assets.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 border-t border-white/5 pt-4 w-full">
              <li>&bull; Format validation</li>
              <li>&bull; Clean categorization</li>
              <li>&bull; Quick details preview</li>
            </ul>
          </div>

          {/* Video Management */}
          <div className="glass-panel-interactive rounded-3xl p-8 flex flex-col justify-between items-start text-left group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-accent-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mb-6">
                <FiVideo className="text-accent-cyan text-xl" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3 text-white">Video Management</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                Organize commercial trailers, video clips, tutorials, and mp4 records.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 border-t border-white/5 pt-4 w-full">
              <li>&bull; Upload validation</li>
              <li>&bull; Media size formatting</li>
              <li>&bull; Deletion triggers</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Call To Action Section */}
      <section className="relative z-10 px-6 py-24 max-w-4xl mx-auto text-center">
        <div className="glass-panel border border-white/10 rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-mesh-grid opacity-10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-accent-cyan/15 blur-[60px] pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight relative z-10">
            Ready to organize your digital assets?
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mt-6 font-light relative z-10 leading-relaxed">
            Start managing documents, images, videos, and files in one secure platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center relative z-10">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-sky text-white font-bold text-xs shadow-md shadow-accent-cyan/25 hover:shadow-accent-cyan/35 hover:scale-[1.01] active:scale-[0.99] transition duration-200 flex items-center justify-center gap-1.5"
            >
              Create Account <FiArrowRight />
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-2xl glass-panel border border-white/10 text-slate-200 font-bold text-xs hover:bg-white/5 hover:border-white/20 hover:scale-[1.01] active:scale-[0.99] transition duration-200"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 text-slate-500 border-t border-white/5 text-sm bg-dark-950/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <FiDatabase className="text-accent-cyan text-lg" />
              <span className="font-bold text-slate-200 text-sm font-display">AssetVault</span>
              <span className="text-[9px] text-slate-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">v2.0</span>
            </div>
            <p className="text-slate-400 font-light leading-relaxed max-w-sm">
              Enterprise digital asset management system for cataloging, search matching, and database uploading under clean responsive styling.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[10px]">Technology Stack</h4>
            <ul className="space-y-1.5 font-light text-slate-400">
              <li>React & React Router</li>
              <li>Tailwind CSS</li>
              <li>Spring Boot REST API</li>
              <li>MySQL Database</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[10px]">Project Info</h4>
            <p className="font-light text-slate-400 leading-relaxed font-sans">
              Designed as a premium commercial software DAM. Re-styled with Linear/Vercel visual excellence.
            </p>
          </div>

        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/5 flex justify-between items-center text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} AssetVault. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="#terms" className="hover:text-slate-300">Terms</a>
            <a href="#privacy" className="hover:text-slate-300">Privacy</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;