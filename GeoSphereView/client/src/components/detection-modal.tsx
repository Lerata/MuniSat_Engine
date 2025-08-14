import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, FileText, Bell } from "lucide-react";

interface Detection {
  id: string;
  type: string;
  location: string;
  confidence: string;
  area?: string;
  firstDetected?: string;
  status?: string;
}

export default function DetectionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  // Mock detection data
  const mockDetection = {
    id: "1",
    type: "Informal Settlement",
    location: "Sector 7, Grid A3", 
    confidence: "92%",
    area: "2.3 hectares",
    firstDetected: "Jan 15, 2024",
    status: "Under Investigation"
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedDetection(null);
  };

  const detection = selectedDetection || mockDetection;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "under investigation":
        return "bg-orange-100 text-orange-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "detected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Detection Details
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Detection Information</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="text-sm font-medium text-gray-900">{detection.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Confidence:</span>
                <span className="text-sm font-medium text-gray-900">{detection.confidence}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Area:</span>
                <span className="text-sm font-medium text-gray-900">{detection.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">First Detected:</span>
                <span className="text-sm font-medium text-gray-900">{detection.firstDetected}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge className={getStatusColor(detection.status || "detected")}>
                  {detection.status}
                </Badge>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Historical Analysis</h4>
            <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-sm text-gray-600">Trend Chart Placeholder</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Recommended Actions</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-900">Schedule field verification within 48 hours</p>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <p className="text-sm text-gray-900">Notify local law enforcement and zoning department</p>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-900">Continue monitoring for 30 days post-intervention</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 -m-6 mt-6 p-6 flex justify-end space-x-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button className="bg-municipal-blue hover:bg-blue-700">
            <Bell className="w-4 h-4 mr-2" />
            Create Alert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
