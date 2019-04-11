var web3_main = require('./web3.js');
var helios_web3 = web3_main.web3;
var fileSaver = require("file-saver");
var ConnectionMaintainer = require("./node_connection_helpers.js").ConnectionMaintainer;
var getNodeMessageFromError = require("./node_connection_helpers.js").getNodeMessageFromError;

// var availableNodes = [
//     "ws://127.0.0.1:30304",
//     "ws://142.58.49.25:30304"
// ];

// var availableNodes = [
//     "ws://127.0.0.1:30304",
// ];

var availableNodes = [
    "ws://127.0.0.1:30304",
    "wss://bootnode.heliosprotocol.io:30304"
];

var connectionMaintainer = new ConnectionMaintainer(availableNodes);
connectionMaintainer.startNetworkConnectionMaintainerLoop();


if (typeof window !== 'undefined') {
    if (typeof window.helios_web3 === 'undefined'){
        window.helios_web3 = helios_web3;
    }
    if (typeof window.fileSaver === 'undefined'){
        window.fileSaver = fileSaver;
    }
    if (typeof window.connectionMaintainer === 'undefined'){
        window.connectionMaintainer = connectionMaintainer;
    }
    if (typeof window.getNodeMessageFromError === 'undefined'){
        window.getNodeMessageFromError = getNodeMessageFromError;
    }
}


module.exports = {
    fileSaver: fileSaver,
    helios_web3: helios_web3,
    connectionMaintainer:connectionMaintainer,
    getNodeMessageFromError:getNodeMessageFromError
};
