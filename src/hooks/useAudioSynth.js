import { useEffect, useRef } from 'react';
import { useDashboard } from '../context/DashboardContext';

export const useAudioSynth = () => {
  const { isEmergency, isMuted } = useDashboard();
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainRef = useRef(null);
  const sirenIntervalRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Play micro click sound for button press
  const playClick = () => {
    if (isMuted) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    } catch (e) {
      console.warn('Audio click synth failed', e);
    }
  };

  // Play sweep sweep sound when emergency is acknowledged
  const playAcknowledgeSweep = () => {
    if (isMuted) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio sweep synth failed', e);
    }
  };

  // Manage emergency alarm sound
  useEffect(() => {
    if (isEmergency && !isMuted) {
      try {
        initAudio();
        const ctx = audioCtxRef.current;
        
        oscillatorRef.current = ctx.createOscillator();
        gainRef.current = ctx.createGain();
        
        oscillatorRef.current.type = 'sawtooth';
        oscillatorRef.current.frequency.setValueAtTime(440, ctx.currentTime);
        
        gainRef.current.gain.setValueAtTime(0.03, ctx.currentTime);
        
        oscillatorRef.current.connect(gainRef.current);
        gainRef.current.connect(ctx.destination);
        oscillatorRef.current.start();
        
        // Loop siren frequencies
        sirenIntervalRef.current = setInterval(() => {
          if (!audioCtxRef.current) return;
          const t = audioCtxRef.current.currentTime;
          if (oscillatorRef.current) {
            oscillatorRef.current.frequency.cancelScheduledValues(t);
            oscillatorRef.current.frequency.setValueAtTime(440, t);
            oscillatorRef.current.frequency.linearRampToValueAtTime(880, t + 0.5);
            oscillatorRef.current.frequency.linearRampToValueAtTime(440, t + 1.0);
          }
        }, 1000);
      } catch (e) {
        console.warn('Failed to start alarm sound', e);
      }
    } else {
      // Clean up alarm siren
      if (sirenIntervalRef.current) {
        clearInterval(sirenIntervalRef.current);
        sirenIntervalRef.current = null;
      }
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (e) {}
        oscillatorRef.current = null;
      }
      if (gainRef.current) {
        try {
          gainRef.current.disconnect();
        } catch (e) {}
        gainRef.current = null;
      }
    }

    return () => {
      if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current);
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {}
      }
    };
  }, [isEmergency, isMuted]);

  return { playClick, playAcknowledgeSweep };
};
