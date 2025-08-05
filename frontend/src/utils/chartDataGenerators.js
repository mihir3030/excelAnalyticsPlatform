// utils/chartDataGenerators.js

// Common color palette for all charts
const CHART_COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#8AC24A', '#FF6B6B', '#4ECDC4', '#45B7D1',
  '#96CEB4', '#FFEEAD', '#D4A5A5', '#392F5A', '#31A2AC',
  '#61C0BF', '#6B4226', '#D9BF77', '#ACD8AA', '#FFB347'
];

// Common dataset configuration
const getDatasetConfig = (chartType, label) => {
  const baseConfig = {
    label,
    hoverOffset: 10,
    borderWidth: 1
  };

  switch (chartType) {
    case 'pie':
      return {
        ...baseConfig,
        backgroundColor: CHART_COLORS,
        borderColor: '#FFFFFF',
        borderWidth: 2
      };
    case 'bar':
      return {
        ...baseConfig,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)'
      };
    case 'line':
      return {
        ...baseConfig,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        pointBackgroundColor: '#1D4ED8',
        pointBorderColor: '#FFFFFF',
        pointRadius: 6,
        pointHoverRadius: 8
      };
    case 'doughnut':
      return {
        ...baseConfig,
        backgroundColor: CHART_COLORS,
        borderColor: '#FFFFFF',
        borderWidth: 2
      };
    default:
      return baseConfig;
  }
};

// Common data processing
const processChartData = (groupedData, maxItems = 15) => {
  if (!groupedData?.data) return null;

  // Filter out zero/negative values and sort by value (descending)
  const sortedData = groupedData.data
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxItems);

  if (sortedData.length === 0) return null;

  return {
    labels: sortedData.map(([label]) => label),
    values: sortedData.map(([, value]) => value),
    validDataCount: groupedData.validCount
  };
};

export const generatePieChartData = (groupedData, xColumn, yColumn) => {
  const processedData = processChartData(groupedData, 10); // Limit pie to 10 segments
  if (!processedData) return null;

  return {
    labels: processedData.labels,
    datasets: [{
      ...getDatasetConfig('pie', `${yColumn} by ${xColumn}`),
      data: processedData.values
    }],
    validDataCount: processedData.validDataCount
  };
};

export const generateBarChartData = (groupedData, xColumn, yColumn) => {
  const processedData = processChartData(groupedData, 20); // Show more bars
  if (!processedData) return null;

  return {
    labels: processedData.labels,
    datasets: [{
      ...getDatasetConfig('bar', yColumn),
      data: processedData.values
    }],
    validDataCount: processedData.validDataCount
  };
};

export const generateLineChartData = (groupedData, xColumn, yColumn) => {
  const processedData = processChartData(groupedData);
  if (!processedData) return null;

  return {
    labels: processedData.labels,
    datasets: [{
      ...getDatasetConfig('line', yColumn),
      data: processedData.values
    }],
    validDataCount: processedData.validDataCount
  };
};

export const generateDoughnutChartData = (groupedData, xColumn, yColumn) => {
  const processedData = processChartData(groupedData, 10); // Limit doughnut to 10 segments
  if (!processedData) return null;

  return {
    labels: processedData.labels,
    datasets: [{
      ...getDatasetConfig('doughnut', `${yColumn} by ${xColumn}`),
      data: processedData.values
    }],
    validDataCount: processedData.validDataCount
  };
};

// Unified generator for all chart types
export const generateChartData = (groupedData, chartType, xColumn, yColumn) => {
  switch (chartType) {
    case 'pie':
      return generatePieChartData(groupedData, xColumn, yColumn);
    case 'bar':
      return generateBarChartData(groupedData, xColumn, yColumn);
    case 'line':
      return generateLineChartData(groupedData, xColumn, yColumn);
    case 'doughnut':
      return generateDoughnutChartData(groupedData, xColumn, yColumn);
    default:
      return generatePieChartData(groupedData, xColumn, yColumn);
  }
};