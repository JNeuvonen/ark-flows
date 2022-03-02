import { useSelector } from 'react-redux'
import { FundShareCounts } from '../../utils/functions'
import GraphVerticalBar from '../Graph-Bar-Vertical'
import SymbolMiniTitle from '../Symbol-Mini-Title'
import React from 'react'
const SymbolFunds = () => {
  const symbolData = useSelector((state) => state.symbol)
  const { graphData, max } = FundShareCounts(symbolData)
  return (
    <React.Fragment>
      <SymbolMiniTitle title={'Shares By Fund'} />
      <GraphVerticalBar
        graphData={graphData}
        max={max}
        neg={false}
        dataKeyY="Shares"
        title="Shares By Fund"
        color={'#309CC9'}
      />
    </React.Fragment>
  )
}

export default SymbolFunds
