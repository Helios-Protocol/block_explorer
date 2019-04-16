function populateAddressDetails(address){
    if(address !== undefined) {
        if (connectionMaintainer.isConnected()) {
            console.log("Populating address details");
            web3.hls.getNewestBlocks(1, 0, undefined, address, false)
            .then(function(blocks){
                if(blocks.length == 0 || blocks[0] === undefined){
                    $('#account_details_overview').html("This account does not exist.")
                    return;
                }
                var block = blocks[0];
                var options = { day: 'numeric', year: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName:'short'};
                var d = new Date(block['timestamp']*1000);

                var html = "<div class='clear_both'>" +
                            "<h3 class='hash'>Wallet/Chain address " + block['chainAddress']+ "</h3>" +
                            "<div class='clear_both'><div class='object_detail_label'>Account balance (HLS)</div><div class='object_detail_description'>" + web3.utils.fromWei(block['accountBalance']) + "</div></div>" +
                            "<div class='clear_both'><div class='object_detail_label'>Length of chain</div><div class='object_detail_description'>" + block['number'] + " blocks</div></div>" +
                            "<div class='clear_both'><div class='object_detail_label'>Date of last block</div><div class='object_detail_description'>" + d.toLocaleString('en-US',options) + "</div></div>" +
                            "<div class='clear_both'><div class='object_detail_label'>Account hash</div><div class='object_detail_description'>" + block['accountHash'] + "</div></div>" +
                            "</div>";

                $('#account_details_overview').html(html)
            })
            .catch(function(error){
                popup(error);
            })
        }
    }
}

async function checkIfAddressExists(address){
    if(address !== undefined) {
        if (connectionMaintainer.isConnected()) {
            return web3.hls.getNewestBlocks(1, 0, undefined, address, false)
            .then(function(blocks){
                if(blocks.length == 0 || blocks[0] === undefined){
                    return false;
                }else{
                    return true;
                }
            })
            .catch(function(error){
                return false;
            })
        }
    }
}