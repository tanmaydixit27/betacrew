const assert = require('assert');
const TcpClient = require('../src/services/tcpClient');

describe('TCP Client', () => {
    it('should connect to the server', () => {
        const client = new TcpClient();
        assert.doesNotThrow(() => client.connect(), 'Connection failed');
    });
});
