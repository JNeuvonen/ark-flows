import SymbolKeyInfo from '../Symbol-Key-Technicals'
import MultiLineGraph from '../Graph-Multi-Line/Graph-Multi-Line'
import SymbolLatestTrades from '../Symbol-Latest-Trades'
import SymbolDetailedInfo from '../Symbol-Detailed-Info'
const SymbolGrid = ({ symbolData, yahooData }) => {
  return (
    <div className="symbol__grid">
      <div className="symbol__grid__graph">
        <MultiLineGraph gradient="shares" line="stockPrice" />
      </div>
      <div className="symbol__grid__key-info">
        <SymbolKeyInfo symbolData={symbolData} yahooData={yahooData} />
      </div>
      <div className="symbol__grid__detailed-info">
        <SymbolDetailedInfo yahooData={yahooData} />
      </div>
      <div className="symbol__grid__latest-trades">
        <SymbolLatestTrades />
      </div>
    </div>
  )
}

export default SymbolGrid
