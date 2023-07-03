const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8081 })

console.log('system started')

var connections = []

wss.on('connection', function connection(ws) {
    
	connections.push(ws)
	console.log('users connected '+ connections.length)
	
	wss.clients.forEach(function each(client) {
        		if (client !== ws && client.readyState === WebSocket.OPEN) {
          		client.send(connections.length);
        		}
     	 });


    ws.onmessage = ({data}) => {
        wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(`${data}`);
          console.log(`${data}`);
        }
      });
    }
      
	ws.on('close', function(){
		console.log('busa vez')
		connections = connections.filter(function (conn, i){
			return (conn === ws) ? false : true
		})
		
		wss.clients.forEach(function each(client) {
        		if (client !== ws && client.readyState === WebSocket.OPEN) {
          		client.send(connections.length);
        		}
     	 });
		
		console.log('users connected '+ connections.length)
	})

    ws.onerror = function () {
        console.log("Some Error occurred");
    }
});
