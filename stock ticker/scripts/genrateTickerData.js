const fs = require('fs');
const path = require('path');

const tickers = [
    { symbol: 'AAPL', price: 150.25 },
    { symbol: 'GOOGL', price: 2800.15 },
    { symbol: 'AMZN', price: 3450.45 },
];

const TICKER_FILE = path.join(__dirname, '../data/tickers.json');

fs.writeFile(TICKER_FILE, JSON.stringify(tickers, null, 2), (err) => {
    if (err) {
        console.error('Error writing to JSON file', err);
    } else {
        console.log('Dummy ticker data generated');
    }
});
