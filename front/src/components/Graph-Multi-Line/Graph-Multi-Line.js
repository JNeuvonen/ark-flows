import { useSelector } from 'react-redux'
import {
  Area,
  ComposedChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import {
  GetGraphDataBasedOnParams,
  ShareFormatter,
  StockPriceFormatter,
} from '../../utils/functions'

const MultiLineGraph = ({ gradient, line }) => {
  const symbolData = useSelector((state) => state.symbol)
  const { graphData, y1Min, y1Max, y2Min, y2Max, customX } =
    GetGraphDataBasedOnParams(symbolData, gradient, line)

  return (
    <ResponsiveContainer height={350}>
      <ComposedChart data={graphData}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="30%" stopColor="blue" stopOpacity={0.6} />
            <stop offset="80%" stopColor="blue" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <XAxis dataKey="x" fontSize={12} ticks={customX} />
        <YAxis
          yAxisId="left"
          orientation="left"
          stroke="grey"
          tickFormatter={ShareFormatter}
          fontSize={12}
          domain={[y1Min * 0.98, y1Max * 1.02]}
          axisLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          type="number"
          stroke="grey"
          tickFormatter={StockPriceFormatter}
          fontSize={12}
          domain={[y2Min * 0.98, y2Max * 1.02]}
          axisLine={false}
        />
        <Tooltip />

        <Area
          strokeWidth={1.5}
          type="monotone"
          yAxisId="left"
          dataKey="y1"
          name="Shares"
          stroke="#334be8"
          fillOpacity={0.5}
          fill="url(#colorUv)"
        ></Area>
        <Line
          type="monotone"
          yAxisId="right"
          dataKey="y2"
          stroke="grey"
          dot={false}
          name="Price"
          strokeWidth={1.5}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default MultiLineGraph
