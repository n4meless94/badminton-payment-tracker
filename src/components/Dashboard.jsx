import { useMemo } from 'react';
import { getCurrentMonthYear, formatCurrency } from '../utils/helpers';

export default function Dashboard({ members, payments, settings }) {
  const currentMonth = getCurrentMonthYear();
  
  const stats = useMemo(() => {
    const currentMonthPayments = payments.filter(p => p.month === currentMonth);
    const paidMemberIds = new Set(currentMonthPayments.map(p => p.memberId));
    
    const paidMembers = members.filter(m => paidMemberIds.has(m.id));
    const unpaidMembers = members.filter(m => !paidMemberIds.has(m.id));
    
    const totalCollected = currentMonthPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const monthlyFee = parseFloat(settings.monthlyFee || 50);
    const totalExpected = members.length * monthlyFee;
    
    return {
      totalMembers: members.length,
      paidCount: paidMembers.length,
      unpaidCount: unpaidMembers.length,
      totalCollected,
      totalExpected,
      paidMembers,
      unpaidMembers
    };
  }, [members, payments, currentMonth, settings.monthlyFee]);

  const monthName = new Date(currentMonth + '-01').toLocaleDateString('en-MY', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard - {monthName}</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Members</p>
          <p className="text-3xl font-bold text-gray-800">{stats.totalMembers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Paid</p>
          <p className="text-3xl font-bold text-green-600">{stats.paidCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <p className="text-gray-500 text-sm">Unpaid</p>
          <p className="text-3xl font-bold text-red-600">{stats.unpaidCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm">Collected</p>
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(stats.totalCollected)}</p>
          <p className="text-xs text-gray-400">of {formatCurrency(stats.totalExpected)}</p>
        </div>
      </div>

      {/* Payment Status Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unpaid Members */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">⚠️ Unpaid Members</h3>
          {stats.unpaidMembers.length === 0 ? (
            <p className="text-gray-500">All members have paid! 🎉</p>
          ) : (
            <ul className="space-y-2">
              {stats.unpaidMembers.map(member => (
                <li key={member.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span>{member.name}</span>
                  <span className="text-gray-500 text-sm">{member.phone}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Paid Members */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-green-600 mb-4">✅ Paid Members</h3>
          {stats.paidMembers.length === 0 ? (
            <p className="text-gray-500">No payments recorded yet</p>
          ) : (
            <ul className="space-y-2">
              {stats.paidMembers.map(member => (
                <li key={member.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span>{member.name}</span>
                  <span className="text-green-600 text-sm">Paid</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
