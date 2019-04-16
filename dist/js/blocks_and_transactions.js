
//
// Block details functions
//

function populateBlockDetails(hash) {
    getBlockByHash(hash)
    .then(function (block) {
        //header
        $('#block_header_details').html('');
        $('#block_header_details').append("<div class='clear_both'></div><div class='object_detail_label'>Block hash</div><div class='object_detail_description'>" + block.hash + "</div></div>");
        $('#block_header_details').append("<div class='clear_both'><div class='object_detail_label'>Block number</div><div class='object_detail_description'>" + block.number + "</div></div>");
        $('#block_header_details').append("<div class='clear_both'><div class='object_detail_label'>Timestamp</div><div class='object_detail_description'>" + block.timestamp + "</div></div>");
        $('#block_header_details').append("<div class='clear_both'></div><div class='object_detail_label'>Chain address</div><div class='object_detail_description'><a href='#main_page-address&"+block.chainAddress+"'>" + block.chainAddress + "</a></div></div>");
        $('#block_header_details').append("<div class='clear_both'><div class='object_detail_label'>Signed by</div><div class='object_detail_description'><a href='#main_page-address&"+block.sender+"'>" + block.sender + "</a></div></div>");
        $('#block_header_details').append("<div class='clear_both'><div class='object_detail_label'>Account hash</div><div class='object_detail_description'>" + block.accountHash + "</div></div>");
        $('#block_header_details').append("<div class='clear_both'><div class='object_detail_label'>Account balance</div><div class='object_detail_description'>" + web3.utils.fromWei(block.accountBalance) + "</div></div>");
        $('#block_header_details').append("<div class='clear_both'><div class='object_detail_label'>Gas used (Gwei)</div><div class='object_detail_description'>" + block.gasUsed + "</div></div>");
        $('#block_header_details').append("<div class='clear_both'><div class='object_detail_label'>Extra data</div><div class='object_detail_description'>" + block.extraData + "</div></div>");
        $('#block_header_details').append("<div class='clear_both'><div class='object_detail_label'>Parent hash</div><div class='object_detail_description'>" + block.parentHash + "</div></div>");
        $('#block_header_details').append("<div class='clear_both'><div class='object_detail_label'>Stake reward hash</div><div class='object_detail_description'>" + block.rewardHash + "</div></div>");
        $('#block_header_details').append("<div class='clear_both'><div class='object_detail_label'>Receipts root</div><div class='object_detail_description'>" + block.receiptsRoot + "</div></div>");
        $('#block_header_details').append("<div class='clear_both'><div class='object_detail_label'>Send transactions root</div><div class='object_detail_description'>" + block.transactionsRoot + "</div></div>");
        $('#block_header_details').append("<div class='clear_both'><div class='object_detail_label'>Receive transactions root</div><div class='object_detail_description'>" + block.receiveTransactionsRoot + "</div></div>");
        $('#block_header_details').append("<div class='clear_both'><div class='object_detail_label'>Block size (bytes)</div><div class='object_detail_description'>" + block.size + "</div></div>");

        //
        //send transactions
        //
        $('#block_send_transactions_details').html('');
        if(block.transactions.length > 0){
            for(var i = 0; i < block.transactions.length; i++){
                var sendTx = block.transactions[i];
                var html = getDetailHtmlForSendTx(sendTx)

                $('#block_send_transactions_details').append(html);
            }
        }else{
            $('#block_send_transactions_details').html('No send transactions');
        }

        //
        //receive transactions
        //
        $('#block_receive_transactions_details').html('');
        if(block.receiveTransactions.length > 0){
            for(var i = 0; i < block.receiveTransactions.length; i++){
                var tx = block.receiveTransactions[i];
                var html = getDetailHtmlForReceiveTx(tx)

                $('#block_receive_transactions_details').append(html);
            }
        }else{
            $('#block_receive_transactions_details').html('No receive transactions');
        }

        //
        // Stake reward
        //
        var rewardBundle = block.rewardBundle;
        var type1RewardAmount = (rewardBundle.rewardType1 !== undefined && rewardBundle.rewardType1.amount !== undefined) ? rewardBundle.rewardType1.amount : 0;
        var type2RewardAmount = (rewardBundle.rewardType2 !== undefined && rewardBundle.rewardType2.amount !== undefined) ? rewardBundle.rewardType2.amount : 0;
        $('#block_reward_bundle_details').html('');

        var html = "<div class='clear_both'>" +
                    "<div class='clear_both'><div class='object_detail_label'>Hash</div><div class='object_detail_description'>" + rewardBundle['hash'] + "</div></div>" +
                    "<div class='clear_both'><div class='object_detail_label'>Type 1 amount (HLS)</div><div class='object_detail_description'>" + web3.utils.fromWei(type1RewardAmount) + "</div></div>" +
                    "<div class='clear_both'><div class='object_detail_label'>Type 2 amount (HLS)</div><div class='object_detail_description'>" + web3.utils.fromWei(type2RewardAmount) + "</div></div>" +
                    "</div>";

        $('#block_reward_bundle_details').append(html);
        $('#block_reward_bundle_details').append("<div class='clear_both'><h3>Reward type 2 proofs</h3></div>");

        //
        // Stake reward type 2 proofs
        //
        if(rewardBundle.rewardType2.proof.length > 0){
            for(var i = 0; i < rewardBundle.rewardType2.proof.length ; i++){
                var proof = rewardBundle.rewardType2.proof [i];
                var html = "<div class='clear_both'>" +
                            "<h4>Proof #" + i + "</h4>" +
                            "<div class='clear_both'><div class='object_detail_label'>Sender wallet address</div><div class='object_detail_description'><a href='#main_page-address&"+proof.sender+"'>" + proof.sender + "</a></div></div>" +
                            "<div class='clear_both'><div class='object_detail_label'>Recipient wallet address</div><div class='object_detail_description'><a href='#main_page-address&"+proof.recipientNodeWalletAddress+"'>" + proof.recipientNodeWalletAddress + "</a></div></div>" +
                            "<div class='clear_both'><div class='object_detail_label'>Score (max 100,000)</div><div class='object_detail_description'>" + proof.score + "</div></div>" +
                            "<div class='clear_both'><div class='object_detail_label'>Timestamp</div><div class='object_detail_description'>" + proof.timestamp + "</div></div>" +
                            "<div class='clear_both'><div class='object_detail_label'>Previous reward block #</div><div class='object_detail_description'>" + proof.sinceBlockNumber + "</div></div>" +
                            "<div class='clear_both'><div class='object_detail_label'>Chain head hash of sender</div><div class='object_detail_description'>" + proof.headHashOfSenderChain + "</div></div>" +
                            "</div>";

                $('#block_reward_bundle_details').append(html);
            }
        }else{
            $('#block_reward_bundle_details').append('No reward type 2 proofs');
        }


    });
}

