import { useState } from 'react'

const ChartTypes = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie'
}

export default function InteractiveChart({
  data,
  type = ChartTypes.LINE,
  title,
  height = 300,
  showLegend = true
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('1M')
  const [chartType, setChartType] = useState(type)

  const periods = [
    { key: '1W', label: '1 Week' },
    { key: '1M', label: '1 Month' },
    { key: '3M', label: '3 Months' },
    { key: '1Y', label: '1 Year' }
  ]

  // Sample data for different chart types
  const getChartData = () => {
    switch (chartType) {
      case ChartTypes.LINE:
        return [
          { date: 'Jan', value: 3200, category: 'Income' },
          { date: 'Feb', value: 3100, category: 'Income' },
          { date: 'Mar', value: 3400, category: 'Income' },
          { date: 'Apr', value: 3300, category: 'Income' },
          { date: 'May', value: 3600, category: 'Income' },
          { date: 'Jun', value: 3500, category: 'Income' }
        ]
      case ChartTypes.BAR:
        return [
          { category: 'Housing', value: 1920, color: '#3B82F6' },
          { category: 'Food', value: 640, color: '#10B981' },
          { category: 'Transport', value: 640, color: '#F59E0B' },
          { category: 'Entertainment', value: 640, color: '#8B5CF6' },
          { category: 'Utilities', value: 320, color: '#EF4444' }
        ]
      case ChartTypes.PIE:
        return [
          { label: 'Checking', value: 8420, color: '#3B82F6' },
          { label: 'Savings', value: 32800, color: '#10B981' },
          { label: 'Credit', value: 740, color: '#F59E0B' }
        ]
      default:
        return data || []
    }
  }

  const renderLineChart = () => {
    const chartData = getChartData()
    const maxValue = Math.max(...chartData.map(d => d.value))
    const minValue = Math.min(...chartData.map(d => d.value))
    const range = maxValue - minValue

    return (
      <div className="relative w-full h-full p-4">
        <div className="flex items-end justify-between h-full">
          {chartData.map((point, i) => {
            const height = ((point.value - minValue) / range) * 100
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="relative group">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600 cursor-pointer"
                    style={{
                      height: `${Math.max(height, 5)}%`,
                      minHeight: '20px'
                    }}
                    onMouseEnter={() => setHoveredPoint({ ...point, index: i })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* Hover tooltip */}
                  {hoveredPoint && hoveredPoint.index === i && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg text-sm z-10 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {point.date}
                      </div>
                      <div className="text-blue-600 dark:text-blue-400">
                        ${point.value.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                  {point.date}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderBarChart = () => {
    const chartData = getChartData()
    const maxValue = Math.max(...chartData.map(d => d.value))

    return (
      <div className="flex items-end justify-between h-full space-x-2 px-4">
        {chartData.map((bar, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="relative group">
              <div
                className="w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer"
                style={{
                  height: `${(bar.value / maxValue) * 100}%`,
                  backgroundColor: bar.color,
                  minHeight: '20px'
                }}
                onMouseEnter={() => setHoveredPoint(bar)}
                onMouseLeave={() => setHoveredPoint(null)}
              />

              {/* Hover tooltip */}
              {hoveredPoint === bar && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg text-sm z-10 whitespace-nowrap">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {bar.category}
                  </div>
                  <div className="text-center" style={{ color: bar.color }}>
                    ${bar.value.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
              {bar.category}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderPieChart = () => {
    const chartData = getChartData()
    const total = chartData.reduce((sum, item) => sum + item.value, 0)

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative w-32 h-32">
          {chartData.map((slice, i) => {
            const percentage = slice.value / total
            const angle = percentage * 360
            const startAngle = chartData.slice(0, i).reduce((sum, item) => sum + (item.value / total) * 360, 0)

            return (
              <div
                key={i}
                className="absolute inset-0 rounded-full border-8 border-transparent"
                style={{
                  borderTopColor: slice.color,
                  transform: `rotate(${startAngle}deg)`,
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(angle * Math.PI / 180)}% ${50 + 50 * Math.sin(angle * Math.PI / 180)}%, 50% 50%)`
                }}
                onMouseEnter={() => setHoveredPoint(slice)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            )
          })}

          {/* Center circle */}
          <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                ${total.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
            </div>
          </div>
        </div>

        {/* Hover tooltip */}
        {hoveredPoint && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg text-sm z-10 text-center">
            <div className="font-medium text-gray-900 dark:text-white">
              {hoveredPoint.label}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              ${hoveredPoint.value.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {((hoveredPoint.value / total) * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderChart = () => {
    try {
      switch (chartType) {
        case ChartTypes.LINE:
          return renderLineChart()
        case ChartTypes.BAR:
          return renderBarChart()
        case ChartTypes.PIE:
          return renderPieChart()
        default:
          return renderLineChart()
      }
    } catch (error) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <div className="text-lg font-medium">Chart Error</div>
            <div className="text-sm">Unable to render chart</div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="flex items-center gap-4">
        {/* Chart type selector */}
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 p-1">
          {Object.values(ChartTypes).map((chartTypeOption) => (
            <button
              key={chartTypeOption}
              onClick={() => setChartType(chartTypeOption)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${chartType === chartTypeOption
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              {chartTypeOption.charAt(0).toUpperCase() + chartTypeOption.slice(1)}
            </button>
          ))}
        </div>

        {/* Period selector */}
        <div className="flex rounded-sm border border-gray-200 dark:border-gray-600 p-1">
          {periods.map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${selectedPeriod === period.key
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 relative">
        {renderChart()}
      </div>

      {showLegend && chartType === ChartTypes.PIE && (
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {getChartData().map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
