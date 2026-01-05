import { useState } from 'react';

export default function CloudSync({ 
  membersCloud, 
  paymentsCloud, 
  scheduleCloud, 
  settingsCloud 
}) {
  const [apiKey, setApiKey] = useState(localStorage.getItem('jsonbin-api-key') || '');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveApiKey = () => {
    localStorage.setItem('jsonbin-api-key', apiKey);
    setStatus('API key saved! You can now sync your data to the cloud.');
  };

  const handleSyncAll = async () => {
    if (!apiKey) {
      setStatus('Please enter your JSONBin API key first.');
      return;
    }

    setIsLoading(true);
    setStatus('Syncing all data to cloud...');

    try {
      const results = await Promise.all([
        membersCloud.saveToCloud(),
        paymentsCloud.saveToCloud(),
        scheduleCloud.saveToCloud(),
        settingsCloud.saveToCloud()
      ]);

      const successCount = results.filter(Boolean).length;
      setStatus(`✅ Successfully synced ${successCount}/4 data types to cloud!`);
    } catch (error) {
      setStatus('❌ Failed to sync data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadAll = async () => {
    if (!apiKey) {
      setStatus('Please enter your JSONBin API key first.');
      return;
    }

    setIsLoading(true);
    setStatus('Loading data from cloud...');

    try {
      const results = await Promise.all([
        membersCloud.syncWithCloud(),
        paymentsCloud.syncWithCloud(),
        scheduleCloud.syncWithCloud(),
        settingsCloud.syncWithCloud()
      ]);

      const successCount = results.filter(Boolean).length;
      if (successCount > 0) {
        setStatus(`✅ Successfully loaded ${successCount}/4 data types from cloud!`);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setStatus('No cloud data found or failed to load.');
      }
    } catch (error) {
      setStatus('❌ Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getLastSyncInfo = () => {
    const syncs = [
      { name: 'Members', sync: membersCloud.lastSync },
      { name: 'Payments', sync: paymentsCloud.lastSync },
      { name: 'Schedule', sync: scheduleCloud.lastSync },
      { name: 'Settings', sync: settingsCloud.lastSync }
    ].filter(item => item.sync);

    if (syncs.length === 0) return 'Never synced';
    
    const latest = syncs.reduce((latest, current) => 
      new Date(current.sync) > new Date(latest.sync) ? current : latest
    );
    
    return `Last synced: ${new Date(latest.sync).toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Cloud Sync</h2>

      {status && (
        <div className={`p-4 rounded-lg ${
          status.includes('✅') ? 'bg-green-100 text-green-700' : 
          status.includes('❌') ? 'bg-red-100 text-red-700' : 
          'bg-blue-100 text-blue-700'
        }`}>
          {status}
        </div>
      )}

      {/* API Key Setup */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">🔑 Cloud Storage Setup</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              JSONBin API Key (Free)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your JSONBin API key"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Get free API key at <a href="https://jsonbin.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">jsonbin.io</a> (100k requests/month free)
            </p>
          </div>
          <button
            onClick={handleSaveApiKey}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save API Key
          </button>
        </div>
      </div>

      {/* Sync Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">☁️ Sync Your Data</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSyncAll}
              disabled={isLoading || !apiKey}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {isLoading ? '⏳ Syncing...' : '📤 Save to Cloud'}
            </button>
            <button
              onClick={handleLoadAll}
              disabled={isLoading || !apiKey}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isLoading ? '⏳ Loading...' : '📥 Load from Cloud'}
            </button>
          </div>
          <p className="text-sm text-gray-500">
            {getLastSyncInfo()}
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">🤔 How Cloud Sync Works</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p><strong>1. Get Free API Key:</strong> Sign up at jsonbin.io (free 100k requests/month)</p>
          <p><strong>2. Save to Cloud:</strong> Your data is encrypted and stored securely</p>
          <p><strong>3. Access Anywhere:</strong> Load your data on any device/browser</p>
          <p><strong>4. Always Backup:</strong> Data is saved both locally and in cloud</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg mt-4">
          <p className="text-yellow-800 text-sm">
            <strong>💡 Pro Tip:</strong> Save to cloud regularly, especially before switching devices or browsers!
          </p>
        </div>
      </div>
    </div>
  );
}