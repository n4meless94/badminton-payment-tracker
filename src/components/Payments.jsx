import { useState } from 'react';
import { generateId, formatDate, formatCurrency, getCurrentMonthYear } from '../utils/helpers';

export default function Payments({ members, payments, setPayments, settings }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    amount: settings.monthlyFee || '50',
    month: getCurrentMonthYear(),
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const member = members.find(m => m.id === formData.memberId);
    setPayments([...payments, {
      id: generateId(),
      ...formData,
      memberName: member?.name || 'Unknown'
    }]);
    setFormData({
      memberId: '',
      amount: settings.monthlyFee || '50',
      month: getCurrentMonthYear(),
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this payment record?')) {
      setPayments(payments.filter(p => p.id !== id));
    }
  };

  // Sort payments by date (newest first)
  const sortedPayments = [...payments].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Payments</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Record Payment
        </button>
      </div>

      {/* Add Payment Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Record Payment</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member</label>
              <select
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select member...</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (RM)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">For Month</label>
                <input
                  type="month"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g., Bank transfer, Cash"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Record Payment
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">For Month</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedPayments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No payments recorded yet
                </td>
              </tr>
            ) : (
              sortedPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{payment.memberName}</td>
                  <td className="px-6 py-4 text-green-600 font-semibold">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(payment.month + '-01').toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(payment.date)}</td>
                  <td className="px-6 py-4 text-gray-500">{payment.notes || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
