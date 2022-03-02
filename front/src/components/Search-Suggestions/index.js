import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getQuote } from '../../services/returns'
import StateManagement from '../../utils/state-management'
const SearchSuggestions = ({ suggestions }) => {
  //Img API doesn't work on all entries
  const ignoreImg = ['STNE']
  //Yahoo Finance doesn't work on all entries
  const ignoreTicker = ['4689']

  const navigate = useNavigate()
  const { updateSymbol, updatePage } = StateManagement()

  useEffect(() => {
    suggestions.forEach((item) => {
      if (!ignoreTicker.includes(item.symbol)) {
        const ret = getQuote(item.symbol)
        ret.then((res) => {
          const priceSpan = document.getElementById(item.symbol + '-price')
          const priceChangeSpan = document.getElementById(
            item.symbol + '-priceChange'
          )
          priceSpan.innerHTML = '$' + res.data.price.raw
          priceChangeSpan.innerHTML = res.data.postMarketChange.fmt

          if (res.data.postMarketChange.raw > 0) {
            priceChangeSpan.innerHTML = '+' + res.data.postMarketChange.fmt
            priceChangeSpan.style.color = '#00c928'
          }

          if (res.data.postMarketChange.raw < 0) {
            priceChangeSpan.style.color = '#910404'
          }
        })
      }
    })
  }, [suggestions])

  const handleOnClick = (e, entry) => {
    e.preventDefault()
    navigate(`/symbol/${entry.symbol.toLowerCase()}`)
    updateSymbol(entry)
    updatePage('symbol')

    document.getElementsByClassName(
      'nav-bar__search-bar__search-suggestions'
    )[0].style.display = 'none'

    document.getElementsByClassName('nav-bar__search-bar__search')[0].value = ''
  }

  return (
    <div className="nav-bar__search-bar__search-suggestions">
      {suggestions.map((entry, index) => {
        return (
          <div
            key={entry.symbol}
            className="nav-bar__search-bar__search-suggestions__item"
            onClick={(e) => {
              handleOnClick(e, entry)
            }}
          >
            {entry['companyUrl'] && !ignoreImg.includes(entry['symbol']) ? (
              <img
                src={`https://logo.clearbit.com/${entry['companyUrl']}`}
                alt="companyLogo"
                className="nav-bar__search-bar__search-suggestions__item__company-logo"
              ></img>
            ) : (
              'N/A'
            )}
            <span className="nav-bar__search-bar__search-suggestions__item__symbol">
              {entry.symbol}
            </span>
            <span
              id={`${entry.symbol}-price`}
              className="nav-bar__search-bar__search-suggestions__item__price"
            ></span>
            <span
              id={`${entry.symbol}-priceChange`}
              className="nav-bar__search-bar__search-suggestions__item__price-change"
            ></span>
          </div>
        )
      })}
    </div>
  )
}

export default SearchSuggestions
