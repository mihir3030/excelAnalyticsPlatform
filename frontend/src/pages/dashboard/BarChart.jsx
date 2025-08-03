import { Bar } from "react-chartjs-2";
import { generateBarChartData } from "../../utils/chartDataGenerators.js";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useFileData } from "../../hooks/useFileData.js";
import { ChartConfigPanel } from "../../components/ChartConfigPanel.jsx";
import { FiBarChart2, FiArrowLeft, FiInfo, FiAlertTriangle, FiSave } from "react-icons/fi";
import TopBar from "../../components/Dashboard/dashboard/TopBar.jsx";
import html2canvas from "html2canvas";

export default function BarChart() {
  const { id } = useParams();
  const navigate = useNavigate();
  const chartRef = useRef(null);
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
  const [chartError, setChartError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
    
    const groupedData = groupData(selectedXAxis, selectedYAxis, aggregation);
    const newChartData = generateBarChartData(groupedData, selectedXAxis, selectedYAxis);
    
    if (!newChartData) {
      setChartError("No valid data found. Please choose different columns.");
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

  const handleSaveChart = async () => {
    if (!chartRef.current) return;
    
    setIsSaving(true);
    try {
      const canvas = await html2canvas(chartRef.current);
      const image = canvas.toDataURL("image/png");
      
      const link = document.createElement("a");
      link.download = `${fileName}_${selectedYAxis}_by_${selectedXAxis}_(${aggregation}).png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error("Error saving chart:", err);
      setChartError("Failed to save chart image");
    } finally {
      setIsSaving(false);
    }
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
          <FiBarChart2 className="inline-block" />
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
        display: false,
      },
      title: {
        display: true,
        text: `${selectedYAxis} by ${selectedXAxis} (${aggregation})`,
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
        boxPadding: 6
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
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
              <h1 className="text-2xl font-bold text-gray-800">Bar Chart Visualization</h1>
            </div>
            <p className="text-gray-600 mt-2 ml-11">
              Analyzing: <span className="font-medium text-blue-600">{fileName}</span>
            </p>
          </div>
        </div>

        {/* Configuration Panel */}
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

          {chartError && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <FiAlertTriangle className="text-yellow-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-yellow-700">{chartError}</span>
            </div>
          )}

        {/* Chart Display */}
        <div className="space-y-8">
          {showChart && chartData ? (
            <>
              <div 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                ref={chartRef}
              >
                <div className="p-6">
                  <div className="h-[500px]">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* Chart Actions and Information */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
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
                        <p className="mt-1 text-gray-800">Bar Chart</p>
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
                        <h4 className="text-sm font-medium text-gray-500">Aggregation</h4>
                        <p className="mt-1 text-gray-800">{aggregation}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Total Bars</h4>
                        <p className="mt-1 text-gray-800">{chartData.labels.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Chart Button */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Chart Actions</h3>
                  <button
                    onClick={handleSaveChart}
                    disabled={isSaving}
                    className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all flex items-center justify-center ${
                      isSaving
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow hover:shadow-md'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        Save Chart as Image
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Downloads as PNG image with transparent background
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <FiBarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
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