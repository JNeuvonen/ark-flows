import {
  RemoveMinusFromFront,
  StringPercentToNumber,
} from '../../utils/functions'
import { DownIcon, UpIcon } from '../../utils/icons/returns'
import { GetMediaQuery } from '../../utils/hooks/'
const SymbolTitleCard = ({ symbolData, yahooData }) => {
  //Var for inline color
  let green = null

  const getUpOrDownIcon = (val) => {
    const helper = StringPercentToNumber(val)
    if (helper < 0) {
      green = false
      return (
        <DownIcon
          className="symbol__title-card__icon"
          inlineStyles={{ fill: '#910404' }}
        />
      )
    }
    if (helper > 0) {
      green = true
      return (
        <UpIcon
          className="symbol__title-card__icon"
          inlineStyles={{ fill: 'green' }}
        />
      )
    }

    return null
  }
  return (
    <div className="symbol__title-card">
      <div style={{ width: '45%' }}>
        {yahooData && (
          <span className="symbol__title-card__company-name">
            {yahooData.shortName.toLowerCase() + ' (' + symbolData.symbol + ')'}
          </span>
        )}
        <img
          src={`https://logo.clearbit.com/${symbolData['companyUrl']}`}
          alt="companyLogo"
          className="symbol__title-card__company-logo"
        ></img>
      </div>
      <div>
        {yahooData && (
          <div className="symbol__title-card__prices">
            <span className="symbol__title-card__price">
              {yahooData.price}$
            </span>
            {getUpOrDownIcon(yahooData.priceChange)}
            <span
              className="symbol__title-card__price-change"
              style={{ color: green ? 'green' : '#910404' }}
            >
              {RemoveMinusFromFront(yahooData.priceChange)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default SymbolTitleCard
