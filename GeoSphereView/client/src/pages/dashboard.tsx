import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import NavigationHeader from "@/components/navigation-header";
import QuickStats from "@/components/quick-stats";
import InteractiveMap from "@/components/ui/map";
import AnalysisControls from "@/components/analysis-controls";
import TrendChart from "@/components/trend-chart";
import RecentAlerts from "@/components/recent-alerts";
import AnalysisReports from "@/components/analysis-reports";
import DetectionModal from "@/components/detection-modal";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-municipal-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <QuickStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Interface */}
          <div className="lg:col-span-2">
            <InteractiveMap />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AnalysisControls />
            <TrendChart />
            <RecentAlerts />
          </div>
        </div>

        <AnalysisReports />
      </div>

      <DetectionModal />
    </div>
  );
}
