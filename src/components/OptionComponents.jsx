// Sample components for each option
const Option1Component = () => (
  <div className="p-8 h-full overflow-auto">
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Dashboard Overview</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Total Users</h3>
          <p className="text-2xl font-bold text-blue-900">1,234</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Revenue</h3>
          <p className="text-2xl font-bold text-green-900">$45,678</p>
        </div>
      </div>
      <p className="text-gray-600">This is the dashboard overview with key metrics and insights.</p>
    </div>
  </div>
)

const Option2Component = () => (
  <div className="p-8 h-full overflow-auto">
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-purple-900 mb-4">Analytics</h1>
      <div className="bg-purple-50 p-6 rounded-lg mb-4">
        <h3 className="font-semibold text-purple-800 mb-3">Performance Metrics</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Page Views</span>
            <span className="font-bold">12,345</span>
          </div>
          <div className="flex justify-between">
            <span>Bounce Rate</span>
            <span className="font-bold">23.4%</span>
          </div>
        </div>
      </div>
      <p className="text-gray-600">Detailed analytics and performance data.</p>
    </div>
  </div>
)

const Option3Component = () => (
  <div className="p-8 h-full overflow-auto">
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-green-900 mb-4">Reports</h1>
      <div className="bg-green-50 p-6 rounded-lg mb-4">
        <h3 className="font-semibold text-green-800 mb-3">Monthly Report</h3>
        <ul className="space-y-2 text-green-700">
          <li>• Sales increased by 15%</li>
          <li>• Customer satisfaction: 94%</li>
          <li>• New customers: 456</li>
        </ul>
      </div>
      <p className="text-gray-600">Comprehensive reports and data analysis.</p>
    </div>
  </div>
)

const Option4Component = () => (
  <div className="p-8 h-full overflow-auto">
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-orange-900 mb-4">Settings</h1>
      <div className="space-y-4">
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-semibold text-orange-800 mb-2">User Preferences</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              Email notifications
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              SMS alerts
            </label>
          </div>
        </div>
      </div>
      <p className="text-gray-600">Configure your application settings.</p>
    </div>
  </div>
)

const Option5Component = () => (
  <div className="p-8 h-full overflow-auto">
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-red-900 mb-4">Help & Support</h1>
      <div className="bg-red-50 p-6 rounded-lg mb-4">
        <h3 className="font-semibold text-red-800 mb-3">Contact Information</h3>
        <div className="space-y-2 text-red-700">
          <p>📧 support@example.com</p>
          <p>📞 +1 (555) 123-4567</p>
          <p>💬 Live chat available 24/7</p>
        </div>
      </div>
      <p className="text-gray-600">Get help and support for your questions.</p>
    </div>
  </div>
)

export {
  Option1Component,
  Option2Component,
  Option3Component,
  Option4Component,
  Option5Component
}