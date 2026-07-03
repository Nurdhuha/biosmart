import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useTranslation } from '../hooks/useTranslation';

export const LogsTable = () => {
  const { logs, currentLang } = useDashboard();
  const { t } = useTranslation();
  
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSeverityChange = (e) => {
    setSeverityFilter(e.target.value);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.msg.toLowerCase().includes(search.toLowerCase()) || 
                          log.source.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || log.level === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="bento-card col-6 logs-card entrance-animated">
      <div className="card-header-bar">
        <h2 className="card-title">{t('titleLogs')}</h2>
        
        <div className="logs-action-bar">
          <input
            type="text"
            className="logs-search"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={handleSearchChange}
          />
          
          <select
            className="logs-filter"
            value={severityFilter}
            onChange={handleSeverityChange}
          >
            <option value="all">{t('optAll')}</option>
            <option value="critical">{t('optCritical')}</option>
            <option value="warning">{t('optWarning')}</option>
            <option value="info">{t('optInfo')}</option>
          </select>
        </div>
      </div>

      <div className="logs-scrollable">
        <table className="logs-table">
          <thead>
            <tr>
              <th width="15%">{t('thTime')}</th>
              <th width="15%">{t('thLevel')}</th>
              <th width="25%">{t('thSource')}</th>
              <th width="45%">{t('thMsg')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={index}>
                <td className="log-time-col">{log.time}</td>
                <td>
                  <span className={`sev-badge ${log.level}`}>
                    {log.level}
                  </span>
                </td>
                <td style={{ fontWeight: 600, color: '#ffffff' }}>{log.source}</td>
                <td>{log.msg}</td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  {currentLang === 'id' ? 'Tidak ada data log' : 'No logs found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default LogsTable;
