var express = require('express');
var router = express.Router();
const https = require('https');
const { displayRandomCardsFromEachSet, findFirstPrinting } = require('../helpers');
const dataConst = require('../data/dataConst.json');

router.get('/', function(req, res, next) {
  res.send({
    message: 'api works'
  });
})
router.get('/random', async function(req, res, next) {
  // console.log('/random',req.body)

  try {
    const randomCards = await displayRandomCardsFromEachSet();
    return res.send(randomCards);
  } catch (error) {
    console.error(error);
    return res.status(500).send('An error occurred while fetching random cards');
  }
});

router.post('/cards', async function(req, res, next) {
  const payload = req.body; // Access the payload from the request
  // console.log('payload',payload,req.route.path);
  const results = {};
  let cardData = [];

  async function fetchPage(url) {
    const pageUrl = new URL(url); // Parse the next_page URL

    const pageOptions = {
      hostname: pageUrl.hostname,
      path: pageUrl.pathname + pageUrl.search, // Use the path and query from the URL
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'premodern-oracle/1.0',
        'Accept': '*/*',
      },
      method: 'GET', // Use GET method
    };

    return new Promise((resolve, reject) => {
      const proxyRequest = https.request(pageOptions, (proxyResponse) => {
        let data = '';
        proxyResponse.setEncoding('utf8');
        proxyResponse.on('data', (chunk) => {
          data += chunk;
        });

        proxyResponse.on('end', () => {
          // console log the first 80 characters of data
          // console.log(url,'data', data.slice(0, 80));
          const responseData = JSON.parse(data);
          // console.log(url,'data', responseData.data);
          if(responseData?.data) cardData.push(...responseData.data);
          resolve(); // Resolve the promise when the fetch operation is complete
        });
      });

      proxyRequest.on('error', (error) => {
        console.error('Error proxying request to 3rd party API:', error);
        reject(new Error('Error proxying request to 3rd party API')); // Reject the promise with an error
      });

      proxyRequest.end();
    });
  }

  // Use Promise.all with an array to store the fetched data in the correct order
  await Promise.all(payload.cardList.map(async (cardName, index) => {
    cardData = [];
    if (!global.cache[cardName.toLowerCase().normalize("NFD").normalize('NFKD').replace(/[\u0300-\u036f]/g, "")] || (new Date().getTime() - (global.cache[cardName.toLowerCase().normalize("NFD").normalize('NFKD').replace(/[\u0300-\u036f]/g, "")]?.time.getTime() || 0) > 24 * 60 * 60 * 1000)) {
      const initialPageUrl = `https://api.scryfall.com/cards/search?order=released&dir=asc&unique=prints&q=name%3D${encodeURIComponent(`${cardName}`)}`;
      const fetchedData = await fetchPage(initialPageUrl, index); // Start fetching the initial page for each item
      // console.log('fetchedData',initialPageUrl,fetchedData);
      // console.log(cardData)
      let firstPrinting = findFirstPrinting(cardName,cardData);
      if(firstPrinting){
        // console.log('firstPrinting',firstPrinting.name);
        if(firstPrinting?.card_faces?.length > 1){
          firstPrinting.arts = [];
          for(let i = 0; i < firstPrinting.card_faces.length; i++){
            firstPrinting.arts[i] = [];
            for(let j = 0; j < cardData.length; j++){
              if(cardData[j].name === firstPrinting.name){
                console.log('cardData[j].card_faces[i]',cardData[j].name,cardData[j].card_faces[i])
                firstPrinting.arts[i].push({
                  art_crop: cardData[j].card_faces[i].image_uris?.art_crop || cardData[j].image_uris?.art_crop,
                  artist: cardData[j].card_faces[i].artist,
                });
              }
            }
          }
        }else{
          firstPrinting.arts = [
            cardData.filter(card => card.name === firstPrinting.name).map(card => {
              return {
                art_crop: card.image_uris.art_crop,
                artist: card.artist,
              }
            })
          ];
        }
        global.cache[cardName.toLowerCase().normalize("NFD").normalize('NFKD').replace(/[\u0300-\u036f]/g, "")] = {
          time: new Date(),
          data: firstPrinting,
        };
      }
    }
    results[cardName] = dataConst[cardName.toLowerCase().normalize("NFD").normalize('NFKD').replace(/[\u0300-\u036f]/g, "")]?.data || global.cache[cardName.toLowerCase().normalize("NFD").normalize('NFKD').replace(/[\u0300-\u036f]/g, "")]?.data || {};
  }));

  let orderedResults = {};
  payload.cardList.forEach(cardName => {
    orderedResults[global.cache[cardName.toLowerCase().normalize("NFD").normalize('NFKD').replace(/[\u0300-\u036f]/g, "")]?.data?.name || cardName] = results[cardName];
  });
  // console.log('results:',orderedResults);
  res.send(JSON.stringify({...orderedResults,...req.body}));
});


module.exports = router