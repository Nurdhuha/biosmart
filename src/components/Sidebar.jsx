import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useAudioSynth } from '../hooks/useAudioSynth';

export const Sidebar = () => {
  const { currentLang } = useDashboard();
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Overview');
  const { playClick } = useAudioSynth();

  const handleNavClick = (itemName) => {
    playClick();
    setActiveItem(itemName);
  };

  const navItems = [
    { name: 'Overview', icon: 'fa-solid fa-chart-pie', tooltip: currentLang === 'id' ? 'Ringkasan' : 'Overview' },
    { name: 'Analytics', icon: 'fa-solid fa-brain', tooltip: currentLang === 'id' ? 'Analisis AI' : 'AI Analytics' },
    { name: 'Logs', icon: 'fa-solid fa-receipt', tooltip: currentLang === 'id' ? 'Log Sistem' : 'System Logs' },
    { name: 'Devices', icon: 'fa-solid fa-microchip', tooltip: currentLang === 'id' ? 'IoT Perangkat' : 'IoT Devices' },
    { name: 'Settings', icon: 'fa-solid fa-sliders', tooltip: currentLang === 'id' ? 'Pengaturan' : 'Settings' }
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo-section">
        <div className="logo-icon">
          <i className="fa-solid fa-seedling"></i>
        </div>
        <span className="logo-text">BIOSMART</span>
      </div>
      
      <nav className="nav-menu">
        {navItems.map((item) => (
          <div
            key={item.name}
            className={`nav-item ${activeItem === item.name ? 'active' : ''}`}
            data-tooltip={item.tooltip}
            onClick={() => handleNavClick(item.name)}
          >
            <i className={item.icon}></i>
            <span className="nav-text">{item.tooltip}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="toggle-sidebar-btn"
          onClick={() => {
            playClick();
            setCollapsed(!collapsed);
          }}
          title="Toggle Sidebar"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
