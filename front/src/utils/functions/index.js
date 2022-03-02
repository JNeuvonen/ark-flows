import { List } from '@mui/material'
import { specificSearch } from '../../services/returns'
import { ignoreImg } from '../constants'

export function StringPercentToNumber(val) {
  return Number(val.substring(0, val.length - 1))
}

export function AddPlusSignInFront(val, StringPerc) {
  let helper = val
  if (StringPerc) {
    helper = StringPercentToNumber(val)
    if (helper > 0) {
      return '+' + helper + '%'
    }
    return helper + '%'
  }

  if (val > 0) {
    return '+' + val
  }
  return val
}

export function RemoveMinusFromFront(val) {
  let helper = StringPercentToNumber(val)
  if (helper < 0) {
    return val.substring(1, val.length)
  }
  return val
}

export function GetGraphDataBasedOnParams(symbolData, gradient, line) {
  let graphData = []
  const data = Object.entries(symbolData.date)

  let y1Min = Infinity
  let y1Max = -Infinity

  let y2Min = Infinity
  let y2Max = -Infinity

  let customX = [
    data[1][0],
    data[Math.floor(data.length / 2)][0],
    data[data.length - 2][0],
  ]

  for (let i = 0; i < data.length; i++) {
    //Both params found on current tick
    if (data[i][1][gradient] && data[i][1][line]) {
      let tick = {}
      tick['x'] = data[i][0]
      tick['y1'] = data[i][1][gradient]
      tick['y2'] = data[i][1][line]

      y1Min = Math.min(data[i][1][gradient], y1Min)
      y1Max = Math.max(data[i][1][gradient], y1Max)
      y2Min = Math.min(data[i][1][line], y2Min)
      y2Max = Math.max(data[i][1][line], y2Max)

      graphData.push(tick)
    }
  }
  return { graphData, y1Min, y1Max, y2Min, y2Max, customX }
}

export function ShareFormatter(val) {
  if (val > 1000000) {
    return String((val / 1000000).toFixed(1)) + 'm'
  }

  return String((val / 1000).toFixed(1)) + 'k'
}

export function StockPriceFormatter(val) {
  return String(val.toFixed(2)) + '$'
}

export function TenLatestTrades(symbolData) {
  const data = Object.entries(symbolData.date)
  let ret = []
  let max = -Infinity

  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][1]['change']['totalShareCountChange'] !== 0) {
      let tick = {}
      tick['x'] = data[i][0]
      tick['Share Change'] = data[i][1]['change']['totalShareCountChange']
      max = Math.max(Math.abs(tick['Share Change']), max)

      ret.push(tick)

      if (ret.length === 10) {
        break
      }
    }
  }

  return { graphData: ret, max }
}

export function FundShareCounts(symbolData) {
  const data = Object.entries(symbolData.date)
  const funds = Object.entries(data[data.length - 1][1]['fundAllocation'])
  let ret = []
  let max = -Infinity

  for (let i = 0; i < funds.length; i++) {
    let tick = {}
    tick['x'] = funds[i][0]
    tick['Shares'] = funds[i][1].shares
    max = Math.max(max, tick['Shares'])
    ret.push(tick)
  }

  ret.sort(function (a, b) {
    return b['Shares'] - a['Shares']
  })

  return { graphData: ret, max }
}

export function FundAllocation(symbolData) {
  const data = Object.entries(symbolData.date)
  const funds = Object.entries(data[data.length - 1][1]['fundAllocation'])
  let ret = []
  let max = -Infinity

  for (let i = 0; i < funds.length; i++) {
    let tick = {}
    tick['x'] = funds[i][0]
    tick['Allocation'] = StringPercentToNumber(funds[i][1].allocation)
    max = Math.max(max, tick['Allocation'])
    ret.push(tick)
  }

  ret.sort(function (a, b) {
    return b['Allocation'] - a['Allocation']
  })

  return { graphData: ret, max }
}

