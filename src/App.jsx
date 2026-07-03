import React, { useState, useEffect } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { KpiCard } from './components/KpiCard';
import { Topology2D5 } from './components/Topology2D5';
import { AiPredictor } from './components/AiPredictor';
import { CarbonGauge } from './components/CarbonGauge';
import { SlurryTank } from './components/SlurryTank';
import { LogsTable } from './components/LogsTable';
import { ControlPanel } from './components/ControlPanel';
import { useTelemetry } from './hooks/useTelemetry';
import { useAudioSynth } from './hooks/useAudioSynth';
import { useTranslation } from './hooks/useTranslation';

const DashboardContent = () => {
  useTelemetry(); // Start telemetry simulation loops
  const { playAcknowledgeSweep } = useAudioSynth();
  const { t } = useTranslation();
  
  const {
    isEmergency,
    acknowledgeEmergency,
    currentLang,
    batteryLevel,
    batteryChargingRate,
    gasPressure,
    gensetOutput,
    isValveOpen,
    isGensetOnline,
    solarHeartbeat,
    batteryHeartbeat,
    biodigesterHeartbeat,
    gastankHeartbeat
  } = useDashboard();

  // History states for sparklines
  const [batteryHistory, setBatteryHistory] = useState([75, 75.3, 75.8, 76.4, 77.1, 77.8, 78.5]);
  const [pressureHistory, setPressureHistory] = useState([1.75, 1.78, 1.80, 1.83, 1.81, 1.84, 1.82]);
  const [gensetHistory, setGensetHistory] = useState([12.0, 12.2, 12.1, 12.5, 12.3, 12.4, 12.4]);
  const [safetyHistory, setSafetyHistory] = useState([1, 1, 1, 1, 1, 1, 1]);

  // Sync historical arrays when values change
  useEffect(() => {
    if (isEmergency) return;
    setBatteryHistory(prev => [...prev.slice(1), batteryLevel]);
    setPressureHistory(prev => [...prev.slice(1), gasPressure]);
    setGensetHistory(prev => [...prev.slice(1), gensetOutput]);
    setSafetyHistory(prev => [...prev.slice(1), isValveOpen ? 1 : 0]);
  }, [batteryLevel, gasPressure, gensetOutput, isValveOpen, isEmergency]);

  // Set emergency body class for styling triggers
  useEffect(() => {
    if (isEmergency) {
      document.body.classList.add('emergency-active');
    } else {
      document.body.classList.remove('emergency-active');
    }
    return () => document.body.classList.remove('emergency-active');
  }, [isEmergency]);

  const handleAckClick = () => {
    playAcknowledgeSweep();
    acknowledgeEmergency();
  };

  return (
    <>
      {/* Emergency Ambient Strobe */}
      <div className="emergency-strobe"></div>

      {/* Backdrop Ambient Glow Circles */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* Global Emergency Banner */}
      {isEmergency && (
        <div className="emergency-banner">
          <div className="banner-content">
            <i className="fa-solid fa-triangle-exclamation pulse-icon"></i>
            <span>{t('alertBanner')}</span>
          </div>
          <button className="ack-btn" onClick={handleAckClick}>
            Acknowledge Alarm
          </button>
        </div>
      )}

      <div className="dashboard-container">
        {/* Sidebar Nav */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="main-content">
          <Topbar />

          {/* Bento Grid */}
          <div className="bento-grid">
            
            {/* KPI 1: Battery Capacity */}
            <KpiCard
              className="col-3"
              label={t('lblBattery')}
              value={batteryLevel.toFixed(1)}
              unit="%"
              icon="fa-solid fa-battery-three-quarters"
              iconColorClass={batteryChargingRate > 0 ? "battery-charging" : ""}
              subText={
                batteryChargingRate > 0 ? (
                  <span className="text-warning">
                    <i className="fa-solid fa-arrow-trend-up"></i> +{batteryChargingRate} kW ({currentLang === 'id' ? 'Pengisian' : 'Charging'})
                  </span>
                ) : (
                  <span className="text-secondary">
                    <i className="fa-solid fa-arrow-trend-down"></i> -1.8 kW ({currentLang === 'id' ? 'Pengosongan' : 'Discharging'})
                  </span>
                )
              }
              sparklineColor="#fe8c00"
              sparklineData={batteryHistory}
              heartbeat={batteryHeartbeat}
              offline={!batteryHeartbeat}
            />

            {/* KPI 2: Gas Pressure */}
            <KpiCard
              className="col-3"
              label={t('lblPressure')}
              value={gasPressure.toFixed(2)}
              unit="Bar"
              icon="fa-solid fa-gauge-high"
              iconColorClass={isEmergency ? "safety-alert text-danger" : "safety-ok"}
              subText={
                isEmergency ? (
                  <span className="text-danger font-bold">
                    <i className="fa-solid fa-triangle-exclamation"></i> {currentLang === 'id' ? 'Kritis (> 2.8 Bar)' : 'Critical (> 2.8 Bar)'}
                  </span>
                ) : (
                  <span className="text-success">
                    <i className="fa-solid fa-circle-check"></i> {currentLang === 'id' ? 'Rentang Aman' : 'Safe Range'}
                  </span>
                )
              }
              sparklineColor={isEmergency ? "#ff0844" : "#00f2fe"}
              sparklineData={pressureHistory}
              heartbeat={gastankHeartbeat}
              offline={!gastankHeartbeat}
            />

            {/* KPI 3: Genset Output */}
            <KpiCard
              className="col-3"
              label={t('lblGenset')}
              value={gensetOutput.toFixed(1)}
              unit="kW"
              icon="fa-solid fa-bolt-lightning"
              iconColorClass={isGensetOnline && isValveOpen && !isEmergency ? "safety-ok" : "offline-text"}
              subText={
                isGensetOnline && isValveOpen && !isEmergency ? (
                  <span className="text-success">
                    <i className="fa-solid fa-circle-notch fa-spin"></i> {currentLang === 'id' ? 'Efisiensi: 92%' : 'Efficiency: 92%'}
                  </span>
                ) : (
                  <span className="text-secondary">
                    {currentLang === 'id' ? 'Genset Offline' : 'Genset Offline'}
                  </span>
                )
              }
              sparklineColor="#3b82f6"
              sparklineData={gensetHistory}
              heartbeat={isGensetOnline && isValveOpen && !isEmergency}
              offline={!isGensetOnline || !isValveOpen || isEmergency}
            />

            {/* KPI 4: Safety Status */}
            <KpiCard
              className="col-3"
              label={t('lblSafety')}
              value={isEmergency ? "ALERT" : (!isValveOpen ? "ISOLATED" : "SECURE")}
              icon="fa-solid fa-shield-halved"
              iconColorClass={isEmergency || !isValveOpen ? "safety-alert text-danger" : "safety-ok"}
              subText={
                isEmergency ? (
                  <span className="text-danger font-bold">
                    {currentLang === 'id' ? 'Kebocoran Terdeteksi!' : 'Gas Leak Detected!'}
                  </span>
                ) : !isValveOpen ? (
                  <span className="text-danger">
                    {currentLang === 'id' ? 'Katup Tertutup (Manual)' : 'Valve Closed (Manual)'}
                  </span>
                ) : (
                  <span className="text-success">
                    {currentLang === 'id' ? 'Solenoid Valve Terbuka' : 'Solenoid Valve Open'}
                  </span>
                )
              }
              sparklineColor={isEmergency || !isValveOpen ? "#ff0844" : "#00f2fe"}
              sparklineData={safetyHistory}
              heartbeat={biodigesterHeartbeat}
              offline={!biodigesterHeartbeat}
            />

            {/* Topology Map (2.5D Isometric SVG) */}
            <Topology2D5 />

            {/* AI Predictions Graph */}
            <AiPredictor />

            {/* Carbon Capture Radial Progress */}
            <CarbonGauge />

            {/* Slurry Liquid Tank Animation */}
            <SlurryTank />

            {/* Real-time Activity Logs */}
            <LogsTable />

            {/* Remote Override Access Panels */}
            <ControlPanel />

          </div>
        </main>
      </div>
    </>
  );
};

export const App = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default App;
