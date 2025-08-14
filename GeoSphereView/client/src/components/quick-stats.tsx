import { useQuery } from "@tanstack/react-query";
import { TrendingUp, MapPin, Satellite, Clock } from "lucide-react";

export default function QuickStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Alerts</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.activeAlerts || 0}</p>
            <p className="text-sm text-red-600">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +3 this week
            </p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Areas Monitored</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.areasMonitored || 0}</p>
            <p className="text-sm text-green-600">
              <i className="fas fa-check mr-1"></i>
              12 resolved
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <MapPin className="text-municipal-blue text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Data Coverage</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.coverage || 0}%</p>
            <p className="text-sm text-gray-600">Last updated: 2h ago</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Satellite className="text-environmental-green text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Analysis Queue</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.queueLength || 0}</p>
            <p className="text-sm text-orange-600">
              <Clock className="inline w-3 h-3 mr-1" />
              Est. 2h remaining
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-cogs text-alert-orange text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
