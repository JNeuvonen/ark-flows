import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Nav from './components/Nav'
import FundPage from './pages/Fund'
import StartPage from './pages/Start'
import SymbolPage from './pages/Symbol'
import { getAllEntries } from './services/returns'
import './style/css/style.css'
import StateManagement from './utils/state-management'

function App() {
  const { updateAllSymbols } = StateManagement()

  //Fetch application data on start
  useEffect(() => {
    const ret = getAllEntries()
    ret
      .then((res) => {
        updateAllSymbols(res.data)
      })
      .catch((err) => {
        console.log('failed')
      })
  }, [])
  return (
    <div className="app">
      <Nav />
      <div className="app__content-body">
        <Routes>
          <Route path="/symbol/:ticker" element={<SymbolPage />} />
          <Route path="/fund/:fund" element={<FundPage />} />
          <Route path="/" element={<StartPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
