import axios from "axios";
const client = require("./mongo");
let globalDateHelper = "";
const collection = client.db("ARK-js").collection("fundHoldings");
const yahooFinance = require("yahoo-finance");
const urls = [
  "https://ark-funds.com/wp-content/uploads/funds-etf-csv/ARK_INNOVATION_ETF_ARKK_HOLDINGS.csv",
  "https://ark-funds.com/wp-content/uploads/funds-etf-csv/ARK_NEXT_GENERATION_INTERNET_ETF_ARKW_HOLDINGS.csv",
  "https://ark-funds.com/wp-content/uploads/funds-etf-csv/ARK_AUTONOMOUS_TECH._&_ROBOTICS_ETF_ARKQ_HOLDINGS.csv",
  "https://ark-funds.com/wp-content/uploads/funds-etf-csv/ARK_GENOMIC_REVOLUTION_ETF_ARKG_HOLDINGS.csv",
  "https://ark-funds.com/wp-content/uploads/funds-etf-csv/ARK_FINTECH_INNOVATION_ETF_ARKF_HOLDINGS.csv",
  "https://ark-funds.com/wp-content/uploads/funds-etf-csv/ARK_SPACE_EXPLORATION_&_INNOVATION_ETF_ARKX_HOLDINGS.csv",
];

let dataDict = {};
let arkkAUM = 0;
let arkqAUM = 0;
let arkwAUM = 0;
let arkxAUM = 0;
let arkgAUM = 0;
let arkfAUM = 0;

