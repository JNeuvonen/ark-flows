import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'
import { actionCreators } from '../../state/index'

const StateManagement = () => {
  const dispatch = useDispatch()

  const {
    updateSymbol,
    updateAllSymbols,
    updateYahooRealTime,
    updatePosSizeFilter,
    updateFundCountFilter,
    updateOwnershipFilter,
    updateMicroMcapFilter,
    updateMediumMcapFilter,
    updateLargeMcapFilter,
    updateMegaMcapFilter,
    updatePage,
  } = bindActionCreators(actionCreators, dispatch)
  return {
    updateSymbol,
    updateAllSymbols,
    updateYahooRealTime,
    updatePosSizeFilter,
    updateFundCountFilter,
    updateOwnershipFilter,
    updateMicroMcapFilter,
    updateMediumMcapFilter,
    updateLargeMcapFilter,
    updateMegaMcapFilter,
    updatePage,
  }
}

export default StateManagement
