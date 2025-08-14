export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-municipal-blue rounded-lg flex items-center justify-center">
                <i className="fas fa-satellite-dish text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MuniSat Analytics</h1>
                <p className="text-sm text-gray-600">Municipal Satellite Analysis Platform</p>
              </div>
            </div>
            <a 
              href="/api/login" 
              className="px-6 py-2 bg-municipal-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Advanced Satellite Analysis for
            <span className="text-municipal-blue"> Municipal Planning</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Monitor environmental changes, detect illegal activities, and make data-driven decisions 
            with our comprehensive satellite analysis platform designed for municipal authorities.
          </p>
          
          <a 
            href="/api/login" 
            className="inline-flex items-center px-8 py-4 bg-municipal-blue text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <i className="fas fa-rocket mr-3"></i>
            Get Started Today
          </a>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
              <i className="fas fa-home text-red-600 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Settlement Detection</h3>
            <p className="text-gray-600">
              Automatically identify and monitor informal settlements, tracking expansion patterns over time.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
              <i className="fas fa-trash text-orange-600 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Waste Management</h3>
            <p className="text-gray-600">
              Detect illegal dumping sites and monitor waste accumulation in urban and rural areas.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <i className="fas fa-tint text-blue-600 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Water Quality</h3>
            <p className="text-gray-600">
              Monitor water sources for pollution and contamination, ensuring community health and safety.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <i className="fas fa-tree text-green-600 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Forest Protection</h3>
            <p className="text-gray-600">
              Track deforestation activities and vegetation changes to protect natural resources.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <i className="fas fa-water text-blue-600 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Flood Risk Assessment</h3>
            <p className="text-gray-600">
              Identify flood-prone areas and assess vulnerability for disaster preparedness planning.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <i className="fas fa-chart-line text-purple-600 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Analytics & Reports</h3>
            <p className="text-gray-600">
              Generate comprehensive reports and analytics to support evidence-based decision making.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Municipal Planning?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join leading municipalities worldwide in using satellite technology for smarter, 
            more efficient urban management and environmental protection.
          </p>
          <a 
            href="/api/login" 
            className="inline-flex items-center px-8 py-4 bg-environmental-green text-white rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            <i className="fas fa-sign-in-alt mr-3"></i>
            Access Platform
          </a>
        </div>
      </main>
    </div>
  );
}
