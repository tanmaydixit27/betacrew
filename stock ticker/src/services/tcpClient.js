const net = require('net');
const { parseTickerData, checkMissingSequences, requestMissingPackets } = require('../utils/dataHandler');
const { SERVER_HOST, SERVER_PORT } = require('../../config/config');
const fs = require('fs');

// TCP Client Class
class TcpClient {
    constructor() {
        this.client = new net.Socket();
        this.buffer = '';
        this.packets = [];  // To store received packets
    }

    // Method to connect to the server and request data
    connect() {
        this.client.connect(SERVER_PORT, SERVER_HOST, () => {
            console.log(`Connected to BetaCrew server at ${SERVER_HOST}:${SERVER_PORT}`);
            
            // Send request to stream all packets (Call Type 1)
            const payload = Buffer.from([0x01]); // 0x01 is "Stream All Packets"
            this.client.write(payload);
        });

        // On receiving data from the server
        this.client.on('data', (data) => {
            this.buffer += data.toString('hex');  // Store incoming data as hex

            // Process the data when a full packet is received
            const packets = parseTickerData(Buffer.from(this.buffer, 'hex'));
            this.packets.push(...packets);  // Add the parsed packets to the list
            this.buffer = '';  // Clear buffer after processing
        });

        // Handle connection errors
        this.client.on('error', (err) => {
            console.error(`Connection error: ${err.message}`);
        });

        // When the server closes the connection
        this.client.on('close', async () => {
            console.log('Connection closed by the server');
            
            // Check for missing sequences
            const missingSequences = checkMissingSequences(this.packets);

            // Request missing packets
            if (missingSequences.length > 0) {
                console.log(`Requesting missing sequences: ${missingSequences}`);
                await requestMissingPackets(missingSequences, this);
            }

            // Save the final data to JSON file
            fs.writeFileSync('./data/tickers.json', JSON.stringify(this.packets, null, 2));
            console.log('Data saved to tickers.json');
        });
    }

    // Method to request specific missing packets (Call Type 2)
    requestResendPacket(seqNumber) {
        const payload = Buffer.from([0x02, seqNumber]); // Call Type 2 with sequence number
        this.client.write(payload);
    }
}

module.exports = TcpClient;
