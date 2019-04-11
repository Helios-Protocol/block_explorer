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

    $('body').on('click', '.view_block', function(e) {
        var hash = $(this).data('hash');
        getBlockByHash(hash)
        .then(function(block){
            $('#block_info').html('');
            for (var key in block) {
                if (block.hasOwnProperty(key)) {
                    console.log(key, block[key]);
                    $('#block_info').append(key +': '+block[key] + "<br>");
                }
            }
        });
    });

    $('body').on('click', '.view_transaction', function(e) {
        var hash = $(this).data('hash');
        getTransactionByHash(hash)
        .then(function(tx){
            $('#transaction_info').html('');
            for (var key in tx) {
                if (tx.hasOwnProperty(key)) {
                    console.log(key, tx[key]);
                    $('#transaction_info').append(key +': '+tx[key] + "<br>");
                }
            }
        });
    });



});

//
// newest block and transaction functions
//

function connectedCallback(){
    populateNewestBlocks();
    populateNewestTransactions();
}
function populateNewestBlocks(start) {
    console.log("populating newest blocks")
    if(start === undefined){
        start=0;
    }
    if(connectionMaintainer.isConnected()) {
        web3.hls.getNewestBlocks(newBlockListLength, start)
            .then(function (block_list) {
                console.log(block_list);
                $('#new_block_list').html('');
                block_list.forEach(function (block) {
                    blockCache[block['hash']] = block;
                    var numberOfTransactions = block.transactions.length + block.receiveTransactions.length;
                    var type1RewardAmount = (block.rewardBundle.rewardType1 !== undefined && block.rewardBundle.rewardType1.amount !== undefined) ? block.rewardBundle.rewardType1.amount : 0;
                    var type2RewardAmount = (block.rewardBundle.rewardType2 !== undefined && block.rewardBundle.rewardType2.amount !== undefined) ? block.rewardBundle.rewardType2.amount : 0;
                    var stakeReward = web3.utils.toBN(type1RewardAmount).add(web3.utils.toBN(type2RewardAmount));

                    if(!stakeReward.eq(web3.utils.toBN(0))){
                        numberOfTransactions++;
                    }
                    stakeReward = web3.utils.fromWei(stakeReward);
                    var d = new Date();
                    var now = Math.round(d.getTime() / 1000);
                    var timeSinceBlock = now - block['timestamp']

                    var block_html = "<div class='item'>\n" +
                        "                    <a href='#main_page-block' data-hash='" + block['hash'] + "' class='view_block'><h2>Block " + block['number'] + " : " + block['hash'] + "</h2></a>\n" +
                        "                    <div class='block_list_details'><h4>On Chain: " + block['chainAddress'] + ",&nbsp;</h4></div><div class='block_list_details'><h4>Number of Transactions: " + numberOfTransactions + ",&nbsp;</h4></div><div class='block_list_details'><h4>Staking reward: "+stakeReward+" </h4></div>\n" +
                        "                    <div class='clear_both'><h4>" + timeSinceBlock + " seconds ago</h4></div>\n" +
                        "                </div>";
                    $('#new_block_list').append(block_html);
                    if (start <= 0) {
                        $('.newest_blocks_nav.explorer_prev_nav').hide();
                    } else {
                        $('.newest_blocks_nav.explorer_prev_nav').show();
                    }
                    if ((start - newBlockListLength) < 0) {
                        var prev = 0;
                    } else {
                        var prev = start - newBlockListLength;
                    }

                    var next = start + newBlockListLength;
                    $('.newest_blocks_nav.explorer_prev_nav').data('start', prev);
                    $('.newest_blocks_nav.explorer_next_nav').data('start', next);
                    $('.explorer_page_nav').html(start + " - " + next);
                });
            })
    }
}


