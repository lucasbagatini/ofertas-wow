var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var puppeteer = require('puppeteer');

const submarinoURL = 'https://www.submarino.com.br/especial/oferta-do-dia';
const shoptimeURL = 'https://www.shoptime.com.br/oferta-do-dia';
const americanasURL = 'https://www.americanas.com.br/especial/oferta-do-dia';

router.get('/', function(req, res, next) {
  (async () => {
    const browser = await puppeteer.launch(
      {
        timeout: 15000
      }
    );
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.goto(submarinoURL)
    const content = await page.content();
    var $ = cheerio.load(content);
    const products = [];
    $('div[class*="RippleContainer-"]').each(function(i, element){
      product = {
        name: $(element).find('span[class*="__ProductName-"]').text(),
        price: $(element).find('span[class*="__Price-"]').text(),
        image: $(element).find('img[class*="Image-"]').attr('src')
      }
      console.log(product)
      products.push(product);
    });

    await page.goto(shoptimeURL)
    $ = cheerio.load(await page.content());
    $('div[class*="_ColDayOffer-"]').each(function(i, element){
      product = {
        name: $(element).find('h2[class*="TitleUI-"]').text(),
        price: $(element).find('span[class*="PriceUI-"]').text(),
        image: $(element).find('img[class*="ImageUI-"]').attr('src')
      }
      console.log(product)
      products.push(product);
    });

    await page.goto(americanasURL)
    $ = cheerio.load(await page.content());
    $('div[class*="ColUI-"]').each(function(i, element){
      product = {
        name: $(element).find('h2[class*="TitleUI-"]').text(),
        price: $(element).find('span[class*="PriceUI-"]').text(),
        image: $(element).find('img[class*="ImageUI-"]').attr('src')
      }
      console.log(product)
      products.push(product);
    });

    res.render('index', { products: products });
    browser.close()
  })()
});

module.exports = router;