function getDetailHtmlForSendTx(sendTx){
    var html = "<div class='clear_both'>" +
                "<a href='#main_page-transaction&"+sendTx['hash']+"'><h3 class='hash'>Tx "+sendTx['transactionIndex']+" with hash " + sendTx['hash'] + "</h3></a>" +
                "<div class='clear_both'><div class='object_detail_label'>Transaction index</div><div class='object_detail_description'>" + sendTx.transactionIndex + "</div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>Block hash</div><div class='object_detail_description'><a href='#main_page-block&"+sendTx['blockHash']+"'>"+sendTx['blockHash']+" </a></div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>From</div><div class='object_detail_description'><a href='#main_page-address&"+sendTx.from+"'>" + sendTx.from + "</a></div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>To</div><div class='object_detail_description'><a href='#main_page-address&"+sendTx.to+"'>" + sendTx.to + "</a></div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>Amount (HLS)</div><div class='object_detail_description'>" + web3.utils.fromWei(sendTx.value) + "</div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>Max gas (Gwei)</div><div class='object_detail_description'>" + sendTx.gas + "</div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>Gas used</div><div class='object_detail_description'>" + sendTx.gasUsed + "</div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>Gas price (Gwei)</div><div class='object_detail_description'>" + web3.utils.fromWei(sendTx.gasPrice, 'gwei') + "</div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>Total gas cost (HLS)</div><div class='object_detail_description'>" + web3.utils.fromWei(web3.utils.toBN(sendTx.gasUsed).mul(web3.utils.toBN(sendTx.gasPrice))) + "</div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>Data</div><div class='object_detail_description'>" + sendTx.data + "</div></div>" +
                "</div>";
    return html;
}

