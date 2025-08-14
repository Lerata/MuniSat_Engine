import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import NavigationHeader from "@/components/navigation-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileDown, BarChart3, RefreshCw, Flame, Settings, Eye, Download, Plus, Search, Calendar, Filter } from "lucide-react";
import { format } from "date-fns";

export default function Reports() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [newReportConfig, setNewReportConfig] = useState({
    title: "",
    description: "",
    type: "monthly",
    dateRange: {
      start: "2024-01-01",
      end: "2024-01-31"
    }
  });

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

  const { data: reports = [], isLoading: reportsLoading } = useQuery<any[]>({
    queryKey: ["/api/reports"],
  });

  const generateReportMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/reports", {
        title: newReportConfig.title || `${newReportConfig.type} Analysis Report`,
        description: newReportConfig.description || `Generated ${newReportConfig.type.toLowerCase()} analysis report`,
        type: newReportConfig.type,
        parameters: {
          dateRange: newReportConfig.dateRange,
          analysisType: newReportConfig.type
        }
      });
    },
    onSuccess: () => {
      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      setIsGenerateDialogOpen(false);
      setNewReportConfig({
        title: "",
        description: "",
        type: "monthly",
        dateRange: {
          start: "2024-01-01",
          end: "2024-01-31"
        }
      });
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

  const reportTypes = [
    {
      key: "monthly",
      icon: BarChart3,
      title: "Monthly Summary",
      description: "Comprehensive monthly analysis report",
      bgColor: "bg-blue-100",
      iconColor: "text-municipal-blue",
    },
    {
      key: "change_detection", 
      icon: RefreshCw,
      title: "Change Detection",
      description: "Compare different time periods",
      bgColor: "bg-green-100",
      iconColor: "text-environmental-green",
    },
    {
      key: "hotspot",
      icon: Flame,
      title: "Hotspot Analysis", 
      description: "Identify high-activity areas",
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      key: "custom",
      icon: Settings,
      title: "Custom Report",
      description: "Create custom analysis parameters",
      bgColor: "bg-orange-100",
      iconColor: "text-alert-orange",
    },
  ];

  const mockReports = [
    {
      id: "1",
      title: "January 2024 Environmental Analysis",
      description: "Monthly comprehensive report covering all detection types",
      type: "monthly",
      createdAt: new Date("2024-01-31"),
      status: "completed"
    },
    {
      id: "2",
      title: "Emergency Response Alert - Sector 7",
      description: "High-priority settlement growth analysis", 
      type: "emergency",
      createdAt: new Date("2024-01-28"),
      status: "completed"
    },
    {
      id: "3",
      title: "Q4 2023 Change Detection Report",
      description: "Quarterly environmental change analysis",
      type: "change_detection",
      createdAt: new Date("2024-01-15"),
      status: "completed"
    },
  ];

  const displayReports = reports.length > 0 ? reports : mockReports;

  const filteredReports = displayReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || report.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleQuickGenerate = (reportType: string) => {
    setNewReportConfig({
      title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Analysis Report`,
      description: `Generated ${reportType.toLowerCase()} analysis report`,
      type: reportType,
      dateRange: newReportConfig.dateRange
    });
    generateReportMutation.mutate();
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case "monthly":
        return "bg-blue-100 text-blue-800";
      case "change_detection":
        return "bg-green-100 text-green-800";
      case "hotspot":
        return "bg-red-100 text-red-800";
      case "emergency":
        return "bg-red-100 text-red-800";
      case "custom":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-municipal-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analysis Reports</h1>
            <p className="text-gray-600">Generate and manage environmental monitoring reports</p>
          </div>
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-environmental-green hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="report-title">Report Title</Label>
                  <Input
                    id="report-title"
                    value={newReportConfig.title}
                    onChange={(e) => setNewReportConfig(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter report title"
                  />
                </div>
                <div>
                  <Label htmlFor="report-description">Description</Label>
                  <Input
                    id="report-description"
                    value={newReportConfig.description}
                    onChange={(e) => setNewReportConfig(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter report description"
                  />
                </div>
                <div>
                  <Label>Report Type</Label>
                  <Select value={newReportConfig.type} onValueChange={(value) => setNewReportConfig(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly Summary</SelectItem>
                      <SelectItem value="change_detection">Change Detection</SelectItem>
                      <SelectItem value="hotspot">Hotspot Analysis</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Input
                      type="date"
                      value={newReportConfig.dateRange.start}
                      onChange={(e) => setNewReportConfig(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                    />
                    <Input
                      type="date"
                      value={newReportConfig.dateRange.end}
                      onChange={(e) => setNewReportConfig(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => generateReportMutation.mutate()}
                  disabled={generateReportMutation.isPending}
                  className="w-full bg-municipal-blue hover:bg-blue-700"
                >
                  {generateReportMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Report Generation</CardTitle>
            <CardDescription>Generate common report types with default parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTypes.map((reportType) => {
                const IconComponent = reportType.icon;
                return (
                  <div
                    key={reportType.key}
                    className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleQuickGenerate(reportType.key)}
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
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Report Library</CardTitle>
                <CardDescription>Browse and download your generated reports</CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="change_detection">Change Detection</SelectItem>
                    <SelectItem value="hotspot">Hotspot</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {reportsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
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
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileDown className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterType !== "all" ? "No matching reports" : "No reports generated"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterType !== "all" ? "Try adjusting your search or filter criteria" : "Generate your first report to get started with environmental analysis"}
                </p>
                <Button 
                  onClick={() => setIsGenerateDialogOpen(true)}
                  className="bg-municipal-blue hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-file-pdf text-red-600"></i>
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <p className="font-medium text-gray-900">{report.title}</p>
                          <Badge className={getReportTypeColor(report.type)}>
                            {report.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{report.description}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Generated: {format(new Date(report.createdAt), "MMM dd, yyyy 'at' HH:mm")}
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
                        Preview
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}