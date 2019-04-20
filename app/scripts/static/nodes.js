async function populateConnectedNodesDetails(){
    if(connectionMaintainer.isConnected()){
        return web3.hls.getConnectedNodes()
        .then(function(connectedNodes){
            console.log(connectedNodes);
            nodeCache = connectedNodes;
            $('#node_info').html('');
            if(connectedNodes.length > 0) {

                for (var i = 0; i < connectedNodes.length; i++) {
                    var node = connectedNodes[i]
                    var html = "<div class='item'>\n" +
                        "                   <h2 class='hash'>" + htmlEntities(node['url']) + ",&nbsp;</h2>" +
                        "                    <div class='block_list_details'><h4>Stake: " + web3.utils.fromWei(node['stake']) + ",&nbsp;</h4></div>" +
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

async function doAjax(ip) {
    let result;

    try {
        result = await $.ajax({
            url: ajaxurl,
            type: 'GET',
            data: ip
        });

        return result;
    } catch (error) {
        console.error(error);
    }
}

async function populateLocationCharts(){
    console.log("plotting node locations1")
    if(nodeCache.length > 0){
        console.log("plotting node locations")
        var myChart = echarts.init(document.getElementById('global_node_chart'));
        var locations = {};
        //locations['Canada'] = 1;
        for(var i = 0; i < nodeCache.length; i++){
            var node = nodeCache[i];
            var result = await $.get( "http://ip-api.com/json/"+node.ipAddress);
            var country = result["country"];
            if(country !== undefined){
                if(country in locations){
                    locations[country]++;
                }else{
                    locations[country] = 1;
                }
            }
        }

        var data = [];
        var yellow = false;
        for (var key in locations) {
            if (locations.hasOwnProperty(key)) {
                console.log(key, locations[key]);
                if(yellow){
                    var color="#d4d4d4";
                    yellow = false;
                }else{
                    var color="#e6d46a";
                    yellow = true;
                }
                data.push({
                    value:locations[key],
                    name: key,
                    itemStyle:{color:color}
                })
            }
        }

        option = {
            series : [
                {
                    type: 'pie',
                    radius : '70%',
                    center: ['50%', '50%'],
                    data:data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(100, 100, 100, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    }
}
