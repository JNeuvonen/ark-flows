import { useSelector } from 'react-redux'
import { specificSearch, getYahooRealTime } from '../../services/returns'
import SymbolTitleCard from '../../components/Symbol-Title'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import StateManagement from '../../utils/state-management'
import CircularProgress from '@mui/material/CircularProgress'
import SymbolGrid from '../../components/Symbol-Grid'
const SymbolPage = () => {
  let symbolData = useSelector((state) => state.symbol)
  const [yahooData, setYahooData] = useState(null)
  const { updateSymbol } = StateManagement()
  const { ticker } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const resDb = await specificSearch(ticker)
      const resYahoo = await getYahooRealTime(ticker)

      updateSymbol(resDb.data[0])
      setYahooData(resYahoo.data)
    }
    if (symbolData && yahooData) {
      if (symbolData.symbol !== yahooData.symbol) {
        fetchData()
      }
    }
    if (!symbolData) {
      fetchData()
    }

    if (symbolData && !yahooData) {
      fetchData()
    }
  }, [symbolData])

  //Loading spinner
  if (!symbolData) {
    return (
      <div className="symbol__start-loader">
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="symbol">
      <SymbolTitleCard symbolData={symbolData} yahooData={yahooData} />
      <SymbolGrid symbolData={symbolData} yahooData={yahooData} />
    </div>
  )
}

export default SymbolPage
