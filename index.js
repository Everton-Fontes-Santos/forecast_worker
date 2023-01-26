require('dotenv').config()
const { default: axios } = require('axios')
const Stocks = require('stocks.js/dist/stocks')
const { forecast } = require('./MinMaxScaler')
const queue = require('./queue')

const timeframe = process.env.TIMEFRAME || 15
const minutes = 60 * timeframe * 1000


const main = async ()=>{
    const dataToSend = [[]]
    const stock = new Stocks(process.env.API_KEY)
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
    await queue.publish(process.env.CHANNEL, scaledPrediction)
}
console.log(minutes)
setInterval(main, minutes);
