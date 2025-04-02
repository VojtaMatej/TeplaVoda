import React, { useState, useContext } from 'react';
import { useData } from '../../context/DataContext';
import api from '../../services/api';

const TriggerList = ({ meter }) => {
  const { triggers, fetchTriggers } = useData();
  const [newTrigger, setNewTrigger] = useState({
    type: 'monthly_exceed',
    threshold: '',
    month: new Date().getMonth() + 1,
    maxValue: '',
    active: true
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/triggers', {
        ...newTrigger,
        meterId: meter.id,
        threshold: parseFloat(newTrigger.threshold),
        maxValue: parseFloat(newTrigger.maxValue)
      });
      await fetchTriggers();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Chyba při ukládání triggeru');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/triggers/${id}`);
      await fetchTriggers();
    } catch (err) {
      setError(err.response?.data?.message || 'Chyba při mazání triggeru');
    }
  };

  return (
    <div className="trigger-section">
      <h3>Nastavení upozornění</h3>
      
      <form onSubmit={handleSubmit} className="trigger-form">
        <div className="form-group">
          <label>Typ upozornění:</label>
          <select
            value={newTrigger.type}
            onChange={(e) => setNewTrigger({...newTrigger, type: e.target.value})}
          >
            <option value="monthly_exceed">Překročení měsíční spotřeby</option>
            <option value="historical_exceed">Překročení historického průměru</option>
            <option value="monthly_report">Měsíční přehled</option>
            <option value="remaining_to_max">Zbývající množství do maxima</option>
          </select>
        </div>

        {['monthly_exceed', 'remaining_to_max'].includes(newTrigger.type) && (
          <div className="form-group">
            <label>
              {newTrigger.type === 'monthly_exceed' ? 'Hranice spotřeby' : 'Maximální hodnota'}:
            </label>
            <input
              type="number"
              step="0.01"
              value={newTrigger.threshold}
              onChange={(e) => setNewTrigger({...newTrigger, threshold: e.target.value})}
              required
            />
            <span>{meter.unit}</span>
          </div>
        )}

        <button type="submit" className="submit-button">Uložit upozornění</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="trigger-list">
        <h4>Aktivní upozornění</h4>
        {triggers.filter(t => t.meterId === meter.id && t.active).length === 0 ? (
          <p>Žádná aktivní upozornění</p>
        ) : (
          <ul>
            {triggers
              .filter(t => t.meterId === meter.id && t.active)
              .map(trigger => (
                <li key={trigger.id}>
                  <span>{formatTriggerDescription(trigger, meter)}</span>
                  <button 
                    onClick={() => handleDelete(trigger.id)}
                    className="delete-button"
                  >
                    Smazat
                  </button>
                </li>
              ))
            }
          </ul>
        )}
      </div>
    </div>
  );
};

function formatTriggerDescription(trigger, meter) {
  switch(trigger.type) {
    case 'monthly_exceed':
      return `Upozornit při překročení ${trigger.threshold} ${meter.unit} v měsíci`;
    case 'historical_exceed':
      return `Upozornit při překročení historického průměru`;
    case 'monthly_report':
      return `Měsíční přehled spotřeby`;
    case 'remaining_to_max':
      return `Upozornit při spotřebě nad ${trigger.threshold} ${meter.unit} (max ${trigger.maxValue})`;
    default:
      return `Neznámý typ upozornění`;
  }
}

export default TriggerList;
