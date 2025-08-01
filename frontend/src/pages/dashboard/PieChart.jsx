import { useParams, useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../utils/axiosUtil";
import { Pie } from "react-chartjs-2";
import TopBar from "../../components/Dashboard/dashboard/TopBar";

export default function PieChart() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  
  const outletContext = useOutletContext() || {};
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Chart configuration state
  const [selectedXAxis, setSelectedXAxis] = useState("");
  const [selectedYAxis, setSelectedYAxis] = useState("");
  const [chartData, setChartData] = useState(null);
  const [showChart, setShowChart] = useState(false);
  
  // Column type analysis
  const [numericColumns, setNumericColumns] = useState([]);
  const [stringColumns, setStringColumns] = useState([]);

  useEffect(() => {
    const stateFileData = location.state?.fileData;
    const contextFileData = outletContext.fileData;
    
    if (stateFileData) {
      setFileData(stateFileData);
    } else if (contextFileData) {
      setFileData(contextFileData);
    } else if (id) {
      const fetchFile = async () => {
        try {
          setLoading(true);
          const res = await axiosInstance.get(`/uploads/get-files/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFileData(res.data);
        } catch (error) {
          setError("Failed to fetch file data");
        } finally {
          setLoading(false);
        }
      };
      fetchFile();
    }
  }, [id, location.state, outletContext, token]);

  // Analyze column types when file data is loaded
  useEffect(() => {
    if (fileData?.data && fileData?.metadata?.columns) {
      const data = fileData.data;
      const columns = fileData.metadata.columns;
      const numeric = [];
      const strings = [];

      columns.forEach(column => {
        // Sample first few non-empty values to determine type
        const sampleValues = data
          .slice(0, 10)
          .map(row => row[column])
          .filter(val => val !== null && val !== undefined && val !== '');

        const numericCount = sampleValues.filter(val => {
          const num = parseFloat(val);
          return !isNaN(num) && isFinite(num);
        }).length;

        // If more than 70% of sample values are numeric, consider it numeric
        if (sampleValues.length > 0 && numericCount / sampleValues.length > 0.7) {
          numeric.push(column);
        } else {
          strings.push(column);
        }
      });

      setNumericColumns(numeric);
      setStringColumns(strings);

      // Auto-select: first string column for labels, first numeric column for values
      if (strings.length > 0) {
        setSelectedXAxis(strings[0]);
      }
      if (numeric.length > 0) {
        setSelectedYAxis(numeric[0]);
      }
    }
  }, [fileData]);

  // Enhanced chart data generation
  const generateChartData = () => {
    if (!fileData?.data || !selectedXAxis || !selectedYAxis) {
      return null;
    }

    const data = fileData.data;
    const groupedData = {};
    let validDataCount = 0;
    
    data.forEach(row => {
      const xValue = String(row[selectedXAxis] || 'Unknown').trim();
      const rawYValue = row[selectedYAxis];
      
      // More robust numeric parsing
      let yValue = 0;
      if (rawYValue !== null && rawYValue !== undefined && rawYValue !== '') {
        const parsed = parseFloat(String(rawYValue).replace(/[^0-9.-]/g, ''));
        if (!isNaN(parsed) && isFinite(parsed)) {
          yValue = parsed;
          validDataCount++;
        }
      }
      
      if (groupedData[xValue]) {
        groupedData[xValue] += yValue;
      } else {
        groupedData[xValue] = yValue;
      }
    });

    // Filter out zero values and sort
    const filteredEntries = Object.entries(groupedData)
      .filter(([label, value]) => value > 0)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    if (filteredEntries.length === 0) {
      return null;
    }

    const labels = filteredEntries.map(([label]) => label);
    const values = filteredEntries.map(([, value]) => value);

    return {
      labels: labels,
      datasets: [
        {
          label: `${selectedYAxis} by ${selectedXAxis}`,
          data: values,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#FF6B6B",
            "#4ECDC4",
            "#45B7D1",
            "#96CEB4",
          ],
          hoverOffset: 10,
        },
      ],
      validDataCount,
    };
  };

  // Handle generate chart with validation
  const handleGenerateChart = () => {
    if (!selectedXAxis || !selectedYAxis) {
      alert("Please select both X and Y axes");
      return;
    }

    // Check if Y-axis column has numeric data
    if (!numericColumns.includes(selectedYAxis)) {
      alert(`Warning: "${selectedYAxis}" appears to contain non-numeric data. Pie chart may not display correctly.`);
    }
    
    const newChartData = generateChartData();
    
    if (!newChartData) {
      alert("No valid numeric data found for the selected columns. Please choose a different Y-axis column with numeric values.");
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

  const fileName = fileData?.metadata?.filename || location.state?.fileName || outletContext.fileName || 'Unknown File';
  const columns = fileData?.metadata?.columns || [];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: `${fileName} - Pie Chart: ${selectedYAxis} by ${selectedXAxis}`,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg pb-5 shadow h-auto">
      <TopBar />
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pie Chart Builder</h1>
          <p className="text-gray-600 mt-2">Data from: {fileName}</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => navigate(`/dashboard/files/${id}/charts`)}
          >
            Back to Charts
          </button>
          <button 
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            onClick={() => navigate(`/dashboard/files/${id}`)}
          >
            Back to Table
          </button>
        </div>
      </div>
      
      {/* Column Type Information */}
      {(numericColumns.length > 0 || stringColumns.length > 0) && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-blue-800 mb-2">Column Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-green-700">Numeric Columns:</strong>
              <p className="text-green-600">
                {numericColumns.length > 0 ? numericColumns.join(', ') : 'None detected'}
              </p>
            </div>
            <div>
              <strong className="text-blue-700">Text Columns:</strong>
              <p className="text-blue-600">
                {stringColumns.length > 0 ? stringColumns.join(', ') : 'None detected'}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            💡 Tip: Use text columns for labels (X-axis) and numeric columns for values (Y-axis)
          </p>
        </div>
      )}
      
      {/* Axis Selection Panel */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Configure Your Pie Chart</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* X-Axis (Labels) Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Labels (Categories) - X Axis
            </label>
            <select
              value={selectedXAxis}
              onChange={(e) => {
                setSelectedXAxis(e.target.value);
                handleAxisChange();
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select column for labels</option>
              {columns.map((column, index) => (
                <option key={index} value={column}>
                  {column} {stringColumns.includes(column) ? '(Text)' : numericColumns.includes(column) ? '(Number)' : ''}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              This will be used for pie slice labels (preferably text data)
            </p>
          </div>

          {/* Y-Axis (Values) Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Values (Numbers) - Y Axis
            </label>
            <select
              value={selectedYAxis}
              onChange={(e) => {
                setSelectedYAxis(e.target.value);
                handleAxisChange();
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select column for values</option>
              {columns.map((column, index) => (
                <option key={index} value={column}>
                  {column} {stringColumns.includes(column) ? '(Text)' : numericColumns.includes(column) ? '(Number)' : ''}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              This determines pie slice sizes (must be numeric data)
            </p>
            {selectedYAxis && !numericColumns.includes(selectedYAxis) && (
              <p className="text-sm text-amber-600 mt-1">
                ⚠️ Warning: Selected column may contain non-numeric data
              </p>
            )}
          </div>
        </div>

        {/* Generate Chart Button */}
        <div className="mt-6">
          <button
            onClick={handleGenerateChart}
            disabled={!selectedXAxis || !selectedYAxis}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            Generate Pie Chart
          </button>
        </div>
      </div>

      {/* Chart Display */}
      {showChart && chartData && (
        <div className="bg-white  rounded-lg shadow-lg">
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Chart Information */}
      {showChart && chartData && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Chart Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>File:</strong> {fileName}</p>
              <p><strong>Chart Type:</strong> Pie Chart</p>
              <p><strong>Total Slices:</strong> {chartData.labels.length}</p>
            </div>
            <div>
              <p><strong>Label Column:</strong> {selectedXAxis}</p>
              <p><strong>Value Column:</strong> {selectedYAxis}</p>
              <p><strong>Valid Data Points:</strong> {chartData.validDataCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sample Data Preview */}
     
    </div>
    </div>
  );
}