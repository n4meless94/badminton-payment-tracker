import { useState } from 'react';
import { SupabaseService, isSupabaseConfigured } from '../config/supabase';

export default function SupabaseSync({ 
  membersCloud, 
  paymentsCloud, 
  scheduleCloud, 
  settingsCloud 
}) {
  const [supabaseUrl, setSupabaseUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveCredentials = () => {
    // In a real app, you'd want to store these securely
    // For now, we'll just show instructions to add them to Netlify
    setStatus('💡 Add these as environment variables in Netlify for automatic sync!');
  };

  const handleSyncToSupabase = async () => {
    if (!isSupabaseConfigured()) {
      setStatus('❌ Please configure Supabase credentials first.');
      return;
    }

    setIsLoading(true);
    setStatus('📤 Syncing data to Supabase...');

    try {
      const result = await SupabaseService.syncToSupabase(
        membersCloud.data,
        paymentsCloud.data,
        scheduleCloud.data,
        settingsCloud.data
      );

      if (result.success) {
        setStatus('✅ Successfully synced all data to Supabase!');
      } else {
        setStatus(`❌ Sync failed: ${result.error}`);
      }
    } catch (error) {
      setStatus(`❌ Sync failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadFromSupabase = async () => {
    if (!isSupabaseConfigured()) {
      setStatus('❌ Please configure Supabase credentials first.');
      return;
    }

    setIsLoading(true);
    setStatus('📥 Loading data from Supabase...');

    try {
      const result = await SupabaseService.loadFromSupabase();

      if (result.success) {
        // Update all local data
        if (result.data.members) await membersCloud.setData(result.data.members);
        if (result.data.payments) await paymentsCloud.setData(result.data.payments);
        if (result.data.schedule) await scheduleCloud.setData(result.data.schedule);
        if (result.data.settings) await settingsCloud.setData(result.data.settings);

        setStatus('✅ Successfully loaded all data from Supabase!');
        setTimeout(() => {
          setStatus('🔄 Refreshing app with new data...');
          setTimeout(() => window.location.reload(), 1000);
        }, 1000);
      } else {
        setStatus(`❌ Load failed: ${result.error}`);
      }
    } catch (error) {
      setStatus(`❌ Load failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Supabase Database Sync</h2>

      {status && (
        <div className={`p-4 rounded-lg ${
          status.includes('✅') ? 'bg-green-100 text-green-700' : 
          status.includes('❌') ? 'bg-red-100 text-red-700' : 
          'bg-blue-100 text-blue-700'
        }`}>
          {status}
        </div>
      )}

      {/* Configuration Status */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">🔧 Configuration Status</h3>
        <div className={`p-4 rounded-lg ${isConfigured ? 'bg-green-50' : 'bg-yellow-50'}`}>
          {isConfigured ? (
            <div className="text-green-800">
              <p className="font-medium">✅ Supabase is configured and ready!</p>
              <p className="text-sm mt-1">Your app is connected to your Supabase database.</p>
            </div>
          ) : (
            <div className="text-yellow-800">
              <p className="font-medium">⚠️ Supabase not configured</p>
              <p className="text-sm mt-1">Add environment variables to enable database sync.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sync Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">🔄 Database Sync</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSyncToSupabase}
              disabled={isLoading || !isConfigured}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? '⏳ Syncing...' : '📤 Save to Database'}
            </button>
            <button
              onClick={handleLoadFromSupabase}
              disabled={isLoading || !isConfigured}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {isLoading ? '⏳ Loading...' : '📥 Load from Database'}
            </button>
          </div>
          
          {!isConfigured && (
            <p className="text-sm text-gray-500">
              Configure Supabase credentials to enable database sync.
            </p>
          )}
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">🚀 Setup Instructions</h3>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Step 1: Create Supabase Project</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
              <li>2. Sign up and create a new project</li>
              <li>3. Wait for project to be ready (2-3 minutes)</li>
            </ol>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Step 2: Get Credentials</h4>
            <ol className="text-sm text-green-700 space-y-1">
              <li>1. Go to Project Settings → API</li>
              <li>2. Copy "Project URL" and "anon public" key</li>
            </ol>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">Step 3: Add to Netlify</h4>
            <ol className="text-sm text-purple-700 space-y-1">
              <li>1. Go to your Netlify dashboard</li>
              <li>2. Site settings → Environment variables</li>
              <li>3. Add these variables:</li>
            </ol>
            <div className="mt-2 bg-white p-3 rounded border text-xs font-mono">
              <div>VITE_SUPABASE_URL = your_project_url</div>
              <div>VITE_SUPABASE_ANON_KEY = your_anon_key</div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">Step 4: Create Database Tables</h4>
            <p className="text-sm text-orange-700 mb-2">Run this SQL in Supabase SQL Editor:</p>
            <div className="bg-white p-3 rounded border text-xs font-mono overflow-x-auto">
              <pre>{`-- Members table
CREATE TABLE members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments table  
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  member_name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  month TEXT NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Schedule table
CREATE TABLE schedule (
  id TEXT PRIMARY KEY,
  month TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  venue TEXT NOT NULL,
  max_players INTEGER NOT NULL,
  players JSONB DEFAULT '[]',
  waitlist JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  club_name TEXT NOT NULL,
  monthly_fee TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  qr_code_url TEXT,
  payment_message TEXT NOT NULL,
  reminder_days TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">✨ Supabase Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p>✅ <strong>Real Database:</strong> PostgreSQL, not just JSON</p>
            <p>✅ <strong>Real-time Sync:</strong> Automatic updates</p>
            <p>✅ <strong>Free Tier:</strong> 50,000 monthly users</p>
            <p>✅ <strong>Built-in Auth:</strong> Google, email login</p>
          </div>
          <div className="space-y-2">
            <p>✅ <strong>Secure:</strong> Row Level Security</p>
            <p>✅ <strong>Scalable:</strong> Grows with your club</p>
            <p>✅ <strong>Backup:</strong> Automatic daily backups</p>
            <p>✅ <strong>Fast:</strong> Global CDN</p>
          </div>
        </div>
      </div>
    </div>
  );
}