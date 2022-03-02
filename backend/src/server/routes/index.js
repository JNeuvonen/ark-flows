const router = require('express').Router()
const client = require('../mongo-db/index')
const collection = client.db('ARK-js').collection('fundHoldings')
const yahooFinance = require('yahoo-finance')
const axios = require('axios')
router.get('/search', async (request, response) => {
  try {
    let result = await collection
      .aggregate([
        {
          $search: {
            index: 'default',
            text: {
              query: request.query.query,
              path: {
                wildcard: '*',
              },
            },
          },
        },
      ])
      .toArray()
    response.send(result)
  } catch (e) {
    response.status(500).send({ message: e.message })
  }
})

router.get('/specificsearch/:ticker', async (request, response) => {
  try {
    let result = await collection
      .aggregate([
        {
          $search: {
            index: 'default',
            text: {
              query: request.params.ticker,
              path: {
                wildcard: '*',
              },
            },
          },
        },
      ])
      .toArray()

    if (result.length === 1) {
      response.send(result)
    } else {
      response.send([])
    }
  } catch (e) {
    response.send([])
  }
})
router.get('/ticker/:ticker', async (request, response) => {
  try {
    const ret = await yahooFinance.quote({
      symbol: request.params.ticker,
      modules: ['price', 'summaryDetail', 'defaultKeyStatistics'],
    })
    response.send(ret)
  } catch (err) {
    response.status(500).send({ message: err.message })
  }
})

router.get('/getAll', async (request, response) => {
  try {
    const allTickersDict = await collection.find({}).toArray()

    response.send(allTickersDict)
  } catch (e) {
    response.status(500).send({ message: e.message })
  }
})

router.get('/getquote/:ticker', async (request, response) => {
  try {
    const ret = await axios.get(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${request.params.ticker}?modules=price`
    )

    response.send({
      price: ret.data.quoteSummary.result[0].price.regularMarketPrice,
      postMarketChange:
        ret.data.quoteSummary.result[0].price.regularMarketChangePercent,
    })
  } catch (e) {
    response.status(500).send({ message: e.message })
  }
})

router.get('/getyahoorealtime/:ticker', async (request, response) => {
  try {
    const ret = await axios.get(
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${request.params.ticker}?modules=assetProfile%2CsummaryProfile%2CsummaryDetail%2CesgScores%2Cprice%2CincomeStatementHistory%2CincomeStatementHistoryQuarterly%2CbalanceSheetHistory%2CbalanceSheetHistoryQuarterly%2CcashflowStatementHistory%2CcashflowStatementHistoryQuarterly%2CdefaultKeyStatistics%2CfinancialData%2CcalendarEvents%2CsecFilings%2CrecommendationTrend%2CupgradeDowngradeHistory%2CinstitutionOwnership%2CfundOwnership%2CmajorDirectHolders%2CmajorHoldersBreakdown%2CinsiderTransactions%2CinsiderHolders%2CnetSharePurchaseActivity%2Cearnings%2CearningsHistory%2CearningsTrend%2CindustryTrend%2CindexTrend%2CsectorTrend`
    )
    const price = ret.data.quoteSummary.result[0].price
    const defaultKeyStatistics =
      ret.data.quoteSummary.result[0].defaultKeyStatistics
    const summaryDetail = ret.data.quoteSummary.result[0].summaryDetail
    const calendarEvents = ret.data.quoteSummary.result[0].calendarEvents
    const majorHoldersBreakdown =
      ret.data.quoteSummary.result[0].majorHoldersBreakdown

    const financialData = ret.data.quoteSummary.result[0].financialData

    function returnFmt(value, fmt) {
      if (fmt === null) {
        return value
      }

      if (!value) {
        return 'N/A'
      }

      if (fmt) {
        if (!value['fmt']) {
          return value
        }
        return value['fmt'] ? value['fmt'] : 'N/A'
      }
      if (!value['raw']) {
        return value
      }

      return value['raw'] ? value['raw'] : 'N/A'
    }

    response.send({
      price: returnFmt(price['regularMarketPrice'], true),
      priceChange: returnFmt(price['regularMarketChangePercent'], true),
      mcap: returnFmt(price['marketCap'], null),
      beta: returnFmt(defaultKeyStatistics['beta'], true),
      trailingPE: returnFmt(summaryDetail['trailingPE'], true),
      forwardPE: returnFmt(summaryDetail['forwardPE'], true),
      earningsDate: returnFmt(calendarEvents['earnings'], null),
      shortPercentOfFloat: returnFmt(
        defaultKeyStatistics['shortPercentOfFloat'],
        null
      ),
      yearChange: returnFmt(defaultKeyStatistics['52WeekChange'], true),
      majorHoldersBreakdown: returnFmt(majorHoldersBreakdown, null),
      targetMeanPrice: returnFmt(financialData['targetMeanPrice'], false),
      numberOfAnalystOpinions: returnFmt(
        financialData['numberOfAnalystOpinions'],
        false
      ),
      totalCash: returnFmt(financialData['totalCash'], null),
      totalRevenue: returnFmt(financialData['totalRevenue'], null),
      revenueGrowth: returnFmt(financialData['revenueGrowth'], true),
      grossMargins: returnFmt(financialData['grossMargins'], true),
      operatingMargins: returnFmt(financialData['operatingMargins'], true),
      profitMargins: returnFmt(financialData['profitMargins'], true),
      freeCashFlow: returnFmt(financialData['freeCashFlow'], null),
      quickRatio: returnFmt(financialData['quickRatio'], true),
      currentRatio: returnFmt(financialData['currentRatio'], true),
      yearLow: returnFmt(summaryDetail['fiftyTwoWeekLow'], true),
      yearHigh: returnFmt(summaryDetail['fiftyTwoWeekHigh'], true),
      symbol: returnFmt(price['symbol'], null),
      shortName: returnFmt(price['shortName'], null),
    })
  } catch (e) {
    response.status(500).send({ message: e.message })
  }
})

module.exports = router
