const { Server } = require("socket.io");
const io = new Server({
    cors:true
});

module.exports = {io}