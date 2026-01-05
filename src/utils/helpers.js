// Generate unique ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format date
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Get current month/year string
export function getCurrentMonthYear() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Format currency (Malaysian Ringgit)
export function formatCurrency(amount) {
  return `RM ${parseFloat(amount).toFixed(2)}`;
}

// Generate WhatsApp message for payment reminder
export function generateWhatsAppReminder(member, amount, month, settings = {}) {
  const monthName = new Date(month + '-01').toLocaleDateString('en-MY', { month: 'long', year: 'numeric' });
  
  const template = settings.paymentMessage || `Hi {memberName}! 🏸

This is a friendly reminder for your badminton club payment for {monthName}.

Amount: RM {amount}

Please make payment to:
Bank: {bankName}
Account: {accountNumber}
Name: {accountName}

{qrCode}

Thank you! 🙏`;

  return template
    .replace('{memberName}', member.name)
    .replace('{monthName}', monthName)
    .replace('{amount}', amount)
    .replace('{bankName}', settings.bankName || '[Your Bank]')
    .replace('{accountNumber}', settings.accountNumber || '[Account Number]')
    .replace('{accountName}', settings.accountName || '[Account Name]')
    .replace('{qrCode}', settings.qrCodeUrl ? 'QR Code will be sent separately for easy payment 📱' : '');
}

// Generate WhatsApp link
export function getWhatsAppLink(phone, message) {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

// Copy to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}
