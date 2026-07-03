import React, { createContext, useState, useEffect, useContext } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('id');
  const [isMuted, setIsMuted] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isValveOpen, setIsValveOpen] = useState(true);
  const [isGensetOnline, setIsGensetOnline] = useState(true);
  const [userRole, setUserRole] = useState('senior_technician'); // 'senior_technician' | 'operator'
  
  // Real-time telemetry values
  const [batteryLevel, setBatteryLevel] = useState(78.5);
  const [batteryChargingRate, setBatteryChargingRate] = useState(1.2); // kW
  const [gasPressure, setGasPressure] = useState(1.82); // Bar
  const [gensetOutput, setGensetOutput] = useState(12.4); // kW
  const [solarOutput, setSolarOutput] = useState(3.45); // kW
  const [carbonCaptured, setCarbonCaptured] = useState(246.5); // kg
  const [carbonAbsorptionRate, setCarbonAbsorptionRate] = useState(18.4); // g/h
  const [algaeDensity, setAlgaeDensity] = useState(1.45); // OD
  const [slurryLevel, setSlurryLevel] = useState(64); // %
  const [slurryVolume, setSlurryVolume] = useState(3200); // L
  const [solarHeartbeat, setSolarHeartbeat] = useState(true);
  const [batteryHeartbeat, setBatteryHeartbeat] = useState(true);
  const [biodigesterHeartbeat, setBiodigesterHeartbeat] = useState(true);
  const [gastankHeartbeat, setGastankHeartbeat] = useState(true);
  
  // System Logs
  const [logs, setLogs] = useState([
    { time: "19:35:10", level: "info", source: "Smart Grid", msg: "Sistem menyalurkan 12.4 kW daya Genset ke Grid Desa." },
    { time: "19:30:45", level: "info", source: "Solar Controller", msg: "Tegangan panel surya turun di bawah 15V. Panel beralih ke standby malam." },
    { time: "19:15:00", level: "warning", source: "Slurry Tank", msg: "Volume Tangki Residu (Slurry) mencapai 64%. Siapkan pemanenan pupuk." },
    { time: "18:45:20", level: "info", source: "Biodigester", msg: "Suhu internal biodigester termostabil pada 37.2°C." },
    { time: "18:00:10", level: "info", source: "FBR Algae", msg: "Laju fotosintesis mikroalga optimal, pH kultur stabil pada 8.2." }
  ]);

  const addLog = (level, source, msg) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs(prev => [
      { time: timeStr, level, source, msg },
      ...prev.slice(0, 49) // Keep last 50 logs
    ]);
  };

  // Trigger simulated emergency anomaly
  const triggerEmergency = () => {
    if (isEmergency) return;
    setIsEmergency(true);
    setGasPressure(2.92);
    setAlgaeDensity(0.85); // shift pH stress
    addLog("critical", "Methane Gas Sensor", currentLang === 'id' ? "BAHAYA: Deteksi tekanan gas kritis 2.92 Bar melebihi ambang batas." : "CRITICAL: Gas pressure sensor 2.92 Bar exceeds safe threshold limits.");
  };

  // Restore simulated emergency back to safe values
  const acknowledgeEmergency = () => {
    if (!isEmergency) return;
    setIsEmergency(false);
    setGasPressure(1.82);
    setAlgaeDensity(1.45);
    addLog("info", "Operator", currentLang === 'id' ? "Alarm diakui (Acknowledge). Kondisi sensor dikembalikan ke aman." : "Alarm acknowledged. Sensor states returned to safe values.");
  };

  const harvestSlurry = () => {
    setSlurryLevel(5);
    setSlurryVolume(250);
    addLog("info", "Slurry Tank", currentLang === 'id' ? "Residu Slurry dipanen dan dikemas sebagai pupuk organik cair." : "Slurry residue harvested and packaged as organic liquid fertilizer.");
  };

  return (
    <DashboardContext.Provider value={{
      currentLang, setCurrentLang,
      isMuted, setIsMuted,
      isEmergency, setIsEmergency,
      isValveOpen, setIsValveOpen,
      isGensetOnline, setIsGensetOnline,
      userRole, setUserRole,
      batteryLevel, setBatteryLevel,
      batteryChargingRate, setBatteryChargingRate,
      gasPressure, setGasPressure,
      gensetOutput, setGensetOutput,
      solarOutput, setSolarOutput,
      carbonCaptured, setCarbonCaptured,
      carbonAbsorptionRate, setCarbonAbsorptionRate,
      algaeDensity, setAlgaeDensity,
      slurryLevel, setSlurryLevel,
      slurryVolume, setSlurryVolume,
      solarHeartbeat, setSolarHeartbeat,
      batteryHeartbeat, setBatteryHeartbeat,
      biodigesterHeartbeat, setBiodigesterHeartbeat,
      gastankHeartbeat, setGastankHeartbeat,
      logs, setLogs, addLog,
      triggerEmergency,
      acknowledgeEmergency,
      harvestSlurry
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
