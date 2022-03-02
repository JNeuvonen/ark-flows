import React from 'react'
import { useSelector } from 'react-redux'
import { TenLatestTrades } from '../../utils/functions'
import GraphVerticalBar from '../Graph-Bar-Vertical'
import SymbolMiniTitle from '../Symbol-Mini-Title'
const SymbolLatestTrades = () => {
  const symbolData = useSelector((state) => state.symbol)

  const { graphData, max } = TenLatestTrades(symbolData)

  return (
    <React.Fragment>
      <SymbolMiniTitle title={'Recent Trades'} />
      <GraphVerticalBar
        graphData={graphData}
        max={max}
        neg={true}
        dataKeyY="Share Change"
        title="Recent Trades"
      />
    </React.Fragment>
  )
}

export default SymbolLatestTrades
