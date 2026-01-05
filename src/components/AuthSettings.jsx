import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { generateId } from '../utils/helpers';

export default function AuthSettings() {
  const { authSettings, updateAuthSettings, user, logout } = useAuth();
  const [formData, setFormData] = useState({
    authType: authSettings.authType,
    adminPassword: authSettings.adminPassword,
    requireAuth: authSettings.requireAuth,
    allowedUsers: [...authSettings.allowedUsers]
  });
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    password: '',
    role: 'member'
  });
  const [showAddUser, setShowAddUser] = useState(false);
  const [status, setStatus] = useState('');

  const handleSave = () => {
    updateAuthSettings(formData);
    setStatus('✅ Authentication settings saved!');
    setTimeout(() => setStatus(''), 3000);
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.username || !newUser.password) {
      setStatus('❌ Please fill all user fields');
      return;
    }

    const userExists = formData.allowedUsers.some(u => u.username === newUser.username);
    if (userExists) {
      setStatus('❌ Username already exists');
      return;
    }

    const user = {
      id: generateId(),
      ...newUser
    };

    setFormData({
      ...formData,
      allowedUsers: [...formData.allowedUsers, user]
    });

    setNewUser({ name: '', username: '', password: '', role: 'member' });
    setShowAddUser(false);
    setStatus('✅ User added successfully');
  };

  const handleRemoveUser = (userId) => {
    setFormData({
      ...formData,
      allowedUsers: formData.allowedUsers.filter(u => u.id !== userId)
    });
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Authentication Settings</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Logged in as: <strong>{user?.name}</strong> ({user?.role})
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {status && (
        <div className={`p-4 rounded-lg ${
          status.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {status}
        </div>
      )}

      {/* Authentication Type */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">🔐 Authentication Type</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.requireAuth}
                onChange={(e) => setFormData({ ...formData, requireAuth: e.target.checked })}
                className="rounded"
              />
              <span className="font-medium">Require Authentication</span>
            </label>
            <p className="text-sm text-gray-500 ml-6">
              When enabled, users must login to access the app
            </p>
          </div>

          {formData.requireAuth && (
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="authType"
                  value="password"
                  checked={formData.authType === 'password'}
                  onChange={(e) => setFormData({ ...formData, authType: e.target.value })}
                />
                <span>Simple Password (Single Admin)</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="authType"
                  value="multi-user"
                  checked={formData.authType === 'multi-user'}
                  onChange={(e) => setFormData({ ...formData, authType: e.target.value })}
                />
                <span>Multi-User (Admin + Members)</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="authType"
                  value="google"
                  checked={formData.authType === 'google'}
                  onChange={(e) => setFormData({ ...formData, authType: e.target.value })}
                />
                <span>Google Authentication (Coming Soon)</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Simple Password Settings */}
      {formData.requireAuth && formData.authType === 'password' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">🔑 Admin Password</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Set Admin Password
            </label>
            <input
              type="password"
              value={formData.adminPassword}
              onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
              placeholder="Enter a strong password"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              This password will be required to access the app
            </p>
          </div>
        </div>
      )}

      {/* Multi-User Settings */}
      {formData.requireAuth && formData.authType === 'multi-user' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">👥 Manage Users</h3>
            <button
              onClick={() => setShowAddUser(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Add User
            </button>
          </div>

          {/* Add User Form */}
          {showAddUser && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-3">Add New User</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="p-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="p-2 border rounded-lg"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="p-2 border rounded-lg"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="p-2 border rounded-lg"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleAddUser}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Add User
                </button>
                <button
                  onClick={() => setShowAddUser(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="space-y-2">
            {formData.allowedUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No users added yet</p>
            ) : (
              formData.allowedUsers.map(user => (
                <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{user.name}</span>
                    <span className="text-gray-500 ml-2">(@{user.username})</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveUser(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Google Auth Settings */}
      {formData.requireAuth && formData.authType === 'google' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">🔍 Google Authentication</h3>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800">
              <strong>Coming Soon!</strong> Google authentication will be available in the next update.
              For now, use Simple Password or Multi-User authentication.
            </p>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          💾 Save Authentication Settings
        </button>
      </div>

      {/* Security Notes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">🛡️ Security Notes</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Passwords are stored locally in your browser</li>
          <li>• Use strong passwords for better security</li>
          <li>• Admin users can access all features</li>
          <li>• Member users can view data but cannot modify settings</li>
          <li>• Clear browser data will reset authentication settings</li>
        </ul>
      </div>
    </div>
  );
}