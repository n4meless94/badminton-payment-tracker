import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

// Simple cloud storage using JSONBin.io (free tier: 100k requests/month)
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3/b';

export function useCloudStorage(key, initialValue, binId = null) {
  const [localData, setLocalData] = useLocalStorage(key, initialValue);
  const [cloudBinId, setCloudBinId] = useLocalStorage(`${key}-bin-id`, binId);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useLocalStorage(`${key}-last-sync`, null);

  // Save to cloud
  const saveToCloud = async (data) => {
    setIsLoading(true);
    try {
      const apiKey = localStorage.getItem('jsonbin-api-key');
      if (!apiKey) {
        console.warn('No JSONBin API key found. Data saved locally only.');
        return false;
      }

      const url = cloudBinId 
        ? `${JSONBIN_BASE_URL}/${cloudBinId}`
        : `${JSONBIN_BASE_URL}`;
      
      const method = cloudBinId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': apiKey,
          'X-Bin-Name': `badminton-${key}`,
          'X-Bin-Private': 'false'
        },
        body: JSON.stringify({
          data,
          lastUpdated: new Date().toISOString(),
          version: '1.0'
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (!cloudBinId && result.metadata?.id) {
          setCloudBinId(result.metadata.id);
        }
        setLastSync(new Date().toISOString());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save to cloud:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load from cloud
  const loadFromCloud = async () => {
    if (!cloudBinId) return null;
    
    setIsLoading(true);
    try {
      const apiKey = localStorage.getItem('jsonbin-api-key');
      if (!apiKey) return null;

      const response = await fetch(`${JSONBIN_BASE_URL}/${cloudBinId}/latest`, {
        headers: {
          'X-Master-Key': apiKey
        }
      });

      if (response.ok) {
        const result = await response.json();
        setLastSync(new Date().toISOString());
        return result.record?.data || null;
      }
      return null;
    } catch (error) {
      console.error('Failed to load from cloud:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update data (saves both locally and to cloud)
  const setData = async (newData) => {
    setLocalData(newData);
    await saveToCloud(newData);
  };

  // Sync with cloud
  const syncWithCloud = async () => {
    const cloudData = await loadFromCloud();
    if (cloudData) {
      setLocalData(cloudData);
      return true;
    }
    return false;
  };

  return {
    data: localData,
    setData,
    saveToCloud: () => saveToCloud(localData),
    loadFromCloud,
    syncWithCloud,
    isLoading,
    lastSync,
    cloudBinId,
    hasCloudStorage: !!cloudBinId
  };
}