export function GetEmojiIcon(title) {
  if ('Shares By Fund' === title) {
    return '📊'
  }

  if ('Allocation By Fund' === title) {
    return '⚖️'
  }

  if ('Recent Trades' === title) {
    return '🧭'
  }

  if ('Key Technicals' === title) {
    return '🔍'
  }
}

export function ColorForHeaderValPair(header, val) {
  const defaultVal = 'black'
  const green = '#088a20'

  if (header === "ARK's total pos.") {
    if (val > 1) {
      return green
    }
    return defaultVal
  }

  if (header === "ARK's stake") {
    if (val > 0.07) {
      return green
    }
  }

  if (header === 'Total shares change') {
    if (val > 0) {
      return green
    }
    if (val < 0) {
      return '#910404'
    }
  }

  if (header === 'Total pos. change') {
    if (val > 0) {
      return green
    }
    if (val < 0) {
      return '#910404'
    }
  }

  return defaultVal
}

export function getLatestDate(allSymbols) {
  let latestDate = null

  for (let i = 0; i < allSymbols.length; i++) {
    if (allSymbols[i]['symbol'] === 'TSLA') {
      const dates = Object.entries(allSymbols[i]['date'])
      latestDate = dates[dates.length - 1][0]
      break
    }
  }

  return latestDate
}

export function getFund10BiggestPositions(data, latestDate, x, y, param) {
  let helper = data
  let ret = []

  helper.sort(
    (a, b) =>
      (b['date'][latestDate][param] != null
        ? b['date'][latestDate][param]
        : -Infinity) -
      (a['date'][latestDate][param] != null
        ? a['date'][latestDate][param]
        : -Infinity)
  )

  for (let i = 0; i < 10; i++) {
    let tick = {}
    tick[x] = helper[i]['symbol']
    tick[y] = helper[i]['date'][latestDate][param]
    ret.push(tick)
  }

  return ret
}

export function getFilteredSymbols(
  allSymbols,
  fund,
  latestDate,
  posSizeLow,
  posSizeHigh,
  ownershipLow,
  ownershipHigh,
  fundCountLow,
  fundCountHigh,
  microMcapLow,
  microMcapHigh,
  mediumMcapLow,
  mediumMcapHigh,
  largeMcapLow,
  largeMcapHigh,
  megaMcapLow,
  megaMcapHigh
) {
  let helper = []

  const getUserFilters = (val, low, high) => {
    //=== null on purpose
    if (low === null || high === null) {
      return true
    }

    if (val < low || val > high) {
      return false
    }

    return true
  }

  for (let i = 0; i < allSymbols.length; i++) {
    if (!allSymbols[i]) {
      continue
    }

    if (
      allSymbols[i]['symbol'] === '6301' ||
      allSymbols[i]['symbol'] === '2618'
    ) {
      continue
    }

    if (!allSymbols[i]['date']) {
      continue
    }

    if (!allSymbols[i]['date'][latestDate]) {
      continue
    }

    if (!allSymbols[i]['date'][latestDate]['fundAllocation']) {
      continue
    }

    if (
      !getUserFilters(
        allSymbols[i]['date'][latestDate]['dollars'],
        posSizeLow,
        posSizeHigh
      )
    ) {
      continue
    }

    if (
      !getUserFilters(
        allSymbols[i]['date'][latestDate]['arkStake'],
        ownershipLow,
        ownershipHigh
      )
    ) {
      continue
    }

    if (
      !getUserFilters(
        getFundCount(allSymbols[i]['date'][latestDate]['fundAllocation']),
        fundCountLow,
        fundCountHigh
      )
    ) {
      continue
    }

    if (
      microMcapLow ||
      microMcapHigh ||
      mediumMcapLow ||
      mediumMcapHigh ||
      largeMcapLow ||
      largeMcapHigh ||
      megaMcapLow ||
      megaMcapHigh
    ) {
      const microMcapFilter =
        microMcapLow || microMcapHigh
          ? getUserFilters(
              allSymbols[i]['date'][latestDate]['mcap'],
              microMcapLow,
              microMcapHigh
            )
          : false

      const mediumMcapFilter =
        mediumMcapLow || mediumMcapHigh
          ? getUserFilters(
              allSymbols[i]['date'][latestDate]['mcap'],
              mediumMcapLow,
              mediumMcapHigh
            )
          : false

      const largeMcapFilter =
        largeMcapLow || largeMcapHigh
          ? getUserFilters(
              allSymbols[i]['date'][latestDate]['mcap'],
              largeMcapLow,
              largeMcapHigh
            )
          : false

      const megaMcapFilter =
        megaMcapLow || megaMcapHigh
          ? getUserFilters(
              allSymbols[i]['date'][latestDate]['mcap'],
              megaMcapLow,
              megaMcapHigh
            )
          : false

      if (
        (!microMcapFilter &&
          !mediumMcapFilter &&
          !largeMcapFilter &&
          !megaMcapFilter) ||
        !allSymbols[i]['date'][latestDate]['mcap']
      ) {
        continue
      }
    }

    if (
      !allSymbols[i]['date'][latestDate]['fundAllocation'][
        fund.toUpperCase()
      ] &&
      fund !== 'combined'
    ) {
      continue
    }

    helper.push(allSymbols[i])
  }

  helper.sort(
    (a, b) =>
      (b['date'][latestDate]['dollars'] != null
        ? b['date'][latestDate]['dollars']
        : -Infinity) -
      (a['date'][latestDate]['dollars'] != null
        ? a['date'][latestDate]['dollars']
        : -Infinity)
  )

  return helper
}

