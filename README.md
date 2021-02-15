# CoinMarketCap-GApps
A Google Apps Script Library for accessing the CoinMarketCap API

# How to use
- Create an API account on [CoinMarketCap](https://coinmarketcap.com)
- Follow the [Google Docs](https://developers.google.com/apps-script/guides/sheets) for creating a new App Script in your spreadsheet
- Copy the Code.gs contents into your new App Script
- Replace the `API_KEY = 'enter-your-key-here'` with your CoinMarketCap API key
- Save your script with the disk icon at the top of the page
- You should now be able to access this custom function via Google Sheets `=CRYPTOPRICES("BTC", "USD")`

# Cache Busting
By default, this script caches recent requests to avoid overloading a free CoinMarketCap API account.  You only get ~300 requests per day, so use them wisely. There are a few ways to bust the cache if you want to update your values more often:

- The cache will automatically bust every hour by default
- You can supply an optional third parameter "watchValue," which will force the cache to bust if it changes. I have cell A1 set to an arbitrary value that I can change to manually bust my cache, and reference it like so: `=CRYPTOPRICES("BTC", "USD", $A$1)`

# No Warranty, Contributing
This code is provided as-is, and should have no expectation of active maintenance. That said, pull requests are encouraged if you find anything you'd like to add / update.
