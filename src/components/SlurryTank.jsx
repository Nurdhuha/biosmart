import React, { useEffect, useRef } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useTranslation } from '../hooks/useTranslation';

export const SlurryTank = () => {
  const { t } = useTranslation();
  const { slurryLevel, slurryVolume, harvestSlurry, isEmergency, currentLang } = useDashboard();
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Liquid level height math (0% is top of canvas = height, 100% is bottom = 0)
      const fillHeight = (slurryLevel / 100) * height;
      const targetY = height - fillHeight;

      ctx.save();
      
      // Create clip region within tank rounded corners
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.clip();

      // Draw primary wave
      ctx.beginPath();
      phaseRef.current += 0.05;
      
      const amplitude = 4; // wave height
      const frequency = 0.08; // wave frequency

      ctx.moveTo(0, targetY);
      for (let x = 0; x <= width; x++) {
        const y = targetY + Math.sin(x * frequency + phaseRef.current) * amplitude;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      // Liquid gradients
      const gradient = ctx.createLinearGradient(0, targetY, 0, height);
      gradient.addColorStop(0, '#d97706'); // Top/crest color
      gradient.addColorStop(1, '#78350f'); // Dark deep bottom color
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw secondary wave (slightly offset and translucent)
      ctx.beginPath();
      ctx.moveTo(0, targetY);
      for (let x = 0; x <= width; x++) {
        const y = targetY + Math.sin(x * 0.06 - phaseRef.current * 0.7) * (amplitude * 0.8);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(217, 119, 6, 0.3)';
      ctx.fill();

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [slurryLevel]);

  // Estimate full days
  const daysLeft = Math.max(0, Math.ceil((100 - slurryLevel) / 7.2));

  return (
    <div className="bento-card col-6 entrance-animated">
      <div className="card-header-bar">
        <h2 className="card-title">{t('titleSlurry')}</h2>
      </div>

      <div className="economy-wrapper">
        <div className="slurry-tank-container">
          <div className="slurry-tank-glass">
            <canvas ref={canvasRef} className="slurry-wave-canvas" />
            <div className="slurry-percent-tag font-mono">
              {Math.round(slurryLevel)}%
            </div>
          </div>
        </div>

        <div className="economy-stats">
          <div className="econ-stat-item">
            <span className="econ-lbl">{t('lblSlurryVol')}</span>
            <span className="econ-val font-mono text-warning">
              {slurryVolume.toLocaleString(currentLang === 'id' ? 'id-ID' : 'en-US')} Liter
            </span>
          </div>
          <div className="econ-stat-item">
            <span className="econ-lbl">{t('lblSlurryEst')}</span>
            <span className="econ-val font-mono">
              {daysLeft > 0 
                ? (currentLang === 'id' ? `${daysLeft} Hari Lagi` : `${daysLeft} Days Left`)
                : (currentLang === 'id' ? 'PENUH (Panen!)' : 'FULL (Harvest Now!)')}
            </span>
          </div>
          <div className="action-btn-container">
            <button
              className="harvest-btn"
              onClick={harvestSlurry}
              disabled={isEmergency}
              style={{ opacity: isEmergency ? 0.5 : 1 }}
            >
              <i className="fa-solid fa-bucket"></i> {t('btnHarvest')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SlurryTank;
