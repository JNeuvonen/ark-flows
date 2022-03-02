import { getFund10BiggestPositions } from '../../utils/functions'
import React from 'react'
import GraphBarHorizontal from '../Graph-Bar-Horizontal'

const FundBiggestStakes = ({ filteredSymbols, latestDate }) => {
  const tenBiggestStakes = getFund10BiggestPositions(
    filteredSymbols,
    latestDate,
    'Symbol',
    'Stake',
    'arkStake'
  )

  return (
    <React.Fragment>
      <GraphBarHorizontal
        graphData={tenBiggestStakes}
        type={'stake'}
        x={'Symbol'}
        y={'Stake'}
        ticks={[0.1]}
      />
    </React.Fragment>
  )
}

export default FundBiggestStakes
