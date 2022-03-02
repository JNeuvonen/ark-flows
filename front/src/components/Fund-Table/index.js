import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tableHeaders } from '../../utils/constants'
import {
  getLatestTrade,
  getPages,
  getSortedList,
  getTdBasedOnColumn,
} from '../../utils/functions'
import { GetMediaQuery } from '../../utils/hooks'
import {
  BillsAndCoinsIcon,
  CalculatorIcon,
  ChangeIcon,
  ChevronDown,
  ChevronUp,
  CloseIcon,
  FlexBicepIcon,
  HandShakeIcon,
  MarketUpAndDownIcon,
  MenuIcon,
  UnbalanceIcon,
  WeightIcon,
} from '../../utils/icons/returns'
import StateManagement from '../../utils/state-management'
import FundTableBottomInfo from '../Fund-Table-Bottom-Info'
import FundTableMenu from '../Fund-Table-Menu'
const FundTable = ({ filteredSymbols, latestDate }) => {
  //dispatch
  const { updatePage } = StateManagement()

  //hooks
  const navigate = useNavigate()
  const [sortType, setSortType] = useState(null)
  const [page, setPage] = useState(1)
  const [customColumnValue, setCustomColumnValue] = useState(
    'Latest Trade Market Value'
  )

  //constants
  const headers = tableHeaders
  const tableCells = filteredSymbols.slice(20 * (page - 1), 20 * page)
  const pages = getPages(filteredSymbols.length, 20)
  let columns = headers.length - 1
  let customColumns = []

  useEffect(() => {
    //If user changes fund type pagination should reset
    if (page !== 1) {
      let domObjectNew = document.getElementById(`table-pagination-1`)
      let domObjectLast = document.getElementById(`table-pagination-${page}`)
      if (domObjectLast) {
        domObjectLast.classList.remove('pagination-active')
      }
      domObjectNew.classList.add('pagination-active')
      setPage(1)
    }
  }, [filteredSymbols])

  //bp
  let bp = [1200, 1000, 750, 650, 530, 430, 390]

  bp.forEach((item) => {
    if (GetMediaQuery(item)) {
      if (item === 1200) {
        columns -= 2
        customColumns.push('Latest Trade Market Value', 'Overall Share Change')
      } else {
        columns -= 1
        customColumns.push(headers[headers.length - customColumns.length - 1])
      }
    }
  })

  const fmtTh = (col) => {
    return (
      <th
        className="fund__table-wrapper__table__th"
        align="center"
        key={col}
        onClick={(e) => {
          headerOnClick(col)
        }}
      >
        {col}
      </th>
    )
  }

  const headerOnClick = (col) => {
    const reverseSort = sortType ? (col === sortType ? true : false) : false

    filteredSymbols = getSortedList(
      filteredSymbols,
      latestDate,
      col,
      reverseSort
    )

    let newState = col === sortType ? 'rev' : col
    setSortType(newState)
  }

  const handleCustomColumnOpen = () => {
    const domObject = document.getElementsByClassName(
      'fund__table-wrapper__table__th__dropdown'
    )[0]

    domObject.style.display = 'flex'
  }

  const handleCustomColumnClose = () => {
    const domObject = document.getElementsByClassName(
      'fund__table-wrapper__table__th__dropdown'
    )[0]

    domObject.style.display = 'none'
  }

  const customColumn = () => {
    const inlineStyles = { width: 22, height: 22, marginRight: 15 }
    const list = [
      <MarketUpAndDownIcon inlineStyles={inlineStyles}></MarketUpAndDownIcon>,
      <ChangeIcon inlineStyles={inlineStyles}></ChangeIcon>,
      <WeightIcon inlineStyles={inlineStyles}></WeightIcon>,
      <HandShakeIcon inlineStyles={inlineStyles}></HandShakeIcon>,
      <CalculatorIcon inlineStyles={inlineStyles}></CalculatorIcon>,
      <UnbalanceIcon inlineStyles={inlineStyles}></UnbalanceIcon>,
      <FlexBicepIcon inlineStyles={inlineStyles}></FlexBicepIcon>,
      <BillsAndCoinsIcon inlineStyles={inlineStyles}></BillsAndCoinsIcon>,
    ]

    const handleCustomColumnChange = (item) => {
      setCustomColumnValue(item)
      handleCustomColumnClose()
    }

    return (
      <th className="fund__table-wrapper__table__th" align="center">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div onClick={handleCustomColumnOpen}>
            <MenuIcon inlineStyles={{ width: 30, height: 30 }} />
          </div>

          <div
            onClick={() => {
              headerOnClick(customColumnValue)
            }}
          >
            {sortType === 'rev' ? (
              <ChevronDown
                className={'fund__table-wrapper__table__th__chevron-icon'}
              />
            ) : (
              <ChevronUp
                className={'fund__table-wrapper__table__th__chevron-icon'}
              />
            )}
          </div>

          <div className="fund__table-wrapper__table__th__dropdown">
            <div className="fund__table-wrapper__table__th__dropdown__header">
              <h4>Custom Column</h4>
              <div onClick={handleCustomColumnClose}>
                <CloseIcon
                  className={
                    'fund__table-wrapper__table__th__dropdown__header__icon'
                  }
                />
              </div>
            </div>
            {customColumns.map((item, index) => {
              return (
                <div
                  key={item + 'custom'}
                  className="fund__table-wrapper__table__th__dropdown__item"
                  onClick={() => {
                    handleCustomColumnChange(item)
                  }}
                >
                  {list[index]}
                  <div> {item}</div>
                </div>
              )
            })}
          </div>
        </div>
      </th>
    )
  }

  return (
    <React.Fragment>
      <FundTableMenu
        filteredSymbols={filteredSymbols}
        latestDate={latestDate}
      />

      <table className="fund__table-wrapper__table" cellSpacing={0}>
        <thead>
          <tr>
            {headers.map((item, index) => {
              if (index <= columns) {
                return fmtTh(item)
              }
            })}
            {columns !== headers.length - 1 ? customColumn() : null}
          </tr>
        </thead>
        <tbody>
          {tableCells.map((item, index) => {
            const latestTrade = getLatestTrade(item['date'])

            return (
              <tr
                key={index + (page - 1) * 20 + 1}
                className="fund__table-wrapper__table__tr"
                onClick={() => {
                  navigate(`/symbol/${item['symbol']}`)
                  updatePage('symbol')
                }}
              >
                <td align="center">{index + (page - 1) * 20 + 1}</td>
                {getTdBasedOnColumn(item, 'Ticker', latestDate, latestTrade)}
                {getTdBasedOnColumn(item, 'Price', latestDate, latestTrade)}
                {getTdBasedOnColumn(
                  item,
                  'Market Cap',
                  latestDate,
                  latestTrade,
                  columns
                )}

                {getTdBasedOnColumn(
                  item,
                  'Pos. Size',
                  latestDate,
                  latestTrade,
                  columns
                )}
                {getTdBasedOnColumn(
                  item,
                  "ARK's Ownership",
                  latestDate,
                  latestTrade,
                  columns
                )}
                {getTdBasedOnColumn(
                  item,
                  'Fund Count',
                  latestDate,
                  latestTrade,
                  columns
                )}
                {getTdBasedOnColumn(
                  item,
                  'Latest Trade',
                  latestDate,
                  latestTrade,
                  columns
                )}
                {getTdBasedOnColumn(
                  item,
                  'Latest Trade Size',
                  latestDate,
                  latestTrade,
                  columns
                )}
                {getTdBasedOnColumn(
                  item,
                  'Latest Trade Market Value',
                  latestDate,
                  latestTrade,
                  columns
                )}
                {getTdBasedOnColumn(
                  item,
                  'Overall Share Change',
                  latestDate,
                  latestTrade,
                  columns
                )}
                {columns !== headers.length - 1 &&
                  getTdBasedOnColumn(
                    item,
                    customColumnValue,
                    latestDate,
                    latestTrade
                  )}
              </tr>
            )
          })}
        </tbody>
      </table>
      <FundTableBottomInfo
        latestDate={latestDate}
        pages={pages}
        page={page}
        setPage={setPage}
      />
    </React.Fragment>
  )
}

export default FundTable
