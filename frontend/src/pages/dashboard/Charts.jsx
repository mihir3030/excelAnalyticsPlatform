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
  const { id } = useParams(); // Get file ID from URL
  const token = useSelector((state) => state.auth.token);
  
  // State for file data
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get file data from navigation state (if available) or fetch it
  useEffect(() => {
    const stateFileData = location.state?.fileData;
    
    if (stateFileData) {
      // Use data from navigation state
      setFileData(stateFileData);
    } else if (id) {
      // Fetch data if not available in state (e.g., direct navigation or refresh)
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

  console.log(fileData)

  // Check if we're on a nested route (individual chart view)
  const isNestedRoute = location.pathname !== `/dashboard/files/${id}/charts`;

  // Helper function to prepare chart data from file data
//   const prepareChartData = () => {
//     if (!fileData?.data || !fileData?.metadata?.columns) {
//       // Fallback to dummy data if no file data
//       return {
//         labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//         values: [12, 19, 3, 5, 2, 3]
//       };
//     }

     // Helper function to prepare chart data from file data
  const prepareChartData = () => {
    
      // Fallback to dummy data if no file data
      return {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        values: [12, 19, 3, 5, 2, 3]
      };
    

    // Use actual file data - you can customize this logic based on your data structure
    const columns = fileData.metadata.columns;
    const data = fileData.data;
    
    // For example, if you want to create a chart from the first two columns
    if (columns.length >= 2) {
      const labelColumn = columns[5];
      const valueColumn = columns[6];
      
      const labels = data.map(row => row[labelColumn]).slice(0, 10); // Limit to 10 items
      const values = data.map(row => parseFloat(row[valueColumn]) || 0).slice(0, 10);
      
      return { labels, values };
    }
    
    // Fallback
    return {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      values: [12, 19, 3, 5, 2, 3]
    };
  };

  // Navigation handlers that preserve file data and use file ID in URL
  const handleChartClick = (chartType) => {
    navigate(`/dashboard/files/${id}/charts/${chartType}`, { 
      state: { 
        fileData,
        fileId: id,
        fileName: fileData?.metadata?.originalFileName || 'Unknown File',
        chartType
      } 
    });
  };

  // Show loading or error states
  if (loading) return <div className="p-6"><p>Loading file data...</p></div>;
  if (error) return <div className="p-6"><p className="text-red-500">{error}</p></div>;
  if (!fileData) return <div className="p-6"><p>No file data found.</p></div>;

  // If we're on a nested route, render the nested component
  if (isNestedRoute) {
    return <Outlet context={{ fileData, fileId: id, fileName: fileData?.metadata?.originalFileName }} />;
  }

  const chartInfo = prepareChartData();
  const fileName = fileData?.metadata?.originalFileName || 'Unknown File';

  const pieData = {
    labels: chartInfo.labels,
    datasets: [
      {
        label: `${fileName} Data`,
        data: chartInfo.values,
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
  };

  const barData = {
    labels: chartInfo.labels,
    datasets: [
      {
        label: `${fileName} Data`,
        data: chartInfo.values,
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const lineData = {
    labels: chartInfo.labels,
    datasets: [
      {
        label: `${fileName} Data`,
        data: chartInfo.values,
        fill: false,
        borderColor: "#742774",
      },
    ],
  };

  const doughnutData = {
    labels: chartInfo.labels,
    datasets: [
      {
        label: `${fileName} Data`,  
        data: chartInfo.values,
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
      },
    ],
  };

  const radarData = {
    labels: chartInfo.labels,
    datasets: [
      {
        label: `${fileName} Data`,
        data: chartInfo.values,
        fill: true,
        backgroundColor: "rgba(179,181,198,0.2)",
        borderColor: "rgba(179,181,198,1)",
        pointBackgroundColor: "rgba(179,181,198,1)",
      },
    ],
  };

  // Otherwise, render the charts overview
  return (
    <div className="bg-white rounded-lg pb-5 shadow h-auto">
        <TopBar />
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Available Charts</h1>
          <p className="text-gray-600 mt-2">Data from: {fileName}</p>
        </div>
        <button 
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          onClick={() => navigate(`/dashboard/files/${id}`)}
        >
          Back to Table
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Pie Chart */}
        <div
          className="cursor-pointer p-4 bg-stone-100 rounded shadow-l hover:shadow-xl 
          hover:scale-105 transition"
          onClick={() => handleChartClick('pie-chart')}
          title="Pie Chart"
        >
          <h2 className="text-xl font-semibold mb-2 text-center">
            View Pie Chart
          </h2>
          <Pie data={pieData} />
        </div>

        {/* Bar Chart */}
        <div
          className="cursor-pointer p-4 bg-stone-100 rounded shadow-l hover:scale-105 
          hover:shadow-xl transition"
          onClick={() => handleChartClick('bar-chart')}
          title="Bar Chart"
        >
          <h2 className="text-xl font-semibold mb-2 text-center">View Bar Chart</h2>
          <Bar data={barData} />
        </div>

        {/* Line Chart */}
        <div
          className="cursor-pointer p-4 bg-stone-100 rounded shadow-l hover:scale-105
          hover:shadow-xl transition"
          onClick={() => handleChartClick('line-chart')}
          title="Line Chart"
        >
          <h2 className="text-xl font-semibold mb-2 text-center">View Line Chart</h2>
          <Line data={lineData} />
        </div>

        {/* Doughnut Chart */}
        <div
          className="cursor-pointer p-4 bg-stone-100 rounded shadow-l hover:scale-105
          hover:shadow-xl transition mt-3"
          onClick={() => handleChartClick('doughnut')}
          title="Doughnut Chart"
        >
          <h2 className="text-xl font-semibold mb-2 text-center">
            View Doughnut Chart
          </h2>
          <Doughnut data={doughnutData} />
        </div>

        {/* Radar Chart */}
        <div
          className="cursor-pointer p-4 bg-stone-100 rounded shadow-l hover:scale-105
          hover:shadow-xl transition mt-3"
          onClick={() => handleChartClick('radar')}
          title="Radar Chart"
        >
          <h2 className="text-xl font-semibold mb-2 text-center">View Radar Chart</h2>
          <Radar data={radarData} />
        </div>
      </div>
    </div>
    </div>
  );
}