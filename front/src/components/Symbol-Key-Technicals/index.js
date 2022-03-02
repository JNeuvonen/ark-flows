import SymbolMiniTitle from '../Symbol-Mini-Title'
import React from 'react'
const SymbolKeyInfo = ({ symbolData, yahooData }) => {
  const getRow = (header, val) => {
    if (val.constructor === Object) {
      val = 'N/A'
    }
    return (
      <div className="symbol__grid__key-info__row">
        <span className="symbol__grid__key-info__row__header">{header}</span>
        <span className="symbol__grid__key-info__row__value">{val}</span>
      </div>
    )
  }

  return yahooData ? (
    <React.Fragment>
      <div style={{ marginBottom: 47 }}>
        <SymbolMiniTitle title="Key Technicals" />
      </div>
      {getRow('Market Cap', yahooData.mcap.fmt)}
      {getRow('Beta', yahooData.beta)}
      {getRow('52Wk Change', yahooData.yearChange)}
      {getRow('Year High', yahooData.yearHigh + '$')}
      {getRow('Year Low', yahooData.yearLow + '$')}
      {getRow('PE', yahooData.trailingPE)}
      {getRow('Forward PE', yahooData.forwardPE)}
    </React.Fragment>
  ) : null
}

export default SymbolKeyInfo
