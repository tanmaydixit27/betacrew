const TcpClient = require('./services/tcpClient');

// Initialize and connect to the server
const client = new TcpClient();
client.connect();