async function getNewestTransactions(startBlock, startTxIndex, blockLimit, txLimit){
    return web3.hls.getNewestBlocks(blockLimit, startBlock, undefined, undefined, true)
    .then(function (block_list) {
        if(block_list.length === 0){
            throw new Error("No transactions found.")
        }

        var returnTransactions = [];
        var blockCount = 0;

        block_list.forEach(function (block) {
            transactionCache[block['hash']] = block;

            var txIndex = 0;
            var d = new Date();
            var now = Math.round(d.getTime() / 1000);
            var timeSinceBlock = now - block['timestamp']

            //First send transactions
            if (block.transactions !== undefined && block.transactions.length > 0) {

                block.transactions.forEach(function(tx){
                    transactionCache[tx['hash']] = tx;
                    txIndex += 1;
                    if((txIndex >= startTxIndex || blockCount > 0) && returnTransactions.length < txLimit) {
                        var txInfo = {  'timestamp': block['timestamp'],
                                        'description': "Send transaction",
                                        'value': tx['value'],
                                        'to': tx['to'],
                                        'from': tx['from'],
                                        'balance': block['accountBalance'],
                                        'blockNumber': block['number'],
                                        'hash': tx['hash'],
                                        'type': 0};
                        returnTransactions.push(txInfo);
                    }
                    if(returnTransactions.length >= txLimit){
                        return [returnTransactions, startBlock+blockCount, txIndex]
                    }
                })
            }

            //Next receive transactions
            if (block.receiveTransactions !== undefined && block.receiveTransactions.length > 0) {
                block.receiveTransactions.forEach(function(tx){
                    transactionCache[tx['hash']] = tx;
                    txIndex += 1;
                    if((txIndex >= startTxIndex || blockCount > 0) && returnTransactions.length < txLimit) {
                        var txInfo = {  'timestamp': block['timestamp'],
                                        'description': "Receive transaction",
                                        'value': tx['value'],
                                        'to': tx['to'],
                                        'from': tx['from'],
                                        'balance': block['accountBalance'],
                                        'blockNumber': block['number'],
                                        'hash': tx['hash']};
                        returnTransactions.push(txInfo);
                    }
                    if(returnTransactions.length >= txLimit){
                        return [returnTransactions, startBlock+blockCount, txIndex]
                    }

                });
            }

            //Next reward transactions
            if (block.rewardBundle !== undefined) {
                var tx = block.rewardBundle;
                transactionCache[tx['hash']] = tx;
                txIndex += 1;
                if((txIndex >= startTxIndex || blockCount > 0) && returnTransactions.length < txLimit) {
                    if (tx.rewardType1 !== undefined && tx.rewardType1.value !== 0) {
                        var rewardType1Value = tx.rewardType1.value;
                    }else{
                        var rewardType1Value = 0;
                    }
                    if(tx.rewardType2 !== undefined && tx.rewardType2.value !== 0){
                        var rewardType2Value = tx.rewardType2.value;
                    }else{
                        var rewardType2Value = 0;
                    }

                    var txInfo = {  'timestamp': block['timestamp'],
                                    'description': "Stake reward",
                                    'value': rewardType1Value+rewardType2Value,
                                    'to': block['chainAddress'],
                                    'from': 'Coinbase',
                                    'balance': block['accountBalance'],
                                    'blockNumber': block['number'],
                                    'hash': tx['hash']};
                    returnTransactions.push(txInfo);
                }
            }
            blockCount ++;
            if(returnTransactions.length >= txLimit){
                return [returnTransactions, startBlock+blockCount, txIndex]
            }
        });
        return [returnTransactions, startBlock+blockCount, 0]
    });
}


