import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon, Bell, Shield, Palette, Globe } from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    currency: 'USD'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserSettings();
      setSettings({
        notifications: response.notifications ?? true,
        darkMode: response.darkMode ?? true,
        currency: response.currency ?? 'USD'
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings);
      await apiService.updateUserSettings({ [key]: value });
    } catch (error) {
      console.error('Error updating setting:', error);
      // Revert the change if API call fails
      setSettings(settings);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Settings</h1>
              <p className="text-sm text-slate-400">Customize your experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Notifications */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-6 h-6 text-blue-400" />
            <h2 className="text-lg font-semibold text-blue-400">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Push Notifications</p>
                <p className="text-sm text-slate-400">Receive alerts for transactions and budgets</p>
              </div>
              <button
                onClick={() => updateSetting('notifications', !settings.notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Palette className="w-6 h-6 text-purple-400" />
            <h2 className="text-lg font-semibold text-purple-400">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-sm text-slate-400">Use dark theme for better viewing</p>
              </div>
              <button
                onClick={() => updateSetting('darkMode', !settings.darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.darkMode ? 'bg-purple-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Currency */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-6 h-6 text-green-400" />
            <h2 className="text-lg font-semibold text-green-400">Currency</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Default Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => updateSetting('currency', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="INR">INR - Indian Rupee</option>
            </select>
          </div>
        </div>

        {/* Security */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-red-400" />
            <h2 className="text-lg font-semibold text-red-400">Security</h2>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-600/30 rounded-lg transition-colors">
              <p className="text-white font-medium">Change Password</p>
              <p className="text-sm text-slate-400">Update your account password</p>
            </button>
            <button className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-600/30 rounded-lg transition-colors">
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-slate-400">Add an extra layer of security</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;