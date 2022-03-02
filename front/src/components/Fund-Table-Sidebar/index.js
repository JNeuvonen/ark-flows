import { useState } from 'react'
import { Slider } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { ChevronLeft } from '../../utils/icons/returns'
import React from 'react'
import StateManagement from '../../utils/state-management'
const FundTableFilters = () => {
  const {
    updatePosSizeFilter,
    updateOwnershipFilter,
    updateFundCountFilter,
    updateMicroMcapFilter,
    updateMediumMcapFilter,
    updateLargeMcapFilter,
    updateMegaMcapFilter,
  } = StateManagement()

  const [arkStakeRange, setArkStakeRange] = useState([0, 15])
  const [posSizeRange, setPosSizeRange] = useState([0, 2])
  const [fundCountRange, setFundCountRange] = useState([0, 6])
  const [microActive, setMicroActive] = useState(false)
  const [mediumActive, setMediumActive] = useState(false)
  const [largeActive, setLargeActive] = useState(false)
  const [megaActive, setmegaActive] = useState(false)

  const handleRangeChange = (event, stateChanger, dispatcher) => {
    stateChanger(event.target.value)
    let payload = {}
    payload['low'] = event.target.value[0]
    payload['high'] = event.target.value[1]
    dispatcher(payload)
  }

  const closeIconOnClick = () => {
    const selector = document.getElementsByClassName(
      'fund__table-wrapper__side-bar'
    )[0].style

    selector.width = '0%'
  }

  const handleMcapFilterClick = (
    values,
    currState,
    stateChanger,
    dispatcher
  ) => {
    if (!currState) {
      let payload = {}
      payload['low'] = values[0]
      payload['high'] = values[1]
      stateChanger(true)
      dispatcher(payload)
    } else {
      let payload = {}
      payload['low'] = null
      payload['high'] = null
      stateChanger(false)
      dispatcher(payload)
    }
  }

  return (
    <React.Fragment>
      <div className="fund__table-wrapper__side-bar">
        <div className="fund__table-wrapper__side-bar__main-title">
          <div></div>
          <div className="fund__table-wrapper__side-bar__main-title__title">
            Filters
          </div>
          <div onClick={closeIconOnClick}>
            <ChevronLeft className="fund__table-wrapper__side-bar__main-title__icon" />
          </div>
        </div>

        <div className="fund__table-wrapper__side-bar__sub-title">
          💲 Market Cap (B)
        </div>

        <div className="fund__table-wrapper__side-bar__btn-group">
          <Tooltip
            enterDelay={500}
            title={
              <p style={{ fontSize: 15 }}>
                Companies with market capitalization between 0 and 1 billion
              </p>
            }
          >
            <button
              className="fund__table-wrapper__side-bar__btn-group__btn"
              style={{ backgroundColor: microActive ? '#06347d' : null }}
              onClick={(e) => {
                handleMcapFilterClick(
                  [0, 1],
                  microActive,
                  setMicroActive,
                  updateMicroMcapFilter
                )
              }}
            >
              Micro
            </button>
          </Tooltip>
          <Tooltip
            enterDelay={500}
            title={
              <p style={{ fontSize: 15 }}>
                Companies with market capitalization between 1 and 10 billion
              </p>
            }
          >
            <button
              className="fund__table-wrapper__side-bar__btn-group__btn"
              style={{ backgroundColor: mediumActive ? '#06347d' : null }}
              onClick={(e) => {
                handleMcapFilterClick(
                  [1, 10],
                  mediumActive,
                  setMediumActive,
                  updateMediumMcapFilter
                )
              }}
            >
              Medium
            </button>
          </Tooltip>
          <Tooltip
            enterDelay={500}
            title={
              <p style={{ fontSize: 15 }}>
                Companies with market capitalization between 10 and 100 billion
              </p>
            }
          >
            <button
              className="fund__table-wrapper__side-bar__btn-group__btn"
              style={{ backgroundColor: largeActive ? '#06347d' : null }}
              onClick={(e) => {
                handleMcapFilterClick(
                  [10, 100],
                  largeActive,
                  setLargeActive,
                  updateLargeMcapFilter
                )
              }}
            >
              Large
            </button>
          </Tooltip>
          <Tooltip
            enterDelay={500}
            title={
              <p style={{ fontSize: 15 }}>
                Companies with market capitalization above 100 billion
              </p>
            }
          >
            <button
              className="fund__table-wrapper__side-bar__btn-group__btn"
              style={{ backgroundColor: megaActive ? '#06347d' : null }}
              onClick={(e) => {
                handleMcapFilterClick(
                  [100, 9000000],
                  megaActive,
                  setmegaActive,
                  updateMegaMcapFilter
                )
              }}
            >
              Mega
            </button>
          </Tooltip>
        </div>

        <div className="fund__table-wrapper__side-bar__sub-title">
          💸 Pos. Size (B)
        </div>
        <div className="fund__table-wrapper__side-bar__slider-wrapper">
          <Slider
            value={posSizeRange}
            min={0}
            step={0.1}
            max={2}
            onChange={(e) => {
              handleRangeChange(e, setPosSizeRange, updatePosSizeFilter)
            }}
            valueLabelDisplay="auto"
          />
        </div>

        <div className="fund__table-wrapper__side-bar__sub-title">
          🧾 ARK's Ownership %
        </div>
        <div className="fund__table-wrapper__side-bar__slider-wrapper">
          <Slider
            value={arkStakeRange}
            min={0}
            max={15}
            valueLabelDisplay="auto"
            onChange={(e) => {
              handleRangeChange(e, setArkStakeRange, updateOwnershipFilter)
            }}
          />
        </div>

        <div className="fund__table-wrapper__side-bar__sub-title">
          ➕ Fund Count
        </div>
        <div className="fund__table-wrapper__side-bar__slider-wrapper">
          <Slider
            value={fundCountRange}
            min={0}
            step={1}
            max={6}
            onChange={(e) => {
              handleRangeChange(e, setFundCountRange, updateFundCountFilter)
            }}
            valueLabelDisplay="auto"
          />
        </div>
      </div>
    </React.Fragment>
  )
}

export default FundTableFilters
