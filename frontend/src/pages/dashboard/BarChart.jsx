// components/BarChart.js - Similar structure
import { Bar } from "react-chartjs-2";
import { generateBarChartData } from "../..//utils/chartDataGenerators.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFileData } from "../../hooks/useFileData.js"
import { ChartConfigPanel } from "../../components/ChartConfigPanel.jsx";

export default function BarChart() {
  const navigate = useNavigate();
  const {
    fileData,
    loading,
    error,
    numericColumns,
    stringColumns,
    fileName,
    columns,
    groupData
  } = useFileData();
  
  const [selectedXAxis, setSelectedXAxis] = useState("");
  const [selectedYAxis, setSelectedYAxis] = useState("");
  const [aggregation, setAggregation] = useState("sum");
  const [chartData, setChartData] = useState(null);
  const [showChart, setShowChart] = useState(false);

  // Auto-select columns
  useEffect(() => {
    if (stringColumns.length > 0 && !selectedXAxis) {
      setSelectedXAxis(stringColumns[0]);
    }
    if (numericColumns.length > 0 && !selectedYAxis) {
      setSelectedYAxis(numericColumns[0]);
    }
  }, [stringColumns, numericColumns, selectedXAxis, selectedYAxis]);

  const handleGenerateChart = () => {
    if (!selectedXAxis || !selectedYAxis) {
      alert("Please select both X and Y axes");
      return;
    }
    
    const groupedData = groupData(selectedXAxis, selectedYAxis, aggregation);
    const newChartData = generateBarChartData(groupedData, selectedXAxis, selectedYAxis);
    
    if (!newChartData) {
      alert("No valid data found. Please choose different columns.");
      return;
    }
    
    setChartData(newChartData);
    setShowChart(true);
  };

  const handleAxisChange = () => {
    setShowChart(false);
    setChartData(null);
  };

  if (loading) return <div className="p-6"><p>Loading chart data...</p></div>;
  if (error) return <div className="p-6"><p className="text-red-500">{error}</p></div>;
  if (!fileData) return <div className="p-6"><p>No file data found.</p></div>;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${fileName} - Bar Chart: ${selectedYAxis} by ${selectedXAxis} (${aggregation})`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bar Chart Builder</h1>
          <p className="text-gray-600 mt-2">Data from: {fileName}</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => navigate(`/dashboard/files/${fileData.id}/charts`)}
          >
            Back to Charts
          </button>
        </div>
      </div>
      
      {/* Configuration Panel with Aggregation */}
      <ChartConfigPanel
        columns={columns}
        numericColumns={numericColumns}
        stringColumns={stringColumns}
        selectedXAxis={selectedXAxis}
        setSelectedXAxis={setSelectedXAxis}
        selectedYAxis={selectedYAxis}
        setSelectedYAxis={setSelectedYAxis}
        onAxisChange={handleAxisChange}
        onGenerateChart={handleGenerateChart}
        aggregation={aggregation}
        setAggregation={setAggregation}
        showAggregation={true}
      />

      {/* Chart Display */}
      {showChart && chartData && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}

      {/* Chart Information */}
      {showChart && chartData && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Chart Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>File:</strong> {fileName}</p>
              <p><strong>Chart Type:</strong> Bar Chart</p>
              <p><strong>Aggregation:</strong> {aggregation}</p>
            </div>
            <div>
              <p><strong>Category Column:</strong> {selectedXAxis}</p>
              <p><strong>Value Column:</strong> {selectedYAxis}</p>
              <p><strong>Total Bars:</strong> {chartData.labels.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
