import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Payments from './components/Payments';
import Reminders from './components/Reminders';
import Schedule from './components/Schedule';
import Settings from './components/Settings';
import GoogleSheetsSync from './components/GoogleSheetsSync';

const TABS = [
  { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
  { id: 'members', label: '👥 Members', icon: '👥' },
  { id: 'schedule', label: '📅 Schedule', icon: '📅' },
  { id: 'payments', label: '💰 Payments', icon: '💰' },
  { id: 'reminders', label: '📱 Reminders', icon: '📱' },
  { id: 'sync', label: '☁️ Sync', icon: '☁️' },
  { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [members, setMembers] = useLocalStorage('badminton-members', []);
  const [payments, setPayments] = useLocalStorage('badminton-payments', []);
  const [schedule, setSchedule] = useLocalStorage('badminton-schedule', []);
  const [settings, setSettings] = useLocalStorage('badminton-settings', {
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
        return <Dashboard members={members} payments={payments} settings={settings} />;
      case 'members':
        return <Members members={members} setMembers={setMembers} />;
      case 'schedule':
        return <Schedule members={members} schedule={schedule} setSchedule={setSchedule} />;
      case 'payments':
        return <Payments members={members} payments={payments} setPayments={setPayments} settings={settings} />;
      case 'reminders':
        return <Reminders members={members} payments={payments} settings={settings} />;
      case 'sync':
        return <GoogleSheetsSync members={members} payments={payments} setMembers={setMembers} setPayments={setPayments} />;
      case 'settings':
        return <Settings settings={settings} setSettings={setSettings} />;
      default:
        return <Dashboard members={members} payments={payments} settings={settings} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🏸 {settings.clubName}
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
        <p className="text-sm">{settings.clubName} Payment Tracker © 2026</p>
      </footer>
    </div>
  );
}
