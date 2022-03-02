import SymbolFundAllocation from '../Symbol-Funds-Allocation'
import SymbolFundShares from '../Symbol-Funds-Shares'
import SymbolTechnicals from '../Symbol-Technicals'

const SymbolDetailedInfo = () => {
  return (
    <div className="symbol__grid__detailed-info__wrapper">
      <div className="symbol__grid__detailed-info__wrapper__shares-graph">
        <SymbolFundShares />
      </div>
      <div className="symbol__grid__detailed-info__wrapper__allocation-graph">
        <SymbolFundAllocation />
      </div>
      <div className="symbol__grid__detailed-info__wrapper__technicals">
        <SymbolTechnicals />
      </div>
    </div>
  )
}

export default SymbolDetailedInfo
