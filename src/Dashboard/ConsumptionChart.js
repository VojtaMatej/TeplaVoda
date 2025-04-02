import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const ConsumptionChart = ({ data, meter }) => {
  if (!data || data.length === 0) return <p>Žádná data k zobrazení</p>;

  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.year, item.month - 1);
      return date.toLocaleDateString('cs-CZ', { month: 'short', year: 'numeric' });
    }),
    datasets: [{
      label: `Spotřeba ${meter.type} (${meter.unit})`,
      data: data.map(item => item.value),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return (
    <div className="chart-container">
      <h3>Historická spotřeba</h3>
      <Line data={chartData} />
    </div>
  );
};

export default ConsumptionChart;
