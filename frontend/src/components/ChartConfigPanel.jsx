// components/ChartConfigPanel.js
import React from 'react';

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
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h3 className="text-xl font-semibold mb-4">Configure Your Chart</h3>
      
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
            💡 Tip: Use text columns for categories (X-axis) and numeric columns for values (Y-axis)
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* X-Axis Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories - X Axis
          </label>
          <select
            value={selectedXAxis}
            onChange={(e) => {
              setSelectedXAxis(e.target.value);
              onAxisChange();
            }}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select column for categories</option>
            {columns.map((column, index) => (
              <option key={index} value={column}>
                {column} {stringColumns.includes(column) ? '(Text)' : numericColumns.includes(column) ? '(Number)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Y-Axis Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Values - Y Axis
          </label>
          <select
            value={selectedYAxis}
            onChange={(e) => {
              setSelectedYAxis(e.target.value);
              onAxisChange();
            }}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select column for values</option>
            {columns.map((column, index) => (
              <option key={index} value={column}>
                {column} {stringColumns.includes(column) ? '(Text)' : numericColumns.includes(column) ? '(Number)' : ''}
              </option>
            ))}
          </select>
          {selectedYAxis && !numericColumns.includes(selectedYAxis) && (
            <p className="text-sm text-amber-600 mt-1">
              ⚠️ Warning: Selected column may contain non-numeric data
            </p>
          )}
        </div>

        {/* Aggregation Selection (for bar/line charts) */}
        {showAggregation && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aggregation Method
            </label>
            <select
              value={aggregation}
              onChange={(e) => {
                setAggregation(e.target.value);
                onAxisChange();
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="sum">Sum</option>
              <option value="average">Average</option>
              <option value="count">Count</option>
              <option value="max">Maximum</option>
              <option value="min">Minimum</option>
            </select>
          </div>
        )}
      </div>

      {/* Generate Chart Button */}
      <div className="mt-6">
        <button
          onClick={onGenerateChart}
          disabled={!selectedXAxis || !selectedYAxis}
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Generate Chart
        </button>
      </div>
    </div>
  );
};
