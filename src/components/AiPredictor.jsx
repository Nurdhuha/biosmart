import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useDashboard } from '../context/DashboardContext';
import { useTranslation } from '../hooks/useTranslation';

Chart.register(...registerables);

export const AiPredictor = () => {
  const { currentLang } = useDashboard();
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Generate mock datasets matching specified timeframes
    const labels = [];
    const actualData = [];
    const predictedData = [];
    const confidenceUpper = [];
    const confidenceLower = [];

    for (let i = -20; i <= 10; i++) {
      const time = new Date();
      time.setHours(time.getHours() + i);
      labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      // Sinusoidal base curve representation of load/production
      const baseValue = 35 + 10 * Math.sin(((time.getHours() - 6) / 24) * Math.PI * 2);

      if (i <= 0) {
        // Historical actual values
        actualData.push(parseFloat((baseValue + (Math.random() * 2 - 1)).toFixed(1)));
        predictedData.push(parseFloat((baseValue + (Math.random() * 0.8 - 0.4)).toFixed(1)));
        confidenceUpper.push(null);
        confidenceLower.push(null);
      } else {
        // Predicted future values
        actualData.push(null);
        predictedData.push(parseFloat(baseValue.toFixed(1)));
        confidenceUpper.push(parseFloat((baseValue + 3).toFixed(1)));
        confidenceLower.push(parseFloat((baseValue - 3).toFixed(1)));
      }
    }

    // Custom Gradients
    const gradActual = ctx.createLinearGradient(0, 0, 0, 200);
    gradActual.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
    gradActual.addColorStop(1, 'rgba(0, 242, 254, 0.00)');

    const gradPredicted = ctx.createLinearGradient(0, 0, 0, 200);
    gradPredicted.addColorStop(0, 'rgba(59, 130, 246, 0.20)');
    gradPredicted.addColorStop(1, 'rgba(59, 130, 246, 0.00)');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: currentLang === 'id' ? 'Produksi Aktual (m³)' : 'Actual Production (m³)',
            data: actualData,
            borderColor: '#00f2fe',
            borderWidth: 2.5,
            backgroundColor: gradActual,
            fill: true,
            tension: 0.4,
            pointRadius: (ctx) => ctx.dataIndex === 20 ? 5 : 0, // Current hour highlight
            pointBackgroundColor: '#00f2fe',
            spanGaps: true,
            z: 10
          },
          {
            label: currentLang === 'id' ? 'Prediksi AI (m³)' : 'AI Prediction (m³)',
            data: predictedData,
            borderColor: '#3b82f6',
            borderWidth: 2,
            borderDash: [4, 4],
            backgroundColor: gradPredicted,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            spanGaps: true,
            z: 5
          },
          {
            label: 'Confidence Upper',
            data: confidenceUpper,
            borderColor: 'transparent',
            backgroundColor: 'rgba(59, 130, 246, 0.07)',
            fill: '+1', // Fill to next dataset which is lower
            tension: 0.4,
            pointRadius: 0,
            spanGaps: true,
            z: 1
          },
          {
            label: 'Confidence Lower',
            data: confidenceLower,
            borderColor: 'transparent',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            spanGaps: true,
            z: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#9ca3af',
              font: { family: 'Outfit', size: 11 },
              // Filter out confidence intervals from legend
              filter: (legendItem) => !legendItem.text.includes('Confidence')
            }
          },
          tooltip: {
            backgroundColor: '#0a0c10',
            titleColor: '#ffffff',
            bodyColor: '#9ca3af',
            borderColor: 'rgba(255,255,255,0.06)',
            borderWidth: 1,
            padding: 10,
            displayColors: true,
            bodyFont: { family: 'Outfit' },
            titleFont: { family: 'Outfit', weight: 'bold' }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#6b7280',
              font: { family: 'Outfit', size: 10 },
              maxTicksLimit: 6
            }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.02)' },
            ticks: {
              color: '#6b7280',
              font: { family: 'Outfit', size: 10 },
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [currentLang]);

  return (
    <div className="bento-card col-4 entrance-animated">
      <div className="card-header-bar">
        <h2 className="card-title">{t('titleAiChart')}</h2>
        <span className="ai-badge"><i className="fa-solid fa-robot"></i> AI ACTIVE</span>
      </div>

      <div className="chart-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}></canvas>
      </div>

      <div className="ai-insight-bar">
        <i className="fa-solid fa-lightbulb"></i>
        <p>
          <strong>Insight AI:</strong> {currentLang === 'id' 
            ? "Produksi biogas diperkirakan naik 14% dalam 6 jam ke depan menyusul peningkatan suhu anaerobik pasca-panen residu kemarin." 
            : "Biogas production is forecasted to rise by 14% in the next 6 hours following anaerobic temperature improvements."}
        </p>
      </div>
    </div>
  );
};
export default AiPredictor;
