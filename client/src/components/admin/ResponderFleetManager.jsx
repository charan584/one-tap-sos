import React from 'react';
import { Truck, Radio, Phone, Navigation, Play, CheckCircle2 } from 'lucide-react';
import { responderApi } from '../../services/api';

export const ResponderFleetManager = ({ responders, activeEmergency, onResponderMoved }) => {
  const handleSimulateMove = async (responderId) => {
    if (!activeEmergency?.location) return;
    try {
      const res = await responderApi.simulateMovement(
        responderId,
        activeEmergency.location.latitude,
        activeEmergency.location.longitude
      );
      if (res.success && onResponderMoved) {
        onResponderMoved(res.responder);
      }
    } catch (e) {
      console.error('Movement simulation error:', e);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-400" />
            Active Campus Responder Fleet
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time GPS tracking & tactical dispatch units
          </p>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
          {responders.length} Units Online
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {responders.map((resp) => {
          const isMedical = resp.role.includes('Medical');
          const isBusy = resp.status === 'Dispatched' || resp.status === 'On Scene';

          return (
            <div
              key={resp._id}
              className={`p-4 rounded-xl border backdrop-blur-md transition-all ${
                isBusy
                  ? 'bg-red-950/20 border-red-500/40'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base ${
                    isMedical ? 'bg-cyan-500/20 text-cyan-400' : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {isMedical ? '🚑' : '🚔'}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs leading-tight">{resp.name}</h4>
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      {resp.callSign} • {resp.vehicleType}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  resp.status === 'Available'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                }`}>
                  {resp.status}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="text-slate-400 text-[11px] truncate max-w-[130px]">
                  📍 {resp.currentLocation?.zone || 'Campus Area'}
                </div>

                {activeEmergency && (
                  <button
                    onClick={() => handleSimulateMove(resp._id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[11px] font-semibold border border-indigo-500/30 transition-colors"
                    title="Advance responder towards student on map"
                  >
                    <Play className="w-3 h-3" />
                    Move Closer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResponderFleetManager;
