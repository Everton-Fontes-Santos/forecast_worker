require('dotenv').config()
const { default: axios } = require('axios')
const Stocks = require('stocks.js/dist/stocks')
const { forecast } = require('./MinMaxScaler')
const queue = require('./queue')

const timeframe = process.env.TIMEFRAME || 15

let send = false
const main = async ()=>{
    const date = new Date()
    if(date.getDay() === 0 || date.getDay() === 6){
        return
    }
    if(date.getMinutes() % timeframe !== 0 ){
        send = false
        return
    }
    if(send) return
    send=true
    const dataToSend = [[]]
    
    const stock = new Stocks(process.env.API_KEY)
    try{
        const tickers = await stock.timeSeries({
            symbol: 'EURUSD',
            interval: stock.INTERVALS[2],
            amount: 15
           });
        
           tickers.forEach((ticker)=>{
            dataToSend[0].push([ticker.close])
        })
        dataToSend[0].push([0])
        const response = await axios.post(
            'https://tensor-serving.onrender.com/v1/models/saved_model:predict',
            { "instances": dataToSend}
        )
        
        const data = response?.data
        if(!data) return
        const prediction = data.predictions[0][0]
        const scaledPrediction = forecast.m15.inverseScale(prediction)
        const last_close = tickers.at(0).close
        await queue.publish(process.env.CHANNEL, {
            forecast: scaledPrediction,
            last_close,
            timeframe
        })

        process.exit()
    }catch(err){
        console.log(err)
        process.exit()
    }    
}
console.log("Starting worker")
// setInterval(main, 1000);
main()
// 