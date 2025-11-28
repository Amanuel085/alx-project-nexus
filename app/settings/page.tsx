"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [smsNotif, setSmsNotif] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  const handleSavePassword = () => {
    console.log("Password updated:", { currentPassword, newPassword });
  };

  const handleDeleteAccount = () => {
    console.log("Account deleted");
  };

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A]">
      <Navbar />
      <section className="px-8 py-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">App Settings</h2>

        {/* Change Password */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-md text-sm"
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-md text-sm"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-md text-sm"
            />
            <button
              onClick={handleSavePassword}
              className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span>Email Notifications</span>
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={() => setEmailNotif(!emailNotif)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Push Notifications</span>
              <input
                type="checkbox"
                checked={pushNotif}
                onChange={() => setPushNotif(!pushNotif)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>SMS Notifications</span>
              <input
                type="checkbox"
                checked={smsNotif}
                onChange={() => setSmsNotif(!smsNotif)}
              />
            </label>
          </div>
        </div>

        {/* Theme */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Theme</h3>
          <label className="flex items-center justify-between">
            <span>Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </label>
        </div>

        {/* Delete Account */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4 text-red-500">Delete Account</h3>
          <p className="text-sm text-[#7E7B7B] mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="border border-red-500 text-red-500 px-6 py-3 rounded-md font-medium"
          >
            Delete Account
          </button>
        </div>
      </section>
      <Footer />
    </main>
  );
}