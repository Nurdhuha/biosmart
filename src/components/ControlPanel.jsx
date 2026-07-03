import React, { useState, useRef, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useTranslation } from '../hooks/useTranslation';
import { useAudioSynth } from '../hooks/useAudioSynth';

export const ControlPanel = () => {
  const { t } = useTranslation();
  const { playClick, playAcknowledgeSweep } = useAudioSynth();
  
  const {
    isEmergency,
    isValveOpen,
    setIsValveOpen,
    isGensetOnline,
    setIsGensetOnline,
    userRole,
    addLog,
    currentLang
  } = useDashboard();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  
  // Slide state
  const sliderRef = useRef(null);
  const handleRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const startXRef = useRef(0);

  // Touch/Mouse Drag handlers
  const handleDragStart = (e) => {
    if (userRole !== 'senior_technician') return;
    setDragging(true);
    startXRef.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    if (handleRef.current) {
      handleRef.current.style.transition = 'none';
    }
  };

  const handleDrag = (e) => {
    if (!dragging) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    let delta = clientX - startXRef.current;
    
    const currentMaxDrag = sliderRef.current && handleRef.current 
      ? sliderRef.current.offsetWidth - handleRef.current.offsetWidth - 4
      : 120;
    
    if (delta < 0) delta = 0;
    if (delta > currentMaxDrag) delta = currentMaxDrag;
    
    setDragX(delta);
  };

  const handleDragEnd = () => {
    if (!dragging) return;
    setDragging(false);
    
    if (handleRef.current) {
      handleRef.current.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    const currentMaxDrag = sliderRef.current && handleRef.current 
      ? sliderRef.current.offsetWidth - handleRef.current.offsetWidth - 4
      : 120;

    if (dragX >= currentMaxDrag * 0.9) {
      // Slid successfully! Toggle Solenoid Valve
      playAcknowledgeSweep();
      const nextState = !isValveOpen;
      setIsValveOpen(nextState);
      
      if (nextState) {
        addLog("info", "Valve Control", currentLang === 'id' ? "Override Manual: Katup Solenoid Utama DIBUKA." : "Manual Override: Main Solenoid Valve OPENED.");
      } else {
        addLog("warning", "Valve Control", currentLang === 'id' ? "Override Manual: Katup Solenoid Utama DITUTUP. Aliran gas diisolasi." : "Manual Override: Main Solenoid Valve CLOSED. Gas flow isolated.");
      }
    } else {
      // Revert handle
      playClick();
    }
    setDragX(0);
  };

  // Switch change handler (opens modal)
  const handleSwitchChange = () => {
    playClick();
    setShowModal(true);
  };

  const confirmGensetToggle = () => {
    playAcknowledgeSweep();
    const nextState = !isGensetOnline;
    setIsGensetOnline(nextState);
    setShowModal(false);
    
    if (!nextState) {
      addLog("critical", "Genset Override", currentLang === 'id' ? "Override Darurat: Genset Biogas Utama DIMATIKAN PAKSA." : "Emergency Override: Main Biogas Genset SHUT DOWN FORCEFULLY.");
    } else {
      addLog("info", "Genset Control", currentLang === 'id' ? "Genset Biogas Utama dinyalakan kembali dan terhubung ke grid desa." : "Main Biogas Genset restarted and synchronized to the village grid.");
    }
  };

  const cancelGensetToggle = () => {
    playClick();
    setShowModal(false);
  };

  // Lock panel if user role lacks permissions
  const isLocked = userRole !== 'senior_technician';

  return (
    <div className="bento-card col-6 controls-card entrance-animated">
      <div className="card-header-bar">
        <h2 className="card-title">{t('titleControls')}</h2>
        <span className="lock-badge"><i className="fa-solid fa-lock"></i> RBAC ACTIVE</span>
      </div>

      <div className="controls-wrapper" style={{ position: 'relative' }}>
        {/* Role Lock Overlay */}
        {isLocked && (
          <div className="rbac-lock-overlay">
            <i className="fa-solid fa-lock"></i>
            <span>AKSES DITOLAK: HANYA TEKNISI SENIOR</span>
          </div>
        )}

        {/* Control 1: Solenoid Valve */}
        <div className={`control-item ${!isValveOpen || isEmergency ? 'danger-state' : ''}`}>
          <div className="ctrl-info">
            <div className="ctrl-header-row">
              <span className="ctrl-lbl">{t('lblCtrlValve')}</span>
              <span className={`ctrl-status font-mono ${isEmergency || !isValveOpen ? 'text-danger' : 'text-success'}`}>
                {isEmergency ? 'CLOSED (ALERT)' : (isValveOpen ? 'OPEN' : 'CLOSED')}
              </span>
            </div>
            <span className="ctrl-desc">{t('descCtrlValve')}</span>
          </div>
          
          <div className="slide-confirm-container">
            <div 
              ref={sliderRef}
              className={`slide-track-bar ${!isValveOpen ? 'unlocked' : ''}`}
              onMouseMove={handleDrag}
              onTouchMove={handleDrag}
              onMouseLeave={handleDragEnd}
            >
              <div className="slide-progress" style={{ width: `${dragX + (dragX > 0 ? 18 : 0)}px` }}></div>
              <div className="slide-track-label">
                {isValveOpen ? t('textSlideValve') : t('textSlideValveOpen')}
              </div>
              <div
                ref={handleRef}
                className="slide-thumb"
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                onMouseUp={handleDragEnd}
                onTouchEnd={handleDragEnd}
                style={{ transform: `translateX(${dragX}px)` }}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Control 2: Genset emergency stop */}
        <div className={`control-item ${!isGensetOnline ? 'danger-state' : ''}`}>
          <div className="ctrl-info">
            <div className="ctrl-header-row">
              <span className="ctrl-lbl">{t('lblCtrlGenset')}</span>
              <span className={`ctrl-status font-mono ${isGensetOnline ? 'text-success' : 'text-danger'}`}>
                {isGensetOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <span className="ctrl-desc">{t('descCtrlGenset')}</span>
          </div>

          <div className="ctrl-widget-container">
            <label className="custom-switch">
              <input
                type="checkbox"
                checked={isGensetOnline}
                disabled={isLocked}
                onChange={handleSwitchChange}
              />
              <span className="switch-bg"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <div className={`modal-overlay ${showModal ? 'active' : ''}`}>
        <div className="modal-box">
          <div className="modal-alert-icon">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h3>{t('modalTitle')}</h3>
          <p>
            {isGensetOnline 
              ? t('modalMsg')
              : (currentLang === 'id' 
                ? "Apakah Anda yakin ingin menyalakan kembali Genset Biogas Utama? Proses sinkronisasi jaringan hibrida akan memakan waktu sekitar 1 menit."
                : "Are you sure you want to restart the Main Biogas Genset? The microgrid synchronization process will take approximately 1 minute.")}
          </p>
          <div className="modal-buttons">
            <button className="modal-btn-action cancel" onClick={cancelGensetToggle}>
              {t('btnCancel')}
            </button>
            <button className="modal-btn-action confirm" onClick={confirmGensetToggle}>
              {isGensetOnline 
                ? t('btnConfirm')
                : t('btnConfirmOn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ControlPanel;
