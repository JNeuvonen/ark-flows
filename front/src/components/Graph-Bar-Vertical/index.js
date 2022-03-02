import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { GetEmojiIcon } from '../../utils/functions'

const GraphLatestTrades = ({ graphData, neg, dataKeyY, title, max, color }) => {
  //Vars
  const BAR_AXIS_SPACE = title === 'Allocation By Fund' ? 30 : 5
  let ctx
  const emoji = GetEmojiIcon(title)
  const toolTipFormatter = (val) => {
    if (title === 'Allocation By Fund') {
      return val + '%'
    }

    if (title === 'Shares By Fund') {
      if (val > 1000000) {
        return String((val / 1000000).toFixed(2)) + 'm'
      }

      return String((val / 1000).toFixed(1)) + 'k'
    }

    return val
  }

  const measureText14HelveticaNeue = (text) => {
    if (!ctx) {
      ctx = document.createElement('canvas').getContext('2d')
      ctx.font = "14px 'Helvetica Neue"
    }

    return ctx.measureText(text).width
  }

  const maxTextWidth = useMemo(
    () =>
      graphData.reduce((acc, cur) => {
        const value = cur[dataKeyY]
        const width = measureText14HelveticaNeue(value.toLocaleString())
        if (width > acc) {
          return width
        }
        return acc
      }, 0),
    [graphData, dataKeyY]
  )

  const YAxisRightFormatter = (val) => {
    if (title === 'Allocation By Fund') {
      return val + '%'
    }

    if (title === 'Shares By Fund') {
      if (val > 1000000) {
        return String((val / 1000000).toFixed(2)) + 'm'
      }

      return String((val / 1000).toFixed(1)) + 'k'
    }
  }

  return (
    <ResponsiveContainer
      width={'100%'}
      height={50 * graphData.length}
      debounce={50}
    >
      <BarChart
        data={graphData}
        layout="vertical"
        margin={
          neg
            ? { left: 10 }
            : { left: 10, right: maxTextWidth + (BAR_AXIS_SPACE - 8) }
        }
      >
        {neg ? (
          <XAxis
            dataKey={dataKeyY}
            hide
            type="number"
            domain={[max * 0.98, max * 0.98]}
          />
        ) : (
          <XAxis dataKey={dataKeyY} type="number" hide domain={[0, max]} />
        )}
        {neg ? (
          <YAxis
            yAxisId={0}
            dataKey="x"
            axisLine={false}
            tickLine={false}
            orientation="left"
            tick={{ fill: 'black' }}
            fontSize={12}
            fontWeight="bold"
            type="category"
          />
        ) : (
          <YAxis
            yAxisId={0}
            dataKey="x"
            axisLine={false}
            tickLine={false}
            type="category"
            fontWeight="bold"
            fontSize={15}
            orientation="left"
            fontStyle={'string'}
          />
        )}

        {neg ? null : (
          <YAxis
            dataKey={dataKeyY}
            yAxisId={1}
            axisLine={false}
            tickLine={false}
            type="category"
            fontSize={15}
            fontWeight="bold"
            orientation="right"
            tick={{
              transform: `translate(${maxTextWidth + BAR_AXIS_SPACE}, 0)`,
            }}
            tickFormatter={YAxisRightFormatter}
            mirror
          />
        )}

        <Tooltip wrapperStyle={{ fontSize: 15 }} formatter={toolTipFormatter} />
        <Bar dataKey={dataKeyY} minPointSize={2} barSize={18} radius={5}>
          {graphData.map((tick, index) => {
            if (neg) {
              if (tick[dataKeyY] > 0) {
                return (
                  <Cell
                    key={tick[dataKeyY]}
                    fill={'#32b51b'}
                    wrapperStyle={{ zIndex: 1 }}
                  ></Cell>
                )
              }
              return <Cell key={tick[dataKeyY]} fill={'#910404'}></Cell>
            }

            return <Cell key={tick[dataKeyY]} fill={color}></Cell>
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default GraphLatestTrades
