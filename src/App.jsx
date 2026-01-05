import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useCloudStorage } from './hooks/useCloudStorage';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Payments from './components/Payments';
import Reminders from './components/Reminders';
import Schedule from './components/Schedule';
import Settings from './components/Settings';
import GoogleSheetsSync from './components/GoogleSheetsSync';
import CloudSync from './components/CloudSync';

const TABS = [
  { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
  { id: 'members', label: '👥 Members', icon: '👥' },
  { id: 'schedule', label: '📅 Schedule', icon: '📅' },
  { id: 'payments', label: '💰 Payments', icon: '💰' },
  { id: 'reminders', label: '📱 Reminders', icon: '📱' },
  { id: 'cloud', label: '☁️ Cloud', icon: '☁️' },
  { id: 'sync', label: '📊 Sheets', icon: '📊' },
  { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Use cloud storage for all data
  const membersCloud = useCloudStorage('badminton-members', []);
  const paymentsCloud = useCloudStorage('badminton-payments', []);
  const scheduleCloud = useCloudStorage('badminton-schedule', []);
  const settingsCloud = useCloudStorage('badminton-settings', {
    clubName: 'Badminton Club',
    monthlyFee: '50',
    bankName: 'Maybank',
    accountNumber: '1234567890',
    accountName: 'Club Account',
    qrCodeUrl: '',
    paymentMessage: `Hi {memberName}! 🏸

This is a friendly reminder for your badminton club payment for {monthName}.

Amount: RM {amount}

Please make payment to:
Bank: {bankName}
Account: {accountNumber}
Name: {accountName}

{qrCode}

Thank you! 🙏`,
    reminderDays: '3'
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard members={membersCloud.data} payments={paymentsCloud.data} settings={settingsCloud.data} />;
      case 'members':
        return <Members members={membersCloud.data} setMembers={membersCloud.setData} />;
      case 'schedule':
        return <Schedule members={membersCloud.data} schedule={scheduleCloud.data} setSchedule={scheduleCloud.setData} />;
      case 'payments':
        return <Payments members={membersCloud.data} payments={paymentsCloud.data} setPayments={paymentsCloud.setData} settings={settingsCloud.data} />;
      case 'reminders':
        return <Reminders members={membersCloud.data} payments={paymentsCloud.data} settings={settingsCloud.data} />;
      case 'cloud':
        return <CloudSync 
          membersCloud={membersCloud}
          paymentsCloud={paymentsCloud}
          scheduleCloud={scheduleCloud}
          settingsCloud={settingsCloud}
        />;
      case 'sync':
        return <GoogleSheetsSync members={membersCloud.data} payments={paymentsCloud.data} setMembers={membersCloud.setData} setPayments={paymentsCloud.setData} />;
      case 'settings':
        return <Settings settings={settingsCloud.data} setSettings={settingsCloud.setData} />;
      default:
        return <Dashboard members={membersCloud.data} payments={paymentsCloud.data} settings={settingsCloud.data} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🏸 {settingsCloud.data.clubName}
          </h1>
          <p className="text-blue-200 text-sm mt-1">Track payments, schedule sessions, send WhatsApp reminders</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium whitespace-nowrap transition border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 mt-8">
        <p className="text-sm">{settingsCloud.data.clubName} Payment Tracker © 2026</p>
      </footer>
    </div>
  );
}
