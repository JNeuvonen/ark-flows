import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const GraphBarHorizontal = ({ graphData, type, x, y, ticks }) => {
  const tickFormatter = (val) => {
    if (type === 'dollarsInvested') {
      return val + 'B'
    }

    return (val * 100).toFixed(1) + '%'
  }

  const toolTipFormatter = (val) => {
    if (type === 'dollarsInvested') {
      return val.toFixed(2) + 'B'
    }

    return (val * 100).toFixed(1) + '%'
  }
  return (
    <ResponsiveContainer width={'100%'} height={200} debounce={50}>
      <BarChart data={graphData}>
        <XAxis
          dataKey={x}
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          dataKey={y}
          axisLine={false}
          tickFormatter={tickFormatter}
          tick={{ fontSize: 12 }}
          ticks={ticks}
        />
        <Tooltip formatter={toolTipFormatter} />
        <Bar
          dataKey={y}
          fill="#939694"
          minPointSize={2}
          barSize={24}
          radius={3}
        >
          {graphData.map((tick) => {
            return <Cell key={tick[y]} />
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default GraphBarHorizontal
