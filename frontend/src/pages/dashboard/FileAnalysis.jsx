import { useState, useEffect } from "react";
import TopBar from "../../components/Dashboard/dashboard/TopBar";
import { axiosInstance } from "../../utils/axiosUtil";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function FileAnalysis() {
  // get file id from parameters
  const { id } = useParams();
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  //for pegination
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10; 

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get(`/uploads/get-files/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // res returns metadata and fulldata
        setFileData(res.data);
        console.log(res.data);
                
      } catch (error) {
        setError("Failed to fetch file data");
      } finally {
        setLoading(false)
      }
    };
    if (id) fetchFile();
  }, [id]);

  // function that send file data charts/ page
  const handleChartsNavigation = () => {
    navigate(`/dashboard/files/${id}/charts`, {
      fileData: fileData,
      fileId: id,
      fileName: fileData?.metadata?.originalFileName || "Unknow File"
    })
  }

  //pegination
  const startIdx = (currentPage- 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const currentRows = fileData?.data?.slice(startIdx, endIdx)

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if (!fileData) return <p>No data found.</p>

  return (
    <div className="bg-white rounded-lg pb-5 shadow h-auto">
      <TopBar />
      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <div className="relative overflow-x-auto px-4">
            <table className="w-full text-sm text-left text-gray-700 bg-stone-200 shadow-xl">
              <thead className="text-xs uppercase bg-cyan-300 text-gray-800 rounded-2xl ">
                 <tr>
                  {fileData?.metadata?.columns?.map((col, idx) => (
                    <th key={idx} className="px-6 py-3">{col}</th>
                  ))}
                </tr>
              </thead>
             <tbody>
              {currentRows?.map((row, idx) => (
                <tr key={idx} className="bg-white border-b border-stone-300">
                  {fileData.metadata.columns.map((col, i) => (
                    <td key={i} className="px-6 py-3.5 whitespace-nowrap">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            </table>
            
          </div>

            {/* Navigation and Pagination */}
            <div className="flex justify-between mt-4 items-center">
              <div className="flex items-center space-x-2">
                <button 
                  className="px-4 py-2 bg-amber-400 rounded hover:bg-amber-500 transition"
                  onClick={handleChartsNavigation}
                >
                  View Charts
                </button>
                <button 
                  className="px-4 py-2 bg-blue-400 rounded hover:bg-blue-500 transition text-white"
                  onClick={() => navigate("/dashboard/user-files")}
                >
                  Back to Files
                </button>
              </div>
              
              <div className="flex items-center space-x-2 px-4">
                <button
                  className="px-4 py-2 bg-emerald-500 rounded disabled:opacity-50 text-white"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {Math.ceil(fileData?.data?.length / rowsPerPage)}
                </span>
                <button 
                  className="px-4 py-2 bg-emerald-500 rounded disabled:opacity-50 text-white"
                  onClick={() => 
                    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(fileData?.data?.length / rowsPerPage)))
                  }
                  disabled={currentPage === Math.ceil(fileData?.data?.length / rowsPerPage)}
                >
                  Next
                </button>
              </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default FileAnalysis;