export function getFundCount(fundAllocation) {
  return Object.entries(fundAllocation).length
}

export function getLatestTrade(datesDict) {
  const dates = Object.entries(datesDict)

  //i >= 1 on purpose
  for (let i = dates.length - 1; i >= 1; i--) {
    if (dates[i][1]['change']['totalShareChangePercent'] !== 0) {
      const ret = dates[i][1]['change']['totalShareChangePercent']
      const direction = ret > 0 ? 'Buy' : 'Sell'
      const date = dates[i][0]

      let dollars = null
      if (dates[i][1]['stockPrice']) {
        dollars =
          (Math.abs(dates[i][1]['change']['totalShareCountChange']) *
            dates[i][1]['stockPrice']) /
          1000000
      }

      return { ret, date, direction, dollars }
    }
  }

  return null
}

export function getFundAum(symbols, latestDate) {
  let marketValue = 0
  let sells = 0
  let buys = 0
  let valueOfSells = 0
  let valueOfBuys = 0

  for (let i = 0; i < symbols.length; i++) {
    marketValue += symbols[i]['date'][latestDate]['dollars']
    if (symbols[i]['date'][latestDate]['change']['totalShareCountChange'] < 0) {
      sells += 1
      if (symbols[i]['date'][latestDate]['stockPrice']) {
        valueOfSells +=
          symbols[i]['date'][latestDate]['stockPrice'] *
          Math.abs(
            symbols[i]['date'][latestDate]['change']['totalShareCountChange']
          )
      }
    }

    if (symbols[i]['date'][latestDate]['change']['totalShareCountChange'] > 0) {
      buys += 1

      if (symbols[i]['date'][latestDate]['stockPrice']) {
        valueOfBuys +=
          symbols[i]['date'][latestDate]['stockPrice'] *
          symbols[i]['date'][latestDate]['change']['totalShareCountChange']
      }
    }
  }

  valueOfSells = valueOfSells / 1000000
  valueOfBuys = valueOfBuys / 1000000

  return {
    marketValue: marketValue.toFixed(2),
    sells: sells,
    buys: buys,
    valueOfSells: valueOfSells.toFixed(2),
    valueOfBuys: valueOfBuys.toFixed(2),
  }
}

export function getGreenOrRedColor(val) {
  if (val > 0) {
    return '#00c928'
  }

  if (val < 0) {
    return '#910404'
  }

  return 'black'
}