function getDetailHtmlForReceiveTx(tx) {
    var html = "<div class='clear_both'>" +
                "<a href='#main_page-transaction&" + tx['hash'] + "'><h3 class='hash'>Tx " + tx['transactionIndex'] + " with hash " + tx['hash'] + "</h3></a>" +
                "<div class='clear_both'><div class='object_detail_label'>Block hash</div><div class='object_detail_description'><a href='#main_page-block&"+tx['blockHash']+"'>"+tx['blockHash']+"</a></div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>From</div><div class='object_detail_description'><a href='#main_page-address&"+tx.from+"'>" + tx.from + "</a></div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>To</div><div class='object_detail_description'><a href='#main_page-address&"+tx.to+"'>" + tx.to + "</a></div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>Amount (HLS)</div><div class='object_detail_description'>" + web3.utils.fromWei(tx.value) + "</div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>Send tx hash</div><div class='object_detail_description'><a href='#main_page-transaction&" + tx['sendTransactionHash'] + "'>" + tx.sendTransactionHash + "</a></div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>Is it a refund?</div><div class='object_detail_description'>" + tx.isRefund + "</div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>Remaining refund</div><div class='object_detail_description'>" + tx.remainingRefund + "</div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>Gas used</div><div class='object_detail_description'>" + tx.gasUsed + "</div></div>" +
                "<div class='clear_both'><div class='object_detail_label'>Gas price (gwei)</div><div class='object_detail_description'>" + web3.utils.fromWei(tx.gasPrice, 'gwei') + "</div></div>" +
                "</div>";
    return html;
}

function populateTransactionDetails(hash){
    getTransactionByHash(hash)
    .then(function(tx){
        $('#transaction_info').html('');
        if(tx['isReceive']){
            $('#transaction_info').append("<h2>Type: Receive transaction</h2>");
            var html = getDetailHtmlForReceiveTx(tx);
        }else{
            $('#transaction_info').append("<h2>Type: Send transaction</h2>");
            var html = getDetailHtmlForSendTx(tx);
        }
        $('#transaction_info').append(html);
    });
}


function populateNewestBlocks(start) {
    console.log("populating newest blocks")
    if(start === undefined){
        start=0;
    }
    if(connectionMaintainer.isConnected()) {
        web3.hls.getNewestBlocks(newBlockListLength, start, undefined, undefined, true)
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
                    "                    <a href='#main_page-block&"+ block['hash'] +"'class='view_block'><h2>Block " + block['number'] + " : " + block['hash'] + "</h2></a>\n" +
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
        .catch(function(error){
            popup(error);
        })
    }
}


function populateNewestBlocksForAddress(start, address) {
    console.log("populating newest blocks for address")
    if(start === undefined){
        start=0;
    }
    if(address !== undefined) {
        if (connectionMaintainer.isConnected()) {
            web3.hls.getNewestBlocks(newBlockListLength, start, undefined, address, true)
            .then(function (blockList) {
                console.log(blockList);
                if(blockList.length == 0 || blockList[0] === undefined){
                    $('#new_blocks_for_address_list').html("<h2>NO BLOCKS ON THIS CHAIN...</h2>");
                    return;
                }
                $('#new_blocks_for_address_list').html('');
                for(var i=0; i<blockList.length; i++){
                    var block = blockList[i];
                    blockCache[block['hash']] = block;
                    var numberOfTransactions = block.transactions.length + block.receiveTransactions.length;
                    var type1RewardAmount = (block.rewardBundle.rewardType1 !== undefined && block.rewardBundle.rewardType1.amount !== undefined) ? block.rewardBundle.rewardType1.amount : 0;
                    var type2RewardAmount = (block.rewardBundle.rewardType2 !== undefined && block.rewardBundle.rewardType2.amount !== undefined) ? block.rewardBundle.rewardType2.amount : 0;
                    var stakeReward = web3.utils.toBN(type1RewardAmount).add(web3.utils.toBN(type2RewardAmount));

                    if (!stakeReward.eq(web3.utils.toBN(0))) {
                        numberOfTransactions++;
                    }
                    stakeReward = web3.utils.fromWei(stakeReward);
                    var d = new Date();
                    var now = Math.round(d.getTime() / 1000);
                    var timeSinceBlock = now - block['timestamp']

                    var block_html = "<div class='item'>\n" +
                        "                    <a href='#main_page-block&" + block['hash'] + "'class='view_block'><h2>Block " + block['number'] + " : " + block['hash'] + "</h2></a>\n" +
                        "                    <div class='block_list_details'><h4>On Chain: " + block['chainAddress'] + ",&nbsp;</h4></div><div class='block_list_details'><h4>Number of Transactions: " + numberOfTransactions + ",&nbsp;</h4></div><div class='block_list_details'><h4>Staking reward: " + stakeReward + " </h4></div>\n" +
                        "                    <div class='clear_both'><h4>" + timeSinceBlock + " seconds ago</h4></div>\n" +
                        "                </div>";
                    $('#new_blocks_for_address_list').append(block_html);
                    if (start <= 0) {
                        $('.newest_blocks_for_address_nav.explorer_prev_nav').hide();
                    } else {
                        $('.newest_blocks_for_address_nav.explorer_prev_nav').show();
                    }
                    if ((start - newBlockListLength) < 0) {
                        var prev = 0;
                    } else {
                        var prev = start - newBlockListLength;
                    }

                    var next = start + newBlockListLength;
                    $('.newest_blocks_for_address_nav.explorer_prev_nav').data('start', prev);
                    $('.newest_blocks_for_address_nav.explorer_next_nav').data('start', next);
                    $('.explorer_new_block_for_address_page_nav').html(start + " - " + next);
                }
            })
            .catch(function (error) {
                popup(error);
            })
        }
    }
}

