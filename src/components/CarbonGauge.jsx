import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useTranslation } from '../hooks/useTranslation';

export const CarbonGauge = () => {
  const { t } = useTranslation();
  const {
    isEmergency,
    isGensetOnline,
    isValveOpen,
    carbonCaptured,
    carbonAbsorptionRate,
    algaeDensity
  } = useDashboard();

  // Circular gauge math: radius 50 -> circumference 314.15
  // We want to show a value of 0 to 100%. 84.5% efficiency is nominal.
  const efficiency = isGensetOnline && isValveOpen && !isEmergency ? 84.5 : 0;
  const strokeOffset = 314.15 - (314.15 * efficiency) / 100;

  return (
    <div className="bento-card col-6 entrance-animated">
      <div className="card-header-bar">
        <h2 className="card-title">{t('titleCarbon')}</h2>
      </div>

      <div className="economy-wrapper">
        <div className="circular-gauge-container">
          <svg className="radial-svg" viewBox="0 0 120 120">
            <circle className="radial-bg" cx="60" cy="60" r="50"></circle>
            <circle
              className="radial-val"
              cx="60"
              cy="60"
              r="50"
              style={{
                strokeDasharray: '314.15',
                strokeDashoffset: strokeOffset,
                stroke: isEmergency ? '#ff0844' : '#06b6d4'
              }}
            ></circle>
          </svg>
          <div className="radial-text">
            <span className="radial-num font-mono">
              {isEmergency ? '0.0' : carbonCaptured.toFixed(1)}
            </span>
            <span className="radial-unit">kg CO₂</span>
          </div>
        </div>

        <div className="economy-stats">
          <div className="econ-stat-item">
            <span className="econ-lbl">{t('lblCarbonRate')}</span>
            <span className="econ-val font-mono text-info">
              {isEmergency ? '0.0' : carbonAbsorptionRate} g/jam
            </span>
          </div>
          <div className="econ-stat-item">
            <span className="econ-lbl">{t('lblAlgaeOd')}</span>
            <span className="econ-val font-mono">
              {isEmergency ? '0.00' : algaeDensity} OD
            </span>
          </div>
          <div className="econ-stat-item">
            <span className="econ-lbl">{t('lblFbrStatus')}</span>
            <span className={`econ-val ${isEmergency ? 'text-danger' : 'text-success'}`}>
              {isEmergency ? (
                <><i className="fa-solid fa-circle-exclamation"></i> {t('lblStatusFbrCritical')}</>
              ) : (
                <><i className="fa-solid fa-circle-check"></i> {t('lblStatusFbrOptimal')}</>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CarbonGauge;
