const axios = require('axios');
'use strict';
const StockModel = require('../models.js').Stock;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function createStock(stock,like,ip) {
  const newStock = new StockModel({
    symbol:stock, 
    likes: like=="true" ? [ip] : []
  });
  const saved = await newStock.save();
  return saved;
}

async function findStock(stock) {
  return await StockModel.findOne({symbol:stock}).exec();
}

async function saveStock(stock,like,ip) {
  let saved = {};
  const foundStock = await findStock(stock);
  if(!foundStock) {
    const newStock = await createStock(stock,like,ip);
    saved = newStock;
    return saved;
  } else {
    // console.log(like,typeof(like),like=="true");
    if(like=="true" && foundStock.likes.indexOf(ip) === -1) {
      foundStock.likes.push(ip);
    }
    saved = await foundStock.save();
    return saved;
  }
}

async function getStock(stock) {
  const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`;
  const response = await fetch(url);
  const { symbol, latestPrice } = await response.json();
  // .log(symbol,latestPrice);
  return { symbol, latestPrice } ;
}

module.exports = function (app) {
  app.route('/api/stock-prices').get(async function (req, res){
    const { stock, like } = req.query;

    if (Array.isArray(stock)) {
      console.log("stocks",stock);
      const {symbol,latestPrice} = await getStock(stock[0]);
      const {symbol:symbol2,latestPrice:latestPrice2} = await getStock(stock[1]);
      // console.log(latestPrice,latestPrice);
      const firstStock = await saveStock(symbol, like, req.ip);
      const secondStock = await saveStock(symbol2, like, req.ip);

      let stockData = []

      if(!symbol) {
        stockData.push({
          rel_likes: firstStock.likes.length - secondStock.likes.length,
        });
      } else {
        stockData.push({
          stock:symbol,
          price:latestPrice,
          rel_likes: firstStock.likes.length - secondStock.likes.length,
        });
      }

      if(!symbol2) {
        stockData.push({
          rel_likes: secondStock.likes.length - firstStock.likes.length,
        });
      } else {
        stockData.push({
          stock:symbol2,
          price:latestPrice,
          rel_likes: secondStock.likes.length - firstStock.likes.length,
        });
      }

      res.json({ stockData });
      return;

    }


    const {symbol, latestPrice} = await getStock(stock);
    if (!symbol) {
      res.json({ stockData:{likes:like=="true" ? 1 : 0} });
      return;
    }
    // console.log(like,typeof(like),like=="true");
    const saved = await saveStock(symbol, like, req.ip);
    console.log("saved stock data",saved);

    res.json({ 
      stockData:{
        stock:symbol,
        price:latestPrice,
        likes:saved.likes.length
      } 
    });

  });
};