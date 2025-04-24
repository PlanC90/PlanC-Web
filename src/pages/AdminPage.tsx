import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Settings, FileText, Bell, Shield, LogOut } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication for demo (in production, use proper authentication)
    if (username === 'admin' && password === 'password') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Try admin/password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <>
        <Helmet>
          <title>Admin Login - PlanC Space</title>
        </Helmet>
        <div className="max-w-md mx-auto my-16">
          <div className="glass-card rounded-lg p-8">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
            {loginError && (
              <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded mb-4 text-sm">
                {loginError}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium"
              >
                Sign In
              </button>
            </form>
            <div className="mt-4 text-sm text-gray-400 text-center">
              <p>For demo use: admin / password</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - PlanC Space</title>
      </Helmet>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="glass-card rounded-lg p-4">
            <div className="mb-6 px-2">
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            </div>
            <nav>
              <ul className="space-y-1">
                <SidebarItem
                  icon={<Shield size={18} />}
                  label="Dashboard"
                  isActive={activeTab === 'dashboard'}
                  onClick={() => setActiveTab('dashboard')}
                />
                <SidebarItem
                  icon={<Users size={18} />}
                  label="Users"
                  isActive={activeTab === 'users'}
                  onClick={() => setActiveTab('users')}
                />
                <SidebarItem
                  icon={<FileText size={18} />}
                  label="Content"
                  isActive={activeTab === 'content'}
                  onClick={() => setActiveTab('content')}
                />
                <SidebarItem
                  icon={<Bell size={18} />}
                  label="Notifications"
                  isActive={activeTab === 'notifications'}
                  onClick={() => setActiveTab('notifications')}
                />
                <SidebarItem
                  icon={<Settings size={18} />}
                  label="Settings"
                  isActive={activeTab === 'settings'}
                  onClick={() => setActiveTab('settings')}
                />
                <SidebarItem
                  icon={<LogOut size={18} />}
                  label="Logout"
                  onClick={handleLogout}
                />
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-4">
          <div className="glass-card rounded-lg p-6">
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'content' && <ContentTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>
    </>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <li>
      <button
        className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-slate-800 hover:text-white'
        }`}
        onClick={onClick}
      >
        <span className="mr-3">{icon}</span>
        {label}
      </button>
    </li>
  );
};

const DashboardTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Users"
          value="1,234"
          change="+12%"
          isPositive={true}
        />
        <DashboardCard
          title="Active Sessions"
          value="568"
          change="+8%"
          isPositive={true}
        />
        <DashboardCard
          title="API Requests"
          value="45.2k"
          change="-3%"
          isPositive={false}
        />
      </div>
      
      <div className="glass-card rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <ActivityItem
            message="New user registered"
            time="5 minutes ago"
          />
          <ActivityItem
            message="API rate limit increased for premium users"
            time="2 hours ago"
          />
          <ActivityItem
            message="System update completed"
            time="Yesterday at 11:30 PM"
          />
          <ActivityItem
            message="New blog post published: 'Crypto Market Analysis'"
            time="2 days ago"
          />
        </div>
      </div>
      
      <div className="glass-card rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-4">System Status</h3>
        <div className="space-y-3">
          <StatusItem
            name="Website"
            status="Operational"
            isOperational={true}
          />
          <StatusItem
            name="API Services"
            status="Operational"
            isOperational={true}
          />
          <StatusItem
            name="Database"
            status="Operational"
            isOperational={true}
          />
          <StatusItem
            name="Notification System"
            status="Degraded Performance"
            isOperational={false}
          />
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, change, isPositive }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4">
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <div className="flex items-center justify-between">
        <div className="text-white text-2xl font-bold">{value}</div>
        <div className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </div>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  message: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ message, time }) => {
  return (
    <div className="flex items-start border-b border-slate-700 pb-3 last:border-0 last:pb-0">
      <div>
        <p className="text-white text-sm">{message}</p>
        <p className="text-gray-400 text-xs mt-1">{time}</p>
      </div>
    </div>
  );
};

interface StatusItemProps {
  name: string;
  status: string;
  isOperational: boolean;
}

const StatusItem: React.FC<StatusItemProps> = ({ name, status, isOperational }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300 text-sm">{name}</span>
      <span className={`text-sm ${isOperational ? 'text-green-400' : 'text-yellow-400'}`}>
        {status}
      </span>
    </div>
  );
};

const UsersTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Users Management</h2>
      <p className="text-gray-400 mb-4">Manage user accounts, permissions, and activity.</p>
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">User List</h3>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm">
            Add New User
          </button>
        </div>
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-700">
              <td className="py-3 px-4 text-white">John Doe</td>
              <td className="py-3 px-4 text-gray-300">john@example.com</td>
              <td className="py-3 px-4 text-gray-300">Admin</td>
              <td className="py-3 px-4"><span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">Active</span></td>
              <td className="py-3 px-4 text-blue-400">Edit</td>
            </tr>
            <tr className="border-b border-slate-700">
              <td className="py-3 px-4 text-white">Jane Smith</td>
              <td className="py-3 px-4 text-gray-300">jane@example.com</td>
              <td className="py-3 px-4 text-gray-300">User</td>
              <td className="py-3 px-4"><span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">Active</span></td>
              <td className="py-3 px-4 text-blue-400">Edit</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-white">Mike Johnson</td>
              <td className="py-3 px-4 text-gray-300">mike@example.com</td>
              <td className="py-3 px-4 text-gray-300">Editor</td>
              <td className="py-3 px-4"><span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-xs">Pending</span></td>
              <td className="py-3 px-4 text-blue-400">Edit</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ContentTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Content Management</h2>
      <p className="text-gray-400 mb-4">Manage website content, blog posts, and announcements.</p>
      
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Blog Posts</h3>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm">
            Create New Post
          </button>
        </div>
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Author</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-700">
              <td className="py-3 px-4 text-white">Bitcoin Price Analysis: June 2025</td>
              <td className="py-3 px-4 text-gray-300">John Doe</td>
              <td className="py-3 px-4 text-gray-300">Jun 15, 2025</td>
              <td className="py-3 px-4"><span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">Published</span></td>
              <td className="py-3 px-4 text-blue-400">Edit</td>
            </tr>
            <tr className="border-b border-slate-700">
              <td className="py-3 px-4 text-white">Ethereum 2.0: What to Expect</td>
              <td className="py-3 px-4 text-gray-300">Jane Smith</td>
              <td className="py-3 px-4 text-gray-300">Jun 10, 2025</td>
              <td className="py-3 px-4"><span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">Published</span></td>
              <td className="py-3 px-4 text-blue-400">Edit</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-white">NFT Market Analysis Q2 2025</td>
              <td className="py-3 px-4 text-gray-300">Mike Johnson</td>
              <td className="py-3 px-4 text-gray-300">Jun 8, 2025</td>
              <td className="py-3 px-4"><span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-xs">Draft</span></td>
              <td className="py-3 px-4 text-blue-400">Edit</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NotificationsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Notifications</h2>
      <p className="text-gray-400 mb-4">Manage system notifications and alerts.</p>
      
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Send Notification</h3>
        </div>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Notification Type
            </label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Announcement</option>
              <option>Alert</option>
              <option>Update</option>
              <option>Maintenance</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Recipient Group
            </label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Users</option>
              <option>Admin Users</option>
              <option>Premium Users</option>
              <option>Free Users</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Subject
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notification subject"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Message
            </label>
            <textarea
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="Notification message"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Send Notification
          </button>
        </form>
      </div>
    </div>
  );
};

const SettingsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
      <p className="text-gray-400 mb-4">Configure system settings and preferences.</p>
      
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">General Settings</h3>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Site Name
            </label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value="PlanC Space"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Site Description
            </label>
            <textarea
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
              value="Cryptocurrency investment platform with real-time market data, portfolio tracking, and investment insights."
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="maintenance-mode"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="maintenance-mode" className="ml-2 block text-sm text-gray-300">
              Enable Maintenance Mode
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Data Refresh Interval (minutes)
            </label>
            <input
              type="number"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value="5"
              min="1"
              max="60"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Save Settings
          </button>
        </form>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-4">API Settings</h3>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              API Key
            </label>
            <div className="flex">
              <input
                type="text"
                className="flex-grow bg-slate-800 border border-slate-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value="****************************************"
                readOnly
              />
              <button
                type="button"
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-r-lg transition-colors"
              >
                Regenerate
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Rate Limit (requests per minute)
            </label>
            <input
              type="number"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value="60"
              min="10"
              max="1000"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Save API Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
