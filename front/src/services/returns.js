import axios from 'axios'

//const baseUrl = 'http://localhost:3001/api'

const baseUrl = 'http://3.82.173.235:5000/api'

export const searchForEntry = async (searchWord) => {
  return await axios.get(`${baseUrl}/search?query=${searchWord}`)
}

export const specificSearch = async (searchWord) => {
  return await axios.get(`${baseUrl}/specificsearch/${searchWord}`)
}

export const searchForTicker = async (ticker) => {
  return await axios.get(`${baseUrl}/ticker/${ticker}`)
}

export const getAllEntries = () => {
  return axios.get(`${baseUrl}/getAll`)
}

export const getQuote = async (ticker) => {
  return await axios.get(`${baseUrl}/getquote/${ticker}`)
}

export const getYahooRealTime = async (ticker) => {
  return await axios.get(`${baseUrl}/getyahoorealtime/${ticker}`)
}
