import React, { useState } from 'react'
import '../../style/css/style.css'
import SearchBar from '../Search-Bar'
import { useNavigate, useParams } from 'react-router-dom'
import { GetMediaQuery } from '../../utils/hooks'
import { BarsIcon } from '../../utils/icons/returns'
import { useSelector } from 'react-redux'
import StateManagement from '../../utils/state-management'
const NavBar = () => {
  const page = useSelector((state) => state.page)
  const { updatePage } = StateManagement()
  const navigate = useNavigate()
  const under700 = GetMediaQuery(700)
  const under500 = GetMediaQuery(500)
  const handleDropdownMouseEnter = () => {
    const dropdownList = document.getElementsByClassName(
      'nav-bar__dropdown-list'
    )[0]
    dropdownList.style.display = 'block'
  }

  const handleDropdownMouseLeave = () => {
    setTimeout(function () {
      const dropdownList = document.getElementsByClassName(
        'nav-bar__dropdown-list'
      )[0]

      if (!dropdownList.matches(':hover')) {
        dropdownList.style.display = 'none'
      }
    }, 200)
  }

  const handleMenuItemClick = (type) => {
    navigate(`/fund/${type.toLowerCase()}`)
    updatePage('fund')
  }

  const filtersOnClick = (e) => {
    e.preventDefault()

    const selector = document.getElementsByClassName(
      'fund__table-wrapper__side-bar'
    )[0].style

    if (selector.width === '15%') {
      selector.width = '0'
    } else {
      if (under700) {
        selector.width = '50%'
      }
      if (under500) {
        selector.width = '65%'
      }

      if (!under500 && !under700) {
        selector.width = '15%'
      }
    }
  }

  const dropDownListItem = (type, icon) => {
    return (
      <React.Fragment>
        <li
          className="nav-bar__dropdown-list__menu-item"
          onClick={() => {
            handleMenuItemClick(type)
          }}
        >
          {type}
          <div className="nav-bar__dropdown-list__menu-item__icon">{icon}</div>
        </li>
      </React.Fragment>
    )
  }

  return (
    <div className="nav-bar">
      <div className="nav-bar__dropdown-menu">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {under700 && page === 'fund' ? (
            <BarsIcon
              className={'fund__table-wrapper__table-menu__icon-bars'}
              onClickFunction={filtersOnClick}
            />
          ) : null}
          <button
            className="nav-bar__droppable-menu__fund-btn"
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            Funds
          </button>
        </div>
        <div
          className="nav-bar__dropdown-list"
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <ul>
            {dropDownListItem('Combined', '➕')}
            {dropDownListItem('ARKK', '🚩')}
            {dropDownListItem('ARKG', '🧬')}
            {dropDownListItem('ARKQ', '🤖')}
            {dropDownListItem('ARKX', '🛸')}
            {dropDownListItem('ARKF', '💱')}
            {dropDownListItem('ARKW', '🌐')}
          </ul>
        </div>
      </div>

      <SearchBar />
    </div>
  )
}

export default NavBar
