


// utils/chartDataGenerators.js
export const generatePieChartData = (groupedData, xColumn, yColumn) => {
  if (!groupedData?.data) return null;

  const sortedData = groupedData.data
    .filter(([, value]) => value > 0)
    .slice(0, 10);

  if (sortedData.length === 0) return null;

  const labels = sortedData.map(([label]) => label);
  const values = sortedData.map(([, value]) => value);

  return {
    labels,
    datasets: [{
      label: `${yColumn} by ${xColumn}`,
      data: values,
      backgroundColor: [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
        "#FF9F40", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"
      ],
      hoverOffset: 10,
    }],
    validDataCount: groupedData.validCount
  };
};

export const generateBarChartData = (groupedData, xColumn, yColumn) => {
  if (!groupedData?.data) return null;

  const sortedData = groupedData.data.slice(0, 20); // Show more items for bar chart
  const labels = sortedData.map(([label]) => label);
  const values = sortedData.map(([, value]) => value);

  return {
    labels,
    datasets: [{
      label: yColumn,
      data: values,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }],
    validDataCount: groupedData.validCount
  };
};

export const generateLineChartData = (groupedData, xColumn, yColumn) => {
  if (!groupedData?.data) return null;

  const sortedData = groupedData.data;
  const labels = sortedData.map(([label]) => label);
  const values = sortedData.map(([, value]) => value);

  return {
    labels,
    datasets: [{
      label: yColumn,
      data: values,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1
    }],
    validDataCount: groupedData.validCount
  };
};
