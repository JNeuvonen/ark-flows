import { CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import FundTable from '../../components/Fund-Table'
import FundTableFilters from '../../components/Fund-Table-Sidebar'

import { getFilteredSymbols, getLatestDate } from '../../utils/functions'
import StateManagement from '../../utils/state-management'
const FundPage = () => {
  const { fund } = useParams()
  const { updatePage } = StateManagement()
  const page = useSelector((state) => state.page)
  //Filters
  const allSymbols = useSelector((state) => state.allSymbols)
  const posSizeLow = useSelector((state) => state.posSizeLow)
  const posSizeHigh = useSelector((state) => state.posSizeHigh)
  const ownershipLow = useSelector((state) => state.ownershipLow)
  const ownershipHigh = useSelector((state) => state.ownershipHigh)
  const fundCountLow = useSelector((state) => state.fundCountLow)
  const fundCountHigh = useSelector((state) => state.fundCountHigh)
  const microMcapLow = useSelector((state) => state.microMcapLow)
  const microMcapHigh = useSelector((state) => state.microMcapHigh)
  const mediumMcapLow = useSelector((state) => state.mediumMcapLow)
  const mediumMcapHigh = useSelector((state) => state.mediumMcapHigh)
  const largeMcapLow = useSelector((state) => state.largeMcapLow)
  const largeMcapHigh = useSelector((state) => state.largeMcapHigh)
  const megaMcapLow = useSelector((state) => state.megaMcapLow)
  const megaMcapHigh = useSelector((state) => state.megaMcapHigh)

  if (!page) {
    updatePage('fund')
  }

  if (!allSymbols) {
    return (
      <div className="fund__loading-spinner">
        <CircularProgress />
      </div>
    )
  }

  const latestDate = getLatestDate(allSymbols)
  const filteredSymbols = getFilteredSymbols(
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
  )

  return (
    <div className="fund">
      <div className="fund__table-wrapper">
        <FundTableFilters />
        <FundTable filteredSymbols={filteredSymbols} latestDate={latestDate} />
      </div>
    </div>
  )
}

export default FundPage