export function getSortedList(list, latestDate, sort, reverse) {
  let column = null

  if (sort === 'Nr.') {
    return list.reverse()
  }

  if (sort === 'Price') {
    column = 'stockPrice'
  }

  if (sort === 'Market Cap') {
    column = 'mcap'
  }

  if (sort === 'Pos. Size') {
    column = 'dollars'
  }

  if (sort === "ARK's Ownership") {
    column = 'arkStake'
  }

  function compare(a, b) {
    if (sort === 'Ticker') {
      if (a['symbol'] < b['symbol']) {
        return reverse ? 1 : -1
      }
      if (a['symbol'] > b['symbol']) {
        return reverse ? -1 : 1
      }
      return 0
    } else if (sort === 'Fund Count') {
      if (
        getFundCount(a['date'][latestDate]['fundAllocation']) <
        getFundCount(b['date'][latestDate]['fundAllocation'])
      ) {
        return reverse ? -1 : 1
      }
      if (
        getFundCount(a['date'][latestDate]['fundAllocation']) >
        getFundCount(b['date'][latestDate]['fundAllocation'])
      ) {
        return reverse ? 1 : -1
      }
      return 0
    } else if (sort === 'Latest Trade') {
      if (
        new Date(getLatestTrade(a['date'])['date']) <
        new Date(getLatestTrade(b['date'])['date'])
      ) {
        return reverse ? -1 : 1
      }
      if (
        new Date(getLatestTrade(a['date'])['date']) >
        new Date(getLatestTrade(b['date'])['date'])
      ) {
        return reverse ? 1 : -1
      }
      return 0
    } else if (sort === 'Latest Trade Size') {
      if (getLatestTrade(a['date'])['ret'] < getLatestTrade(b['date'])['ret']) {
        return reverse ? -1 : 1
      }
      if (getLatestTrade(a['date'])['ret'] > getLatestTrade(b['date'])['ret']) {
        return reverse ? 1 : -1
      }
      return 0
    } else if (sort === 'Latest Trade Market Value') {
      if (
        getLatestTrade(a['date'])['dollars'] <
        getLatestTrade(b['date'])['dollars']
      ) {
        return reverse ? -1 : 1
      }
      if (
        getLatestTrade(a['date'])['dollars'] >
        getLatestTrade(b['date'])['dollars']
      ) {
        return reverse ? 1 : -1
      }
      return 0
    } else if (sort === 'Overall Share Change') {
      if (
        a['date'][latestDate]['change']['percShareChangeSinceTracking'] <
        b['date'][latestDate]['change']['percShareChangeSinceTracking']
      ) {
        return reverse ? -1 : 1
      }
      if (
        a['date'][latestDate]['change']['percShareChangeSinceTracking'] >
        b['date'][latestDate]['change']['percShareChangeSinceTracking']
      ) {
        return reverse ? 1 : -1
      }
      return 0
    } else {
      if (a['date'][latestDate][column] < b['date'][latestDate][column]) {
        return reverse ? -1 : 1
      }
      if (a['date'][latestDate][column] > b['date'][latestDate][column]) {
        return reverse ? 1 : -1
      }
      return 0
    }
  }

  return list.sort(compare)
}

export function getAumEntry(allSymbols) {
  for (let i = 0; i < allSymbols.length; i++) {
    if (allSymbols[i]['symbol'] === 'aumEntry') {
      return allSymbols[i]
    }
  }

  return null
}

export function getAumChange(data, fundType) {
  const dates = Object.entries(data['date'])

  if (fundType === 'All Funds Combined') {
    return dates[dates.length - 1][1]['change']['totalAumChange']
  }

  return dates[dates.length - 1][1]['change'][
    `aumChange${
      fundType.charAt(0).toUpperCase() + fundType.slice(1).toLowerCase()
    }`
  ]
}

export function getPages(items, itemsPerPage) {
  const pageCount = items / itemsPerPage + 1
  let pages = []
  for (let i = 1; i < pageCount; i++) {
    pages.push(i)
  }
  return pages
}

