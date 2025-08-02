// hooks/useFileData.js
import { useState, useEffect } from "react";
import { useParams, useLocation, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { axiosInstance } from "../utils/axiosUtil";

export const useFileData = () => {
  const { id } = useParams();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const outletContext = useOutletContext() || {};
  
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [numericColumns, setNumericColumns] = useState([]);
  const [stringColumns, setStringColumns] = useState([]);

  // Analyze column types
  const analyzeColumns = (data, columns) => {
    const numeric = [];
    const strings = [];

    columns.forEach(column => {
      const sampleValues = data
        .slice(0, 20) // Increased sample size for better accuracy
        .map(row => row[column])
        .filter(val => val !== null && val !== undefined && val !== '');

      const numericCount = sampleValues.filter(val => {
        const num = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
        return !isNaN(num) && isFinite(num);
      }).length;

      if (sampleValues.length > 0 && numericCount / sampleValues.length > 0.7) {
        numeric.push(column);
      } else {
        strings.push(column);
      }
    });

    return { numeric, strings };
  };

  useEffect(() => {
    const fetchFileData = async () => {
      // Priority: location state -> outlet context -> API fetch
      const stateFileData = location.state?.fileData;
      const contextFileData = outletContext.fileData;
      
      if (stateFileData) {
        setFileData(stateFileData);
        if (stateFileData.metadata?.columns) {
          const { numeric, strings } = analyzeColumns(stateFileData.data, stateFileData.metadata.columns);
          setNumericColumns(numeric);
          setStringColumns(strings);
        }
        return;
      }
      
      if (contextFileData) {
        setFileData(contextFileData);
        if (contextFileData.metadata?.columns) {
          const { numeric, strings } = analyzeColumns(contextFileData.data, contextFileData.metadata.columns);
          setNumericColumns(numeric);
          setStringColumns(strings);
        }
        return;
      }
      
      if (id && token) {
        try {
          setLoading(true);
          setError(null);
          
          const res = await axiosInstance.get(`/uploads/get-files/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          const fetchedData = res.data;
          setFileData(fetchedData);
          
          if (fetchedData.metadata?.columns) {
            const { numeric, strings } = analyzeColumns(fetchedData.data, fetchedData.metadata.columns);
            setNumericColumns(numeric);
            setStringColumns(strings);
          }
        } catch (error) {
          setError("Failed to fetch file data");
          console.error("File fetch error:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFileData();
  }, [id, location.state, outletContext, token]);

  // Helper function to get filename from various sources
  const getFileName = () => {
    return fileData?.metadata?.filename || 
           location.state?.fileName || 
           outletContext.fileName || 
           'Unknown File';
  };

  // Helper function to parse numeric values consistently
  const parseNumericValue = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    const parsed = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
    return !isNaN(parsed) && isFinite(parsed) ? parsed : 0;
  };

  // Helper function to group data (useful for all chart types)
  const groupData = (xColumn, yColumn, aggregation = 'sum') => {
    if (!fileData?.data || !xColumn || !yColumn) return null;

    const grouped = {};
    let validCount = 0;

    fileData.data.forEach(row => {
      const xValue = String(row[xColumn] || 'Unknown').trim();
      const yValue = parseNumericValue(row[yColumn]);
      
      if (yValue !== 0 || aggregation === 'count') {
        validCount++;
        
        if (!grouped[xValue]) {
          grouped[xValue] = {
            sum: 0,
            count: 0,
            values: []
          };
        }
        
        grouped[xValue].sum += yValue;
        grouped[xValue].count += 1;
        grouped[xValue].values.push(yValue);
      }
    });

    // Apply aggregation
    const result = Object.entries(grouped).map(([label, data]) => {
      let value;
      switch (aggregation) {
        case 'average':
          value = data.sum / data.count;
          break;
        case 'count':
          value = data.count;
          break;
        case 'max':
          value = Math.max(...data.values);
          break;
        case 'min':
          value = Math.min(...data.values);
          break;
        default: // 'sum'
          value = data.sum;
      }
      return [label, value];
    });

    return {
      data: result.sort(([,a], [,b]) => b - a),
      validCount
    };
  };

  return {
    fileData,
    loading,
    error,
    numericColumns,
    stringColumns,
    fileName: getFileName(),
    columns: fileData?.metadata?.columns || [],
    parseNumericValue,
    groupData,
    // Expose raw data for complex operations
    rawData: fileData?.data || []
  };
};