const parseCsv = async (data) => {
  const splitData = data.split("\n");
  for (let i = 1; i < splitData.length - 2; i++) {
    const columns = splitData[i].split(",");
    var count = (splitData[i].match(/\"/g) || []).length;
    const quotesSplit = splitData[i].split('"');
    let dollars = null;
    let shares = null;
    const date = columns[0];
    const fund = columns[1];
    const companyName = columns[2].replace(/"/gi, "");
    const ticker = columns[3];

    if (ticker === "") {
      continue;
    }

    const allocation = columns[columns.length - 1];

    if (count === 6) {
      const searchRegExp = /,/gi;
      dollars = quotesSplit[5].replace(searchRegExp, "");
      dollars = dollars.replace("$", "");
      shares = quotesSplit[3].replace(searchRegExp, "");
    } else {
      dollars = quotesSplit[3].replace("$", "");
      const splitHelper = quotesSplit[2].split(",");
      shares = splitHelper[3];
      dollars = dollars.replace(",", "");
    }

    if (dollars) {
      if (isNaN(parseFloat(dollars))) {
        continue;
      } else {
        if (fund === "ARKK") {
          arkkAUM += parseFloat(dollars) / 1000000000;
        } else if (fund === "ARKQ") {
          arkqAUM += parseFloat(dollars) / 1000000000;
        } else if (fund === "ARKW") {
          arkwAUM += parseFloat(dollars) / 1000000000;
        } else if (fund === "ARKG") {
          arkgAUM += parseFloat(dollars) / 1000000000;
        } else if (fund === "ARKX") {
          arkxAUM += parseFloat(dollars) / 1000000000;
        } else if (fund === "ARKF") {
          arkfAUM += parseFloat(dollars) / 1000000000;
        }
      }
    }

    if (ticker in dataDict) {
      dataDict[ticker]["date"][date]["shares"] += parseFloat(shares);
      dataDict[ticker]["date"][date]["dollars"] +=
        parseFloat(dollars) / 1000000000;
      dataDict[ticker]["date"][date]["fundAllocation"][fund] = {};
      dataDict[ticker]["date"][date]["fundAllocation"][fund]["shares"] = shares;
      dataDict[ticker]["date"][date]["fundAllocation"][fund]["allocation"] =
        allocation;
    } else {
      dataDict[ticker] = {};
      dataDict[ticker]["companyName"] = companyName;
      dataDict[ticker]["symbol"] = ticker;
      dataDict[ticker]["date"] = {};
      dataDict[ticker]["date"][date] = {};
      dataDict[ticker]["date"][date]["fundAllocation"] = {};
      dataDict[ticker]["date"][date]["fundAllocation"][fund] = {};
      dataDict[ticker]["date"][date]["fundAllocation"][fund]["shares"] = shares;
      dataDict[ticker]["date"][date]["fundAllocation"][fund]["allocation"] =
        allocation;
      dataDict[ticker]["date"][date]["dollars"] = Number(dollars) / 1000000000;
      dataDict[ticker]["date"][date]["shares"] = parseFloat(shares);
    }

    globalDateHelper = date;
  }
};

const putTickerToDB = async (key: string, dict?: any, dataDictHelper?: any) => {
  const query = { symbol: key.toUpperCase() };
  let document = await collection.findOne(query);
  if (key.toUpperCase() === "NRIX") {
  }
  if (document) {
    document["date"][globalDateHelper] = dict;
    await collection.replaceOne(query, document);
  } else {
    dataDictHelper["date"][globalDateHelper] = dict;

    await collection.insertOne(dataDictHelper);
  }
};

const helperFunc = (helper: any, module: any, value: any, raw: any) => {
  let ret = null;
  try {
    if (raw) {
      ret = helper[module][value]["raw"];
    } else {
      ret = helper[module][value];
    }
  } catch (err) {}

  if (ret === undefined) {
    return null;
  }

  return ret;
};

const top5MinAndMax = (fund, fundSymbol, datesDict, date, data) => {
  try {
    if (
      fundSymbol in datesDict[date]["fundAllocation"] ||
      fundSymbol === "Combined"
    ) {
      if (date in fund["date"]) {
        if ("top5arr" in fund["date"][date]) {
          if (fund["date"][date]["top5arr"].length < 8) {
            fund["date"][date]["top5arr"].push(data["change"]);
            let arrHelper = fund["date"][date]["top5WSymbols"];
            arrHelper.push(data);
            fund["date"][date]["top5WSymbols"] = arrHelper;
          } else {
            const min = Math.min(...fund["date"][date]["top5arr"]);

            if (data["change"] > min) {
              let newArrSymbols = [];
              let newArrChanges = [];
              newArrSymbols.push(data);
              newArrChanges.push(data["change"]);
              const symbols = fund["date"][date]["top5WSymbols"];
              for (let i = 0; i < symbols.length; i++) {
                if (symbols[i]["change"] !== min) {
                  newArrSymbols.push(symbols[i]);
                  newArrChanges.push(symbols[i]["change"]);
                }
              }
              newArrSymbols = newArrSymbols.sort(function (a, b) {
                return b["change"] - a["change"];
              });
              fund["date"][date]["top5arr"] = newArrChanges;
              fund["date"][date]["top5WSymbols"] = newArrSymbols;
            }
          }

          if (fund["date"][date]["bottom5arr"].length < 8) {
            fund["date"][date]["bottom5arr"].push(data["change"]);
            let arrHelper = fund["date"][date]["bottom5WSymbols"];
            arrHelper.push(data);
            fund["date"][date]["bottom5WSymbols"] = arrHelper;
          } else {
            const max = Math.max(...fund["date"][date]["bottom5arr"]);
            if (data["change"] < max) {
              let newArrSymbols = [];
              let newArrChanges = [];
              newArrSymbols.push(data);
              newArrChanges.push(data["change"]);
              const symbols = fund["date"][date]["bottom5WSymbols"];
              for (let i = 0; i < symbols.length; i++) {
                if (symbols[i]["change"] !== max) {
                  newArrSymbols.push(symbols[i]);
                  newArrChanges.push(symbols[i]["change"]);
                }
              }
              newArrSymbols = newArrSymbols.sort(function (a, b) {
                return a["change"] - b["change"];
              });
              fund["date"][date]["bottom5arr"] = newArrChanges;
              fund["date"][date]["bottom5WSymbols"] = newArrSymbols;
            }
          }
        } else {
        }
      } else {
        fund["date"][date] = {};
        fund["date"][date]["top5arr"] = [];
        fund["date"][date]["bottom5arr"] = [];
        fund["date"][date]["top5WSymbols"] = [];
        fund["date"][date]["bottom5WSymbols"] = [];
        fund["date"][date]["top5arr"].push(data["change"]);
        fund["date"][date]["bottom5arr"].push(data["change"]);
        fund["date"][date]["top5WSymbols"].push(data);
        fund["date"][date]["bottom5WSymbols"].push(data);
      }
    }
  } catch (err) {}
};

const getHistoricalPriceData = async (symbol, dateDict) => {
  let priceDict = {};
  const dateToCorrForm = (date) => {
    let newDate = new Date(date);

    return (
      newDate.getMonth() +
      1 +
      "/" +
      newDate.getDate() +
      "/" +
      newDate.getFullYear()
    );
  };

  if (symbol === "aumEntry") {
    await yahooFinance.historical(
      {
        symbol: "QQQ",
        from: "2021-12-10",
      },
      function (err, quotes) {
        quotes.forEach((element) => {
          const date = dateToCorrForm(element["date"]);

          if (date in dateDict) {
            if ("QQQ" in priceDict) {
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["QQQ"][date] = element;
            } else {
              priceDict["QQQ"] = {};
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["QQQ"][date] = element;
            }
          }
        });
      }
    );

    await yahooFinance.historical(
      {
        symbol: "SPY",
        from: "2021-12-10",
      },
      function (err, quotes) {
        quotes.forEach((element) => {
          const date = dateToCorrForm(element["date"]);

          if (date in dateDict) {
            if ("SPY" in priceDict) {
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["SPY"][date] = element;
            } else {
              priceDict["SPY"] = {};
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["SPY"][date] = element;
            }
          }
        });
      }
    );

    await yahooFinance.historical(
      {
        symbol: "ARKK",
        from: "2021-12-10",
      },
      function (err, quotes) {
        quotes.forEach((element) => {
          const date = dateToCorrForm(element["date"]);

          if (date in dateDict) {
            if ("ARKK" in priceDict) {
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["ARKK"][date] = element;
            } else {
              priceDict["ARKK"] = {};
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["ARKK"][date] = element;
            }
          }
        });
      }
    );

    await yahooFinance.historical(
      {
        symbol: "ARKG",
        from: "2021-12-10",
      },
      function (err, quotes) {
        quotes.forEach((element) => {
          const date = dateToCorrForm(element["date"]);

          if (date in dateDict) {
            if ("ARKG" in priceDict) {
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["ARKG"][date] = element;
            } else {
              priceDict["ARKG"] = {};
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["ARKG"][date] = element;
            }
          }
        });
      }
    );

    await yahooFinance.historical(
      {
        symbol: "ARKQ",
        from: "2021-12-10",
      },
      function (err, quotes) {
        quotes.forEach((element) => {
          const date = dateToCorrForm(element["date"]);

          if (date in dateDict) {
            if ("ARKQ" in priceDict) {
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["ARKQ"][date] = element;
            } else {
              priceDict["ARKQ"] = {};
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["ARKQ"][date] = element;
            }
          }
        });
      }
    );

    await yahooFinance.historical(
      {
        symbol: "ARKW",
        from: "2021-12-10",
      },
      function (err, quotes) {
        quotes.forEach((element) => {
          const date = dateToCorrForm(element["date"]);

          if (date in dateDict) {
            if ("ARKW" in priceDict) {
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["ARKW"][date] = element;
            } else {
              priceDict["ARKW"] = {};
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["ARKW"][date] = element;
            }
          }
        });
      }
    );

    await yahooFinance.historical(
      {
        symbol: "ARKF",
        from: "2021-12-10",
      },
      function (err, quotes) {
        quotes.forEach((element) => {
          const date = dateToCorrForm(element["date"]);

          if (date in dateDict) {
            if ("ARKF" in priceDict) {
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["ARKF"][date] = element;
            } else {
              priceDict["ARKF"] = {};
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["ARKF"][date] = element;
            }
          }
        });
      }
    );

    await yahooFinance.historical(
      {
        symbol: "ARKX",
        from: "2021-12-10",
      },
      function (err, quotes) {
        quotes.forEach((element) => {
          const date = dateToCorrForm(element["date"]);

          if (date in dateDict) {
            if ("ARKX" in priceDict) {
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["ARKX"][date] = element;
            } else {
              priceDict["ARKX"] = {};
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["ARKX"][date] = element;
            }
          }
        });
      }
    );

    await yahooFinance.historical(
      {
        symbol: "IWM",
        from: "2021-12-10",
      },
      function (err, quotes) {
        quotes.forEach((element) => {
          const date = dateToCorrForm(element["date"]);

          if (date in dateDict) {
            if ("IWM" in priceDict) {
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["IWM"][date] = element;
            } else {
              priceDict["IWM"] = {};
              element["change"] = element["close"] / element["open"] - 1;
              priceDict["IWM"][date] = element;
            }
          }
        });
      }
    );
  } else {
    await yahooFinance.historical(
      {
        symbol: symbol,
        from: "2021-12-10",
      },
      function (err, quotes) {
        quotes.forEach((element) => {
          const date = dateToCorrForm(element["date"]);
          element["change"] = element["close"] / element["open"] - 1;
          if (date in dateDict) {
            priceDict[date] = element;
          }
        });
      }
    );
  }

  return priceDict;
};

const helperFuncFmt = (helper: any, module: any, value: any, z?: any) => {
  let ret = null;
  try {
    ret = helper[module][value]["fmt"];
  } catch (err) {}

  if (ret === undefined) {
    return null;
  }

  return ret;
};

const getCsvFiles = async () => {
  urls.forEach((url) => {
    axios
      .get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0",
        },
      })
      .then((data) => parseCsv(data.data))
      .catch((err) => console.log(err));
  });
  await new Promise((r) => setTimeout(r, 5000));

  for (const [key, value] of Object.entries(dataDict)) {
    const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${key.toLowerCase()}?modules=assetProfile%2CsummaryProfile%2CsummaryDetail%2CesgScores%2Cprice%2CincomeStatementHistory%2CincomeStatementHistoryQuarterly%2CbalanceSheetHistory%2CbalanceSheetHistoryQuarterly%2CcashflowStatementHistory%2CcashflowStatementHistoryQuarterly%2CdefaultKeyStatistics%2CfinancialData%2CcalendarEvents%2CsecFilings%2CrecommendationTrend%2CupgradeDowngradeHistory%2CinstitutionOwnership%2CfundOwnership%2CmajorDirectHolders%2CmajorHoldersBreakdown%2CinsiderTransactions%2CinsiderHolders%2CnetSharePurchaseActivity%2Cearnings%2CearningsHistory%2CearningsTrend%2CindustryTrend%2CindexTrend%2CsectorTrend`;
    try {
      const ret = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0",
        },
      });

      const helper = ret["data"]["quoteSummary"]["result"][0];
      const dataDictHelper = dataDict[key]["date"][globalDateHelper];
      const shares = dataDictHelper["shares"];
      const financialData = "financialData";
      const summaryDetail = "summaryDetail";
      const price = "price";
      const majorHoldersBreakdown = "majorHoldersBreakdown";

      const mcapB = helperFunc(helper, "price", "marketCap", true) / 1000000000;

      const stockPrice = helperFunc(
        helper,
        "price",
        "regularMarketPrice",
        true
      );

      const regularMarketVolume = helperFunc(
        helper,
        "summaryDetail",
        "regularMarketVolume",
        true
      );

      const sharesShort = helperFunc(
        helper,
        "defaultKeyStatistics",
        "sharesShort",
        true
      );

      const sharesShortPerc = helperFunc(
        helper,
        "defaultKeyStatistics",
        "shortPercentOfFloat",
        true
      );
      const sharesShortPercFmt = helperFuncFmt(
        helper,
        "defaultKeyStatistics",
        "shortPercentOfFloat",
        true
      );
      const avgDailyVolume10Day = helperFunc(
        helper,
        "summaryDetail",
        "averageDailyVolume10Day",
        true
      );

      const priceToSalesTTM = helperFunc(
        helper,
        "summaryDetail",
        "priceToSalesTrailing12Months",
        true
      );

      const forwardEps = helperFunc(
        helper,
        "defaultKeyStatistics",
        "forwardEps",
        true
      );

      const trailingEps = helperFunc(
        helper,
        "defaultKeyStatistics",
        "trailingEps",
        true
      );

      const fiftyTwoWeekHigh = helperFunc(
        helper,
        "summaryDetail",
        "fiftyTwoWeekHigh",
        true
      );

      const fiftyTwoWeekLow = helperFunc(
        helper,
        "summaryDetail",
        "fiftyTwoWeekLow",
        true
      );

      let distFrom52WkHigh = null;
      let distFrom52WkHighFmt = null;
      let distFrom52WkLow = null;
      let distFrom52WkLowFmt = null;
      let posSizeToAvgVol = null;
      let posSizeToAvgVolFmt = null;

      if (fiftyTwoWeekHigh && stockPrice && fiftyTwoWeekHigh !== 0) {
        distFrom52WkHigh = stockPrice / fiftyTwoWeekHigh - 1;
        distFrom52WkHighFmt =
          ((stockPrice / fiftyTwoWeekHigh - 1) * 100).toFixed(2) + "%";
      }

      if (fiftyTwoWeekLow && stockPrice && fiftyTwoWeekLow !== 0) {
        distFrom52WkLow = stockPrice / fiftyTwoWeekLow - 1;
        distFrom52WkLowFmt =
          ((stockPrice / fiftyTwoWeekLow - 1) * 100).toFixed(2) + "%";
      }

      if (shares && avgDailyVolume10Day && avgDailyVolume10Day !== 0) {
        posSizeToAvgVol = shares / avgDailyVolume10Day;
        posSizeToAvgVolFmt =
          ((shares / avgDailyVolume10Day) * 100).toFixed(2) + "%";
      }

      const twoHundredDayAverage = helperFunc(
        helper,
        "summaryDetail",
        "twoHundredDayAverage",
        true
      );

      const twoHundredDayAverageFmt = helperFuncFmt(
        helper,
        "summaryDetail",
        "twoHundredDayAverage",
        false
      );

      const beta = helperFunc(helper, summaryDetail, "beta", true);
      const betaFmt = helperFuncFmt(helper, summaryDetail, "beta", false);

      const insidersPercentHeld = helperFunc(
        helper,
        majorHoldersBreakdown,
        "insidersPercentHeld",
        true
      );

      const insidersPercentHeldFmt = helperFuncFmt(
        helper,
        majorHoldersBreakdown,
        "insidersPercentHeld",
        false
      );

      const industry = helperFunc(helper, "assetProfile", "industry", false);
      const sector = helperFunc(helper, "assetProfile", "sector", false);
      const fullTimeEmployees = helperFunc(
        helper,
        "assetProfile",
        "fullTimeEmployees",
        false
      );

      const institutionsPercentHeld = helperFunc(
        helper,
        majorHoldersBreakdown,
        "institutionsPercentHeld",
        true
      );

      const institutionsPercentHeldFmt = helperFuncFmt(
        helper,
        majorHoldersBreakdown,
        "institutionsPercentHeld",
        false
      );

      const quickRatio = helperFunc(helper, financialData, "quickRatio", true);

      const currentRatio = helperFunc(
        helper,
        financialData,
        "currentRatio",
        true
      );

      const earningsGrowth = helperFunc(
        helper,
        financialData,
        "earningsGrowth",
        true
      );

      const earningsGrowthFmt = helperFuncFmt(
        helper,
        financialData,
        "earningsGrowth",
        true
      );

      const revenueGrowth = helperFunc(
        helper,
        financialData,
        "revenueGrowth",
        true
      );

      const revenueGrowthFmt = helperFuncFmt(
        helper,
        financialData,
        "revenueGrowth",
        true
      );

      const grossMargins = helperFunc(
        helper,
        financialData,
        "grossMargins",
        true
      );

      const grossMarginsFmt = helperFuncFmt(
        helper,
        financialData,
        "grossMargins",
        true
      );

      const ebitdaMargins = helperFunc(
        helper,
        financialData,
        "ebitdaMargins",
        true
      );

      const ebitdaMarginsFmt = helperFuncFmt(
        helper,
        financialData,
        "ebitdaMargins",
        true
      );

      const operatingMargins = helperFunc(
        helper,
        financialData,
        "operatingMargins",
        true
      );

      const operatingMarginsFmt = helperFuncFmt(
        helper,
        financialData,
        "operatingMargins",
        true
      );

      const forwardPE = helperFunc(helper, summaryDetail, "forwardPE", true);

      const forwardPEFmt = helperFuncFmt(
        helper,
        summaryDetail,
        "forwardPE",
        true
      );

      const profitMargins = helperFunc(
        helper,
        financialData,
        "profitMargins",
        true
      );

      const profitMarginsFmt = helperFuncFmt(
        helper,
        financialData,
        "profitMargins",
        true
      );

      const _52weekChange = helperFunc(
        helper,
        "defaultKeyStatistics",
        "52WeekChange",
        true
      );

      const _52weekChangeFmt = helperFuncFmt(
        helper,
        "defaultKeyStatistics",
        "52WeekChange",
        true
      );

      const _SandP52weekChange = helperFunc(
        helper,
        "defaultKeyStatistics",
        "SandP52WeekChange",
        true
      );

      const enterpriseToRevenue = helperFunc(
        helper,
        "defaultKeyStatistics",
        "enterpriseToRevenue",
        true
      );

      const website = helperFunc(helper, "assetProfile", "website", false);

      //Insert data
      //Insert data
      //Insert data

      dataDictHelper["mcap"] = mcapB;
      dataDictHelper["stockPrice"] = stockPrice;
      dataDictHelper["regularMarketVolume"] = regularMarketVolume;
      dataDictHelper["sharesShort"] = sharesShort;
      dataDictHelper["sharesShortPerc"] = sharesShortPerc;
      dataDictHelper["sharesShortPercFmt"] = sharesShortPercFmt;
      dataDictHelper["avgDailyVolume10Day"] = avgDailyVolume10Day;
      dataDictHelper["posSizeToAvgVol"] = posSizeToAvgVol;
      dataDictHelper["posSizeToAvgVolFmt"] = posSizeToAvgVolFmt;
      dataDictHelper["psTTM"] = priceToSalesTTM;
      dataDictHelper["forwardEps"] = forwardEps;
      dataDictHelper["trailingEps"] = trailingEps;
      dataDictHelper["fiftyTwoWeekHigh"] = fiftyTwoWeekHigh;
      dataDictHelper["fiftyTwoWeekLow"] = fiftyTwoWeekLow;
      dataDictHelper["twoHundredDayAverage"] = twoHundredDayAverage;
      dataDictHelper["twoHundredDayAverageFmt"] = twoHundredDayAverageFmt;
      dataDictHelper["beta"] = beta;
      dataDictHelper["betaFmt"] = betaFmt;
      dataDictHelper["insidersPercentHeld"] = insidersPercentHeld;
      dataDictHelper["insidersPercentHeldFmt"] = insidersPercentHeldFmt;
      dataDictHelper["institutionsPercentHeld"] = institutionsPercentHeld;
      dataDictHelper["institutionsPercentHeldFmt"] = institutionsPercentHeldFmt;
      dataDictHelper["retailPercentHeld"] =
        1 - insidersPercentHeld - institutionsPercentHeld;

      dataDictHelper["retailPercentHeldFmt"] =
        String(
          ((1 - insidersPercentHeld - institutionsPercentHeld) * 100).toFixed(2)
        ) + "%";
      dataDictHelper["quickRatio"] = quickRatio;
      dataDictHelper["currentRatio"] = currentRatio;
      dataDictHelper["earningsGrowth"] = earningsGrowth;
      dataDictHelper["earningsGrowthFmt"] = earningsGrowthFmt;
      dataDictHelper["revenueGrowth"] = revenueGrowth;
      dataDictHelper["revenueGrowthFmt"] = revenueGrowthFmt;
      dataDictHelper["grossMargins"] = grossMargins;
      dataDictHelper["grossMarginsFmt"] = grossMarginsFmt;
      dataDictHelper["ebitdaMargins"] = ebitdaMargins;
      dataDictHelper["ebitdaMarginsFmt"] = ebitdaMarginsFmt;
      dataDictHelper["operatingMargins"] = operatingMargins;
      dataDictHelper["operatingMarginsFmt"] = operatingMarginsFmt;
      dataDictHelper["profitMargins"] = profitMargins;
      dataDictHelper["profitMarginsFmt"] = profitMarginsFmt;
      dataDictHelper["fullTimeEmployees"] = fullTimeEmployees;
      dataDictHelper["industry"] = industry;
      dataDictHelper["sector"] = sector;
      dataDictHelper["52weekChange"] = _52weekChange;
      dataDictHelper["52weekChangeFmt"] = _52weekChangeFmt;
      dataDictHelper["distFrom52WkHigh"] = distFrom52WkHigh;
      dataDictHelper["distFrom52WkHighFmt"] = distFrom52WkHighFmt;
      dataDictHelper["distFrom52WkLow"] = distFrom52WkLow;
      dataDictHelper["distFrom52WkLowFmt"] = distFrom52WkLowFmt;
      dataDictHelper["SandP52WeekChange"] = _SandP52weekChange;
      dataDictHelper["ps"] = enterpriseToRevenue;
      dataDictHelper["forwardPE"] = forwardPE;
      dataDictHelper["forwardPEFmt"] = forwardPEFmt;
      if (trailingEps !== 0 && trailingEps) {
        dataDictHelper["peTTM"] = stockPrice / trailingEps;
      } else {
        dataDictHelper["peTTM"] = null;
      }
      dataDict[key]["companyUrl"] = website;

      if (mcapB !== undefined && mcapB && mcapB !== 0) {
        dataDictHelper["arkStake"] = dataDictHelper["dollars"] / mcapB;
      } else {
        dataDictHelper["arkStake"] = null;
      }

      putTickerToDB(key, dataDictHelper, dataDict[key]);
    } catch (err) {
      dataDict[key]["date"][globalDateHelper]["arkStake"] = null;
      putTickerToDB(
        key,
        dataDict[key]["date"][globalDateHelper],
        dataDict[key]
      );
    }
  }
};

const changeData = async () => {
  await new Promise((r) => setTimeout(r, 80000));
  let queryRes = await collection.find({}).toArray();
  let avgSI = {};
  let arkk = {};
  let sellsByDate = {};
  arkk["date"] = {};
  let arkw = {};
  arkw["date"] = {};
  let arkf = {};
  arkf["date"] = {};
  let arkg = {};
  arkg["date"] = {};
  let arkx = {};
  arkx["date"] = {};
  let arkq = {};
  arkq["date"] = {};
  let combined = {};
  combined["date"] = {};
  avgSI["date"] = {};
  let aumEntryIndex = 0;
  let datesArr = [];

  for (let i = 0; i < queryRes.length; i++) {
    let count = 0;
    let datesDict = null;
    let pricesDict = null;
    try {
      datesDict = queryRes[i]["date"];
      pricesDict = queryRes[i]["prices"];
    } catch (err) {
      continue;
    }
    if (queryRes[i]["symbol"] === undefined) {
      continue;
    }

    const priceDict = await getHistoricalPriceData(
      queryRes[i]["symbol"],
      queryRes[i]["date"]
    );

    for (const [date, data] of Object.entries(priceDict)) {
      top5MinAndMax(arkk, "ARKK", datesDict, date, data);
      top5MinAndMax(arkg, "ARKG", datesDict, date, data);
      top5MinAndMax(arkq, "ARKQ", datesDict, date, data);
      top5MinAndMax(arkw, "ARKW", datesDict, date, data);
      top5MinAndMax(arkf, "ARKF", datesDict, date, data);
      top5MinAndMax(arkx, "ARKX", datesDict, date, data);
      top5MinAndMax(combined, "Combined", datesDict, date, data);
    }

    let prevEntry = null;
    let totalBuys = 0;
    let totalSells = 0;
    let last10DaySells = 0;
    let last10DayBuys = 0;
    let companyAvgSI = [];
    let earliestDate = null;

    for (const [date, data] of Object.entries(datesDict)) {
      try {
        if (count === 0) {
          count += 1;
          prevEntry = data;
          earliestDate = date;

          continue;
        }
        count += 1;

        if (queryRes[i]["symbol"] === "aumEntry") {
          aumEntryIndex = i;
          queryRes[i]["price"] = priceDict;
          queryRes[i]["arkkCharts"] = arkk;
          queryRes[i]["arkqCharts"] = arkq;
          queryRes[i]["arkgCharts"] = arkg;
          queryRes[i]["arkwCharts"] = arkw;
          queryRes[i]["arkfCharts"] = arkf;
          queryRes[i]["arkxCharts"] = arkx;
          queryRes[i]["combined"] = combined;
          queryRes[i]["date"][date]["change"] = {};
          queryRes[i]["date"][date]["change"]["totalAumChange"] =
            queryRes[i]["date"][date]["totalAum"] - prevEntry["totalAum"];
          queryRes[i]["date"][date]["change"]["totalAumChangePercent"] =
            queryRes[i]["date"][date]["totalAum"] / prevEntry["totalAum"] - 1;

          queryRes[i]["date"][date]["change"]["aumChangeArkk"] =
            queryRes[i]["date"][date]["arkkAum"] - prevEntry["arkkAum"];
          queryRes[i]["date"][date]["change"]["aumChangeArkkPercent"] =
            queryRes[i]["date"][date]["arkkAum"] / prevEntry["arkkAum"] - 1;

          queryRes[i]["date"][date]["change"]["aumChangeArkg"] =
            queryRes[i]["date"][date]["arkgAum"] - prevEntry["arkgAum"];
          queryRes[i]["date"][date]["change"]["aumChangeArkgPercent"] =
            queryRes[i]["date"][date]["arkgAum"] / prevEntry["arkgAum"] - 1;

          queryRes[i]["date"][date]["change"]["aumChangeArkq"] =
            queryRes[i]["date"][date]["arkqAum"] - prevEntry["arkqAum"];
          queryRes[i]["date"][date]["change"]["aumChangeArkqPercent"] =
            queryRes[i]["date"][date]["arkqAum"] / prevEntry["arkqAum"] - 1;

          queryRes[i]["date"][date]["change"]["aumChangeArkw"] =
            queryRes[i]["date"][date]["arkwAum"] - prevEntry["arkwAum"];
          queryRes[i]["date"][date]["change"]["aumChangeArkwPercent"] =
            queryRes[i]["date"][date]["arkwAum"] / prevEntry["arkwAum"] - 1;

          queryRes[i]["date"][date]["change"]["aumChangeArkf"] =
            queryRes[i]["date"][date]["arkfAum"] - prevEntry["arkfAum"];
          queryRes[i]["date"][date]["change"]["aumChangeArkfPercent"] =
            queryRes[i]["date"][date]["arkfAum"] / prevEntry["arkfAum"] - 1;

          queryRes[i]["date"][date]["change"]["aumChangeArkx"] =
            queryRes[i]["date"][date]["arkxAum"] - prevEntry["arkxAum"];
          queryRes[i]["date"][date]["change"]["aumChangeArkxPercent"] =
            queryRes[i]["date"][date]["arkxAum"] / prevEntry["arkxAum"] - 1;
        } else {
          queryRes[i]["date"][date]["change"] = {};
          queryRes[i]["price"] = priceDict;
          queryRes[i]["date"][date]["change"]["shareChangeSinceTracking"] =
            queryRes[i]["date"][date]["shares"] -
            queryRes[i]["date"][earliestDate]["shares"];
          queryRes[i]["date"][date]["change"]["percShareChangeSinceTracking"] =
            queryRes[i]["date"][date]["shares"] /
              queryRes[i]["date"][earliestDate]["shares"] -
            1;

          queryRes[i]["date"][date]["change"][
            "percShareChangeSinceTrackingFmt"
          ] =
            (
              (queryRes[i]["date"][date]["shares"] /
                queryRes[i]["date"][earliestDate]["shares"] -
                1) *
              100
            ).toFixed(2) + "%";

          queryRes[i]["date"][date]["change"]["fundCountChange"] =
            Object.keys(queryRes[i]["date"][date]["fundAllocation"]).length -
            Object.keys(prevEntry["fundAllocation"]).length;

          queryRes[i]["date"][date]["change"]["totalShareCountChange"] =
            queryRes[i]["date"][date]["shares"] - prevEntry["shares"];

          Object.entries(queryRes[i]["date"][date]["fundAllocation"]).forEach(
            (elem1) => {
              Object.entries(prevEntry["fundAllocation"]).forEach((elem2) => {
                if (elem1[0] === elem2[0]) {
                  if (!datesArr.includes(date)) {
                    datesArr.push(date);
                  }
                  if (elem1[1]["shares"] > elem2[1]["shares"]) {
                    if (date in sellsByDate) {
                      sellsByDate[date][elem1[0]]["buys"] += 1;
                    } else {
                      sellsByDate[date] = {};
                      ["ARKK", "ARKG", "ARKQ", "ARKW", "ARKF", "ARKX"].map(
                        (fund) => {
                          if (elem1[0] === fund) {
                            sellsByDate[date][elem1[0]] = {};
                            sellsByDate[date][elem1[0]]["buys"] = 1;
                            sellsByDate[date][elem1[0]]["sells"] = 0;
                          } else {
                            sellsByDate[date][fund] = {};
                            sellsByDate[date][fund]["buys"] = 0;
                            sellsByDate[date][fund]["sells"] = 0;
                          }
                        }
                      );
                    }
                  }

                  if (elem1[1]["shares"] < elem2[1]["shares"]) {
                    if (date in sellsByDate) {
                      sellsByDate[date][elem1[0]]["sells"] += 1;
                    } else {
                      sellsByDate[date] = {};
                      ["ARKK", "ARKG", "ARKQ", "ARKW", "ARKF", "ARKX"].map(
                        (fund) => {
                          if (elem1[0] === fund) {
                            sellsByDate[date][elem1[0]] = {};
                            sellsByDate[date][elem1[0]]["buys"] = 0;
                            sellsByDate[date][elem1[0]]["sells"] = 1;
                          } else {
                            sellsByDate[date][fund] = {};
                            sellsByDate[date][fund]["buys"] = 0;
                            sellsByDate[date][fund]["sells"] = 0;
                          }
                        }
                      );
                    }
                  }
                }
              });
            }
          );

          queryRes[i]["date"][date]["change"]["totalDollarsChange"] =
            queryRes[i]["date"][date]["dollars"] - prevEntry["dollars"];

          queryRes[i]["date"][date]["change"]["arkStakeChange"] =
            queryRes[i]["date"][date]["arkStake"] - prevEntry["arkStake"];

          queryRes[i]["date"][date]["change"]["totalShareChangePercent"] =
            queryRes[i]["date"][date]["shares"] / prevEntry["shares"] - 1;

          if (prevEntry["shares"] > queryRes[i]["date"][date]["shares"]) {
            totalSells += 1;
            if (count >= Object.entries(datesDict).length - 9) {
              last10DaySells += 1;
            }
          }

          if (queryRes[i]["date"][date]["shares"] > prevEntry["shares"]) {
            totalBuys += 1;
            if (count >= Object.entries(datesDict).length - 9) {
              last10DayBuys += 1;
            }
          }

          if (queryRes[i]["date"][date]["sharesShortPerc"]) {
            let tick = {};
            tick["x"] = date;
            tick["y1"] = queryRes[i]["date"][date]["sharesShortPerc"] * 100;
            tick["y2"] = queryRes[i]["date"][date]["stockPrice"];
            tick["y3"] = queryRes[i]["date"][date]["shares"];
            companyAvgSI.push(tick);
            if (date in avgSI["date"]) {
              avgSI["date"][date]["avgSI"] +=
                queryRes[i]["date"][date]["sharesShortPerc"];

              avgSI["date"][date]["count"] += 1;
              avgSI["date"][date]["finalAvgSi"] =
                (avgSI["date"][date]["avgSI"] / avgSI["date"][date]["count"]) *
                100;
            } else {
              avgSI["date"][date] = {};
              avgSI["date"][date]["avgSI"] =
                queryRes[i]["date"][date]["sharesShortPerc"];
              avgSI["date"][date]["count"] = 1;
            }
          }

          queryRes[i]["date"][date]["last10DayBuys"] = last10DayBuys;
          queryRes[i]["date"][date]["last10DaySells"] = last10DaySells;
          queryRes[i]["date"][date]["totalSells"] = totalSells;
          queryRes[i]["date"][date]["totalBuys"] = totalBuys;
          if (companyAvgSI.length > 0) {
            queryRes[i]["companyAvgSIArr"] = companyAvgSI;
          }

          if ("ARKX" in prevEntry["fundAllocation"]) {
            if (!("ARKX" in queryRes[i]["date"][date]["fundAllocation"])) {
              queryRes[i]["date"][date]["change"]["shareCountChangeARKX"] =
                -1 * prevEntry["fundAllocation"]["ARKX"]["shares"];
            } else {
              queryRes[i]["date"][date]["change"]["shareCountChangeARKX"] =
                queryRes[i]["date"][date]["fundAllocation"]["ARKX"]["shares"] -
                prevEntry["fundAllocation"]["ARKX"]["shares"];
            }
          }

          if ("ARKK" in prevEntry["fundAllocation"]) {
            if (!("ARKK" in queryRes[i]["date"][date]["fundAllocation"])) {
              queryRes[i]["date"][date]["change"]["shareCountChangeARKK"] =
                -1 * prevEntry["fundAllocation"]["ARKK"]["shares"];
            } else {
              queryRes[i]["date"][date]["change"]["shareCountChangeARKK"] =
                queryRes[i]["date"][date]["fundAllocation"]["ARKK"]["shares"] -
                prevEntry["fundAllocation"]["ARKK"]["shares"];
            }
          }

          if ("ARKQ" in prevEntry["fundAllocation"]) {
            if (!("ARKQ" in queryRes[i]["date"][date]["fundAllocation"])) {
              queryRes[i]["date"][date]["change"]["shareCountChangeARKQ"] =
                -1 * prevEntry["fundAllocation"]["ARKQ"]["shares"];
            } else {
              queryRes[i]["date"][date]["change"]["shareCountChangeARKQ"] =
                queryRes[i]["date"][date]["fundAllocation"]["ARKQ"]["shares"] -
                prevEntry["fundAllocation"]["ARKQ"]["shares"];
            }
          }
          if ("ARKW" in prevEntry["fundAllocation"]) {
            if (!("ARKW" in queryRes[i]["date"][date]["fundAllocation"])) {
              queryRes[i]["date"][date]["change"]["shareCountChangeARKW"] =
                -1 * prevEntry["fundAllocation"]["ARKW"]["shares"];
            } else {
              queryRes[i]["date"][date]["change"]["shareCountChangeARKW"] =
                queryRes[i]["date"][date]["fundAllocation"]["ARKW"]["shares"] -
                prevEntry["fundAllocation"]["ARKW"]["shares"];
            }
          }
          if ("ARKG" in prevEntry["fundAllocation"]) {
            if (!("ARKG" in queryRes[i]["date"][date]["fundAllocation"])) {
              queryRes[i]["date"][date]["change"]["shareCountChangeARKG"] =
                -1 * prevEntry["fundAllocation"]["ARKG"]["shares"];
            } else {
              queryRes[i]["date"][date]["change"]["shareCountChangeARKG"] =
                queryRes[i]["date"][date]["fundAllocation"]["ARKG"]["shares"] -
                prevEntry["fundAllocation"]["ARKG"]["shares"];
            }
          }

          if ("ARKF" in prevEntry["fundAllocation"]) {
            if (!("ARKF" in queryRes[i]["date"][date]["fundAllocation"])) {
              queryRes[i]["date"][date]["change"]["shareCountChangeARKF"] =
                -1 * prevEntry["fundAllocation"]["ARKF"]["shares"];
            } else {
              queryRes[i]["date"][date]["change"]["shareCountChangeARKF"] =
                queryRes[i]["date"][date]["fundAllocation"]["ARKF"]["shares"] -
                prevEntry["fundAllocation"]["ARKF"]["shares"];
            }
          }
        }
        prevEntry = data;
      } catch (err) {}
    }
  }
  let avgSIArr = [];

  queryRes[aumEntryIndex]["tradesByFund"] = sellsByDate;

  for (const [key, value] of Object.entries(avgSI["date"])) {
    let tick = {};
    tick["x"] = key;
    // @ts-ignore:next-line
    tick["y"] = value["finalAvgSi"];
    avgSIArr.push(tick);
  }

  queryRes[aumEntryIndex]["avgSIArr"] = avgSIArr;

  for (let i = 0; i < queryRes.length; i++) {
    await collection.replaceOne({ symbol: queryRes[i]["symbol"] }, queryRes[i]);
  }

  console.log("script finished");
};

const startScript = async () => {
  await getCsvFiles();

  try {
    const query = { symbol: "aumEntry" };
    let aumEntry = await collection.findOne(query);

    aumEntry["date"][globalDateHelper] = {};
    aumEntry["date"][globalDateHelper]["totalAum"] =
      arkkAUM + arkgAUM + arkwAUM + arkqAUM + arkfAUM + arkxAUM;
    aumEntry["date"][globalDateHelper]["arkkAum"] = arkkAUM;
    aumEntry["date"][globalDateHelper]["arkgAum"] = arkgAUM;
    aumEntry["date"][globalDateHelper]["arkqAum"] = arkqAUM;
    aumEntry["date"][globalDateHelper]["arkwAum"] = arkwAUM;
    aumEntry["date"][globalDateHelper]["arkfAum"] = arkfAUM;
    aumEntry["date"][globalDateHelper]["arkxAum"] = arkxAUM;
    await collection.replaceOne(query, aumEntry);
  } catch (err) {}
};

startScript();
changeData();
