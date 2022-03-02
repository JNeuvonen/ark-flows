import { useSelector } from 'react-redux'
import { FundAllocation } from '../../utils/functions'
import GraphVerticalBar from '../Graph-Bar-Vertical'
import SymbolMiniTitle from '../Symbol-Mini-Title'
import React from 'react'
const SymbolFundsAllocation = () => {
  const symbolData = useSelector((state) => state.symbol)
  const { graphData, max } = FundAllocation(symbolData)
  return (
    <React.Fragment>
      <SymbolMiniTitle title={'Allocation By Fund'} />
      <GraphVerticalBar
        graphData={graphData}
        max={max}
        neg={false}
        dataKeyY="Allocation"
        title="Allocation By Fund"
        color={'#91a8f2'}
      />
    </React.Fragment>
  )
}

export default SymbolFundsAllocation
