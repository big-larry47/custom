import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Package, PauseCircle } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ShipmentHeader from "@/components/ShipmentHeader";
import InspectionGallery from "@/components/InspectionGallery";
import ClearanceTimeline from "@/components/ClearanceTimeline";
import ActivityLog from "@/components/ActivityLog";
import Header from "@/components/Header";
import SupportAssistant from "@/components/SupportAssistant";
import { mockShipment } from "@/data/mockShipment";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const navigate = useNavigate();
  
  const [shipment, setShipment] = useState<typeof mockShipment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (trackingNumber) {
      performSearch(trackingNumber);
    } else {
      setShipment(null); 
    }
  }, [trackingNumber]);

  const performSearch = (query: string) => {
    setIsLoading(true);
    
    const sanitizedQuery = query.trim().toUpperCase();
    const validEntryNumber = mockShipment.entryNumber.toUpperCase();
    const validReferenceNumber = mockShipment.referenceNumber.toUpperCase();

    setTimeout(() => {
      if (sanitizedQuery === validEntryNumber || sanitizedQuery === validReferenceNumber) {
        setShipment(mockShipment);
      } else {
        setShipment(null);
        toast({
          title: "Shipment Not Found",
          description: "Please verify your Entry Number or Reference Number and try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1200);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    navigate(`/track/${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-grow">
        <section className="bg-secondary/50 border-b border-border">
          <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12">
            {!shipment && (
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                  Track Your Customs Clearance
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Enter your reference number to view real-time clearance status and required actions.
                </p>
              </div>
            )}
            <SearchBar onSearch={handleSearch} isLoading={isLoading} initialQuery={trackingNumber} />
          </div>
        </section>

        {shipment && (
          <main className="container max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ShipmentHeader shipment={shipment} />

            <section>
              <h3 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                Inspection Images
              </h3>
              <InspectionGallery />
            </section>

            <div className="grid md:grid-cols-5 gap-8">
              <div className="md:col-span-3">
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <h3 className="text-lg font-display font-semibold text-foreground">
                      Clearance Progress
                    </h3>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning text-xs font-bold uppercase tracking-wider">
                      <PauseCircle className="h-3.5 w-3.5" />
                      Paused
                    </div>
                  </div>
                  
                  <ClearanceTimeline stages={shipment.timeline} />
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="hidden md:block bg-card rounded-xl border border-border p-6">
                  <ActivityLog entries={shipment.activity} />
                </div>
                
                <div className="flex justify-center md:justify-start">
                  <SupportAssistant />
                </div>
              </div>
            </div>

          </main>
        )}
      </div>

      <footer className="border-t border-border mt-12">
        <div className="container max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            This is a tracking interface for information & official Customs & Border Protection inquiries.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;