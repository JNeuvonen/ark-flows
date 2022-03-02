import React from 'react'
import { getFund10BiggestPositions } from '../../utils/functions'
import GraphBarHorizontal from '../Graph-Bar-Horizontal'

const FundBiggestPositions = ({ filteredSymbols, latestDate }) => {
  const tenBiggestPositions = getFund10BiggestPositions(
    filteredSymbols,
    latestDate,
    'Symbol',
    'Pos. Size',
    'dollars'
  )

  return (
    <React.Fragment>
      <GraphBarHorizontal
        graphData={tenBiggestPositions}
        type={'dollarsInvested'}
        x={'Symbol'}
        y={'Pos. Size'}
        ticks={[1]}
      />
    </React.Fragment>
  )
}

export default FundBiggestPositions
