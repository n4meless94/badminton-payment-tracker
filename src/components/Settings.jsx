import { useState } from 'react';

export default function Settings({ settings, setSettings }) {
  const [formData, setFormData] = useState({
    clubName: settings.clubName || 'Badminton Club',
    monthlyFee: settings.monthlyFee || '50',
    bankName: settings.bankName || 'Maybank',
    accountNumber: settings.accountNumber || '1234567890',
    accountName: settings.accountName || 'Club Account',
    qrCodeUrl: settings.qrCodeUrl || '',
    paymentMessage: settings.paymentMessage || `Hi {memberName}! 🏸

This is a friendly reminder for your badminton club payment for {monthName}.

Amount: RM {amount}

Please make payment to:
Bank: {bankName}
Account: {accountNumber}
Name: {accountName}

{qrCode}

Thank you! 🙏`,
    reminderDays: settings.reminderDays || '3'
  });

  const [qrPreview, setQrPreview] = useState(settings.qrCodeUrl || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSettings(formData);
    alert('Settings saved successfully!');
  };

  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setFormData({ ...formData, qrCodeUrl: dataUrl });
        setQrPreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveQr = () => {
    setFormData({ ...formData, qrCodeUrl: '' });
    setQrPreview('');
  };

  const previewMessage = formData.paymentMessage
    .replace('{memberName}', 'John Doe')
    .replace('{monthName}', 'January 2026')
    .replace('{amount}', formData.monthlyFee)
    .replace('{bankName}', formData.bankName)
    .replace('{accountNumber}', formData.accountNumber)
    .replace('{accountName}', formData.accountName)
    .replace('{qrCode}', qrPreview ? '📱 QR Code attached for easy payment' : '');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Club Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Club Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
              <input
                type="text"
                value={formData.clubName}
                onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Fee (RM)</label>
              <input
                type="number"
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Bank Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="e.g., Maybank, CIMB, Public Bank"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Payment QR Code</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload QR Code Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleQrUpload}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload your bank's QR code for easy payments. Supports JPG, PNG, etc.
              </p>
            </div>
            
            {qrPreview && (
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <img 
                    src={qrPreview} 
                    alt="QR Code Preview" 
                    className="w-32 h-32 object-contain border rounded-lg"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-green-600 mb-2">✓ QR Code uploaded successfully</p>
                  <button
                    type="button"
                    onClick={handleRemoveQr}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove QR Code
                  </button>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-sm font-medium mb-2">📱 How QR Code Works:</p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• WhatsApp doesn't support automatic image attachments</li>
                <li>• The app will show you the QR code to save and share manually</li>
                <li>• Send the text message first, then attach QR code separately</li>
                <li>• Members can scan the QR code with their banking app</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Message Template */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Payment Reminder Message</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Template
              </label>
              <textarea
                value={formData.paymentMessage}
                onChange={(e) => setFormData({ ...formData, paymentMessage: e.target.value })}
                rows="10"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Enter your payment reminder message..."
              />
              <div className="text-xs text-gray-500 mt-2">
                <p><strong>Available placeholders:</strong></p>
                <p>• <code>{'{memberName}'}</code> - Member's name</p>
                <p>• <code>{'{monthName}'}</code> - Month and year</p>
                <p>• <code>{'{amount}'}</code> - Payment amount</p>
                <p>• <code>{'{bankName}'}</code> - Bank name</p>
                <p>• <code>{'{accountNumber}'}</code> - Account number</p>
                <p>• <code>{'{accountName}'}</code> - Account name</p>
                <p>• <code>{'{qrCode}'}</code> - QR code text (if uploaded)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Preview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Message Preview</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="whitespace-pre-wrap text-sm">{previewMessage}</div>
            {qrPreview && (
              <div className="mt-3">
                <img src={qrPreview} alt="QR Code" className="w-24 h-24 object-contain" />
              </div>
            )}
          </div>
        </div>

        {/* Other Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Other Settings</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reminder Days Before Due
            </label>
            <input
              type="number"
              value={formData.reminderDays}
              onChange={(e) => setFormData({ ...formData, reminderDays: e.target.value })}
              min="1"
              max="30"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              How many days before the due date to send reminders
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}