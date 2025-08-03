import { useNavigate, useLocation, useParams, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../utils/axiosUtil";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
} from "chart.js";
import { Pie, Bar, Line, Doughnut, Radar } from "react-chartjs-2";
import TopBar from "../../components/Dashboard/dashboard/TopBar";
import { FiPieChart, FiBarChart2, FiTrendingUp, FiCircle, FiArrowLeft, FiFile } from "react-icons/fi";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale
);

export default function Charts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState(null);
  
  useEffect(() => {
    const stateFileData = location.state?.fileData;
    
    if (stateFileData) {
      setFileData(stateFileData);
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
  }, [id, location.state, token]);

  const isNestedRoute = location.pathname !== `/dashboard/files/${id}/charts`;

  const prepareChartData = () => {
    if (!fileData?.data || !fileData?.metadata?.columns) {
      return {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        values: [12500, 18900, 8300, 15000]
      };
    }

    const columns = fileData.metadata.columns;
    const data = fileData.data;
    
    if (columns.length >= 2) {
      const labelColumn = columns[0];
      const valueColumn = columns[1];
      
      const labels = data.map(row => row[labelColumn]).slice(0, 6);
      const values = data.map(row => parseFloat(row[valueColumn]) || 0).slice(0, 6);
      
      return { labels, values };
    }
    
    return {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      values: [12500, 18900, 8300, 15000]
    };
  };

  const handleChartClick = (chartType) => {
    setActiveChart(chartType);
    navigate(`/dashboard/files/${id}/charts/${chartType}`, { 
      state: { 
        fileData,
        fileId: id,
        fileName: fileData?.metadata?.originalFileName || 'Unknown File',
        chartType
      } 
    });
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
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (!fileData) return (
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

  if (isNestedRoute) {
    return <Outlet context={{ fileData, fileId: id, fileName: fileData?.metadata?.originalFileName }} />;
  }

  const chartInfo = prepareChartData();
  const fileName = fileData?.metadata?.originalFileName || 'Unknown File';

  const chartOptions = {
    responsive: true,
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
    },
    maintainAspectRatio: false
  };

  const chartDataConfig = (type) => ({
    labels: chartInfo.labels,
    datasets: [
      {
        label: `${fileName} Data`,
        data: chartInfo.values,
        backgroundColor: type === 'line' ? '#3B82F6' : [
          '#3B82F6', '#10B981', '#F59E0B', '#6366F1', 
          '#14B8A6', '#EC4899','#F97316', '#8B5CF6'
        ],
        borderColor: type === 'line' ? '#3B82F6' : '#FFFFFF',
        borderWidth: type !== 'line' ? 1 : 2,
        tension: type === 'line' ? 0.1 : 0,
        fill: type === 'radar',
        pointBackgroundColor: type === 'line' ? '#1D4ED8' : undefined,
        pointRadius: type === 'line' ? 4 : undefined
      }
    ]
  });

  const chartCards = [
    { type: 'pie', icon: <FiPieChart size={24} />, title: 'Pie Chart' },
    { type: 'bar', icon: <FiBarChart2 size={24} />, title: 'Bar Chart' },
    { type: 'line', icon: <FiTrendingUp size={24} />, title: 'Line Chart' },
    { type: 'doughnut', icon: <FiCircle size={24} />, title: 'Doughnut Chart' },
    { type: 'radar', icon: <FiCircle size={24} />, title: 'Radar Chart' }
  ];

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
              <button 
                onClick={() => navigate(`/dashboard/files/${id}`)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                <FiArrowLeft className="mr-2" />
                Back to Data Table
              </button>
            </div>
          </div>
          
          {/* Chart Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="h-64">
                      {card.type === 'pie' && <Pie data={chartDataConfig('pie')} options={chartOptions} />}
                      {card.type === 'bar' && <Bar data={chartDataConfig('bar')} options={chartOptions} />}
                      {card.type === 'line' && <Line data={chartDataConfig('line')} options={chartOptions} />}
                      {card.type === 'doughnut' && <Doughnut data={chartDataConfig('doughnut')} options={chartOptions} />}
                      {card.type === 'radar' && <Radar data={chartDataConfig('radar')} options={chartOptions} />}
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