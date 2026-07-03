import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useTranslation } from '../hooks/useTranslation';
import { useAudioSynth } from '../hooks/useAudioSynth';

export const Topology2D5 = () => {
  const { t } = useTranslation();
  const { playClick } = useAudioSynth();
  const [selectedNode, setSelectedNode] = useState(null);
  
  const {
    isEmergency,
    isValveOpen,
    isGensetOnline,
    solarOutput,
    batteryLevel,
    gasPressure,
    gensetOutput,
    carbonCaptured,
    algaeDensity,
    slurryLevel,
    slurryVolume,
    solarHeartbeat,
    batteryHeartbeat,
    biodigesterHeartbeat,
    gastankHeartbeat,
    currentLang
  } = useDashboard();

  const handleNodeClick = (nodeKey) => {
    playClick();
    setSelectedNode(nodeKey);
  };

  const nodeDetails = {
    solar: {
      title: currentLang === 'id' ? "Panel Surya Hibrida" : "Hybrid Solar Array",
      desc: currentLang === 'id' 
        ? "Menangkap energi matahari menggunakan panel fotovoltaik efisiensi tinggi 5kWp. Menyuplai energi langsung ke beban desa dan menyimpan surplus ke Bank Baterai."
        : "Captures solar energy using high-efficiency 5kWp PV panels. Supplies energy directly to the village load and stores surplus into the Battery Bank.",
      stats: {
        [currentLang === 'id' ? "Daya Aktual" : "Actual Power"]: `${solarHeartbeat ? solarOutput : '0.00'} kW`,
        [currentLang === 'id' ? "Tegangan" : "Voltage"]: solarHeartbeat ? "142 VDC" : "0 VDC",
        [currentLang === 'id' ? "Efisiensi" : "Efficiency"]: "19.8%",
        [currentLang === 'id' ? "Status Sensor" : "Sensor Status"]: solarHeartbeat ? "ONLINE" : "OFFLINE"
      }
    },
    battery: {
      title: currentLang === 'id' ? "Bank Baterai LiFePO4" : "LiFePO4 Battery Bank",
      desc: currentLang === 'id'
        ? "Sistem penyimpanan energi baterai lithium besi fosfat berkapasitas 30kWh. Bertindak sebagai penyangga kestabilan grid hibrida desa."
        : "A 30kWh lithium iron phosphate battery storage system. Acts as a stability buffer for the village hybrid microgrid.",
      stats: {
        [currentLang === 'id' ? "Kapasitas (SoC)" : "State of Charge"]: `${batteryLevel}%`,
        [currentLang === 'id' ? "Suhu Sel" : "Cell Temp"]: "31.2°C",
        [currentLang === 'id' ? "Arus Masuk" : "Input Current"]: solarOutput > 1.2 ? "+40 A (Charging)" : "-18 A (Discharging)",
        [currentLang === 'id' ? "Siklus Hidup" : "Life Cycle"]: "1,240 / 6,000"
      }
    },
    biodigester: {
      title: "Anaerobic Biodigester",
      desc: currentLang === 'id'
        ? "Reaktor utama pemroses kotoran ternak dan limbah organik secara anaerob untuk menghasilkan biogas kaya metana."
        : "The primary reactor processing livestock manure and organic waste anaerobically to produce methane-rich biogas.",
      stats: {
        [currentLang === 'id' ? "Suhu Slurry" : "Slurry Temp"]: biodigesterHeartbeat ? "37.2°C" : "NaN",
        [currentLang === 'id' ? "Kadar pH" : "pH Level"]: biodigesterHeartbeat ? "6.82 pH" : "NaN",
        [currentLang === 'id' ? "Waktu Retensi" : "Retention Time"]: "12 Hari",
        [currentLang === 'id' ? "Status" : "Status"]: biodigesterHeartbeat ? "Optimal" : "Offline"
      }
    },
    gastank: {
      title: currentLang === 'id' ? "Tangki Penampung Gas" : "Gas Buffer Tank",
      desc: currentLang === 'id'
        ? "Tangki penampung biogas fleksibel berkapasitas 50 m³ dengan membran ganda untuk menstabilkan tekanan pasokan gas sebelum dialirkan ke Genset."
        : "A 50 m³ flexible double-membrane biogas storage tank to stabilize pressure before feeding into the Genset generator.",
      stats: {
        [currentLang === 'id' ? "Volume Tersimpan" : "Stored Volume"]: "82%",
        [currentLang === 'id' ? "Tekanan" : "Pressure"]: `${gasPressure} Bar`,
        [currentLang === 'id' ? "Kadar Metana (CH₄)" : "Methane Concentration"]: "62.4%",
        [currentLang === 'id' ? "Kadar H₂S" : "H₂S Concentration"]: "12 ppm"
      }
    },
    valve: {
      title: currentLang === 'id' ? "Katup Solenoid Utama" : "Main Solenoid Valve",
      desc: currentLang === 'id'
        ? "Katup elektrik pengaman aliran gas. Dirancang untuk menutup secara otomatis dalam <0.5 detik jika terdeteksi kebocoran atau tombol darurat diaktifkan."
        : "Electrically operated gas flow safety valve. Designed to shut down automatically in <0.5 seconds upon leak detection or emergency trigger.",
      stats: {
        [currentLang === 'id' ? "Status Katup" : "Valve Status"]: isEmergency ? "CLOSED (ALERT)" : (isValveOpen ? "TERBUKA (OPEN)" : "TERTUTUP (CLOSED)"),
        [currentLang === 'id' ? "Tegangan Koil" : "Coil Voltage"]: isValveOpen && !isEmergency ? "24 VDC" : "0 VDC",
        [currentLang === 'id' ? "Mode Kontrol" : "Control Mode"]: "Remote Override / Auto Failsafe"
      }
    },
    genset: {
      title: currentLang === 'id' ? "Genset Generator Biogas" : "Biogas Generator Set",
      desc: currentLang === 'id'
        ? "Mesin pembakaran dalam yang dimodifikasi untuk biogas dengan alternator sinkron 15kW, mengubah gas metana menjadi energi listrik AC 220V."
        : "Internal combustion engine converted for biogas with a 15kW synchronous alternator, transforming methane gas into 220V AC electricity.",
      stats: {
        [currentLang === 'id' ? "Daya Output" : "Output Power"]: `${isGensetOnline && isValveOpen && !isEmergency ? gensetOutput : '0.0'} kW`,
        [currentLang === 'id' ? "Efisiensi" : "Efficiency"]: "92%",
        [currentLang === 'id' ? "Suhu Blok Mesin" : "Engine Temp"]: isGensetOnline && isValveOpen && !isEmergency ? "85.2°C" : "30.0°C (Standby)",
        [currentLang === 'id' ? "Frekuensi" : "Frequency"]: isGensetOnline && isValveOpen && !isEmergency ? "50.1 Hz" : "0.0 Hz"
      }
    },
    algae: {
      title: currentLang === 'id' ? "Fotobioreaktor Mikroalga" : "Microalgae Photobioreactor",
      desc: currentLang === 'id'
        ? "Sistem bioreaktor mikroalga yang dialiri emisi gas buang Genset (CO₂) untuk reduksi jejak karbon sekaligus memanen biomassa alga kaya protein."
        : "A photobioreactor system cultivating microalgae, using Genset exhaust (CO₂) to capture carbon emissions and harvest biomass.",
      stats: {
        [currentLang === 'id' ? "Reduksi CO₂ Aktual" : "Carbon Captured"]: `${carbonCaptured.toFixed(1)} kg`,
        [currentLang === 'id' ? "Laju Penyerapan" : "Absorption Rate"]: isGensetOnline && isValveOpen && !isEmergency ? "18.4 g/jam" : "0.0 g/jam",
        [currentLang === 'id' ? "Kepadatan Kultur" : "Culture Density"]: `${algaeDensity} OD`,
        [currentLang === 'id' ? "Kesehatan Alga" : "Algae Health"]: isEmergency ? (currentLang === 'id' ? "Anomali pH (Stres)" : "pH Anomaly (Stressed)") : (currentLang === 'id' ? "Sangat Sehat" : "Optimal")
      }
    },
    grid: {
      title: currentLang === 'id' ? "Grid Cerdas Desa" : "Village Smart Grid Node",
      desc: currentLang === 'id'
        ? "Pusat distribusi listrik desa yang memadukan input dari Genset Biogas dan Baterai Surya secara cerdas berdasarkan prioritas beban."
        : "Village distribution microgrid that intelligently balances inputs from the Biogas Genset and Solar Battery based on load priority.",
      stats: {
        [currentLang === 'id' ? "Beban Aktif Desa" : "Active Village Load"]: "22.8 kW",
        [currentLang === 'id' ? "Kontribusi Hibrida" : "Hybrid Contribution"]: isGensetOnline && isValveOpen && !isEmergency ? "Genset: 54%, Baterai: 46%" : "Baterai: 100% (Cadangan)",
        [currentLang === 'id' ? "Status Distribusi" : "Distribution Status"]: "STABIL"
      }
    }
  };

  // Flow State evaluations
  const showSolarFlow = solarHeartbeat && solarOutput > 0;
  const showGasFlow = biodigesterHeartbeat && gastankHeartbeat && isValveOpen && !isEmergency;
  const showGensetFlow = isGensetOnline && isValveOpen && !isEmergency;
  const showGridFlow = showSolarFlow || showGensetFlow;

  return (
    <div className="bento-card col-8 entrance-animated">
      <div className="card-header-bar">
        <h2 className="card-title">{t('titleTopology')}</h2>
        <span className="live-indicator"><span className="pulse-dot"></span> LIVE FLOW</span>
      </div>

      <div className="topology-container">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <svg viewBox="0 0 800 450" className="topology-svg">
            <defs>
              <linearGradient id="grad-solar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="grad-biogas" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f2fe" />
                <stop offset="100%" stopColor="#4facfe" />
              </linearGradient>
              <linearGradient id="grad-grid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="grad-algae" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
            </defs>

            {/* FLOW LINES PATHS */}
            {/* 1. Solar -> Battery (H: 200 -> 280 at y=80) */}
            <path
              d="M 200,80 H 280"
              fill="none"
              stroke={showSolarFlow ? "#fe8c00" : "#181c25"}
              strokeWidth="4"
              strokeLinecap="round"
              className={`flow-line ${showSolarFlow ? 'flow-active-solar' : ''}`}
            />
            {/* 2. Battery -> Grid (H: 420 -> 600 at y=80) */}
            <path
              d="M 420,80 H 600"
              fill="none"
              stroke={showGridFlow && batteryLevel > 15 ? "#3b82f6" : "#181c25"}
              strokeWidth="4"
              strokeLinecap="round"
              className={`flow-line ${showGridFlow && batteryLevel > 15 ? 'flow-active-grid' : ''}`}
            />
            {/* 3. Biodigester -> Gas Tank (H: 200 -> 280 at y=230) */}
            <path
              d="M 200,230 H 280"
              fill="none"
              stroke={biodigesterHeartbeat ? "#00f2fe" : "#181c25"}
              strokeWidth="4"
              strokeLinecap="round"
              className={`flow-line ${biodigesterHeartbeat && !isEmergency ? 'flow-active-biogas' : ''}`}
            />
            {/* 4. Gas Tank -> Valve (H: 420 -> 460 at y=230) */}
            <path
              d="M 420,230 H 460"
              fill="none"
              stroke={isEmergency ? "#ff0844" : (showGasFlow ? "#00f2fe" : "#181c25")}
              strokeWidth="4"
              strokeLinecap="round"
              className={`flow-line ${showGasFlow ? 'flow-active-biogas' : ''}`}
            />
            {/* 5. Valve -> Genset (H: 560 -> 600 at y=230) */}
            <path
              d="M 560,230 H 600"
              fill="none"
              stroke={isEmergency ? "#ff0844" : (showGasFlow ? "#00f2fe" : "#181c25")}
              strokeWidth="4"
              strokeLinecap="round"
              className={`flow-line ${showGasFlow ? 'flow-active-biogas' : ''}`}
            />
            {/* 6. Genset -> Grid (V: 670, 195 -> 115) */}
            <path
              d="M 670,195 V 115"
              fill="none"
              stroke={showGensetFlow ? "#3b82f6" : "#181c25"}
              strokeWidth="4"
              strokeLinecap="round"
              className={`flow-line ${showGensetFlow ? 'flow-active-grid' : ''}`}
            />

            {/* 8. Biodigester -> Slurry Tank (V: 130, 265 -> 335) */}
            <path
              d="M 130,265 V 335"
              fill="none"
              stroke={biodigesterHeartbeat ? "#B45309" : "#181c25"}
              strokeWidth="3"
              strokeLinecap="round"
              className={`flow-line ${biodigesterHeartbeat && !isEmergency ? 'flow-active-slurry' : ''}`}
            />
            {/* 9. Genset -> Algae FBR (V: 670, 265 -> 335) */}
            <path
              d="M 670,265 V 335"
              fill="none"
              stroke={showGensetFlow ? "#06b6d4" : "#181c25"}
              strokeWidth="3"
              strokeLinecap="round"
              className={`flow-line ${showGensetFlow ? 'flow-active-algae' : ''}`}
            />

            {/* INTERACTIVE NODES (PURE SVG VECTOR BOXES) */}
            {/* Node 1: Panel Surya */}
            <g className={`node-group-vector ${solarHeartbeat ? 'active-solar' : 'offline'}`} transform="translate(60, 45)" onClick={() => handleNodeClick('solar')}>
              <rect width="140" height="70" rx="8" className="node-rect-vector" />
              <g transform="translate(12, 26)" className="svg-icon">
                <rect x="0" y="0" width="22" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
                <line x1="11" y1="0" x2="11" y2="18" stroke="currentColor" strokeWidth="1.8" />
                <line x1="0" y1="9" x2="22" y2="9" stroke="currentColor" strokeWidth="1.8" />
                <path d="M 4,18 L 1,22 H 21 L 18,18" stroke="currentColor" strokeWidth="1.8" fill="none" />
              </g>
              <text x="44" y="28" className="node-title-vector">{currentLang === 'id' ? "Panel Surya" : "Solar Panel"}</text>
              <text x="44" y="48" className="node-value-vector">{solarHeartbeat ? `${solarOutput} kW` : 'OFFLINE'}</text>
            </g>

            {/* Node 2: Baterai */}
            <g className={`node-group-vector ${batteryHeartbeat ? 'active-solar' : 'offline'}`} transform="translate(280, 45)" onClick={() => handleNodeClick('battery')}>
              <rect width="140" height="70" rx="8" className="node-rect-vector" />
              <g transform="translate(12, 26)" className="svg-icon">
                <rect x="0" y="3" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
                <path d="M 20,7 V 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="4" y1="9" x2="8" y2="9" stroke="currentColor" strokeWidth="1.8" />
                <line x1="6" y1="7" x2="6" y2="11" stroke="currentColor" strokeWidth="1.8" />
                <line x1="12" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.8" />
              </g>
              <text x="44" y="28" className="node-title-vector">{currentLang === 'id' ? "Baterai (LFP)" : "Battery (LFP)"}</text>
              <text x="44" y="48" className="node-value-vector">{batteryHeartbeat ? `${batteryLevel}%` : 'OFFLINE'}</text>
            </g>

            {/* Node 3: Smart Grid */}
            <g className={`node-group-vector ${showGridFlow ? 'active-grid' : 'offline'}`} transform="translate(600, 45)" onClick={() => handleNodeClick('grid')}>
              <rect width="140" height="70" rx="8" className="node-rect-vector" />
              <g transform="translate(12, 26)" className="svg-icon">
                <path d="M 3,22 L 11,2 L 19,22" stroke="currentColor" strokeWidth="1.8" fill="none" />
                <line x1="7" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1.8" />
                <line x1="5" y1="17" x2="17" y2="17" stroke="currentColor" strokeWidth="1.8" />
                <path d="M 1,9 H 21" stroke="currentColor" strokeWidth="1.8" />
                <path d="M 11,2 V 22" stroke="currentColor" strokeWidth="1.8" strokeDasharray="1 2" />
              </g>
              <text x="44" y="28" className="node-title-vector">{currentLang === 'id' ? "Grid Desa" : "Village Grid"}</text>
              <text x="44" y="48" className="node-value-vector">{showGridFlow ? (isGensetOnline && isValveOpen ? "22.8 kW Load" : "10.4 kW Load") : "0.0 kW"}</text>
            </g>

            {/* Node 4: Biodigester */}
            <g className={`node-group-vector ${biodigesterHeartbeat ? 'active-biogas' : 'offline'}`} transform="translate(60, 195)" onClick={() => handleNodeClick('biodigester')}>
              <rect width="140" height="70" rx="8" className="node-rect-vector" />
              <g transform="translate(12, 26)" className="svg-icon">
                <path d="M 6,2 H 16" stroke="currentColor" strokeWidth="1.8" />
                <path d="M 9,2 V 6 L 2,19 A 2,2 0 0 0 4,22 H 18 A 2,2 0 0 0 20,19 L 13,6 V 2" stroke="currentColor" strokeWidth="1.8" fill="none" />
                <path d="M 4,18 H 18" stroke="currentColor" strokeWidth="1.8" strokeDasharray="2 2" />
              </g>
              <text x="44" y="23" className="node-title-vector">Biodigester</text>
              <text x="44" y="41" className="node-value-vector">{biodigesterHeartbeat ? "37.2 °C" : "OFFLINE"}</text>
              {biodigesterHeartbeat && <text x="44" y="55" className="node-sub-vector">pH 6.82 &bull; Ret: 12d</text>}
            </g>

            {/* Node 5: Tangki Gas */}
            <g className={`node-group-vector ${gastankHeartbeat ? (isEmergency ? 'danger' : 'active-biogas') : 'offline'}`} transform="translate(280, 195)" onClick={() => handleNodeClick('gastank')}>
              <rect width="140" height="70" rx="8" className="node-rect-vector" />
              <g transform="translate(12, 26)" className="svg-icon">
                <ellipse cx="11" cy="5" rx="10" ry="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
                <path d="M 1,5 V 11 A 10,3 0 0 0 21,11 V 5" stroke="currentColor" strokeWidth="1.8" fill="none" />
                <path d="M 1,11 V 17 A 10,3 0 0 0 21,17 V 11" stroke="currentColor" strokeWidth="1.8" fill="none" />
              </g>
              <text x="44" y="28" className="node-title-vector">{currentLang === 'id' ? "Tangki Gas" : "Gas Tank"}</text>
              <text x="44" y="48" className="node-value-vector">{gastankHeartbeat ? (isEmergency ? "98% (High)" : "82%") : "OFFLINE"}</text>
            </g>

            {/* Node 6: Solenoid Valve */}
            <g className={`node-group-vector ${isEmergency || !isValveOpen ? 'danger' : 'active-biogas'}`} transform="translate(460, 195)" onClick={() => handleNodeClick('valve')}>
              <rect width="100" height="70" rx="8" className="node-rect-vector" />
              <g transform="translate(12, 26)" className="svg-icon">
                <path d="M 2,5 L 18,15 V 5 L 2,15 Z" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
                <circle cx="10" cy="10" r="3" fill="#0c0e14" stroke="currentColor" strokeWidth="1.5" />
                <path d="M 10,7 V 2 H 6 H 14" stroke="currentColor" strokeWidth="1.8" />
              </g>
              <text x="40" y="28" className="node-title-vector">{currentLang === 'id' ? "Katup Gas" : "Valve"}</text>
              <text x="40" y="48" className="node-value-vector" style={{ fontSize: '11px' }}>{isEmergency ? 'SHUT' : (isValveOpen ? 'OPEN' : 'CLOSED')}</text>
            </g>

            {/* Node 7: Genset Biogas */}
            <g className={`node-group-vector ${isGensetOnline && isValveOpen && !isEmergency ? 'active-grid' : 'offline'}`} transform="translate(600, 195)" onClick={() => handleNodeClick('genset')}>
              <rect width="140" height="70" rx="8" className="node-rect-vector" />
              <g transform="translate(12, 26)" className="svg-icon">
                <rect x="1" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
                <line x1="5" y1="3" x2="5" y2="17" stroke="currentColor" strokeWidth="1.8" />
                <line x1="17" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.8" />
                <path d="M 9,10 L 13,8 L 10,12 L 14,10" stroke="currentColor" strokeWidth="1.8" fill="none" />
              </g>
              <text x="44" y="28" className="node-title-vector">{currentLang === 'id' ? "Genset Biogas" : "Biogas Genset"}</text>
              <text x="44" y="48" className="node-value-vector">{isGensetOnline && isValveOpen && !isEmergency ? `${gensetOutput} kW` : 'OFFLINE'}</text>
            </g>

            {/* Node 8: Slurry Tank */}
            <g className="node-group-vector active-biogas" transform="translate(60, 335)" onClick={() => handleNodeClick('slurry')}>
              <rect width="140" height="70" rx="8" className="node-rect-vector" style={{ stroke: '#b45309', fill: 'rgba(180, 83, 9, 0.02)' }} />
              <g transform="translate(12, 26)" className="svg-icon" style={{ color: '#b45309' }}>
                <path d="M 3,4 H 19" stroke="currentColor" strokeWidth="1.8" />
                <path d="M 4,4 L 6,18 A 2,2 0 0 0 8,20 H 14 A 2,2 0 0 0 16,18 L 18,4" stroke="currentColor" strokeWidth="1.8" fill="none" />
                <path d="M 6,11 H 16" stroke="currentColor" strokeWidth="1.8" strokeDasharray="2 1" />
              </g>
              <text x="44" y="28" className="node-title-vector">{currentLang === 'id' ? "Tangki Slurry" : "Slurry Tank"}</text>
              <text x="44" y="48" className="node-value-vector">{Math.round(slurryLevel)}% ({slurryVolume}L)</text>
            </g>

            {/* Node 9: FBR Algae */}
            <g className={`node-group-vector ${isEmergency ? 'danger' : 'active-algae'}`} transform="translate(600, 335)" onClick={() => handleNodeClick('algae')}>
              <rect width="140" height="70" rx="8" className="node-rect-vector" />
              <g transform="translate(12, 26)" className="svg-icon">
                <path d="M 5,2 H 13" stroke="currentColor" strokeWidth="1.8" />
                <path d="M 7,2 V 15 A 2,2 0 0 0 9,17 A 2,2 0 0 0 11,15 V 2" stroke="currentColor" strokeWidth="1.8" fill="none" />
                <circle cx="9" cy="7" r="0.8" fill="currentColor" />
                <circle cx="11" cy="11" r="0.8" fill="currentColor" />
                <circle cx="9" cy="14" r="0.8" fill="currentColor" />
              </g>
              <text x="44" y="28" className="node-title-vector">{currentLang === 'id' ? "FBR Mikroalga" : "Algae FBR"}</text>
              <text x="44" y="48" className="node-value-vector">{isEmergency ? 'STRESS' : `${algaeDensity} OD`}</text>
            </g>
          </svg>

          {/* Node details slide-up popup panel */}
          {selectedNode && (
            <div className="node-popup-overlay">
              <div className="popup-header">
                <span className="popup-title">{nodeDetails[selectedNode].title}</span>
                <button className="popup-close" onClick={() => setSelectedNode(null)}>&times;</button>
              </div>
              <div className="popup-body">
                <p>{nodeDetails[selectedNode].desc}</p>
                <table className="popup-table">
                  <tbody>
                    {Object.keys(nodeDetails[selectedNode].stats).map((key) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{nodeDetails[selectedNode].stats[key]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Topology2D5;
