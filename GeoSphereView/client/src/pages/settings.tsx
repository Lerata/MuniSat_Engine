import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import NavigationHeader from "@/components/navigation-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Database, Globe, Save, Key, Palette } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const [userSettings, setUserSettings] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "analyst",
    timezone: "UTC-5",
    language: "en",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    highPriorityOnly: false,
    weeklyReports: true,
    systemUpdates: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    defaultAnalysisType: "change_detection",
    defaultPriority: "medium",
    autoRefresh: true,
    darkMode: false,
    compactView: false,
  });

  const [apiSettings, setApiSettings] = useState({
    apiKeyName: "",
    rateLimit: "1000",
    allowedDomains: "",
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

  // Update user settings when user data loads
  useEffect(() => {
    if (user) {
      setUserSettings({
        firstName: (user as any).firstName || "",
        lastName: (user as any).lastName || "",
        email: (user as any).email || "",
        role: (user as any).role || "analyst",
        timezone: "UTC-5",
        language: "en",
      });
    }
  }, [user]);

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    // In a real app, this would update notification preferences
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSaveSystem = () => {
    // In a real app, this would update system preferences
    toast({
      title: "System Settings Updated",
      description: "Your system preferences have been saved.",
    });
  };

  const handleGenerateApiKey = () => {
    // In a real app, this would generate a new API key
    toast({
      title: "API Key Generated",
      description: "A new API key has been generated for your account.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-municipal-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
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
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and system configuration</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>System</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center space-x-2">
              <Key className="w-4 h-4" />
              <span>API Access</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userSettings.firstName}
                      onChange={(e) => setUserSettings(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userSettings.lastName}
                      onChange={(e) => setUserSettings(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userSettings.email}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Role</Label>
                    <Select value={userSettings.role} onValueChange={(value) => setUserSettings(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="analyst">Environmental Analyst</SelectItem>
                        <SelectItem value="administrator">Administrator</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Timezone</Label>
                    <Select value={userSettings.timezone} onValueChange={(value) => setUserSettings(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-5">UTC-5 (Eastern)</SelectItem>
                        <SelectItem value="UTC-6">UTC-6 (Central)</SelectItem>
                        <SelectItem value="UTC-7">UTC-7 (Mountain)</SelectItem>
                        <SelectItem value="UTC-8">UTC-8 (Pacific)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Language</Label>
                  <Select value={userSettings.language} onValueChange={(value) => setUserSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <Button onClick={handleSaveProfile} className="bg-municipal-blue hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-alerts">Email Alerts</Label>
                      <p className="text-sm text-gray-600">Receive alert notifications via email</p>
                    </div>
                    <Switch
                      id="email-alerts"
                      checked={notificationSettings.emailAlerts}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailAlerts: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-600">Receive browser notifications</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="high-priority">High Priority Only</Label>
                      <p className="text-sm text-gray-600">Only receive critical and high-priority alerts</p>
                    </div>
                    <Switch
                      id="high-priority"
                      checked={notificationSettings.highPriorityOnly}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, highPriorityOnly: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-reports">Weekly Reports</Label>
                      <p className="text-sm text-gray-600">Receive weekly summary reports</p>
                    </div>
                    <Switch
                      id="weekly-reports"
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-updates">System Updates</Label>
                      <p className="text-sm text-gray-600">Receive notifications about system updates and maintenance</p>
                    </div>
                    <Switch
                      id="system-updates"
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemUpdates: checked }))}
                    />
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveNotifications} className="bg-municipal-blue hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Notifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  System Preferences
                </CardTitle>
                <CardDescription>
                  Configure default system behavior and interface preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Default Analysis Type</Label>
                    <Select value={systemSettings.defaultAnalysisType} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, defaultAnalysisType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
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
                    <Label>Default Priority</Label>
                    <Select value={systemSettings.defaultPriority} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, defaultPriority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-refresh">Auto Refresh</Label>
                      <p className="text-sm text-gray-600">Automatically refresh data every 5 minutes</p>
                    </div>
                    <Switch
                      id="auto-refresh"
                      checked={systemSettings.autoRefresh}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoRefresh: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-gray-600">Use dark theme for the interface</p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={systemSettings.darkMode}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, darkMode: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compact-view">Compact View</Label>
                      <p className="text-sm text-gray-600">Use compact layout for better space utilization</p>
                    </div>
                    <Switch
                      id="compact-view"
                      checked={systemSettings.compactView}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, compactView: checked }))}
                    />
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveSystem} className="bg-municipal-blue hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save System Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  API Access
                </CardTitle>
                <CardDescription>
                  Manage API keys and integration settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Current API Key</h4>
                  <div className="flex items-center space-x-3">
                    <code className="bg-white px-3 py-2 rounded border text-sm font-mono">
                      msat_************************************
                    </code>
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Created: January 15, 2024 • Last used: 2 hours ago</p>
                </div>

                <div>
                  <Label htmlFor="api-key-name">API Key Name</Label>
                  <Input
                    id="api-key-name"
                    value={apiSettings.apiKeyName}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, apiKeyName: e.target.value }))}
                    placeholder="Enter a name for the new API key"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rate-limit">Rate Limit (requests/hour)</Label>
                    <Input
                      id="rate-limit"
                      value={apiSettings.rateLimit}
                      onChange={(e) => setApiSettings(prev => ({ ...prev, rateLimit: e.target.value }))}
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="allowed-domains">Allowed Domains</Label>
                    <Input
                      id="allowed-domains"
                      value={apiSettings.allowedDomains}
                      onChange={(e) => setApiSettings(prev => ({ ...prev, allowedDomains: e.target.value }))}
                      placeholder="example.com, api.example.com"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Security Notice</h4>
                  <p className="text-sm text-yellow-800">
                    API keys provide access to your satellite analysis data. Keep them secure and never share them publicly.
                    Regenerating a key will invalidate the previous one.
                  </p>
                </div>

                <Separator />

                <div className="flex space-x-3">
                  <Button onClick={handleGenerateApiKey} className="bg-environmental-green hover:bg-green-700">
                    <Key className="w-4 h-4 mr-2" />
                    Generate New Key
                  </Button>
                  <Button variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    View Usage Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}