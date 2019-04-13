async function populateConnectedNodesDetails(){
    if(connectionMaintainer.isConnected()){
        web3.hls.getConnectedNodes()
        .then(function(connectedNodes){
            console.log(connectedNodes);
            $('#node_info').html('');
            if(connectedNodes.length > 0) {

                for (var i = 0; i < connectedNodes.length; i++) {
                    var node = connectedNodes[i]
                    var html = "<div class='item'>\n" +
                        "                   <h2 class='hash'>Node: " + htmlEntities(node['url']) + ",&nbsp;</h2>" +
                        "                    <div class='block_list_details'><h4>Stake: " + web3.utils.fromWei(node['stake']) + ",&nbsp;</h4></div>" +
                        "                    <div class='block_list_details'><h4>IP Aaddress: " + node['ipAddress'] + ",&nbsp;</h4></div>" +
                        "                    <div class='block_list_details'><h4>TCP port: " + node['tcpPort'] + ",&nbsp;</h4></div>" +
                        "                    <div class='block_list_details'><h4>UDP port: " + node['udpPort'] + ",&nbsp;</h4></div>" +
                        "                    <div class='block_list_details'><h4>Requests sent: " + node['requestsSent'] + ",&nbsp;</h4></div>" +
                        "                    <div class='block_list_details'><h4>Failed requests: " + node['failedRequests'] + ",&nbsp;</h4></div>" +
                        "                    <div class='block_list_details'><h4>Average response time (ms): " + node['averageResponseTime']/1000 + ",&nbsp;</h4></div>"
                        "                </div>";
                    $('#node_info').append(html);
                }
            }else{
                $('#node_info').html('No connected nodes');
            }
        })
        .catch(function(error){
            popup(error);
        })
    }
}
