import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { formatDistanceToNow } from "date-fns";

export default function RecentAlerts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["/api/alerts"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: string) => {
      await apiRequest("PATCH", `/api/alerts/${alertId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
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
        description: "Failed to mark alert as read.",
        variant: "destructive",
      });
    },
  });

  // Mock recent alerts if no data
  const mockAlerts = [
    {
      id: "1",
      title: "High-Priority Settlement Growth",
      description: "New informal settlement detected in protected area",
      severity: "high",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
    },
    {
      id: "2", 
      title: "Waste Accumulation Alert",
      description: "Significant increase in dumping activity detected",
      severity: "medium",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      isRead: false,
    },
    {
      id: "3",
      title: "Vegetation Loss Detected",
      description: "Deforestation activity in conservation zone", 
      severity: "medium",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
    },
  ];

  const displayAlerts = alerts.length > 0 ? alerts.slice(0, 3) : mockAlerts;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
      case "critical":
        return "bg-red-50 border-red-200";
      case "medium":
        return "bg-orange-50 border-orange-200";
      case "low":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getSeverityDotColor = (severity: string) => {
    switch (severity) {
      case "high":
      case "critical":
        return "bg-red-500";
      case "medium":
        return "bg-orange-500";
      case "low":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
      <div className="space-y-3">
        {displayAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start space-x-3 p-3 border rounded-lg ${getSeverityColor(alert.severity)}`}
          >
            <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityDotColor(alert.severity)}`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{alert.title}</p>
              <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
              </p>
              {!alert.isRead && (
                <Button
                  size="sm"
                  variant="link"
                  className="text-xs p-0 h-auto text-municipal-blue hover:text-blue-700"
                  onClick={() => markAsReadMutation.mutate(alert.id)}
                  disabled={markAsReadMutation.isPending}
                >
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full mt-4 text-municipal-blue border-municipal-blue hover:bg-blue-50">
        View All Alerts
      </Button>
    </div>
  );
}
