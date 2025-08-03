import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useFileData } from "../../hooks/useFileData.js"
import { ChartConfigPanel } from "../../components/ChartConfigPanel.jsx";
import { generateLineChartData } from "../../utils/chartDataGenerators.js";
import { FiPieChart, FiArrowLeft, FiInfo, FiAlertTriangle } from "react-icons/fi";
import TopBar from "../../components/Dashboard/dashboard/TopBar.jsx";

export default function LineChart() {
  const { id } = useParams();
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
  const [chartData, setChartData] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [chartError, setChartError] = useState("");

  useEffect(() => {
    if (stringColumns.length > 0 && !selectedXAxis) {
      setSelectedXAxis(stringColumns[0]);
    }
    if (numericColumns.length > 0 && !selectedYAxis) {
      setSelectedYAxis(numericColumns[0]);
    }
  }, [stringColumns, numericColumns, selectedXAxis, selectedYAxis]);

  const handleGenerateChart = () => {
    setChartError("");
    
    if (!selectedXAxis || !selectedYAxis) {
      setChartError("Please select both category and value columns");
      return;
    }

    if (!numericColumns.includes(selectedYAxis)) {
      setChartError(`Warning: "${selectedYAxis}" contains non-numeric data. Results may be inaccurate.`);
    }
    
    const groupedData = groupData(selectedXAxis, selectedYAxis, 'sum');
    const newChartData = generateLineChartData(groupedData, selectedXAxis, selectedYAxis);
    
    if (!newChartData) {
      setChartError("No valid numeric data found for the selected columns. Please choose different columns.");
      return;
    }
    
    setChartData(newChartData);
    setShowChart(true);
  };

  const handleAxisChange = () => {
    setShowChart(false);
    setChartData(null);
    setChartError("");
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  if (!fileData) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <div className="text-gray-400 text-4xl mb-4">
          <FiPieChart className="inline-block" />
        </div>
        <h2 className="text-xl font-bold mb-2">No Data Available</h2>
        <p className="text-gray-600 mb-6">The requested file data could not be found.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 6,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      title: {
        display: true,
        text: `${selectedYAxis} by ${selectedXAxis}`,
        font: {
          size: 16,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(`/dashboard/files/${id}/charts`)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Line Chart Visualization</h1>
            </div>
            <p className="text-gray-600 mt-2 ml-11">
              Analyzing: <span className="font-medium text-blue-600">{fileName}</span>
            </p>
          </div>
        </div>

        {/* Configuration Panel - Now full width on top */}
      
        
          
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
          />

          {chartError && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <FiAlertTriangle className="text-yellow-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-yellow-700">{chartError}</span>
            </div>
          )}
        

        {/* Chart Display - Full width below configuration */}
        <div className="space-y-8">
          {showChart && chartData ? (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="h-[500px]">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* Chart Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiInfo className="text-blue-500" />
                  Chart Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">File Information</h4>
                      <p className="mt-1 text-gray-800">{fileName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Chart Type</h4>
                      <p className="mt-1 text-gray-800">Pie Chart</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Category Column</h4>
                      <p className="mt-1 text-gray-800">{selectedXAxis}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Value Column</h4>
                      <p className="mt-1 text-gray-800">{selectedYAxis}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Data Points</h4>
                      <p className="mt-1 text-gray-800">{chartData.labels.length} categories</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Total Value</h4>
                      <p className="mt-1 text-gray-800">
                        {chartData.datasets[0].data.reduce((a, b) => a + b, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <FiPieChart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Chart Displayed</h3>
                <p className="text-gray-500 mb-6">
                  Configure your chart settings and click "Generate Chart" to visualize your data
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

