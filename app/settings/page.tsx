"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [smsNotif, setSmsNotif] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/user/settings');
        const data = await res.json();
        if (res.ok) {
          setEmailNotif(Boolean(data.emailNotif));
          setPushNotif(Boolean(data.pushNotif));
          setSmsNotif(Boolean(data.smsNotif));
          setDarkMode(Boolean(data.darkMode));
        }
      } catch {}
    })();
  }, []);

  const handleSavePassword = async () => {
    setMessage(null);
    setError(null);
    try {
      const res = await fetch('/api/user/password', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to update password');
      setMessage('Verification email sent');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    setMessage(null);
    setError(null);
    try {
      const res = await fetch('/api/user/delete', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to delete account');
      setMessage('Confirmation email sent');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete account');
    }
  };

  const savePreferences = async () => {
    setSavingPrefs(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch('/api/user/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ emailNotif, pushNotif, smsNotif, darkMode }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to save preferences');
      setMessage('Preferences saved');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save preferences');
    } finally {
      setSavingPrefs(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0B0B] text-[#1A1A1A] dark:text-[#EDEDED]">
      <section className="px-8 py-12 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">App Settings</h2>
          <button onClick={() => history.back()} className="text-sm text-[#34967C] underline">Back</button>
        </div>
        {message && <p className="text-green-600 mb-4 text-sm">{message}</p>}
        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

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
            <button onClick={handleSavePassword} className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium">Send Verification</button>
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
            <div className="pt-2">
              <button onClick={savePreferences} disabled={savingPrefs} className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium">
                {savingPrefs ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Theme</h3>
          <div className="flex items-center justify-between border border-border rounded-md p-4">
            <span className="text-sm">Enable Dark Mode</span>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:bg-primary relative">
                <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-6" />
              </div>
            </label>
          </div>
          <div className="pt-2">
            <button onClick={savePreferences} disabled={savingPrefs} className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium">
              {savingPrefs ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4 text-red-500">Delete Account</h3>
          <p className="text-sm text-[#7E7B7B] mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button onClick={() => setConfirmOpen(true)} className="border border-red-500 text-red-500 px-6 py-3 rounded-md font-medium">Delete Account</button>
          {confirmOpen && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-white border border-[#E5E5E5] rounded-md p-6 w-[420px]">
                <h4 className="text-lg font-semibold mb-2">Confirm Deletion</h4>
                <p className="text-sm text-[#7E7B7B] mb-6">This cannot be undone. Proceed?</p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setConfirmOpen(false)} className="px-3 py-2 text-sm border border-[#E5E5E5] rounded-md">Cancel</button>
                  <button onClick={async () => { setConfirmOpen(false); await handleDeleteAccount(); }} className="bg-red-600 text-white px-3 py-2 rounded-md text-sm">Send Confirmation</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}