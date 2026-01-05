import { useMemo, useState } from 'react';
import { getCurrentMonthYear, generateWhatsAppReminder, getWhatsAppLink, copyToClipboard } from '../utils/helpers';
import QRCodeModal from './QRCodeModal';

export default function Reminders({ members, payments, settings }) {
  const [monthlyFee, setMonthlyFee] = useState(settings.monthlyFee || '50');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthYear());
  const [copiedId, setCopiedId] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const unpaidMembers = useMemo(() => {
    const monthPayments = payments.filter(p => p.month === selectedMonth);
    const paidMemberIds = new Set(monthPayments.map(p => p.memberId));
    return members.filter(m => !paidMemberIds.has(m.id));
  }, [members, payments, selectedMonth]);

  const handleCopy = async (member) => {
    const message = generateWhatsAppReminder(member, monthlyFee, selectedMonth, settings);
    const success = await copyToClipboard(message);
    if (success) {
      setCopiedId(member.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleWhatsApp = (member) => {
    const message = generateWhatsAppReminder(member, monthlyFee, selectedMonth, settings);
    const link = getWhatsAppLink(member.phone, message);
    window.open(link, '_blank');
  };

  const monthName = new Date(selectedMonth + '-01').toLocaleDateString('en-MY', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">WhatsApp Reminders</h2>

      {/* Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Fee (RM)</label>
            <input
              type="number"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      {settings.qrCodeUrl && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Payment QR Code</h3>
            <button
              onClick={() => setShowQRModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              📱 View QR Code
            </button>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>💡 How to share QR code with members:</strong>
            </p>
            <ol className="text-yellow-700 text-sm mt-2 space-y-1">
              <li>1. Click "View QR Code" to see the payment QR</li>
              <li>2. Save QR code to your phone</li>
              <li>3. Send WhatsApp message first (using buttons below)</li>
              <li>4. Then manually attach the QR code image in WhatsApp</li>
            </ol>
          </div>
        </div>
      )}

      {/* Unpaid Members */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          Unpaid Members for {monthName} ({unpaidMembers.length})
        </h3>
        
        {unpaidMembers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-green-600 text-lg">🎉 All members have paid for {monthName}!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unpaidMembers.map(member => (
              <div 
                key={member.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-3"
              >
                <div>
                  <p className="font-medium text-gray-800">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.phone}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(member)}
                    className={`px-4 py-2 rounded-lg transition ${
                      copiedId === member.id 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {copiedId === member.id ? '✓ Copied!' : '📋 Copy Message'}
                  </button>
                  <button
                    onClick={() => handleWhatsApp(member)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    📱 WhatsApp
                  </button>
                  {settings.qrCodeUrl && (
                    <button
                      onClick={() => setShowQRModal(true)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      🔍 QR
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Preview */}
      {unpaidMembers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Message Preview</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="whitespace-pre-wrap text-sm">
              {generateWhatsAppReminder({ name: '[Member Name]' }, monthlyFee, selectedMonth, settings)}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            💡 Tip: Customize bank details and message in Settings
          </p>
        </div>
      )}

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        qrCodeUrl={settings.qrCodeUrl}
        bankDetails={{
          bankName: settings.bankName || 'Your Bank',
          accountNumber: settings.accountNumber || 'Account Number',
          accountName: settings.accountName || 'Account Name'
        }}
      />
    </div>
  );
}
