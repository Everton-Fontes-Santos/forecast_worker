const redis = require('redis')
require('dotenv').config()


let client
if(!process.env.REDIS_HOST){
    client = redis.createClient()
}
else{
    client = redis.createClient({
        socket:{
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        },
        password: process.env.REDIS_PASSWORD,
        username: process.env.REDIS_USER,
        //url: process.env.REDIS_URL
    })
}

client.connect()

client.on('error', err => {
    console.log('Error ' + err);
});

async function publish(channel, value) {
    console.log('Message sent!', value);
    return client.publish(channel, JSON.stringify(value));
}
 
async function subscribe(channelSubscribed, callback) {
    client.subscribe(channelSubscribed, (message, channel) => {
        console.log('Message arrived!');
        callback(message);
    });
}
 
module.exports = {
    publish,
    subscribe,
    client
}

