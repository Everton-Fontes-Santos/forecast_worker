const queue = require('./queue')
require('dotenv').config()

queue.subscribe(process.env.CHANNEL,(message) => {
    console.log("processing");
    console.log(message);
})
