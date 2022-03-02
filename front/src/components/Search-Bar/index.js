import React, { useState } from 'react'
import { SearchBarIcon, DiscardTextIconButton } from '../../utils/icons/returns'
import { searchForEntry } from '../../services/returns'
import SearchSuggestions from '../Search-Suggestions'
import { GetMediaQuery } from '../../utils/hooks'
const SearchBar = () => {
  const [suggestions, setSuggestions] = useState([])
  const under900 = GetMediaQuery(900)
  const [open, setOpen] = useState(false)

  const handleInputChange = async (e) => {
    if (e.target.value.length > 0) {
      //Show Search bar "discard text" icon
      if (!under900) {
        document.getElementsByClassName(
          'nav-bar__search-bar__discard-text-icon'
        )[0].style.display = 'inline'
      }

      //Show Search Bar suggestions
      if (
        document.getElementsByClassName(
          'nav-bar__search-bar__search-suggestions'
        )[0]
      ) {
        document.getElementsByClassName(
          'nav-bar__search-bar__search-suggestions'
        )[0].style.display = 'initial'
      }

      const res = await searchForEntry(e.target.value)
      if (res.data.length > 0) {
        if (res.data.length < 7) {
          setSuggestions(res.data)
        } else {
          //Cap input field suggestions to 7
          setSuggestions(res.data.slice(0, 6))
        }
      }
    }
  }

  const handleDiscardText = () => {
    document.getElementsByClassName('nav-bar__search-bar__search')[0].value = ''
    document.getElementsByClassName(
      'nav-bar__search-bar__discard-text-icon'
    )[0].style.display = 'none'
    setSuggestions([])
  }

  const openSearchBar = () => {
    const domObject = document.getElementsByClassName('nav-bar__search-bar')[0]
    domObject.style.backgroundColor = '#d9d9d9'
    domObject.style.width = '40%'
    domObject.style.right = '1rem'
    setOpen(true)
  }

  return (
    <div
      className="nav-bar__search-bar"
      onClick={under900 ? openSearchBar : null}
    >
      {under900 ? (
        <React.Fragment>
          {!open ? (
            <SearchBarIcon className={'nav-bar__search-bar__search-icon'} />
          ) : null}
          {open ? (
            <>
              <SearchBarIcon
                className={'nav-bar__search-bar__search-icon__mobile'}
              />
              <input
                className="nav-bar__search-bar__search"
                placeholder="Search"
                onChange={handleInputChange}
              ></input>
              {suggestions.length > 0 && (
                <SearchSuggestions suggestions={suggestions} />
              )}
            </>
          ) : null}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <SearchBarIcon className={'nav-bar__search-bar__search-icon'} />
          <input
            className="nav-bar__search-bar__search"
            placeholder="Search for companies"
            onChange={handleInputChange}
          ></input>
          <DiscardTextIconButton onClickFunction={handleDiscardText} />
          {suggestions.length > 0 && (
            <SearchSuggestions suggestions={suggestions} />
          )}
        </React.Fragment>
      )}
    </div>
  )
}

export default SearchBar
