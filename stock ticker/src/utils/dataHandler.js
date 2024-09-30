// Utilities for data processing and handling

// Parse the ticker data from the server response
function parseTickerData(buffer) {
    const packets = [];
    const packetSize = 17;  // 4 (Symbol) + 1 (Buy/Sell) + 4 (Quantity) + 4 (Price) + 4 (Sequence)

    for (let i = 0; i < buffer.length; i += packetSize) {
        const symbol = buffer.slice(i, i + 4).toString(); // 4 bytes for the symbol
        const buySell = buffer.slice(i + 4, i + 5).toString(); // 1 byte for Buy/Sell
        const quantity = buffer.readInt32BE(i + 5);  // 4 bytes for quantity (Big Endian)
        const price = buffer.readInt32BE(i + 9);     // 4 bytes for price (Big Endian)
        const sequence = buffer.readInt32BE(i + 13); // 4 bytes for sequence (Big Endian)

        packets.push({ symbol, buySell, quantity, price, sequence });
    }

    return packets;
}

// Check for any missing sequences
function checkMissingSequences(packets) {
    const missing = [];
    let expectedSeq = packets[0].sequence;

    for (const packet of packets) {
        while (expectedSeq < packet.sequence) {
            missing.push(expectedSeq);  // Add missing sequence
            expectedSeq++;
        }
        expectedSeq++;
    }

    return missing;
}

// Request missing packets from the server
async function requestMissingPackets(missingSequences, client) {
    for (const seq of missingSequences) {
        client.requestResendPacket(seq);
        // You may add a delay between requests if needed
    }
}

module.exports = { parseTickerData, checkMissingSequences, requestMissingPackets };