export function getTdBasedOnColumn(
  item,
  columnName,
  latestDate,
  latestTrade,
  columns
) {
  const ignoreIgm = ignoreImg
  const fmtTd = (val, decimals, extra, color) => {
    if (!extra) {
      extra = ''
    }

    if (val === undefined || !val) {
      return (
        <td align="center" key={'N/A' + item['symbol'] + columnName}>
          N/A
        </td>
      )
    }

    if (color) {
      color = getGreenOrRedColor(val)
    }

    return (
      <td
        align="center"
        style={{ color: color }}
        className="fund__table-wrapper__table__td"
      >
        {decimals ? val.toFixed(decimals) + extra : val + extra}
      </td>
    )
  }

  const imageCell = (val, companyUrl) => {
    if (ignoreIgm.includes(val)) {
      return (
        <td align="center" className="fund__table-wrapper__image-cell">
          <div className="fund__table-wrapper__table__flex-wrap">
            <div></div>
            <span>{val}</span>
          </div>
        </td>
      )
    }
    return (
      <td align="center">
        <div className="fund__table-wrapper__table__flex-wrap">
          <img
            src={`https://logo.clearbit.com/${companyUrl}`}
            alt="companyLogo"
            className="fund__table-wrapper__table__flex-wrap__td-logo"
          ></img>
          <span className="fund__table-wrapper__table__flex-wrap__td-value">
            {val}
          </span>
        </div>
      </td>
    )
  }

  if (columnName === 'Ticker') {
    return imageCell(item['symbol'], item['companyUrl'])
  }

  if (columnName === 'Price') {
    return fmtTd(item['date'][latestDate]['stockPrice'], 2, '$')
  }

  if (columnName === 'Market Cap') {
    if (columns) {
      return columns > 2
        ? fmtTd(item['date'][latestDate]['mcap'], 2, 'B')
        : null
    }

    return fmtTd(item['date'][latestDate]['mcap'], 2, 'B')
  }

  if (columnName === 'Pos. Size') {
    if (columns) {
      return columns > 3
        ? fmtTd(item['date'][latestDate]['dollars'], 3, 'B')
        : null
    }
    return fmtTd(item['date'][latestDate]['dollars'], 3, 'B')
  }

  if (columnName === "ARK's Ownership") {
    if (columns) {
      return columns > 4
        ? fmtTd(item['date'][latestDate]['arkStake'] * 100, 2, '%')
        : null
    }
    return fmtTd(item['date'][latestDate]['arkStake'] * 100, 2, '%')
  }

  if (columnName === 'Fund Count') {
    if (columns) {
      return columns > 5
        ? fmtTd(getFundCount(item['date'][latestDate]['fundAllocation']))
        : null
    }
    return fmtTd(getFundCount(item['date'][latestDate]['fundAllocation']))
  }
  if (columnName === 'Latest Trade') {
    if (columns) {
      return columns > 6 ? fmtTd(latestTrade['date']) : null
    }
    return fmtTd(latestTrade['date'])
  }
  if (columnName === 'Latest Trade Size') {
    if (columns) {
      return columns > 7 ? fmtTd(latestTrade['ret'] * 100, 2, '%', true) : null
    }
    return fmtTd(latestTrade['ret'] * 100, 2, '%', true)
  }
  if (columnName === 'Latest Trade Market Value') {
    if (columns) {
      return columns === 10 ? fmtTd(latestTrade['dollars'], 2, 'M') : null
    }

    return fmtTd(latestTrade['dollars'], 2, 'M')
  }

  if (columnName === 'Overall Share Change') {
    if (columns) {
      return columns === 10
        ? fmtTd(
            item['date'][latestDate]['change']['percShareChangeSinceTracking'] *
              100,
            2,
            '%',
            true
          )
        : null
    }

    return fmtTd(
      item['date'][latestDate]['change']['percShareChangeSinceTracking'] * 100,
      2,
      '%',
      true
    )
  }
}
