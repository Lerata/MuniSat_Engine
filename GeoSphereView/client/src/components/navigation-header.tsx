import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Bell, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function NavigationHeader() {
  const { user } = useAuth();
  const [location] = useLocation();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["/api/alerts"],
    select: (alerts: any[]) => alerts.filter((alert: any) => !alert.isRead).length,
  });

  const isActiveRoute = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-municipal-blue rounded-lg flex items-center justify-center">
                <i className="fas fa-satellite-dish text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MuniSat Analytics</h1>
                <p className="text-sm text-gray-600">Municipal Satellite Analysis Platform</p>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={isActiveRoute("/") ? "text-municipal-blue font-medium border-b-2 border-municipal-blue pb-1" : "text-gray-600 hover:text-gray-900"}>
              Dashboard
            </Link>
            <Link href="/analysis" className={isActiveRoute("/analysis") ? "text-municipal-blue font-medium border-b-2 border-municipal-blue pb-1" : "text-gray-600 hover:text-gray-900"}>
              Analysis
            </Link>
            <Link href="/reports" className={isActiveRoute("/reports") ? "text-municipal-blue font-medium border-b-2 border-municipal-blue pb-1" : "text-gray-600 hover:text-gray-900"}>
              Reports
            </Link>
            <Link href="/settings" className={isActiveRoute("/settings") ? "text-municipal-blue font-medium border-b-2 border-municipal-blue pb-1" : "text-gray-600 hover:text-gray-900"}>
              Settings
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="flex items-center space-x-3">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email?.split('@')[0] || 'User'
                  }
                </p>
                <p className="text-xs text-gray-600 capitalize">
                  {user?.role || 'Environmental Analyst'}
                </p>
                <a 
                  href="/api/logout"
                  className="text-xs text-municipal-blue hover:text-blue-700"
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
