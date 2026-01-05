import { useState } from 'react';
import { copyToClipboard } from '../utils/helpers';

export default function QRCodeModal({ isOpen, onClose, qrCodeUrl, bankDetails }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyBankDetails = async () => {
    const bankText = `Bank: ${bankDetails.bankName}
Account: ${bankDetails.accountNumber}
Name: ${bankDetails.accountName}`;
    
    const success = await copyToClipboard(bankText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'payment-qr-code.png';
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Payment QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {qrCodeUrl && (
          <div className="text-center mb-4">
            <img 
              src={qrCodeUrl} 
              alt="Payment QR Code" 
              className="w-64 h-64 object-contain mx-auto border rounded-lg"
            />
          </div>
        )}

        <div className="space-y-3">
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Bank Details:</p>
            <p className="text-sm">Bank: {bankDetails.bankName}</p>
            <p className="text-sm">Account: {bankDetails.accountNumber}</p>
            <p className="text-sm">Name: {bankDetails.accountName}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyBankDetails}
              className={`flex-1 px-4 py-2 rounded-lg transition ${
                copied 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {copied ? '✓ Copied!' : '📋 Copy Bank Details'}
            </button>
            
            {qrCodeUrl && (
              <button
                onClick={handleDownloadQR}
                className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
              >
                💾 Save QR Code
              </button>
            )}
          </div>

          <div className="text-xs text-gray-500 text-center">
            💡 Tip: Save QR code to your phone, then share it manually in WhatsApp
          </div>
        </div>
      </div>
    </div>
  );
}