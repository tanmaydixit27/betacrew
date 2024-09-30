const assert = require('assert');
const { parseTickerData } = require('../src/utils/dataHandler');

describe('Data Handler', () => {
    it('should parse valid ticker data', () => {
        const data = '{"symbol": "AAPL", "price": 150.25}\n{"symbol": "GOOGL", "price": 2800.15}\n';
        const tickers = parseTickerData(data);
        assert.strictEqual(tickers.length, 2);
        assert.strictEqual(tickers[0].symbol, 'AAPL');
    });

    it('should return null for invalid data', () => {
        const data = 'invalid data';
        const tickers = parseTickerData(data);
        assert.strictEqual(tickers, null);
    });
});
