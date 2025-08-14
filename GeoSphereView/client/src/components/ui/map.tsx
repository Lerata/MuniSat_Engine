import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Plus, ZoomIn, ZoomOut, Home, Square, Ruler } from "lucide-react";

interface LayerState {
  settlements: boolean;
  dumping: boolean;
  pollution: boolean;
  deforestation: boolean;
  floodZones: boolean;
}

export default function InteractiveMap() {
  const [layers, setLayers] = useState<LayerState>({
    settlements: true,
    dumping: true,
    pollution: false,
    deforestation: true,
    floodZones: false,
  });

  const [opacity, setOpacity] = useState([75]);
  const [dateRange, setDateRange] = useState({
    start: "2024-01-01",
    end: "2024-01-31",
  });

  const { data: detections = [], isLoading } = useQuery({
    queryKey: ["/api/detections"],
  });

  const handleLayerToggle = (layer: keyof LayerState) => {
    setLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const mockDetections = [
    {
      id: "1",
      type: "Informal Settlement",
      location: "Sector 7, Grid A3",
      confidence: "92%",
      style: "top-16 left-20 w-12 h-8 bg-red-500 opacity-60 rounded-sm"
    },
    {
      id: "2", 
      type: "Informal Settlement",
      location: "Sector 4, Grid B2",
      confidence: "87%",
      style: "top-32 left-32 w-8 h-12 bg-red-500 opacity-60 rounded-sm"
    },
    {
      id: "3",
      type: "Illegal Dumping",
      location: "Industrial Zone, Grid B7",
      confidence: "89%",
      style: "top-24 right-20 w-6 h-6 bg-orange-500 opacity-70 rounded-full"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Satellite Analysis Map</h2>
          <Button className="bg-municipal-blue hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Map Controls */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium text-gray-700">Date Range:</Label>
              <Input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              />
              <span className="text-gray-500">to</span>
              <Input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium text-gray-700">Layer Opacity:</Label>
            <Slider
              value={opacity}
              onValueChange={setOpacity}
              max={100}
              step={1}
              className="w-20"
            />
            <span className="text-sm text-gray-600">{opacity[0]}%</span>
          </div>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox 
              checked={layers.settlements} 
              onCheckedChange={() => handleLayerToggle('settlements')}
            />
            <span className="text-sm font-medium text-gray-700">Settlements</span>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox 
              checked={layers.dumping} 
              onCheckedChange={() => handleLayerToggle('dumping')}
            />
            <span className="text-sm font-medium text-gray-700">Dumping</span>
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox 
              checked={layers.pollution} 
              onCheckedChange={() => handleLayerToggle('pollution')}
            />
            <span className="text-sm font-medium text-gray-700">Pollution</span>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox 
              checked={layers.deforestation} 
              onCheckedChange={() => handleLayerToggle('deforestation')}
            />
            <span className="text-sm font-medium text-gray-700">Deforestation</span>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox 
              checked={layers.floodZones} 
              onCheckedChange={() => handleLayerToggle('floodZones')}
            />
            <span className="text-sm font-medium text-gray-700">Flood Zones</span>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </label>
        </div>
      </div>

      {/* Mock Map Interface */}
      <div className="relative">
        <div className="h-96 bg-gradient-to-br from-green-200 via-green-300 to-green-400 relative overflow-hidden">
          {/* Mock satellite imagery background with grid pattern */}
          <div 
            className="absolute inset-0 opacity-70" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.3'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%2388bb88'/%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
              backgroundSize: 'cover'
            }}
          />
          
          {/* Detection Overlays */}
          {layers.settlements && (
            <>
              <div className="absolute top-16 left-20 w-12 h-8 bg-red-500 opacity-60 rounded-sm cursor-pointer hover:opacity-80" title="Informal Settlement - Confidence: 92%"></div>
              <div className="absolute top-32 left-32 w-8 h-12 bg-red-500 opacity-60 rounded-sm cursor-pointer hover:opacity-80" title="Informal Settlement - Confidence: 87%"></div>
              <div className="absolute bottom-20 right-24 w-16 h-10 bg-red-500 opacity-60 rounded-sm cursor-pointer hover:opacity-80" title="Informal Settlement - Confidence: 94%"></div>
            </>
          )}

          {layers.dumping && (
            <>
              <div className="absolute top-24 right-20 w-6 h-6 bg-orange-500 opacity-70 rounded-full cursor-pointer hover:opacity-90" title="Illegal Dumping - Confidence: 89%"></div>
              <div className="absolute bottom-16 left-16 w-8 h-8 bg-orange-500 opacity-70 rounded-full cursor-pointer hover:opacity-90" title="Illegal Dumping - Confidence: 76%"></div>
            </>
          )}

          {layers.deforestation && (
            <>
              <div className="absolute top-40 left-40 w-20 h-16 bg-green-600 opacity-50 rounded-lg cursor-pointer hover:opacity-70" title="Deforestation - Confidence: 91%"></div>
              <div className="absolute bottom-32 right-32 w-14 h-18 bg-green-600 opacity-50 rounded-lg cursor-pointer hover:opacity-70" title="Deforestation - Confidence: 88%"></div>
            </>
          )}

          {layers.floodZones && (
            <div className="absolute bottom-40 left-40 w-24 h-20 bg-blue-400 opacity-40 rounded-lg cursor-pointer hover:opacity-60" title="Flood Risk Zone - High Risk"></div>
          )}

          {layers.pollution && (
            <div className="absolute top-60 right-40 w-16 h-12 bg-yellow-400 opacity-50 rounded-lg cursor-pointer hover:opacity-70" title="Water Pollution Detected"></div>
          )}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <Button size="sm" variant="outline" className="w-10 h-10 bg-white shadow-lg">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="w-10 h-10 bg-white shadow-lg">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="w-10 h-10 bg-white shadow-lg">
              <Home className="w-4 h-4" />
            </Button>
          </div>

          {/* Area Selection Tool */}
          <div className="absolute bottom-4 left-4 flex space-x-2">
            <Button size="sm" variant="outline" className="bg-white shadow-lg">
              <Square className="w-4 h-4 mr-2" />
              Select Area
            </Button>
            <Button size="sm" variant="outline" className="bg-white shadow-lg">
              <Ruler className="w-4 h-4 mr-2" />
              Measure
            </Button>
          </div>

          {/* Coordinate Display */}
          <div className="absolute bottom-4 right-4 px-3 py-2 bg-black bg-opacity-75 text-white text-sm rounded-lg">
            <span>-25.7461°, 28.1881°</span>
          </div>
        </div>
      </div>

      {/* Detection Results Panel */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Detections</h3>
        <div className="space-y-3">
          {mockDetections.map((detection) => (
            <div key={detection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  detection.type === 'Informal Settlement' ? 'bg-red-500' : 'bg-orange-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{detection.type}</p>
                  <p className="text-xs text-gray-600">{detection.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{detection.confidence}</p>
                  <p className="text-xs text-gray-600">confidence</p>
                </div>
                <Button variant="outline" size="sm" className="text-municipal-blue hover:text-blue-700">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
