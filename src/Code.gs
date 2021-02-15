const KEY_PREV_WATCH = 'prevWatch';
const KEY_PRICE_CACHE = 'priceCache';
const KEY_LAST_RUN = 'lastRun';
const BUST_CACHE_HOURS = 1;
const API_KEY = 'enter-your-key-here';

const getHours = (date1, date2) => {
  return Math.abs(date1.getTime() - date2.getTime()) / 3600000;
}

/**
 * @param coinSymbol symbol of a currency (ex "BTC")
 * @param conversion symbol of a trading pair (ex "USD")
 * @param watchValue a value that must change before CRYPTOPRICES will run again. If omitted, only runs once per trading pair.
 * @returns the current market price for a given currency & conversion
 * @customfunction
 */
const CRYPTOPRICES = (coinSymbol, conversion, watchValue = undefined) => {
  if (coinSymbol === undefined) {
    throw new Error('coinSymbol required');
  } else if (conversion === undefined) {
    throw new Error('conversion required');
  }
  
  const docProps = PropertiesService.getDocumentProperties();
  const prevWatchValue = docProps.getProperty(KEY_PREV_WATCH);
  let priceCache = docProps.getProperty(KEY_PRICE_CACHE);
  let lastRun = docProps.getProperty(KEY_LAST_RUN);
  const tradingPair = `${coinSymbol}/${conversion}`;

  priceCache = priceCache ? JSON.parse(priceCache) : {};
  lastRun = lastRun ? new Date(lastRun) : new Date(0);
  const shouldUseCache = getHours(new Date(Date.now()), lastRun) <= BUST_CACHE_HOURS;

  if (shouldUseCache && (watchValue === undefined || watchValue == prevWatchValue)) {
    const cachedPrice = priceCache[tradingPair];

    if (cachedPrice !== undefined) {
      docProps.setProperty(KEY_LAST_RUN, new Date(Date.now()).toString());
      return cachedPrice;
    }
  }

  if (watchValue !== undefined) {
    docProps.setProperty(KEY_PREV_WATCH, watchValue);
  }

  if (API_KEY === 'enter-your-key-here') {
    throw new Error('Please enter your API key in the app script');
  }

  const response = UrlFetchApp.fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${coinSymbol}&convert=${conversion}`, {
    method: 'GET',
    headers: {
      'X-CMC_PRO_API_KEY': API_KEY
    }
  });

  const content = JSON.parse(response.getContentText());
  const price = +content.data[coinSymbol].quote[conversion].price;
  
  docProps.setProperties({
    [KEY_PRICE_CACHE]: JSON.stringify({
      ...priceCache,
      [tradingPair]: price,
    }),
    [KEY_LAST_RUN]: new Date(Date.now()).toString()
  });

  return price;
};
