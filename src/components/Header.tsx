import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GovBanner from "@/components/GovBanner";
import cbpLogo from "@/assets/cbp.png";

const Header = () => {
  const navigate = useNavigate();
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // If we've scrolled down past 50px
      if (window.scrollY > 50) {
        setIsAtTop(false);
        setIsScrolling(true);

        // Clear the timeout while actively scrolling
        if (scrollTimeout) clearTimeout(scrollTimeout);

        // Set a timeout to hide the header when scrolling STOPS
        scrollTimeout = setTimeout(() => {
          setIsScrolling(false);
        }, 800); // Hides 800ms after scroll activity stops
      } else {
        // Back at the top
        setIsAtTop(true);
        setIsScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // On mobile: Hide if we are not at the top AND not actively scrolling.
  // On desktop (md:): Always stay visible (translate-y-0).
  const navVisibilityClass = !isAtTop && !isScrolling 
    ? "max-md:-translate-y-full" 
    : "translate-y-0";

  return (
    <div 
      className={`sticky top-0 z-50 w-full flex flex-col transition-transform duration-300 shadow-sm md:static md:shadow-none ${navVisibilityClass}`}
    >
      {/* Gov Banner is now inside the sticky container so it shares the exact same visibility as the header */}
      <GovBanner />

      {/* Main Navigation */}
      <header className="w-full bg-white border-b border-border">
        <nav className="container max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <img 
            src={cbpLogo} 
            alt="CBP Shipment Tracker" 
            width={300} 
            height={94} 
            className="object-contain w-36 sm:w-[300px] h-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
          
          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="text-[#004B87] font-semibold hover:bg-[#004B87]/10"
            >
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/track")}
              className="bg-[#004B87] hover:bg-[#003865] text-white"
            >
              Track Shipment
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;