async function getNewestTransactions(startBlock, startTxIndex, blockLimit, txLimit){
    return await web3.hls.getNewestBlocks(blockLimit, startBlock, undefined, undefined, true)
    .then(function (blockList) {
        if(blockList.length === 0){
            throw new Error("No transactions found.")
        }

        var returnTransactions = [];
        var blockCount = 0;
        for(var i = 0; i < blockList.length; i ++){
            var block = blockList[i];
            blockCache[block['hash']] = block;

            var txIndex = 0;
            var d = new Date();
            var now = Math.round(d.getTime() / 1000);
            var timeSinceBlock = now - block['timestamp']

            //First send transactions
            if (block.transactions !== undefined && block.transactions.length > 0) {
                for(var j = 0; j < block.transactions.length; j++){
                    var tx = block.transactions[j];
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
                                        'blockHash': block['hash'],
                                        'isReward': false};
                        returnTransactions.push(txInfo);
                    }
                    if(returnTransactions.length >= txLimit){
                        return [returnTransactions, startBlock+blockCount, txIndex];
                    }
                }
            }
            //Next receive transactions
            if (block.receiveTransactions !== undefined && block.receiveTransactions.length > 0) {
                for(var j = 0; j < block.receiveTransactions.length; j++){
                    var tx = block.receiveTransactions[j];
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
                                        'hash': tx['hash'],
                                        'blockHash': block['hash'],
                                        'isReward': false};
                        returnTransactions.push(txInfo);
                    }
                    if(returnTransactions.length >= txLimit){
                        return [returnTransactions, startBlock+blockCount, txIndex];
                    }

                }
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
                                    'hash': tx['hash'],
                                    'blockHash': block['hash'],
                                    'isReward': true};
                    returnTransactions.push(txInfo);
                }
            }
            blockCount ++;
            if(returnTransactions.length >= txLimit){
                return [returnTransactions, startBlock+blockCount, txIndex];
            }
        }
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

                if(txInfo.isReward){
                    var hashLink = "#main_page-block&"+ txInfo['blockHash'];
                }else{
                    var hashLink = "#main_page-transaction&"+ txInfo['hash'];
                }
                var transaction_html = "<div class='item'>\n" +
                    "                    <a href='"+ hashLink + "'><h2>"+txInfo['description']+" " + txInfo['hash'] + "</h2></a>\n" +
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
        .catch(function(error){
            popup(error);
        })
    }
}





async function getBlockByHash(hash){
    if(blockCache[hash] !== undefined){
        return blockCache[hash];
    }else{
        return await web3.hls.getBlockByHash(hash, true);
    }

}

async function getTransactionByHash(hash){
    if(transactionCache[hash] !== undefined){
        return transactionCache[hash];
    }else{
        return await web3.hls.getTransactionByHash(hash);
    }

}