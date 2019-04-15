var blockCache = {};
var transactionCache = {};
var newBlockListLength = 10;
var newestTransactionsPageIdx = {}


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

    $('body').on('click', '.historical_gas_price_refresh', function(e) {
        populateHistoricalGasPrice();
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
            console.log(graphData);
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

function prepareHistoricalGasPriceDataForPlot(data){
    return data.map(function(element){
        return [new Date(element[0]*1000), element[1]];
    });

}


