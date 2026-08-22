import React, { createContext, useContext, useState, useRef } from 'react';

const SoundContext = createContext(null);

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef(null);
  const sirenOsc1Ref = useRef(null);
  const sirenOsc2Ref = useRef(null);
  const sirenGainRef = useRef(null);
  const sirenIntervalRef = useRef(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // 1. Play Single Countdown Tick
  const playCountdownTick = (remainingSec = 3) => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch increases as countdown approaches 0
      osc.frequency.setValueAtTime(remainingSec === 1 ? 880 : 660, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {
      console.warn('Audio tick error:', e);
    }
  };

  // 2. Play Dispatch Alarm / High Priority Notification (3-tone alert)
  const playDispatchAlarm = () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const notes = [587.33, 739.99, 880]; // D5, F#5, A5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.35);
      });
    } catch (e) {
      console.warn('Audio alert error:', e);
    }
  };

  // 3. Play Continuous Campus Siren (Dual Oscillator)
  const playEmergencySiren = () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (sirenIntervalRef.current) return; // already active

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      sirenOsc1Ref.current = osc;
      sirenGainRef.current = gain;

      let high = false;
      osc.frequency.setValueAtTime(650, ctx.currentTime);

      sirenIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        if (high) {
          osc.frequency.setTargetAtTime(600, now, 0.2);
        } else {
          osc.frequency.setTargetAtTime(900, now, 0.2);
        }
        high = !high;
      }, 500);
    } catch (e) {
      console.warn('Siren play error:', e);
    }
  };

  const stopEmergencySiren = () => {
    try {
      if (sirenIntervalRef.current) {
        clearInterval(sirenIntervalRef.current);
        sirenIntervalRef.current = null;
      }
      if (sirenOsc1Ref.current) {
        sirenOsc1Ref.current.stop();
        sirenOsc1Ref.current.disconnect();
        sirenOsc1Ref.current = null;
      }
    } catch (e) {
      console.warn('Siren stop error:', e);
    }
  };

  // 4. Play Success / Resolved Chime
  const playSuccessChime = () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const chord = [523.25, 659.25, 783.99, 1046.5]; // C Major arpeggio
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.6);
      });
    } catch (e) {
      console.warn('Chime error:', e);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      if (!prev) stopEmergencySiren();
      return !prev;
    });
  };

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        playCountdownTick,
        playDispatchAlarm,
        playEmergencySiren,
        stopEmergencySiren,
        playSuccessChime,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within SoundProvider');
  return context;
};
