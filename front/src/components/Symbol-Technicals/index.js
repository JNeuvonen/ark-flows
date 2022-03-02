import React from 'react'
import { useSelector } from 'react-redux'
import { ColorForHeaderValPair } from '../../utils/functions'

const SymbolTechnicals = () => {
  const symbolData = useSelector((state) => state.symbol)
  let helper = Object.entries(symbolData.date)
  const latestData = helper[helper.length - 1][1]
  helper = null

  const tdPair = (header, val, valDefault) => {
    return (
      <React.Fragment>
        <td className="symbol__grid__detailed-info__wrapper__technicals__table__td">
          {header ? header : 'header'}
        </td>
        <td
          className="symbol__grid__detailed-info__wrapper__technicals__table__td"
          style={{
            fontWeight: 'bold',
            color: ColorForHeaderValPair(header, valDefault),
          }}
        >
          {val ? val : 'val'}
        </td>
      </React.Fragment>
    )
  }

  return (
    <div className="symbol__grid__detailed-info__wrapper__technicals">
      <table
        className="symbol__grid__detailed-info__wrapper__technicals__table"
        cellSpacing={0}
      >
        <tbody>
          <tr className="symbol__grid__detailed-info__wrapper__technicals__table__tr">
            {tdPair(
              "ARK's total pos.",
              latestData.dollars.toFixed(3) + 'B',
              latestData.dollars
            )}
            {tdPair(
              'Income',
              latestData.peTTM > 0
                ? (latestData.mcap * (1 / latestData.peTTM)).toFixed(2) + 'B'
                : 'N/A'
            )}
          </tr>
          <tr className="symbol__grid__detailed-info__wrapper__technicals__table__tr">
            {tdPair(
              "ARK's stake",
              (latestData.arkStake * 100).toFixed(3) + '%',
              latestData.arkStake
            )}
            {tdPair(
              'Sales',
              (latestData.mcap * (1 / latestData.psTTM)).toFixed(2) + 'B'
            )}
          </tr>
          <tr className="symbol__grid__detailed-info__wrapper__technicals__table__tr">
            {tdPair(
              'Fund count',
              Object.entries(latestData.fundAllocation).length
            )}
            {tdPair('P/S', latestData.psTTM.toFixed(2))}
          </tr>
          <tr className="symbol__grid__detailed-info__wrapper__technicals__table__tr">
            {tdPair('Last 10 day sells', latestData.last10DaySells)}
            {tdPair('Rev. growth', latestData.revenueGrowthFmt)}
          </tr>
          <tr className="symbol__grid__detailed-info__wrapper__technicals__table__tr">
            {tdPair('Last 10 day buys', latestData.last10DayBuys)}
            {tdPair(
              'Earn. growth',
              latestData.earningsGrowthFmt
                ? latestData.earningsGrowthFmt
                : 'N/A'
            )}
          </tr>
          <tr className="symbol__grid__detailed-info__wrapper__technicals__table__tr">
            {tdPair('Total sells', latestData.totalSells)}
            {tdPair('Gross margin', latestData.grossMarginsFmt)}
          </tr>
          <tr className="symbol__grid__detailed-info__wrapper__technicals__table__tr">
            {tdPair('Total buys', latestData.totalBuys)}
            {tdPair('Insider held', latestData.insidersPercentHeldFmt)}
          </tr>
          <tr className="symbol__grid__detailed-info__wrapper__technicals__table__tr">
            {tdPair(
              'Total shares change',
              (latestData.change.percShareChangeSinceTracking * 100).toFixed(
                2
              ) + '%',
              latestData.change.percShareChangeSinceTracking
            )}
            {tdPair('Inst. Held', latestData.institutionsPercentHeldFmt)}
          </tr>
          <tr className="symbol__grid__detailed-info__wrapper__technicals__table__tr">
            {tdPair(
              'Total pos. change',
              (latestData.change.totalDollarsChange * 100).toFixed(2) + '%',
              latestData.change.totalDollarsChange
            )}
            {tdPair('Empl.', latestData.fullTimeEmployees)}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default SymbolTechnicals