async function getNewestTransactionsFullLimit(startBlock, startTxIndex, limit) {
    if(startBlock === undefined){
        startBlock=0;
    }
    if(startTxIndex === undefined){
        startTxIndex=0;
    }
    if(limit === undefined){
        limit=10;
    }

    var currentBlock = startBlock;
    var currentTxIndex = startTxIndex
    var currentLimit = limit
    var returnTransactions = [];

    if(connectionMaintainer.isConnected()) {
        while(true) {
            try {
                var result = await getNewestTransactions(currentBlock, currentTxIndex, 10, currentLimit)
            }catch(error){
                if(returnTransactions.length > 0){
                    console.log("getNewestTransactions returned error "+error);
                    return [returnTransactions, currentBlock, currentTxIndex];
                }else{
                    throw new Error(error);
                }
            }
            returnTransactions = returnTransactions.concat(result[0]);
            currentBlock = result[1];
            currentTxIndex = result[2];
            currentLimit = limit-returnTransactions.length;
            if(returnTransactions.length >= limit){
                return [returnTransactions, currentBlock, currentTxIndex]
            }
        }
    }
}


async function populateNewestTransactions(startBlock, startTxIndex, limit, page) {
    console.log("populating newest transactions starting at block "+startBlock);
    if(startBlock === undefined){
        startBlock=0;
    }
    if(startTxIndex === undefined){
        startTxIndex=0;
    }
    if(limit === undefined){
        limit=10;
    }
    if(page === undefined){
        page=0;
    }


    if(connectionMaintainer.isConnected()) {
        getNewestTransactionsFullLimit(startBlock, startTxIndex, limit)
        .then(function (result) {
            var transactions = result[0];
            var blockIndex = result[1];
            var txIndex = result[2];

            if (transactions.length === 0) {
                popup("No more transactions");
                return;
            }

            $('#new_transaction_list').html("");

            transactions.forEach(function (txInfo) {

                var d = new Date();
                var now = Math.round(d.getTime() / 1000);
                var timeSinceBlock = now - txInfo['timestamp'];

                var transaction_html = "<div class='item'>\n" +
                    "                    <a href='#main_page-transaction' data-hash='" + txInfo['hash'] + "' class='view_transaction'><h2>Transaction " + txInfo['hash'] + "</h2></a>\n" +
                    "                    <div class='block_list_details'><h4>Type: " + txInfo['description'] + ",&nbsp;</h4></div>" +
                    "                    <div class='block_list_details'><h4>From: " + txInfo['from'] + ",&nbsp;</h4></div>" +
                    "                    <div class='block_list_details'><h4>To: " + txInfo['to'] + ",&nbsp;</h4></div>" +
                    "                    <div class='clear_both'><h4>" + timeSinceBlock + " seconds ago</h4></div>\n" +
                    "                </div>";
                $('#new_transaction_list').append(transaction_html);

            });


            if (startBlock <= 0 && startTxIndex <= 0) {
                $('.newest_transactions_nav.explorer_prev_nav').hide();
            } else {
                $('.newest_transactions_nav.explorer_prev_nav').show();
            }

            if (transactions.length < limit) {
                $('.newest_transactions_nav.explorer_next_nav').hide();
            } else {
                $('.newest_transactions_nav.explorer_next_nav').show();
            }

            var nav_start = page * limit;
            var nav_end = nav_start + transactions.length;

            if(page <= 1){
                $('.newest_transactions_nav.explorer_prev_nav').data('start_block', 0).data('start_tx', 0).data('page', 0);
            }else{
                $('.newest_transactions_nav.explorer_prev_nav').data('start_block', newestTransactionsPageIdx[page-1][0]).data('start_tx', newestTransactionsPageIdx[page-1][1]).data('page', page-1);
            }


            $('.newest_transactions_nav.explorer_next_nav').data('start_block', blockIndex).data('start_tx', txIndex).data('page', page+1);
            newestTransactionsPageIdx[page+1] = [blockIndex, txIndex];


            $('.explorer_new_tx_page_nav').html(nav_start + " - " + nav_end);

        })
        // .catch(function(error){
        //     popup(error);
        // })
    }
}


async function getBlockByHash(hash){
    if(blockCache[hash] !== undefined){
        return blockCache[hash];
    }else{
        return await web3.hls.getBlock(hash, true);
    }

}

async function getTransactionByHash(hash){
    if(transactionCache[hash] !== undefined){
        return transactionCache[hash];
    }else{
        return await web3.hls.getTransactionByHash(hash);
    }

}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
