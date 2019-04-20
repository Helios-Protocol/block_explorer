var blockCache = {};
var transactionCache = {};
var newBlockListLength = 10;
var newestTransactionsPageIdx = {}
var nodeCache = [];

$( document ).ready(function() {

    //connectionMaintainer.setStatusCallback(set_connection_status);

    web3 = helios_web3;
    connectionMaintainer.setConnectedCallback(connectedCallback);

    $('body').on('click', '.newest_blocks_nav', function(e) {
        var start = $(this).data('start');
        populateNewestBlocks(start);
    });

    $('body').on('click', '.newest_transactions_nav', function(e) {
        var startBlock = $(this).data('start_block');
        var startTx = $(this).data('start_tx');
        var page = $(this).data('page');
        populateNewestTransactions(startBlock, startTx, 10, page);
    });


    $('body').on('click', '.newest_blocks_for_address_nav', function(e) {
        var start = $(this).data('start');
        var walletAddress = $('#current_wallet_address').val();
        populateNewestBlocksForAddress(start, walletAddress);
    });

    $('body').on('click', '.historical_gas_price_refresh', function(e) {
        populateHistoricalGasPrice();
    });

    $('body').on('click', '.historical_tph_cap_refresh', function(e) {
        populateHistoricalNetworkTPHCapability();
    });

    $('body').on('click', '.historical_tph_refresh', function(e) {
        populateHistoricalTPH()
    });

    $('body').on('click', '.search_button', function(e) {
        var searchString = $('#explorer_search_input').val();
        doSearch(searchString)

    });

    $('body').on('submit', '#search_form', function(e) {
        e.preventDefault();
        var searchString = $('#explorer_search_input').val();
        doSearch(searchString)
    });








});


function connectedCallback(){
    goToHashFromURL();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


//
// Historical gas price
//

function populateHistoricalGasPrice(){
    if(connectionMaintainer.isConnected()) {
        console.log("Getting historical gas price");
        web3.hls.getHistoricalGasPrice()
        .then(function (data) {
            console.log(data);
            var graphData = prepareHistoricalGasPriceDataForPlot(data);
            div = document.getElementById("historical_min_gas_plot");
            var g = new Dygraph(div, graphData,{
                                ylabel: 'Minimum gas price (gwei)',
                                xlabel: 'Date/time',
                                labels: ['Date', 'Minimum gas price (gwei)'],
                                animatedZooms: true,
                                color: '#e6d46a'
                            });
        })
    }
}

function populateHistoricalNetworkTPHCapability(){
    if(connectionMaintainer.isConnected()) {
        console.log("Getting historical network tph cap");
        web3.hls.getApproximateHistoricalNetworkTPCCapability()
        .then(function (data) {
            console.log(data);
            var graphData = prepareHistoricalGasPriceDataForPlot(data);
            div = document.getElementById("historical_network_tph_cap_plot");
            var g = new Dygraph(div, graphData,{
                                ylabel: 'Network TPH capability',
                                xlabel: 'Date/time',
                                labels: ['Date', 'Network TPH capability'],
                                animatedZooms: true,
                                color: '#e6d46a'
                            });
        })
    }
}

function populateHistoricalTPH(){
    if(connectionMaintainer.isConnected()) {
        console.log("Getting historical network tph");
        web3.hls.getApproximateHistoricalTPC()
        .then(function (data) {
            console.log(data);
            var graphData = prepareHistoricalGasPriceDataForPlot(data);
            div = document.getElementById("historical_tph_plot");
            var g = new Dygraph(div, graphData,{
                                ylabel: 'Actual TPH',
                                xlabel: 'Date/time',
                                labels: ['Date', 'Actual TPH'],
                                animatedZooms: true,
                                color: '#e6d46a'
                            });
        })
    }
}

async function doSearch(searchString){
    //Figure out if it is an address or hash
    searchString = searchString.trim();
    if(searchString === undefined || searchString === ''){
        popup("Cannot search for an empty string");
        return;
    }
    if(!web3.utils.isHex(searchString)){
        popup("The search term must be in hex format");
        return;
    }

    //it is a hex
    if(searchString.length <= 43){
        // It is an address
        if(!web3.utils.isAddress(searchString)){
            popup("Nothing found that matches your search string.")
            return
        }
        var addressExists = await checkIfAddressExists(searchString);
        if(addressExists === false){
            popup("Nothing found that matches your search string.")
            return
        }
        document.location.hash = "#main_page-address&"+searchString;
    }else{
        // It is a hash
        // First lets try a transaction
        getTransactionByHash(searchString)
        .then(function(result){
            console.log("Search string was found to be a transaction");
            transactionCache[result.hash] = result;
            document.location.hash = "#main_page-transaction&"+searchString;
        })
        .catch(function(error){
            getBlockByHash(searchString)
            .then(function(result){
                console.log("Search string was found to be a block");
                blockCache[result.hash] = result;
                document.location.hash = "#main_page-block&"+searchString;
            })
            .catch(function(error){
                popup("Nothing found that matches your search string.")
            });
        });

    }
}

function prepareHistoricalGasPriceDataForPlot(data){
    return data.map(function(element){
        return [new Date(element[0]*1000), element[1]];
    });
}


