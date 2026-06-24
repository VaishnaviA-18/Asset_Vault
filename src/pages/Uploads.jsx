import { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  FiFolder,
  FiMenu,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiUploadCloud,
  FiFile,
  FiArrowRight
} from "react-icons/fi";

function Uploads() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setMessage(""); 
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setMessage(""); 
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setUploading(true);
    setProgress(0);

    // Simulated progress ticker
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 80);

    const assetData = {
      fileName: selectedFile.name,
      fileType: selectedFile.type || "application/octet-stream",
      fileSize: selectedFile.size,
      uploadDate: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assetData),
      });

      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        if (response.ok) {
          setMessageType("success");
          setMessage(`"${selectedFile.name}" has been uploaded and details registered successfully!`);
          setSelectedFile(null);
        } else {
          setMessageType("error");
          setMessage("Failed to register asset details. Database rejected request.");
        }
        setUploading(false);
      }, 400);

    } catch (error) {
      clearInterval(interval);
      console.error(error);
      setMessageType("error");
      setMessage(
  "Database Upload Offline: Could not contact backend. Please verify the server status."
);
      setUploading(false);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

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

      {/* Main Container */}
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
              Asset Loader
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight">
              Upload Assets
            </h1>
          </div>

          {/* Alert Message Toast */}
          {message && (
            <div className={`p-4.5 rounded-2xl border flex items-start gap-3.5 transition animate-float ${
              messageType === "success" 
                ? "bg-green-500/10 border-green-500/20 text-green-400" 
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}>
              {messageType === "success" ? (
                <FiCheckCircle className="text-lg flex-shrink-0 mt-0.5" />
              ) : (
                <FiAlertCircle className="text-lg flex-shrink-0 mt-0.5 animate-pulse" />
              )}
              <div className="flex-1 text-sm font-medium">
                {message}
              </div>
              <button onClick={() => setMessage("")} className="text-slate-400 hover:text-white transition cursor-pointer">
                <FiX className="text-sm" />
              </button>
            </div>
          )}

          {/* Interactive Drag & Drop Area */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`glass-panel border-2 border-dashed rounded-3xl p-16 text-center transition relative group ${
              dragActive 
                ? "border-accent-cyan bg-accent-cyan/5 shadow-[0_0_30px_rgba(6,182,212,0.1)]" 
                : "border-white/10 hover:border-accent-cyan/30 hover:bg-white/[0.01]"
            }`}
          >
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />

            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-105 group-hover:border-accent-cyan/35 group-hover:bg-accent-cyan/5 transition duration-300">
              <FiUploadCloud className="text-3xl text-slate-400 group-hover:text-accent-cyan transition duration-300" />
            </div>

            <h2 className="text-xl font-bold font-display text-white mb-2">
              Drag & Drop files here
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-8 font-light leading-relaxed">
              Upload images, videos, documents, or spreadsheet files. Details are registered directly to your database.
            </p>

            <label
              htmlFor="fileUpload"
              className={`cursor-pointer px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-dark-950 font-bold text-xs transition duration-200 inline-flex items-center gap-1.5 shadow-md shadow-white/5 ${uploading ? "pointer-events-none opacity-50" : ""}`}
            >
              Browse Files
            </label>
          </div>

          {/* Active File Card with Progress Bar */}
          {selectedFile && (
            <section className="glass-panel border border-white/10 rounded-3xl p-6 space-y-5 shadow-xl animate-float">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0">
                    <FiFile className="text-accent-cyan text-lg" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate max-w-[250px] md:max-w-[400px]">
                      {selectedFile.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Size: {formatSize(selectedFile.size)}
                    </p>
                  </div>
                </div>

                {!uploading && (
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <FiX className="text-xs" />
                  </button>
                )}
              </div>

              {/* Upload progress bar */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>Uploading metadata...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-dark-900 rounded-full overflow-hidden border border-white/5 p-[1px]">
                    <div 
                      className="h-full bg-gradient-to-r from-accent-cyan to-accent-sky rounded-full transition-all duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload action button */}
              {!uploading && (
                <button
                  onClick={handleUpload}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-sky text-white font-bold text-xs shadow-md shadow-accent-cyan/20 hover:scale-[1.01] active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Confirm & Upload Asset <FiArrowRight />
                </button>
              )}

            </section>
          )}

        </main>
      </div>

    </div>
  );
}

export default Uploads;