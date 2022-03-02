import ArkTable from '../../assets/ark-table.png'
import ArkTrades from '../../assets/ark-trades.png'
import ArkShares from '../../assets/ark-shares.png'
import { GetMediaQuery } from '../../utils/hooks'
const StartPage = () => {
  const below900 = GetMediaQuery(900)
  return (
    <div className="starting-page">
      <div className="starting-page__title-div">
        <h1 className="starting-page__title">Track ARK ETF with ease</h1>
      </div>

      <div className="starting-page__card">
        <div
          className="starting-page__card__item-1"
          style={below900 ? null : { marginLeft: 25 }}
        >
          <div className="starting-page__card__item-1__mini-title">
            <h3> See Every Trade</h3>
          </div>
          <div className="starting-page__card__item-1__content">
            Stay up to date on ARK's every trade. ARK's position changes are
            updated daily. Track the biggest actively traded ETF effortlessly.
          </div>
        </div>

        <div>
          <img
            src={ArkTrades}
            alt="table"
            className="starting-page__card__img"
          ></img>
        </div>
      </div>

      {below900 ? (
        <div className="starting-page__card">
          <div className="starting-page__card__item-1">
            <div className="starting-page__card__item-1__mini-title">
              <h3>Long or Short?</h3>
            </div>
            <div className="starting-page__card__item-1__content">
              Find ARK's lowest and highest conviction bets effortlessly. Track
              or counter every trade ARK is making.
            </div>
          </div>
          <div className="starting-page__card__img-div-left">
            <img
              src={ArkShares}
              alt="table"
              className="starting-page__card__img"
            ></img>
          </div>
        </div>
      ) : (
        <div className="starting-page__card">
          <div className="starting-page__card__img-div-left">
            <img
              src={ArkShares}
              alt="table"
              className="starting-page__card__img"
            ></img>
          </div>
          <div className="starting-page__card__item-1">
            <div className="starting-page__card__item-1__mini-title">
              <h3>Long or Short?</h3>
            </div>
            <div className="starting-page__card__item-1__content">
              Find ARK's lowest and highest conviction bets effortlessly. Track
              or counter every trade ARK is making.
            </div>
          </div>
        </div>
      )}

      <div className="starting-page__card">
        <div className="starting-page__card__item-1">
          <div className="starting-page__card__item-1__mini-title">
            <h3>Sort ARK's positions</h3>
          </div>
          <div className="starting-page__card__item-1__content">
            Extract signal from the noise. Filter and sort ARK's over 150
            holdings.
          </div>
        </div>
        <div className="starting-page__card__img-div-left">
          <img
            src={ArkTable}
            alt="table"
            className="starting-page__card__img"
          ></img>
        </div>
      </div>
    </div>
  )
}

export default StartPage
