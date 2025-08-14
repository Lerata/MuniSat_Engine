import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { FileDown, BarChart3, RefreshCw, Flame, Settings, Eye, Download } from "lucide-react";
import { format } from "date-fns";

export default function AnalysisReports() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["/api/reports"],
  });

  const generateReportMutation = useMutation({
    mutationFn: async (reportType: string) => {
      await apiRequest("POST", "/api/reports", {
        title: `${reportType} Analysis Report`,
        description: `Generated ${reportType.toLowerCase()} analysis report`,
        type: reportType.toLowerCase().replace(" ", "_"),
        parameters: {
          dateRange: {
            start: "2024-01-01",
            end: "2024-01-31"
          },
          analysisType: reportType
        }
      });
    },
    onSuccess: () => {
      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mock reports if no data
  const mockReports = [
    {
      id: "1",
      title: "January 2024 Environmental Analysis",
      description: "Monthly comprehensive report covering all detection types",
      type: "monthly",
      createdAt: new Date("2024-01-31"),
    },
    {
      id: "2",
      title: "Emergency Response Alert - Sector 7",
      description: "High-priority settlement growth analysis", 
      type: "emergency",
      createdAt: new Date("2024-01-28"),
    },
  ];

  const displayReports = reports.length > 0 ? reports.slice(0, 2) : mockReports;

  const reportTypes = [
    {
      key: "Monthly Summary",
      icon: BarChart3,
      title: "Monthly Summary",
      description: "Comprehensive monthly analysis report",
      bgColor: "bg-blue-100",
      iconColor: "text-municipal-blue",
    },
    {
      key: "Change Detection", 
      icon: RefreshCw,
      title: "Change Detection",
      description: "Compare different time periods",
      bgColor: "bg-green-100",
      iconColor: "text-environmental-green",
    },
    {
      key: "Hotspot Analysis",
      icon: Flame,
      title: "Hotspot Analysis", 
      description: "Identify high-activity areas",
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      key: "Custom Report",
      icon: Settings,
      title: "Custom Report",
      description: "Create custom analysis parameters",
      bgColor: "bg-orange-100",
      iconColor: "text-alert-orange",
    },
  ];

  const handleGenerateReport = (reportType: string) => {
    generateReportMutation.mutate(reportType);
  };

  return (
    <div className="mt-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Analysis Reports</h2>
            <Button className="bg-environmental-green hover:bg-green-700">
              <FileDown className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTypes.map((reportType) => {
              const IconComponent = reportType.icon;
              return (
                <div
                  key={reportType.key}
                  className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleGenerateReport(reportType.key)}
                >
                  <div className={`w-12 h-12 ${reportType.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className={`${reportType.iconColor} text-xl w-6 h-6`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{reportType.title}</h3>
                  <p className="text-sm text-gray-600">{reportType.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-8 w-20 bg-gray-200 rounded"></div>
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {displayReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-file-pdf text-red-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{report.title}</p>
                        <p className="text-sm text-gray-600">{report.description}</p>
                        <p className="text-xs text-gray-500">
                          Generated: {format(new Date(report.createdAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-municipal-blue border-municipal-blue hover:bg-blue-50"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
