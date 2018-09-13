const webSocketServer = new (require('ws')).Server({port: (process.env.PORT || 5000)})

console.log(`Logged on... ${process.env.PORT}`);
