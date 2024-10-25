import axios from 'axios';
import dayjs from 'dayjs';

const API_KEY = 'XOLA7URKCZHU7C9X'; // Alpha Vantage API key
const BASE_URL = 'https://www.alphavantage.co/query';

export const fetchStockList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`);
    const { top_gainers, top_losers } = response.data;
    const combinedData = [...top_gainers, ...top_losers].map(stock => ({
      symbol: stock.ticker,
      name: stock.ticker,
      price: parseFloat(stock.price),
      change: parseFloat(stock.change_percentage),
    }));
    return combinedData;
  } catch (error) {
    console.error('Error fetching stock list:', error);
    throw error;
  }
};

export const fetchStockDetail = async (symbol) => {
  try {
    const [quoteResponse, overviewResponse] = await Promise.all([
      axios.get(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`),
      axios.get(`${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`)
    ]);

    const quote = quoteResponse.data['Global Quote'];
    const overview = overviewResponse.data;

    return {
      symbol,
      name: overview.Name || symbol,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['10. change percent']),
      volume: parseInt(quote['06. volume']),
      marketCap: overview.MarketCapitalization,
      pe: parseFloat(overview.PERatio),
      pb: parseFloat(overview.PriceToBookRatio)
    };
  } catch (error) {
    console.error(`Error fetching details for ${symbol}:`, error);
    throw error;
  }
};

export const fetchStockCandles = async (symbol) => {
  try {
    const response = await axios.get(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}&outputsize=compact`
    );

    const timeSeriesData = response.data['Time Series (Daily)'];
    return Object.entries(timeSeriesData).map(([date, data]) => ({
      time: dayjs(date).unix(),
      open: parseFloat(data['1. open']),
      high: parseFloat(data['2. high']),
      low: parseFloat(data['3. low']),
      close: parseFloat(data['4. close']),
      volume: parseFloat(data['5. volume'])
    })).reverse();
  } catch (error) {
    console.error(`Error fetching candles for ${symbol}:`, error);
    throw error;
  }
};