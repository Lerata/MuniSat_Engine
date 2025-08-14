import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Play } from "lucide-react";

export default function AnalysisControls() {
  const [analysisType, setAnalysisType] = useState("change_detection");
  const [priority, setPriority] = useState("medium");
  const [sensitivity, setSensitivity] = useState([60]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startAnalysisMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/analysis-jobs", {
        type: analysisType,
        priority,
        parameters: {
          sensitivity: sensitivity[0],
          dateRange: {
            start: "2024-01-01",
            end: "2024-01-31"
          }
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Controls</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Type</label>
          <Select value={analysisType} onValueChange={setAnalysisType}>
            <SelectTrigger>
              <SelectValue placeholder="Select analysis type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="change_detection">Change Detection</SelectItem>
              <SelectItem value="comprehensive">Comprehensive Scan</SelectItem>
              <SelectItem value="targeted">Targeted Analysis</SelectItem>
              <SelectItem value="trend">Trend Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={priority === "low" ? "default" : "outline"}
              onClick={() => setPriority("low")}
              className={priority === "low" ? "bg-municipal-blue text-white" : ""}
            >
              Low
            </Button>
            <Button
              variant={priority === "medium" ? "default" : "outline"}
              onClick={() => setPriority("medium")}
              className={priority === "medium" ? "bg-municipal-blue text-white" : ""}
            >
              Medium
            </Button>
            <Button
              variant={priority === "high" ? "default" : "outline"}
              onClick={() => setPriority("high")}
              className={priority === "high" ? "bg-municipal-blue text-white" : ""}
            >
              High
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Detection Sensitivity</label>
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
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Starting...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Analysis
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
