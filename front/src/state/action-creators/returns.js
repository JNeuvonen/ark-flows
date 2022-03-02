export const updateSymbol = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'updateSymbol',
      payload: data,
    })
  }
}

export const updateAllSymbols = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'updateAllSymbols',
      payload: data,
    })
  }
}

export const updateYahooRealTime = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'updateYahooRealTIme',
      payload: data,
    })
  }
}

export const updatePosSizeFilter = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'updatePosSizeFilter',
      payload: data,
    })
  }
}

export const updateOwnershipFilter = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'updateOwnershipFilter',
      payload: data,
    })
  }
}

export const updateFundCountFilter = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'updateFundCountFilter',
      payload: data,
    })
  }
}

export const updateMicroMcapFilter = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'updateMicroMcapFilter',
      payload: data,
    })
  }
}

export const updateMediumMcapFilter = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'updateMediumMcapFilter',
      payload: data,
    })
  }
}

export const updateLargeMcapFilter = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'updateLargeMcapFilter',
      payload: data,
    })
  }
}

export const updateMegaMcapFilter = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'updateMegaMcapFilter',
      payload: data,
    })
  }
}

export const updatePage = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'updatePage',
      payload: data,
    })
  }
}
