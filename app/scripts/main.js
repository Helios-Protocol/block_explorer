var web3_main = require('./web3.js');
var helios_web3 = web3_main.web3;
var fileSaver = require("file-saver");

var HeliosUtils = require('helios-utils');
var ConnectionMaintainer = HeliosUtils.ConnectionMaintainer;
var getNodeMessageFromError = HeliosUtils.getNodeMessageFromError;

var geolocationHelpers = require("./geolocation_helpers.js");

var networkNames = {
    1: "Mainnet",
    42: "Hypothesis Testnet"
}
var networkBlockExplorerURLs =  {
    1: "heliosprotocol.io/block-explorer/",
    42: "heliosprotocol.io/block-explorer-hypothesis/"
}

var availableNodes = {
    1: [
        "wss://bootnode.heliosprotocol.io:30304",
        "wss://bootnode2.heliosprotocol.io:30304",
        "wss://bootnode3.heliosprotocol.io:30304",
        "wss://masternode1.heliosprotocol.io:30304"
    ],
    42: [
        "wss://hypothesis1.heliosprotocol.io:30304"
    ]
};

function getNetworkIdFromURL(){
    var URL = window.location.href
    for (var k in networkBlockExplorerURLs){
        if(URL.includes(networkBlockExplorerURLs[k])){
            console.log("Got network id "+ k + " from url")
            return k;
        }
    }
    return 1;

}

var connectionMaintainer = new ConnectionMaintainer(helios_web3, availableNodes, undefined, getNetworkIdFromURL());
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
    if (typeof window.geolocationHelpers === 'undefined'){
        window.geolocationHelpers = geolocationHelpers;
    }
    if (typeof window.networkNames === 'undefined'){
        window.networkNames = networkNames;
    }
    if (typeof window.networkBlockExplorerURLs === 'undefined'){
        window.networkBlockExplorerURLs = networkBlockExplorerURLs;
    }
}


module.exports = {
    fileSaver: fileSaver,
    helios_web3: helios_web3,
    connectionMaintainer:connectionMaintainer,
    getNodeMessageFromError:getNodeMessageFromError,
    geolocationHelpers: geolocationHelpers,
    networkNames: networkNames,
    networkBlockExplorerURLs: networkBlockExplorerURLs
};
