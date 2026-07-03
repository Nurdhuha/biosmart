import { useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';

export const useTelemetry = () => {
  const {
    isEmergency,
    isValveOpen,
    setIsValveOpen,
    isGensetOnline,
    slurryLevel,
    setSlurryLevel,
    setSlurryVolume,
    carbonCaptured,
    setCarbonCaptured,
    setCarbonAbsorptionRate,
    batteryLevel,
    setBatteryLevel,
    setBatteryChargingRate,
    gasPressure,
    setGasPressure,
    setGensetOutput,
    solarOutput,
    setSolarOutput,
    setSolarHeartbeat,
    setBatteryHeartbeat,
    setBiodigesterHeartbeat,
    setGastankHeartbeat,
    addLog,
    currentLang,
    triggerEmergency
  } = useDashboard();

  useEffect(() => {
    // 1. Live telemetry values fluctuation simulator (Runs every 3 seconds)
    const telemetryInterval = setInterval(() => {
      if (isEmergency) return; // Freeze fluctuations during panic state to show peak danger

      // Solar Output (dependent on hour)
      const hr = new Date().getHours();
      let solarPower = 0;
      if (hr >= 6 && hr <= 18) {
        solarPower = 3.5 + Math.sin(((hr - 6) / 12) * Math.PI) * 1.5 + (Math.random() * 0.4 - 0.2);
        setSolarOutput(parseFloat(solarPower.toFixed(2)));
      } else {
        setSolarOutput(0);
      }

      // Battery level and rate
      setBatteryLevel(prev => {
        let current = prev;
        if (solarPower > 1.2) {
          current += 0.02;
          setBatteryChargingRate(parseFloat((solarPower - 0.8).toFixed(1)));
        } else {
          current -= 0.01;
          setBatteryChargingRate(-1.8);
        }
        return parseFloat(Math.min(Math.max(current, 0), 100).toFixed(1));
      });

      // Gas Pressure
      setGasPressure(prev => {
        let current = prev + (Math.random() * 0.06 - 0.03);
        current = Math.max(1.1, Math.min(current, 2.5));
        
        // Auto-Failsafe Trigger if pressure climbs too high
        if (current > 2.8) {
          triggerEmergency();
        }
        return parseFloat(current.toFixed(2));
      });

      // Genset output power
      if (isGensetOnline && isValveOpen) {
        setGensetOutput(prev => {
          let current = prev + (Math.random() * 0.2 - 0.1);
          return parseFloat(Math.max(11.5, Math.min(current, 13.5)).toFixed(1));
        });
      } else {
        setGensetOutput(0);
      }
    }, 3000);

    // 2. Incremental circular economy simulator (Runs every 5 seconds)
    const economyInterval = setInterval(() => {
      if (isEmergency) return;

      // Carbon captured
      if (isGensetOnline && isValveOpen) {
        setCarbonCaptured(prev => prev + 0.05 + Math.random() * 0.02);
        setCarbonAbsorptionRate(parseFloat((18.2 + (Math.random() * 0.6 - 0.3)).toFixed(1)));
      } else {
        setCarbonAbsorptionRate(0);
      }

      // Slurry Tank Level
      setSlurryLevel(prev => {
        let nextLevel = prev + 0.02;
        if (nextLevel > 100) nextLevel = 100;
        setSlurryVolume(Math.round(5000 * (nextLevel / 100)));
        return parseFloat(nextLevel.toFixed(2));
      });
    }, 5000);

    // 3. Sensor Heartbeat simulator (Disconnects Solar or Biodigester every 20 seconds for 6 seconds)
    const heartbeatInterval = setInterval(() => {
      if (isEmergency) return;

      const randomTarget = Math.random() > 0.5 ? 'solar' : 'biodigester';
      
      if (randomTarget === 'solar') {
        setSolarHeartbeat(false);
        addLog("warning", "Solar Sensor", currentLang === 'id' ? "Kehilangan detak jantung (Heartbeat Lost) pada modul Panel Surya." : "Heartbeat lost on Solar Panel module.");
        
        setTimeout(() => {
          setSolarHeartbeat(true);
          addLog("info", "Solar Sensor", currentLang === 'id' ? "Sensor Panel Surya terhubung kembali." : "Solar Panel sensor reconnected.");
        }, 6000);
      } else {
        setBiodigesterHeartbeat(false);
        addLog("warning", "Biodigester Sensor", currentLang === 'id' ? "Sinyal telemetri Biodigester terganggu. Mencoba menyambung ulang..." : "Biodigester telemetry signal interrupted. Reconnecting...");
        
        setTimeout(() => {
          setBiodigesterHeartbeat(true);
          addLog("info", "Biodigester Sensor", currentLang === 'id' ? "Koneksi sensor Biodigester pulih." : "Biodigester sensor connection restored.");
        }, 6000);
      }
    }, 25000);

    return () => {
      clearInterval(telemetryInterval);
      clearInterval(economyInterval);
      clearInterval(heartbeatInterval);
    };
  }, [isEmergency, isGensetOnline, isValveOpen, currentLang]);
};
export default useTelemetry;
