import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import NavigationHeader from "@/components/navigation-header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, RefreshCw, Settings, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Analysis() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [analysisType, setAnalysisType] = useState("change_detection");
  const [priority, setPriority] = useState("medium");
  const [sensitivity, setSensitivity] = useState([60]);
  const [dateRange, setDateRange] = useState({
    start: "2024-01-01",
    end: "2024-01-31",
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

  const { data: analysisJobs = [], isLoading: jobsLoading } = useQuery<any[]>({
    queryKey: ["/api/analysis-jobs"],
  });

  const startAnalysisMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/analysis-jobs", {
        type: analysisType,
        priority,
        parameters: {
          sensitivity: sensitivity[0],
          dateRange: dateRange,
          areaSelection: "full_coverage"
        }
      });
    },
    onSuccess: () => {
      toast({
        title: "Analysis Started",
        description: "Your analysis job has been queued successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/analysis-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
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
        description: "Failed to start analysis. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStartAnalysis = () => {
    startAnalysisMutation.mutate();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "processing":
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-municipal-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Satellite Analysis</h1>
          <p className="text-gray-600">Configure and monitor analysis jobs for environmental monitoring</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analysis Configuration */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Analysis Configuration
                </CardTitle>
                <CardDescription>
                  Set up parameters for your satellite analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="analysis-type" className="text-sm font-medium text-gray-700">Analysis Type</Label>
                  <Select value={analysisType} onValueChange={setAnalysisType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select analysis type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="change_detection">Change Detection</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Scan</SelectItem>
                      <SelectItem value="targeted">Targeted Analysis</SelectItem>
                      <SelectItem value="trend">Trend Analysis</SelectItem>
                      <SelectItem value="hotspot">Hotspot Detection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Date Range</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <Label htmlFor="start-date" className="text-xs text-gray-500">From</Label>
                      <Input 
                        id="start-date"
                        type="date" 
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date" className="text-xs text-gray-500">To</Label>
                      <Input 
                        id="end-date"
                        type="date" 
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Priority Level</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["low", "medium", "high"].map((level) => (
                      <Button
                        key={level}
                        variant={priority === level ? "default" : "outline"}
                        onClick={() => setPriority(level)}
                        className={`text-xs ${priority === level ? "bg-municipal-blue text-white" : ""}`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Detection Sensitivity</Label>
                  <Slider
                    value={sensitivity}
                    onValueChange={setSensitivity}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Conservative</span>
                    <span>{sensitivity[0]}%</span>
                    <span>Aggressive</span>
                  </div>
                </div>

                <Button 
                  onClick={handleStartAnalysis}
                  disabled={startAnalysisMutation.isPending}
                  className="w-full bg-municipal-blue hover:bg-blue-700"
                >
                  {startAnalysisMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Jobs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Jobs</CardTitle>
                <CardDescription>
                  Monitor the progress of your satellite analysis jobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-48"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                          </div>
                          <div className="h-6 w-20 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : analysisJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <RefreshCw className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Jobs</h3>
                    <p className="text-gray-600 mb-4">Start your first analysis to monitor environmental changes</p>
                    <Button 
                      onClick={handleStartAnalysis}
                      className="bg-municipal-blue hover:bg-blue-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Analysis
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analysisJobs.map((job: any) => (
                      <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900 capitalize">
                              {job.type.replace('_', ' ')} Analysis
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Priority: {job.priority} • 
                              Created {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(job.status)}
                            <Badge className={getStatusColor(job.status)}>
                              {job.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{job.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-municipal-blue h-2 rounded-full transition-all duration-300"
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          {job.status === "completed" && (
                            <Button variant="outline" size="sm" className="text-environmental-green border-environmental-green">
                              View Results
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}