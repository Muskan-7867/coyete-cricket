"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Coyote Cricket",
    siteEmail: "support@coyotecricket.com",
    enableNotifications: true,
    maintenanceMode: false,
    adminName: "Admin User",
    adminPassword: "",
  });

  const handleChange = (key: keyof typeof settings, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log("Saved settings:", settings);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="font-semibold text-gray-700 flex items-center gap-2">
          🌐 General Settings
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Site Name</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("siteName", e.target.value)
            }
            placeholder="Enter site name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Support Email</label>
          <input
            type="email"
            value={settings.siteEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("siteEmail", e.target.value)
            }
            placeholder="support@example.com"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Enable Notifications</span>
          <input
            type="checkbox"
            checked={settings.enableNotifications}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("enableNotifications", e.target.checked)
            }
            className="w-5 h-5"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Maintenance Mode</span>
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("maintenanceMode", e.target.checked)
            }
            className="w-5 h-5"
          />
        </div>
      </div>

      {/* Admin Profile */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="font-semibold text-gray-700 flex items-center gap-2">👤 Admin Profile</div>
        <div>
          <label className="text-sm font-medium text-gray-600">Admin Name</label>
          <input
            type="text"
            value={settings.adminName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("adminName", e.target.value)
            }
            placeholder="Enter admin name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Change Password</label>
          <input
            type="password"
            value={settings.adminPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("adminPassword", e.target.value)
            }
            placeholder="Enter new password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
          />
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90 flex items-center gap-2"
        >
          💾 Save Changes
        </button>
      </div>
    </div>
  );
}
