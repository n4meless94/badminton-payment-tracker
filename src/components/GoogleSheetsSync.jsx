import { useState } from 'react';

export default function GoogleSheetsSync({ members, payments, setMembers, setPayments }) {
  const [sheetUrl, setSheetUrl] = useState('');
  const [status, setStatus] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Extract Sheet ID from URL
  const extractSheetId = (url) => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  // Generate CSV for export
  const generateMembersCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email'];
    const rows = members.map(m => [m.id, m.name, m.phone, m.email || '']);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generatePaymentsCSV = () => {
    const headers = ['ID', 'Member ID', 'Member Name', 'Amount', 'Month', 'Date', 'Notes'];
    const rows = payments.map(p => [p.id, p.memberId, p.memberName, p.amount, p.month, p.date, p.notes || '']);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  // Download CSV
  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMembers = () => {
    downloadCSV(generateMembersCSV(), 'badminton-members.csv');
    setStatus('Members exported!');
  };

  const handleExportPayments = () => {
    downloadCSV(generatePaymentsCSV(), 'badminton-payments.csv');
    setStatus('Payments exported!');
  };

  const handleExportAll = () => {
    handleExportMembers();
    setTimeout(() => handleExportPayments(), 500);
    setStatus('All data exported!');
  };

  // Import from CSV file
  const handleImportMembers = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const lines = csv.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',');
      
      const importedMembers = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
          id: values[0] || Date.now().toString(),
          name: values[1] || '',
          phone: values[2] || '',
          email: values[3] || ''
        };
      }).filter(m => m.name);

      setMembers(importedMembers);
      setStatus(`Imported ${importedMembers.length} members!`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportPayments = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const lines = csv.split('\n').filter(line => line.trim());
      
      const importedPayments = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
          id: values[0] || Date.now().toString(),
          memberId: values[1] || '',
          memberName: values[2] || '',
          amount: values[3] || '0',
          month: values[4] || '',
          date: values[5] || '',
          notes: values[6] || ''
        };
      }).filter(p => p.memberId);

      setPayments(importedPayments);
      setStatus(`Imported ${importedPayments.length} payments!`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Data Sync</h2>

      {status && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg">
          {status}
        </div>
      )}

      {/* Export Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">📤 Export Data</h3>
        <p className="text-gray-600 mb-4">
          Export your data as CSV files. You can then import these into Google Sheets.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportMembers}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Export Members
          </button>
          <button
            onClick={handleExportPayments}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Export Payments
          </button>
          <button
            onClick={handleExportAll}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Export All
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">📥 Import Data</h3>
        <p className="text-gray-600 mb-4">
          Import data from CSV files. Download from Google Sheets as CSV first.
        </p>
        <div className="flex flex-wrap gap-3">
          <label className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition cursor-pointer">
            Import Members
            <input type="file" accept=".csv" onChange={handleImportMembers} className="hidden" />
          </label>
          <label className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition cursor-pointer">
            Import Payments
            <input type="file" accept=".csv" onChange={handleImportPayments} className="hidden" />
          </label>
        </div>
      </div>

      {/* Google Sheets Instructions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">📊 Google Sheets Setup</h3>
        <div className="space-y-4 text-gray-600">
          <p><strong>To use with Google Sheets:</strong></p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Create a new Google Sheet</li>
            <li>Create two sheets/tabs: "Members" and "Payments"</li>
            <li>Export data from here and import into Google Sheets</li>
            <li>Share the sheet with your club members (view only)</li>
            <li>When you need to update, download as CSV and import back here</li>
          </ol>
          <div className="bg-yellow-50 p-4 rounded-lg mt-4">
            <p className="text-yellow-800">
              <strong>💡 Pro Tip:</strong> For real-time sync with Google Sheets, you'd need to set up 
              Google Sheets API with OAuth. This requires a Google Cloud project. Let me know if you 
              want help setting that up!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
