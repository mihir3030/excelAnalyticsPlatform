import { useNavigate, useLocation, useParams, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../utils/axiosUtil";
import * as Chart from 'chart.js';
import TopBar from "../../components/Dashboard/dashboard/TopBar";
import { FiPieChart, FiBarChart2, FiTrendingUp, FiCircle, FiArrowLeft, FiFile, FiInfo, FiAlertTriangle, FiHash, FiType } from "react-icons/fi";
import { ChartConfigPanel } from "../../components/ChartConfigPanel"; // Import your existing component
import { generateChartData } from "../../utils/chartDataGenerators.js"; // Import from your existing file

// Register Chart.js components
Chart.Chart.register(
  Chart.ArcElement,
  Chart.BarElement,
  Chart.CategoryScale,
  Chart.LinearScale,
  Chart.LineElement,
  Chart.PointElement,
  Chart.RadialLinearScale,
  Chart.Tooltip,
  Chart.Legend
);

export default function Charts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  
  // All state hooks at the top
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState(null);
  const [chartInstances, setChartInstances] = useState({});
  const [selectedXAxis, setSelectedXAxis] = useState('');
  const [selectedYAxis, setSelectedYAxis] = useState('');
  const [aggregation, setAggregation] = useState('sum');
  const [showConfig, setShowConfig] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper functions (moved outside of useEffect to avoid dependencies)
  const getNumericColumns = (data) => {
    if (!data?.data || !data?.metadata?.columns) return [];
    
    return data.metadata.columns.filter(column => {
      return data.data.some(row => {
        const value = row[column];
        return !isNaN(parseFloat(value)) && isFinite(value);
      });
    });
  };

  const getStringColumns = (data) => {
    if (!data?.metadata?.columns) return [];
    const numericCols = getNumericColumns(data);
    return data.metadata.columns.filter(col => !numericCols.includes(col));
  };

  const initializeAxisSelections = (data) => {
    if (data?.metadata?.columns && !isInitialized) {
      const numericCols = getNumericColumns(data);
      const stringCols = getStringColumns(data);
      
      if (stringCols.length > 0 && !selectedXAxis) setSelectedXAxis(stringCols[0]);
      if (numericCols.length > 0 && !selectedYAxis) setSelectedYAxis(numericCols[0]);
      setIsInitialized(true);
    }
  };

  const prepareChartGroupedData = () => {
    if (!fileData?.data || !selectedXAxis || !selectedYAxis) {
      return {
        data: [
          ['Q1', 12500],
          ['Q2', 18900],
          ['Q3', 8300],
          ['Q4', 15000]
        ],
        validCount: 4
      };
    }

    const data = fileData.data;
    const groupedMap = new Map();
    
    data.forEach(row => {
      const xValue = row[selectedXAxis];
      const yValue = parseFloat(row[selectedYAxis]) || 0;
      
      if (groupedMap.has(xValue)) {
        const existing = groupedMap.get(xValue);
        switch (aggregation) {
          case 'sum':
            groupedMap.set(xValue, existing + yValue);
            break;
          case 'average':
            const currentVal = Array.isArray(existing) ? existing : [existing];
            currentVal.push(yValue);
            groupedMap.set(xValue, currentVal);
            break;
          case 'count':
            groupedMap.set(xValue, existing + 1);
            break;
          case 'max':
            groupedMap.set(xValue, Math.max(existing, yValue));
            break;
          case 'min':
            groupedMap.set(xValue, Math.min(existing, yValue));
            break;
        }
      } else {
        groupedMap.set(xValue, aggregation === 'count' ? 1 : 
                      aggregation === 'average' ? [yValue] : yValue);
      }
    });

    if (aggregation === 'average') {
      for (const [key, values] of groupedMap.entries()) {
        if (Array.isArray(values)) {
          const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
          groupedMap.set(key, avg);
        }
      }
    }
    
    const chartData = Array.from(groupedMap.entries());
    
    return {
      data: chartData,
      validCount: chartData.length
    };
  };

  const createChartWithChartJS = (canvasId, chartType, data) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
    }

    const config = {
      type: chartType,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
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
            boxPadding: 6
          }
        }
      }
    };

    if (chartType === 'bar') {
      config.options.scales = {
        y: {
          beginAtZero: true
        }
      };
    }

    const chartInstance = new Chart.Chart(ctx, config);
    
    setChartInstances(prev => ({
      ...prev,
      [canvasId]: chartInstance
    }));
  };

  const handleChartClick = (chartType) => {
    setActiveChart(chartType);
    navigate(`/dashboard/files/${id}/charts/${chartType}`, { 
      state: { 
        fileData,
        fileId: id,
        fileName: fileData?.metadata?.originalFileName || 'Unknown File',
        chartType,
        selectedXAxis,
        selectedYAxis,
        aggregation
      } 
    });
  };

  const handleAxisChange = () => {
    setTimeout(() => {
      if (fileData && selectedXAxis && selectedYAxis) {
        const groupedData = prepareChartGroupedData();
        chartCards.forEach(card => {
          const chartData = generateChartData(groupedData, card.type, selectedXAxis, selectedYAxis);
          if (chartData) {
            createChartWithChartJS(`${card.type}-canvas`, card.type, chartData);
          }
        });
      }
    }, 100);
  };

  // Chart cards definition
  const chartCards = [
    { type: 'pie', icon: <FiPieChart size={24} />, title: 'Pie Chart' },
    { type: 'bar', icon: <FiBarChart2 size={24} />, title: 'Bar Chart' },
    { type: 'line', icon: <FiTrendingUp size={24} />, title: 'Line Chart' },
    { type: 'doughnut', icon: <FiCircle size={24} />, title: 'Doughnut Chart' }
  ];

  // All useEffect hooks together
  useEffect(() => {
    const stateFileData = location.state?.fileData;
    
    if (stateFileData) {
      setFileData(stateFileData);
      initializeAxisSelections(stateFileData);
    } else if (id) {
      const fetchFile = async () => {
        try {
          setLoading(true);
          const res = await axiosInstance.get(`/uploads/get-files/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFileData(res.data);
          initializeAxisSelections(res.data);
        } catch (error) {
          setError("Failed to fetch file data");
        } finally {
          setLoading(false);
        }
      };
      fetchFile();
    }
  }, [id, location.state, token]);

  useEffect(() => {
    if (fileData && selectedXAxis && selectedYAxis) {
      const timer = setTimeout(() => {
        const groupedData = prepareChartGroupedData();
        chartCards.forEach(card => {
          const chartData = generateChartData(groupedData, card.type, selectedXAxis, selectedYAxis);
          if (chartData) {
            createChartWithChartJS(`${card.type}-canvas`, card.type, chartData);
          }
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [fileData, selectedXAxis, selectedYAxis, aggregation]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      Object.values(chartInstances).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
    };
  }, []);

  // Computed values
  const isNestedRoute = location.pathname !== `/dashboard/files/${id}/charts`;
  const fileName = fileData?.metadata?.originalFileName || 'Unknown File';
  const columns = fileData?.metadata?.columns || [];
  const numericColumns = getNumericColumns(fileData);
  const stringColumns = getStringColumns(fileData);
  const groupedData = prepareChartGroupedData();

  // Early returns after all hooks
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!fileData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-gray-400 text-4xl mb-4">
            <FiFile className="inline-block" />
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
  }

  if (isNestedRoute) {
    return <Outlet context={{ fileData, fileId: id, fileName }} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Data Visualization</h1>
                <p className="text-gray-600 mt-1">
                  Analyzing: <span className="font-medium text-blue-600">{fileName}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowConfig(!showConfig)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FiBarChart2 className="mr-2" />
                  {showConfig ? 'Hide Config' : 'Configure Charts'}
                </button>
                <button 
                  onClick={() => navigate(`/dashboard/files/${id}`)}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  <FiArrowLeft className="mr-2" />
                  Back to Data Table
                </button>
              </div>
            </div>
          </div>
          
          {/* Configuration Panel */}
          {showConfig && (
            <div className="p-8 border-b border-gray-100">
              <ChartConfigPanel
                columns={columns}
                numericColumns={numericColumns}
                stringColumns={stringColumns}
                selectedXAxis={selectedXAxis}
                setSelectedXAxis={setSelectedXAxis}
                selectedYAxis={selectedYAxis}
                setSelectedYAxis={setSelectedYAxis}
                onAxisChange={handleAxisChange}
                aggregation={aggregation}
                setAggregation={setAggregation}
                showAggregation={true}
                onGenerateChart={handleAxisChange}
              />
            </div>
          )}
          
          {/* Chart Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {chartCards.map((card) => (
                <div
                  key={card.type}
                  onClick={() => handleChartClick(`${card.type}-chart`)}
                  className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    activeChart === `${card.type}-chart` ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-3">
                        {card.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                    </div>
                    <div className="h-64 relative">
                      <canvas id={`${card.type}-canvas`} className="w-full h-full"></canvas>
                    </div>
                    <div className="mt-4 text-center">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View Full Chart →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}