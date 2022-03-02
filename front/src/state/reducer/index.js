const reducer = (state, action) => {
  switch (action.type) {
    case 'updateSymbol':
      return { ...state, symbol: action.payload }
    case 'updateAllSymbols':
      return { ...state, allSymbols: action.payload }
    case 'updateYahooRealTime':
      return { ...state, yahooRealTime: action.payload }

    case 'updatePosSizeFilter':
      return {
        ...state,
        posSizeLow: action.payload.low,
        posSizeHigh: action.payload.high,
      }

    case 'updateFundCountFilter':
      return {
        ...state,
        fundCountLow: action.payload.low,
        fundCountHigh: action.payload.high,
      }
    case 'updateOwnershipFilter':
      return {
        ...state,
        ownershipLow: action.payload.low / 100,
        ownershipHigh: action.payload.high / 100,
      }

    case 'updateMicroMcapFilter':
      return {
        ...state,
        microMcapLow: action.payload.low,
        microMcapHigh: action.payload.high,
      }

    case 'updateMediumMcapFilter':
      return {
        ...state,
        mediumMcapLow: action.payload.low,
        mediumMcapHigh: action.payload.high,
      }

    case 'updateLargeMcapFilter':
      return {
        ...state,
        largeMcapLow: action.payload.low,
        largeMcapHigh: action.payload.high,
      }

    case 'updatePage':
      return {
        ...state,
        page: action.payload,
      }

    case 'updateMegaMcapFilter':
      return {
        ...state,
        megaMcapLow: action.payload.low,
        megaMcapHigh: action.payload.high,
      }

    default: {
      return {
        symbol: null,
        allSymbols: null,
        yahooRealTime: null,
        posSizeLow: null,
        posSizeHigh: null,
        fundCountLow: null,
        fundCountHigh: null,
        ownershipLow: null,
        ownershipHigh: null,
        microMcapLow: null,
        microMcapHigh: null,
        mediumMcapLow: null,
        mediumMcapHigh: null,
        largeMcapLow: null,
        largeMcapHigh: null,
        megaMcapLow: null,
        megaMcapHigh: null,
        page: null,
      }
    }
  }
}

export default reducer
