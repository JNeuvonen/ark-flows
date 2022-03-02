import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAumChange, getAumEntry, getFundAum } from '../../utils/functions'
import { GetMediaQuery } from '../../utils/hooks'
import {
  BarsIcon,
  CompanyIcon,
  DownIcon,
  GeneEditingIcon,
  LoseMoneyIcon,
  MarketValueIcon,
  SellIcon,
  TradeIcon,
  UpIcon,
} from '../../utils/icons/returns'
const FundTableMenu = ({ filteredSymbols, latestDate }) => {
  const allSymbols = useSelector((state) => state.allSymbols)
  const aumEntry = getAumEntry(allSymbols)
  const under700 = GetMediaQuery(700)
  const under500 = GetMediaQuery(500)

  let { fund } = useParams()

  fund = fund === 'combined' ? 'All Funds Combined' : fund.toUpperCase()
  const aumChange = getAumChange(aumEntry, fund)

  const { marketValue, sells, buys, valueOfSells, valueOfBuys } = getFundAum(
    filteredSymbols,
    latestDate
  )

  const filtersOnClick = (e) => {
    e.preventDefault()

    const selector = document.getElementsByClassName(
      'fund__table-wrapper__side-bar'
    )[0].style

    if (selector.width === '15%') {
      selector.width = '0'
    } else {
      if (under700) {
        selector.width = '50%'
      } else if (under500) {
        selector.width = '75%'
      } else {
        selector.width = '15%'
      }
    }
  }

  const iconHeight = 17
  const iconWidth = 17
  const marginRight = 5

  return (
    <React.Fragment>
      <div className="flex-wrapper">
        {!under700 ? (
          <BarsIcon
            className={'fund__table-wrapper__table-menu__icon-bars'}
            onClickFunction={filtersOnClick}
          />
        ) : null}
        <div className="fund__table-wrapper__table-menu">
          <div className="fund__table-wrapper__table-menu__card">
            {fund !== 'All Funds Combined' ? 'Fund' : ''}
            {fund !== 'All Funds Combined' ? (
              <div className="fund__table-wrapper__table-menu__card__icon-box">
                <GeneEditingIcon
                  inlineStyles={{
                    width: iconWidth,
                    height: iconHeight,
                    marginRight: marginRight,
                  }}
                  fund={fund}
                />
                <p>{fund}</p>
              </div>
            ) : (
              fund
            )}
          </div>
          <div className="fund__table-wrapper__table-menu__card">
            <p className="fund__table-wrapper__table-menu__card__header">
              Companies
            </p>

            <div className="fund__table-wrapper__table-menu__card__icon-box">
              <CompanyIcon
                inlineStyles={{
                  width: iconWidth,
                  height: iconHeight,
                  marginRight: marginRight,
                }}
              />
              <p>{filteredSymbols.length}</p>
            </div>
          </div>
          <div className="fund__table-wrapper__table-menu__card">
            AUM
            <div className="fund__table-wrapper__table-menu__card__icon-box">
              <MarketValueIcon
                inlineStyles={{
                  width: iconWidth,
                  height: iconHeight,
                  marginRight: marginRight,
                }}
              />
              <p> {marketValue}B</p>
            </div>
          </div>
          <div className="fund__table-wrapper__table-menu__card">
            Change in AUM
            <div className="fund__table-wrapper__table-menu__card__icon-box">
              <LoseMoneyIcon
                inlineStyles={{
                  width: iconWidth,
                  height: iconHeight,
                  marginRight: marginRight,
                }}
              />
              <p> {aumChange.toFixed(2)}B</p>
            </div>
          </div>
          <div className="fund__table-wrapper__table-menu__card">
            Sells
            <div className="fund__table-wrapper__table-menu__card__icon-box">
              <DownIcon
                inlineStyles={{
                  width: 12,
                  height: 12,
                  fill: 'red',
                  marginRight: marginRight,
                }}
              />
              <p>{sells}</p>
            </div>
          </div>
          <div className="fund__table-wrapper__table-menu__card">
            Buys
            <div className="fund__table-wrapper__table-menu__card__icon-box">
              <UpIcon
                inlineStyles={{
                  width: 12,
                  height: 12,
                  fill: 'green',
                  marginRight: marginRight,
                }}
              />
              <p>{buys}</p>
            </div>
          </div>

          <div className="fund__table-wrapper__table-menu__card">
            Value of Sells
            <div className="fund__table-wrapper__table-menu__card__icon-box">
              <SellIcon
                inlineStyles={{
                  width: iconWidth,
                  height: iconHeight,
                  marginRight: marginRight,
                }}
              />
              <p> {valueOfSells}M</p>
            </div>
          </div>

          <div className="fund__table-wrapper__table-menu__card">
            Value of Buys
            <div className="fund__table-wrapper__table-menu__card__icon-box">
              <TradeIcon
                inlineStyles={{
                  width: iconWidth,
                  height: iconHeight,
                  marginRight: marginRight,
                }}
              />
              <p>{valueOfBuys}M</p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default FundTableMenu
