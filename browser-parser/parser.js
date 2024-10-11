const url = 'https://www.microfocus.com/en-us/products?trial=true';

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

async function extractProductInfo(url) {
  try {
    
    // initially I was using cheerio and axios to load the data but it did not work. Upon realizing the content was being generated 
    // client-side, I switched to using puppeteer since it's able to retrieve dynamic page elements.

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    const content = await page.content();
    const $ = cheerio.load(content);

    let products = [];

    // upon inspection of the website, the class of the card body was "uk-card-body uk-text-small"
    // I then used various cheerio functions for selection to get each piece of information, i.e.
    // the first letter of the name, etc.

    $('.uk-card-body.uk-text-small').each((index, element) => {
      const name = $(element).find('h3.uk-card-title a.block-header').text().trim();
      const productUrl = nameElement.attr('href');
      const startingLetter = name.charAt(0);
      const description = $(element).find('.description p').text().trim();
      const freeTrialUrl = $(element).find('.cta-buttons a.uk-button-primary').attr('href') || null;

      // for each card I encountered, I created a new object with each of the desired attributes from above
      // and pushed it to the JSON array

      products.push({
        'Product Name': name,
        'Starting Letter': startingLetter,
        'Description': description,
        'Product URL': productUrl,
        'Free Trial / Demo Request URL': freeTrialUrl
      });
    });

    // finally, I also logged the json and wrote it to the products.json file

    console.log(products);
    const jsonOutput = JSON.stringify(products, null, 2);
    fs.writeFileSync('products.json', jsonOutput);
    console.log('Product data saved to products.json');

    await browser.close();
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
  }
}

extractProductInfo(url);