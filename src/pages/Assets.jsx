import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  FiSearch,
  FiTrash2,
  FiFile,
  FiImage,
  FiFolder,
  FiMenu,
  FiX,
  FiVideo,
  FiFileText,
  FiAlertCircle,
  FiFilter,
  FiEye,
  FiHardDrive,
  FiCalendar
} from "react-icons/fi";

function Assets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/assets")
      .then((response) => {
        if (!response.ok) throw new Error("API failed");
        return response.json();
      })
      .then((data) => {
        setFiles(data);
        setLoading(false);
        setApiError(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        setApiError(true);
      });
  }, []);

  const deleteAsset = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this asset?");
    if (!confirmDelete) return;

    try {
     const response = await fetch(
  `${import.meta.env.VITE_API_URL}/assets/${id}`,
  {
    method: "DELETE",
  }
);

      if (response.ok) {
        setFiles(files.filter((file) => file.id !== id));
      } else {
        alert("Failed to delete asset from database.");
      }
    } catch (error) {
      console.error(error);
      alert("API Error: could not contact the backend to delete file.");
    }
  };

  // Size helper
  const formatSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  // Helpers for sorting
  const isDoc = (type) => type?.includes("document") || type?.includes("pdf") || type?.includes("sheet") || type?.includes("presentation") || type?.includes("text");
  const isImg = (type) => type?.includes("image");
  const isVid = (type) => type?.includes("video");

  // Client side filtering
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeCategory === "All") return matchesSearch;
    if (activeCategory === "Documents") return matchesSearch && isDoc(file.fileType);
    if (activeCategory === "Images") return matchesSearch && isImg(file.fileType);
    if (activeCategory === "Videos") return matchesSearch && isVid(file.fileType);
    if (activeCategory === "Others") {
      return matchesSearch && !isDoc(file.fileType) && !isImg(file.fileType) && !isVid(file.fileType);
    }
    return matchesSearch;
  });

  const getFileIcon = (fileType) => {
    if (fileType?.includes("image")) return <FiImage className="text-pink-400 text-lg" />;
    if (fileType?.includes("video")) return <FiVideo className="text-red-400 text-lg" />;
    if (isDoc(fileType)) return <FiFileText className="text-cyan-400 text-lg" />;
    return <FiFile className="text-amber-400 text-lg" />;
  };

  const getBadgeStyle = (fileType) => {
    if (fileType?.includes("image")) return "bg-pink-500/10 border-pink-500/20 text-pink-400";
    if (fileType?.includes("video")) return "bg-red-500/10 border-red-500/20 text-red-400";
    if (isDoc(fileType)) return "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
    return "bg-amber-500/10 border-amber-500/20 text-amber-400";
  };

  const categories = ["All", "Documents", "Images", "Videos", "Others"];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex font-sans selection:bg-accent-cyan/30 selection:text-white">
      
      {/* Background Grids & Radial Glow */}
      <div className="absolute inset-0 bg-mesh-grid opacity-20 pointer-events-none z-0" />
      <div className="radial-glow top-[-200px] left-1/3 opacity-25 pointer-events-none z-0" />

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

        <main className="flex-1 p-6 md:p-10 lg:p-12 space-y-8 max-w-7xl mx-auto w-full overflow-y-auto">
          
          {/* Header Panel */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold font-mono tracking-[0.25em] text-accent-cyan uppercase mb-1.5">
                Vault Repository
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight">
                Assets
              </h1>
            </div>

            {/* Premium Search Bar */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiSearch className="text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search assets by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 glass-input text-slate-100 rounded-2xl outline-none placeholder:text-slate-500 text-xs font-medium"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white font-mono text-xs"
                >
                  <FiX className="text-xs" />
                </button>
              )}
            </div>
          </div>

          {/* Connection Error Banner */}
          {apiError && (
            <div className="glass-panel border-red-500/20 bg-red-500/5 rounded-2xl p-5 flex items-start gap-4 text-red-400 animate-float">
              <FiAlertCircle className="text-xl flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-white">Database Offline</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Unable to connect to the Spring Boot REST API. Files cannot be loaded or deleted at this time. Please run your backend server to re-enable database storage.
                </p>
              </div>
            </div>
          )}

          {/* Filtering Chips / Tab List */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <FiFilter className="text-slate-500 text-sm flex-shrink-0 mr-1 hidden sm:block" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition flex-shrink-0 cursor-pointer ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-accent-cyan to-accent-sky text-white border-transparent shadow-sm shadow-accent-cyan/10"
                    : "glass-panel text-slate-400 border-white/5 hover:text-white hover:border-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Core Table View Container */}
          <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            
            {/* Header Columns */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono bg-dark-900/30 select-none">
              <div className="col-span-6 md:col-span-5">File Name</div>
              <div className="col-span-3 md:col-span-2">Type</div>
              <div className="col-span-3 md:col-span-2 text-right md:text-left">Size</div>
              <div className="hidden md:col-span-2 md:block">Upload Date</div>
              <div className="hidden md:col-span-1 md:block text-right">Actions</div>
            </div>

            {/* List Rows */}
            {loading ? (
              <div className="p-8 space-y-4">
                <div className="h-10 w-full bg-white/5 rounded-2xl shimmer" />
                <div className="h-10 w-full bg-white/5 rounded-2xl shimmer" />
              </div>
            ) : apiError ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center select-none">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5 text-red-400">
                  <FiAlertCircle className="text-3xl" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5 font-display">
                  Database Connection Failed
                </h3>
                <p className="text-xs text-slate-400 max-w-sm font-light leading-relaxed">
                  Vite was unable to fetch file listings. Ensure your backend Spring Boot server is active at port 8080.
                </p>
              </div>
            ) : filteredFiles.length === 0 ? (
              
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center select-none">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-5 text-slate-500 animate-float">
                  <FiFolder className="text-3xl text-accent-cyan" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5 font-display">
                  No assets found.
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mb-6 font-light leading-relaxed">
                  {searchTerm 
                    ? `We couldn't find any file matching "${searchTerm}".`
                    : `Your vault repository doesn't contain files in the "${activeCategory}" filter.`}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-4.5 py-2.5 rounded-xl border border-accent-cyan text-accent-cyan text-xs font-semibold hover:bg-accent-cyan hover:text-white transition duration-200"
                  >
                    Clear Search Query
                  </button>
                )}
              </div>

            ) : (
              
              <div className="divide-y divide-white/5">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4.5 items-center hover:bg-white/[0.015] transition"
                  >
                    {/* Name column */}
                    <div className="col-span-6 md:col-span-5 flex items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0">
                        {getFileIcon(file.fileType)}
                      </div>
                      <span className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                        {file.fileName}
                      </span>
                    </div>

                    {/* Type Column */}
                    <div className="col-span-3 md:col-span-2">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold tracking-wider uppercase font-mono ${getBadgeStyle(file.fileType)}`}>
                        {file.fileType?.includes("image")
                          ? "IMAGE"
                          : file.fileType?.includes("pdf")
                          ? "PDF"
                          : isDoc(file.fileType)
                          ? "DOCX"
                          : file.fileType?.includes("video")
                          ? "VIDEO"
                          : "FILE"}
                      </span>
                    </div>

                    {/* Size Column */}
                    <div className="col-span-3 md:col-span-2 text-right md:text-left text-xs font-mono text-slate-300">
                      {formatSize(file.fileSize)}
                    </div>

                    {/* Date Column */}
                    <div className="hidden md:col-span-2 md:block text-xs text-slate-400 font-mono">
                      {file.uploadDate || "N/A"}
                    </div>

                    {/* Action Buttons Column */}
                    <div className="col-span-12 md:col-span-1 flex items-center justify-end gap-2.5 mt-2 md:mt-0">
                      <button
                        onClick={() => setSelectedFile(file)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-accent-cyan/20 text-slate-300 hover:text-white transition cursor-pointer"
                        title="View Details"
                      >
                        <FiEye className="text-sm" />
                      </button>
                      <button
                        onClick={() => deleteAsset(file.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                        title="Delete Asset"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            )}

          </div>

        </main>
      </div>

      {/* Asset Detail Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="glass-panel border border-white/10 rounded-3xl p-7 max-w-md w-full shadow-2xl relative animate-float">
            
            {/* Modal Exit Button */}
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
            >
              <FiX className="text-sm" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 select-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-cyan to-accent-sky flex items-center justify-center">
                {getFileIcon(selectedFile.fileType)}
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-white">Asset Details</h3>
                <p className="text-[10px] text-slate-500 font-mono">ID: {selectedFile.id}</p>
              </div>
            </div>

            {/* Info details */}
            <div className="space-y-4 border-y border-white/5 py-5 text-sm">
              <div className="flex justify-between items-baseline gap-4">
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider flex-shrink-0">File Name</span>
                <span className="text-white text-right font-semibold truncate max-w-[200px]" title={selectedFile.fileName}>
                  {selectedFile.fileName}
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Format Tag</span>
                <span className="text-white font-mono text-xs">{selectedFile.fileType || "application/octet-stream"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1">
                  <FiHardDrive className="text-[11px]" /> File Size
                </span>
                <span className="text-white font-mono text-xs font-bold">{formatSize(selectedFile.fileSize)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1">
                  <FiCalendar className="text-[11px]" /> Uploaded At
                </span>
                <span className="text-white font-mono text-xs">{selectedFile.uploadDate || "N/A"}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedFile(null)}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 font-bold text-xs text-white transition duration-200 cursor-pointer"
              >
                Close Details
              </button>
              <button
                onClick={() => {
                  const id = selectedFile.id;
                  setSelectedFile(null);
                  deleteAsset(id);
                }}
                className="flex-1 py-3 rounded-xl bg-red-600/10 border border-red-500/20 hover:bg-red-600 hover:text-white font-bold text-xs text-red-400 transition duration-200 cursor-pointer"
              >
                Delete File
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Assets;