import React from 'react';
import { FiInfo, FiAlertTriangle, FiBarChart2, FiHash, FiType } from 'react-icons/fi';

export const ChartConfigPanel = ({ 
  columns, 
  numericColumns, 
  stringColumns,
  selectedXAxis, 
  setSelectedXAxis,
  selectedYAxis, 
  setSelectedYAxis,
  onAxisChange,
  onGenerateChart,
  aggregation = 'sum',
  setAggregation,
  showAggregation = false
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <FiBarChart2 className="text-blue-500" />
        Chart Configuration
      </h2>
      
      {/* Column Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        
        {/* Text Columns */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="flex items-center mb-3">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <FiType className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-medium text-purple-800">Text Columns</h4>
          </div>
          {stringColumns.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {stringColumns.map((col, index) => (
                <span 
                  key={index}
                  className={`px-3 py-1 text-sm rounded-full flex items-center ${
                    selectedXAxis === col 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer'
                  }`}
                  onClick={() => {
                    setSelectedXAxis(col);
                    onAxisChange();
                  }}
                >
                  {col}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-purple-600">No text columns detected</p>
          )}
        </div>
        {/* Numeric Columns */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <FiHash className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-medium text-blue-800">Numeric Columns</h4>
          </div>
          {numericColumns.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {numericColumns.map((col, index) => (
                <span 
                  key={index}
                  className={`px-3 py-1 text-sm rounded-full flex items-center ${
                    selectedYAxis === col 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer'
                  }`}
                  onClick={() => {
                    setSelectedYAxis(col);
                    onAxisChange();
                  }}
                >
                  {col}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-blue-600">No numeric columns detected</p>
          )}
        </div>


      </div>

      {/* Tip Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start">
        <FiInfo className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-yellow-800 mb-1">Charting Tip</h4>
          <p className="text-yellow-700 text-sm">
            Use <span className="font-semibold">text columns</span> for categories (X-axis) and 
            <span className="font-semibold"> numeric columns</span> for values (Y-axis)
          </p>
        </div>
      </div>

      {/* Dropdown Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* X-Axis Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Column (X-Axis)
          </label>
          <select
            value={selectedXAxis}
            onChange={(e) => {
              setSelectedXAxis(e.target.value);
              onAxisChange();
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select category column</option>
            {columns.map((column, index) => (
              <option key={index} value={column}>
                {column} {stringColumns.includes(column) && '(Text)'}
              </option>
            ))}
          </select>
        </div>

        {/* Y-Axis Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value Column (Y-Axis)
          </label>
          <select
            value={selectedYAxis}
            onChange={(e) => {
              setSelectedYAxis(e.target.value);
              onAxisChange();
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select value column</option>
            {columns.map((column, index) => (
              <option key={index} value={column}>
                {column} {numericColumns.includes(column) && '(Number)'}
              </option>
            ))}
          </select>
          {selectedYAxis && !numericColumns.includes(selectedYAxis) && (
            <div className="mt-2 flex items-center text-sm text-amber-600">
              <FiAlertTriangle className="mr-1" />
              Warning: Selected column may contain non-numeric data
            </div>
          )}
        </div>
      </div>

      {/* Aggregation Selection */}
      {showAggregation && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aggregation Method
          </label>
          <select
            value={aggregation}
            onChange={(e) => {
              setAggregation(e.target.value);
              onAxisChange();
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="sum">Sum</option>
            <option value="average">Average</option>
            <option value="count">Count</option>
            <option value="max">Maximum</option>
            <option value="min">Minimum</option>
          </select>
        </div>
      )}

      {/* Generate Chart Button */}
      <div className="mt-6">
        <button
          onClick={onGenerateChart}
          disabled={!selectedXAxis || !selectedYAxis}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all ${
            !selectedXAxis || !selectedYAxis
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow hover:shadow-md'
          }`}
        >
          Generate Chart
        </button>
      </div>
    </div>
  );
};