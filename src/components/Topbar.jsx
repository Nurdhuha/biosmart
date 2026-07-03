import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useAudioSynth } from '../hooks/useAudioSynth';
import { useTranslation } from '../hooks/useTranslation';

export const Topbar = () => {
  const {
    currentLang,
    setCurrentLang,
    isMuted,
    setIsMuted,
    isEmergency,
    triggerEmergency,
    userRole
  } = useDashboard();

  const { t } = useTranslation();
  const { playClick } = useAudioSynth();
  const [timeStr, setTimeStr] = useState('19:39:09');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    // Play sound on click just before muting/unmuting
    if (isMuted) {
      // We are unmuting, play click sound shortly after setting state
      setTimeout(() => playClick(), 50);
    } else {
      playClick();
    }
  };

  const handleLanguageSwitch = (lang) => {
    playClick();
    setCurrentLang(lang);
  };

  const handleTestAlarm = () => {
    playClick();
    triggerEmergency();
  };

  return (
    <header className="top-bar">
      <div className="header-title">
        <h1>{t('pageTitle')}</h1>
        <p className="subtitle">{t('pageSubtitle')}</p>
      </div>

      <div className="header-actions">
        {/* Simulation / Test Alarm */}
        <div className="simulation-tools">
          <button
            className="sim-btn"
            onClick={handleTestAlarm}
            title={currentLang === 'id' ? 'Simulasikan kebocoran gas' : 'Simulate gas leakage'}
          >
            <i className="fa-solid fa-bug-slash"></i> Test Alarm
          </button>
        </div>

        {/* Time Widget */}
        <div className="time-widget">
          <i className="fa-regular fa-clock"></i>
          <span>{timeStr}</span>
        </div>

        {/* Weather Widget */}
        <div className="weather-widget" title={currentLang === 'id' ? 'Prediksi cuaca desa' : 'Village weather prediction'}>
          <i className="fa-solid fa-cloud-sun-rain"></i>
          <span>{currentLang === 'id' ? 'Cerah Berawan' : 'Partly Cloudy'} &bull; 28°C</span>
        </div>

        {/* Language Switcher */}
        <div className="lang-switcher">
          <button
            className={`lang-btn ${currentLang === 'id' ? 'active' : ''}`}
            onClick={() => handleLanguageSwitch('id')}
          >
            ID
          </button>
          <button
            className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
            onClick={() => handleLanguageSwitch('en')}
          >
            EN
          </button>
        </div>

        {/* Mute Button */}
        <button
          className={`action-circle-btn ${isEmergency && !isMuted ? 'active' : ''}`}
          onClick={handleMuteToggle}
          title={isMuted ? (currentLang === 'id' ? 'Bunyikan Suara' : 'Unmute Sounds') : (currentLang === 'id' ? 'Senapkan Suara' : 'Mute Sounds')}
        >
          {isMuted ? (
            <i className="fa-solid fa-volume-xmark"></i>
          ) : (
            <i className="fa-solid fa-volume-high"></i>
          )}
        </button>

        {/* Profile Card */}
        <div className="user-profile">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
            alt="Profile"
            className="profile-img"
          />
          <div className="profile-info">
            <span className="user-name">Nur Dhuha</span>
            <span className="user-role">
              {userRole === 'senior_technician'
                ? (currentLang === 'id' ? 'Teknisi Senior' : 'Senior Technician')
                : (currentLang === 'id' ? 'Operator Desa' : 'Village Operator')}
            </span>
          </div>
          <i className="fa-solid fa-chevron-down profile-arrow"></i>
        </div>
      </div>
    </header>
  );
};
export default Topbar;
