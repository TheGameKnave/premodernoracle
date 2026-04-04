const https = require('https');

function findFirstPrinting(cardName,cardData){
  const normalize = str => str.toLowerCase().normalize("NFD").normalize('NFKD').replace(/[\u0300-\u036f]/g, "");
  const normalizedInput = normalize(cardName);

  // Prefer exact name match first
  let exactMatches = cardData.filter(card => normalize(card.name) === normalizedInput && card.reprint === false);
  if (exactMatches.length >= 1) return exactMatches[0];

  // Fall back to substring match
  let possibilities = cardData.filter(card => {
    console.log('firstPrinting: ', normalize(card.name), normalizedInput)
    return normalize(card.name).includes(normalizedInput) && card.reprint === false;
  });
  if (possibilities.length > 1) {
    let narrowedPossibilities = possibilities.filter(card => normalize(card.name) === normalizedInput);
    if(narrowedPossibilities.length >= 1){
      return narrowedPossibilities[0];
    }
  }
  return possibilities[0];
}

// Function to fetch all expansion sets from the Scryfall API
async function fetchExpansionSets() {
  console.log('fetchExpansionSets');
  return new Promise((resolve, reject) => {
    https.get('https://api.scryfall.com/sets', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('data', JSON.parse(data));
        const sealedProductSets = JSON.parse(data).data.filter((set) => ['core','expansion','draft_innovation'].includes(set.set_type) && set.digital === false);
        // sort expansions by released_at ascending
        sealedProductSets.sort((a, b) => new Date(a.released_at) - new Date(b.released_at));
        console.log('sealedProductSets', sealedProductSets.length, JSON.stringify(sealedProductSets.map(set => set.code)));
        resolve(sealedProductSets);
      });
    }).on('error', (error) => {
      console.log('error', error);
      reject(error);
    });
  });
}
// Function to fetch a random card from a specific expansion set
async function fetchAllCardsFromSet(setCode) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.scryfall.com/cards/search?q=set%3A${setCode}`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Function to display random card from each expansion set
const displayRandomCardsFromEachSet = async function() {
  try {
    const expansionSets = await fetchExpansionSets();
    let randomCards = [];

    for (const set of expansionSets) {
      const allCards = await fetchAllCardsFromSet(set.code);
      // select one common at random from the set (if there are any)
      const commons = allCards.data?.filter(card => card.rarity === 'common' && !['Plains','Island','Swamp','Mountain','Forest'].includes(card.name));
      const randomCommon = commons?.length ? commons[Math.floor(Math.random() * commons?.length)] : null;
      const uncommons = allCards.data?.filter(card => card.rarity === 'uncommon');
      const randomUncommon = uncommons?.length ? uncommons[Math.floor(Math.random() * uncommons?.length)] : null;
      const rares = allCards.data?.filter(card => card.rarity === 'rare');
      const randomRare = rares?.length ? rares[Math.floor(Math.random() * rares?.length)] : null;
      const mythics = allCards.data?.filter(card => card.rarity === 'mythic');
      const randomMythic = mythics?.length ? mythics[Math.floor(Math.random() * mythics?.length)] : null;
      const randoms = [randomCommon, randomUncommon, randomRare, randomMythic].filter(card => card !== null)
      const randomReturn = randoms.map(card => ({set: set.name, card: card.name }));
      console.log('randomReturn', randomReturn);
      randomCards = [...randomCards, ...randomReturn];
    }
    // create an object with the set as the key and the card as the value
    const randomCardsObject = randomCards.reduce((obj, item, index) => {
      obj[index + ' ' + item.set] = item.card;
      return obj;
    }, {});

    return randomCardsObject;
  } catch (error) {
    console.error('Error fetching random cards:', error);
    throw error;
  }
}

module.exports = {
  displayRandomCardsFromEachSet,
  findFirstPrinting,
};