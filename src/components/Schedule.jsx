import { useState, useMemo } from 'react';
import { getCurrentMonthYear, formatDate } from '../utils/helpers';

export default function Schedule({ members, schedule, setSchedule }) {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthYear());
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    venue: '',
    maxPlayers: '8',
    notes: ''
  });

  const currentMonthSchedule = useMemo(() => {
    return schedule.filter(s => s.month === selectedMonth).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [schedule, selectedMonth]);

  const handleAddSession = (e) => {
    e.preventDefault();
    const sessionId = Date.now().toString();
    const newSession = {
      id: sessionId,
      month: selectedMonth,
      ...formData,
      players: [],
      waitlist: []
    };
    setSchedule([...schedule, newSession]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      venue: '',
      maxPlayers: '8',
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteSession = (sessionId) => {
    if (confirm('Delete this session? All player registrations will be lost.')) {
      setSchedule(schedule.filter(s => s.id !== sessionId));
    }
  };

  const handlePlayerToggle = (sessionId, memberId) => {
    setSchedule(schedule.map(session => {
      if (session.id !== sessionId) return session;
      
      const isInPlayers = session.players.includes(memberId);
      const isInWaitlist = session.waitlist.includes(memberId);
      
      if (isInPlayers) {
        // Remove from players
        return {
          ...session,
          players: session.players.filter(id => id !== memberId)
        };
      } else if (isInWaitlist) {
        // Move from waitlist to players if space available
        if (session.players.length < parseInt(session.maxPlayers)) {
          return {
            ...session,
            players: [...session.players, memberId],
            waitlist: session.waitlist.filter(id => id !== memberId)
          };
        } else {
          // Remove from waitlist
          return {
            ...session,
            waitlist: session.waitlist.filter(id => id !== memberId)
          };
        }
      } else {
        // Add to players or waitlist
        if (session.players.length < parseInt(session.maxPlayers)) {
          return {
            ...session,
            players: [...session.players, memberId]
          };
        } else {
          return {
            ...session,
            waitlist: [...session.waitlist, memberId]
          };
        }
      }
    }));
  };

  const getPlayerStatus = (session, memberId) => {
    if (session.players.includes(memberId)) return 'playing';
    if (session.waitlist.includes(memberId)) return 'waitlist';
    return 'not-registered';
  };

  const monthName = new Date(selectedMonth + '-01').toLocaleDateString('en-MY', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Monthly Schedule</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Session
        </button>
      </div>

      {/* Month Selector */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Add Session Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Add New Session</h3>
          <form onSubmit={handleAddSession} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g., Sports Complex Hall A"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Players</label>
              <input
                type="number"
                value={formData.maxPlayers}
                onChange={(e) => setFormData({ ...formData, maxPlayers: e.target.value })}
                min="2"
                max="20"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g., Bring your own shuttlecocks"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Add Session
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sessions for {monthName}</h3>
        {currentMonthSchedule.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
            No sessions scheduled for {monthName}. Add your first session!
          </div>
        ) : (
          currentMonthSchedule.map(session => (
            <div key={session.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold">
                    {formatDate(session.date)} at {session.time}
                  </h4>
                  <p className="text-gray-600">📍 {session.venue}</p>
                  {session.notes && <p className="text-gray-500 text-sm">💬 {session.notes}</p>}
                </div>
                <button
                  onClick={() => handleDeleteSession(session.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Players: {session.players.length}/{session.maxPlayers}
                  {session.waitlist.length > 0 && ` • Waitlist: ${session.waitlist.length}`}
                </p>
              </div>

              {/* Member Registration */}
              <div className="space-y-2">
                <h5 className="font-medium text-gray-700">Member Registration:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {members.map(member => {
                    const status = getPlayerStatus(session, member.id);
                    return (
                      <button
                        key={member.id}
                        onClick={() => handlePlayerToggle(session.id, member.id)}
                        className={`p-2 rounded-lg text-sm font-medium transition ${
                          status === 'playing'
                            ? 'bg-green-100 text-green-800 border-2 border-green-300'
                            : status === 'waitlist'
                            ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {member.name}
                        {status === 'playing' && ' ✓'}
                        {status === 'waitlist' && ' ⏳'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Players List */}
              {session.players.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <h6 className="font-medium text-green-800 mb-2">✓ Playing ({session.players.length}):</h6>
                  <div className="text-sm text-green-700">
                    {session.players.map(playerId => {
                      const member = members.find(m => m.id === playerId);
                      return member?.name;
                    }).join(', ')}
                  </div>
                </div>
              )}

              {/* Waitlist */}
              {session.waitlist.length > 0 && (
                <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                  <h6 className="font-medium text-yellow-800 mb-2">⏳ Waitlist ({session.waitlist.length}):</h6>
                  <div className="text-sm text-yellow-700">
                    {session.waitlist.map(playerId => {
                      const member = members.find(m => m.id === playerId);
                      return member?.name;
                    }).join(', ')}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}