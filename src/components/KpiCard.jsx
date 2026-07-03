import React, { useEffect, useRef } from 'react';

export const KpiCard = ({
  className = '',
  label,
  value,
  unit,
  icon,
  iconColorClass = '',
  subText,
  sparklineColor = '#3b82f6',
  sparklineData = [],
  heartbeat = true,
  offline = false
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || offline || sparklineData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Set display sizes
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    // Draw sparkline path
    ctx.beginPath();
    const minVal = Math.min(...sparklineData);
    const maxVal = Math.max(...sparklineData);
    const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

    const points = sparklineData.map((val, index) => {
      const x = (index / (sparklineData.length - 1)) * width;
      const y = height - 4 - ((val - minVal) / valRange) * (height - 8);
      return { x, y };
    });

    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.strokeStyle = sparklineColor;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Draw gradient area underneath
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, sparklineColor + '30');
    gradient.addColorStop(1, sparklineColor + '00');
    ctx.fillStyle = gradient;
    ctx.fill();

  }, [sparklineData, sparklineColor, offline]);

  return (
    <div className={`bento-card ${offline ? 'offline' : ''} ${className} entrance-animated`}>
      <div className="kpi-container">
        <div className="kpi-header">
          <span className="kpi-label">{label}</span>
          <span className={`kpi-icon ${iconColorClass}`}>
            <i className={icon}></i>
          </span>
        </div>

        <div className="kpi-value-row">
          <span className={`kpi-value ${offline ? 'offline-text' : ''}`}>
            {offline ? 'NaN' : value}
            {!offline && unit && <span className="kpi-unit">{unit}</span>}
          </span>
          <span className="kpi-subtext">
            {subText}
          </span>
        </div>

        {/* Dynamic canvas sparkline */}
        {!offline && sparklineData.length > 0 && (
          <div className="kpi-sparkline">
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }}></canvas>
          </div>
        )}

        {/* Heartbeat connection dot */}
        {heartbeat && !offline && <div className="heartbeat-dot" title="Sensor online & terhubung"></div>}
      </div>
    </div>
  );
};
export default KpiCard;
