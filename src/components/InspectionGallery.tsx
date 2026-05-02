import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Play, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";

import inspect1 from "@/assets/inspect1.png";
import inspect2 from "@/assets/inspect2.png";
import inspect3 from "@/assets/inspect3.png";
import inspect4 from "@/assets/inspect4.png";
import inspect5 from "@/assets/inspect5.mp4";

type MediaItem = {
  src: string;
  alt: string;
  type: "image" | "video";
  details: string;
  refCode: string;
  officerId: string;
};

const images: MediaItem[] = [
  { 
    src: inspect1, 
    alt: "Initial Security Screening", 
    type: "image",
    details: "CBP officers conduct a preliminary visual inspection of the secure transport unit upon arrival at the Miami International Airport (MIA) facility.",
    refCode: "REF-MIA-04387YF",
    officerId: "ID: 4928-MIA"
  },
  { 
    src: inspect2, 
    alt: "Secure Staging Area", 
    type: "image",
    details: "Transport unit securely staged within the designated secondary inspection room pending comprehensive physical examination of internal contents.",
    refCode: "REF-MIA-04387YF",
    officerId: "ID: 4928-MIA"
  },
  { 
    src: inspect3, 
    alt: "Currency Verification & Audit", 
    type: "image",
    details: "Physical inventory of declared currency completed. Total amount verified, audited, and logged at $2,200,000 USD.",
    refCode: "REF-MIA-04387YF",
    officerId: "ID: 4928-MIA"
  },
  { 
    src: inspect4, 
    alt: "Precious Metals Assessment", 
    type: "image",
    details: "Detailed physical inspection and weight verification of bullion. Total inventory confirmed at 51 gold bars with a combined gross weight of 38.0 KG.",
    refCode: "REF-MIA-04387YF",
    officerId: "ID: 4928-MIA"
  },
  { 
    src: inspect5, 
    alt: "Asset Documentation Log", 
    type: "video",
    details: "Official video record documenting the physical condition, quantity, and handling of the gold bullion during the final clearance intake process.",
    refCode: "REF-MIA-04387YF",
    officerId: "ID: 4928-MIA"
  },
];

const InspectionGallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = () =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + images.length) % images.length : 0
    );

  const next = () =>
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % images.length : 0
    );

  // CHANGED: Removed the scrollIntoView command so the page stays exactly where it is
  const handleSupportLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-support-modal"));
  };

  return (
    <>
      {/* Grid - Thumbnails */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i)}
            className={`relative aspect-[4/3] w-full rounded-lg overflow-hidden group cursor-pointer border border-border hover:border-[#004B87]/50 transition-all bg-secondary/10 shadow-sm ${
              !isExpanded && i >= 4 ? "hidden md:block" : ""
            }`}
          >
            <div className="absolute inset-0 p-2 flex items-center justify-center bg-white/50 dark:bg-black/20">
                {img.type === "image" ? (
                <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                    <video
                    src={img.src}
                    className="max-w-full max-h-full object-contain"
                    muted
                    playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                        <Play className="h-8 w-8 text-white fill-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    </div>
                </div>
                )}
            </div>
            {/* Internal Ref Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] text-white/90 font-mono">{img.refCode}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Expand/Collapse Control */}
      {images.length > 4 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden mt-4 w-full flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-[#004B87] transition-colors"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show {images.length - 4} More <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}

      {/* Official Note */}
      <div className="mt-5 flex items-start gap-3 text-sm text-red-900 dark:text-red-200 bg-red-50 dark:bg-red-950/30 p-4 rounded-md border border-red-200 dark:border-red-900 shadow-sm">
        <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5 text-red-600 dark:text-red-500" />
        <p>
          <strong className="text-red-950 dark:text-red-100">ACTION REQUIRED:</strong> Outstanding secure vault storage fees must be settled to finalize clearance. Please contact your dedicated clearance specialist, or use our{" "}
          <button 
            onClick={handleSupportLinkClick} 
            className="font-semibold underline hover:text-red-700 dark:hover:text-red-300 inline-block focus:outline-none"
          >
            support section
          </button>
          {" "}for payment instructions.
        </p>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 md:p-8"
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox} className="absolute top-6 right-6 z-[110] text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full">
            <X className="h-6 w-6" />
          </button>
          
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-slate-800/50 text-white hover:bg-slate-700 transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-slate-800/50 text-white hover:bg-slate-700 transition-colors">
            <ChevronRight className="h-6 w-6" />
          </button>

          <div 
            className="relative w-full h-full flex flex-col items-center justify-between gap-4 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-grow w-full flex items-center justify-center overflow-hidden pointer-events-auto">
              {images[lightboxIndex].type === "image" ? (
                <img
                  src={images[lightboxIndex].src}
                  alt={images[lightboxIndex].alt}
                  className="max-w-full max-h-full w-auto h-auto object-contain shadow-2xl select-none border border-slate-800 rounded-sm"
                />
              ) : (
                <video
                  src={images[lightboxIndex].src}
                  controls
                  autoPlay
                  className="max-w-full max-h-full w-auto h-auto object-contain shadow-2xl border border-slate-800 rounded-sm"
                />
              )}
            </div>

            {/* Metadata Panel */}
            <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 shadow-2xl p-5 md:p-6 rounded-lg pointer-events-auto shrink-0 mb-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                 <h4 className="font-semibold text-slate-100 text-lg md:text-xl flex items-center gap-2">
                   {images[lightboxIndex].alt}
                 </h4>
                 <div className="flex items-center gap-4 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
                    <span className="flex items-center gap-1">
                      FILE: {images[lightboxIndex].refCode}
                    </span>
                    <span className="border-l border-slate-700 pl-4">SECURED BY: {images[lightboxIndex].officerId}</span>
                 </div>
              </div>
              
              <div className="h-px w-full bg-slate-800 mb-4" />
              
              <div className="flex items-start gap-3">
                 <div className="mt-1 px-2 py-1 bg-blue-900/30 border border-blue-800/50 rounded text-blue-400 font-mono text-[10px] uppercase tracking-widest shrink-0">
                    Log Entry
                 </div>
                 <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                   {images[lightboxIndex].details}
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InspectionGallery;