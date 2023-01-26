class MinMaxScaler {
    // Constructor to set the min and max values
    constructor(min, max) {
      this.min = min;
      this.max = max;
    }
  
    // Method to scale a value between the min and max values
    scale(value) {
      return (value - this.min) / (this.max - this.min);
    }
  
    // Method to inverse scale a value between the min and max values
    inverseScale(scaledValue) {
      return scaledValue * (this.max - this.min) + this.min;
    }  
  }

forecast = {
    m15: new MinMaxScaler(1.04909778, 1.08648407)
}

module.exports = {
    MinMaxScaler,
    forecast
}