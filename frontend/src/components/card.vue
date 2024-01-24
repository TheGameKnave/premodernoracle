<template>
  <div class="cardBorder">
    <div class="card">
      <template
        v-if="!card.layout !== 'split'"
      >
        <img
          :src="require(`@/assets/images/card_templates/${cardTemplate()}.jpg`)"
          class="cardTemplate"
          alt="Card Template"
        >
        <img
          v-if="card.color_identity.length === 2 && !cardTemplate().includes('mcard')"
          :src="require(`@/assets/images/card_templates/${cardTemplate2()}.jpg`)"
          class="cardTemplate2"
          alt="Card Template"
        >
        <span
          v-if="tombstoneFrame()"
          class="cardTombstone"
        >Q</span>
        <div
          ref="cardTitleElement"
          class="cardTitle"
        >{{ card.name }}</div>
        <div
          ref="cardManaCostElement"
          class="cardManaCost"
          v-html="parseSymbols(card.mana_cost)"
        />
        <div 
          :style="{ backgroundImage: 'url(' + card.image_uris.art_crop + ')' }" 
          class="cardImage"/>
        <div
          ref="cardTypeElement"
          class="cardType"
        >{{ card.type_line }}</div>
        <i :class="'cardExpansion ' + card.rarity + ' stroke ss ss-' + card.set"/>
        <i
          v-if="card.rarity !== 'common'" 
          :class="'cardExpansion fill ss ss-' + card.set"
        />
        <i
          ref="cardExpansionElement"
          :class="'cardExpansion ' + card.rarity + ' ss ss-' + card.set"
        />
        <div 
          ref="cardTextElement"
          class="cardText"
          v-html="findSymbols(formatText(card.oracle_text, card.flavor_text))"/>
        <div
          ref="cardArtistElement"
          class="cardArtist"
        ><span class="magicSymbol">L</span>{{ card.artist }}</div>
        <div class="cardDisclaimer">Playtest card—NOT FOR SALE!</div>
        <template v-if="card.power || card.toughness">
          <div
            ref="cardPowerToughnessElement"
            class="cardPowerToughness" 
            v-html="formatPT(card.power + '/' + card.toughness)"
          />
        </template>
      </template>
      <template v-else>
        <img
          :src="card.card_faces[0].image_uris.art_crop"
          alt="Card image"
        >
        <img
          :src="card.card_faces[1].image_uris.art_crop"
          alt="Card image"
        >
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Card',
    props: {
      card: {},
    },
    data() {
      return {
        wubrg: ['W', 'U', 'B', 'R', 'G'],
        symbols: {
          'T': '<span class="manaGeneric">o</span>T',
          'Q': '<span class="manaGeneric">o</span>Q',
          'E': '<span class="manaEnergy"></span>',
          'S': '<span class="manaSnow">o</span>V',
          'C': '<span class="manaGeneric">o</span><span class="manaColorless"></span>',
          'W': '<span class="manaWhite">o</span>W',
          'U': '<span class="manaBlue">o</span>U',
          'B': '<span class="manaBlack">o</span>B',
          'R': '<span class="manaRed">o</span>R',
          'G': '<span class="manaGreen">o</span>G',
          'W/U': '<span class="manaWhite">O</span><span class="manaBlue">/</span>Pi',
          'U/W': '<span class="manaBlue">O</span><span class="manaWhite">/</span>Ip',
          'W/B': '<span class="manaWhite">O</span><span class="manaBlack">/</span>Ps',
          'B/W': '<span class="manaBlack">O</span><span class="manaWhite">/</span>Sp',
          'U/B': '<span class="manaBlue">O</span><span class="manaBlack">/</span>Is',
          'B/U': '<span class="manaBlack">O</span><span class="manaBlue">/</span>Si',
          'R/W': '<span class="manaRed">O</span><span class="manaWhite">/</span>Mp',
          'W/R': '<span class="manaWhite">O</span><span class="manaRed">/</span>Pm',
          'R/U': '<span class="manaRed">O</span><span class="manaBlue">/</span>Mi',
          'U/R': '<span class="manaBlue">O</span><span class="manaRed">/</span>Im',
          'R/B': '<span class="manaRed">O</span><span class="manaBlack">/</span>Ms',
          'B/R': '<span class="manaBlack">O</span><span class="manaRed">/</span>Sm',
          'U/G': '<span class="manaBlue">O</span><span class="manaGreen">/</span>If',
          'G/U': '<span class="manaGreen">O</span><span class="manaBlue">/</span>Fi',
          'G/W': '<span class="manaGreen">O</span><span class="manaWhite">/</span>Fp',
          'W/G': '<span class="manaWhite">O</span><span class="manaGreen">/</span>Pf',
          'G/B': '<span class="manaGreen">O</span><span class="manaBlack">/</span>Fs',
          'B/G': '<span class="manaBlack">O</span><span class="manaGreen">/</span>Sf',
          'W/P': '<span class="manaWhitePhy">O</span>Z',
          'U/P': '<span class="manaBluePhy">O</span>Z',
          'B/P': '<span class="manaBlackPhy">O</span>Z',
          'R/P': '<span class="manaRedPhy">O</span>Z',
          'G/P': '<span class="manaGreenPhy">O</span>Z',
          '10': '<span class="manaGeneric">o</span>º',
          '11': '<span class="manaGeneric">o</span>»',
          '12': '<span class="manaGeneric">o</span>¼',
          '13': '<span class="manaGeneric">o</span>½',
          '14': '<span class="manaGeneric">o</span>¾',
          '15': '<span class="manaGeneric">o</span>¿',
          '16': '<span class="manaGeneric">o</span>À',
          '17': '<span class="manaGeneric">o</span>Á',
          '18': '<span class="manaGeneric">o</span>Â',
          '19': '<span class="manaGeneric">o</span>Ã',
          '20': '<span class="manaGeneric">o</span>Ä',
          'X': '<span class="manaGeneric">o</span>X',
        }
      }
    },
    mounted() {
      this.adjustCardTitleSize();
      this.adjustCardTypeSize();
      this.adjustCardTextSize();
    },
    methods: {
      tombstoneFrame() {
        return (
          this.card.frame_effects && this.card.frame_effects.includes('tombstone')
          || (this.card.oracle_text.includes('this card') && this.card.oracle_text.includes('your graveyard'))
          || (this.card.oracle_text.includes('return ' + this.card.name) && this.card.oracle_text.includes('your graveyard'))
        )
      },
      cardTemplate() {
        let returnString = '';
        if(this.card.colors.length > 1) {
          let costArr = this.card.mana_cost.split(/[{}]+/);
          costArr = costArr.filter(x => x);
          let hybridArr = [];
          for(let i = 0; i < costArr.length; i++) {
            if(costArr[i].includes('/')) {
              hybridArr.push(costArr.splice(i, 1)[0]);
            }
            i++;
          }
          // if hybridArr is not empty and all of its elemets are identical
          // AND if W, U, B, R, G are not in the costArr
          if(hybridArr.length > 0 && hybridArr.every(x => x === hybridArr[0]) && !this.wubrg.some(x => costArr.includes(x))) {
            returnString += hybridArr[0][0].toLowerCase();
          }else{
            returnString += 'm';
          }
        } else if(this.card.colors.length === 1) {
          returnString += this.card.colors[0].toLowerCase();
        } else if(this.card.colors.length === 0) {
          if(this.card.type_line.includes('Land')){
            if(this.card.color_identity.length > 2) {
              returnString += 'ml';
            }else if(this.card.color_identity.length === 0) {
              returnString += 'cl';
            }else{
              returnString += this.card.color_identity[0].toLowerCase() + 'l';
            }
          }else if(this.card.type_line.includes('Artifact')) { 
            returnString += 'a';
          }else{
            returnString += 'c';
          }
        }
        return returnString + 'card'
      },
      cardTemplate2() {
        let costArr = this.card.mana_cost.split(/[{}]+/);
        costArr = costArr.filter(x => x);
        let hybridArr = [];
        for(let i = 0; i < costArr.length; i++) {
          if(costArr[i].includes('/')) {
            hybridArr.push(costArr.splice(i, 1)[0]);
          }
          i++;
        }
        let returnString = (hybridArr[0] ? hybridArr[0][2] : this.card.color_identity[1]).toLowerCase();
        if(this.card.type_line.includes('Land')){
          returnString += 'l';
        }
        return returnString + 'card'
      },
      formatText(text, flavorText) {
        let textBox = '<p>' + text.replace(/\n/g, '</p><p>').replace(/\(/g,'<i>(').replace(/\)/g,')</i>') + '</p>';
        if (flavorText) {
          let ftxt = flavorText.replace(/\n/g, '<br>')
            .replace(/\b\*/g, "<i>")       // Closing asterisk
            .replace(/\*\b/g, "</i>")      // Opening singles
            .replace(/\b'/g, "\u2019")     // Closing singles
            .replace(/'\b/g, "\u2018")     // Opening singles
            .replace(/\b"/g, "\u201d")     // Closing doubles
            .replace(/"\b/g, "\u201c")     // Opening doubles
            .replace(/--/g,  "\u2014")     // em-dashes
          textBox = textBox + '<hr><p><i>' + ftxt + '</i></p>';
        }
        return textBox
      },
      formatPT(string){
        return string.replace(/\*/g,'<span class="smol">★</span>')
      },
      parseSymbols(costGroup) {
        let costString = '<span class="symbolGroup">';
        let costArr = costGroup.split(/[{}]+/);
        costArr = costArr.filter(x => x);
        costArr.forEach(cost => {
          costString += '<span class="symbol">';
          if(!isNaN(cost) && Number(cost) < 10) costString += '<span class="manaGeneric">o</span>' + cost;
          else costString += this.symbols[cost] || cost;
          costString += '</span>';
        });
        return costString + '</span>';
      },
      findSymbols(string) {
        let symbolBuffer = '';
        let readingGroup = false;
        let readingSymbol = false;
        let spacesCount = 0;
        let composedString = '';

        for(let i = 0; i < string.length; i++) {
          if(!readingGroup) {
            if(string[i] === '{') {
              readingGroup = true;
              readingSymbol = true;
            }else{
              composedString += string[i];
            }
          }
          if(readingGroup) {
            if(!readingSymbol) {
              if(string[i] === '{') {
                readingSymbol = true;
                spacesCount = 0;
              }else if(string[i] === ' ') {
                spacesCount++;
              }else{
                readingGroup = false;
                composedString += this.parseSymbols(symbolBuffer);
                symbolBuffer = '';
                for(let j = 0; j < spacesCount; j++) composedString += ' ';
                spacesCount = 0;
                composedString += string[i];
              }
            }
            if(readingSymbol) {
              symbolBuffer += string[i];
              if(string[i] === '}') readingSymbol = false;
            }
          }
        }
        return composedString
      },
      adjustCardTitleSize() {
        const cardTitleElement = this.$refs.cardTitleElement;
        const cardManaCostElement = this.$refs.cardManaCostElement || null;
        let fontSize = parseInt(window.getComputedStyle(cardTitleElement).fontSize);

        while (cardTitleElement.clientWidth + (cardManaCostElement ? cardManaCostElement.clientWidth : 0) > 580) {
          fontSize--;
          cardTitleElement.style.fontSize = `${fontSize}px`;
        }
      },
      adjustCardTypeSize() {
        const cardTypeElement = this.$refs.cardTypeElement;
        const cardExpansionElement = this.$refs.cardExpansionElement || null;
        let fontSize = parseInt(window.getComputedStyle(cardTypeElement).fontSize);

        while (cardTypeElement.clientWidth + (cardExpansionElement ? cardExpansionElement.clientWidth : 0) > 580) {
          fontSize--;
          cardTypeElement.style.fontSize = `${fontSize}px`;
        }
      },
      adjustArtistSize() {
        const cardArtistElement = this.$refs.cardArtistElement;
        const cardPowerToughnessElement = this.$refs.cardPowerToughnessElement || null;
        let fontSize = parseInt(window.getComputedStyle(cardArtistElement).fontSize);

        while (cardArtistElement.clientWidth + (cardPowerToughnessElement ? cardPowerToughnessElement.clientWidth : 0) > 580) {
          fontSize--;
          cardArtistElement.style.fontSize = `${fontSize}px`;
        }
      },
      adjustCardTextSize() {
        const cardTextElement = this.$refs.cardTextElement;
        let fontSize = parseInt(window.getComputedStyle(cardTextElement).fontSize);

        while (cardTextElement.scrollHeight > cardTextElement.clientHeight) {
          fontSize--;
          cardTextElement.style.fontSize = `${fontSize}px`;
        }
        if(cardTextElement.clientHeight < 60) {
          cardTextElement.style.textAlign = 'center';
        }
        let leftoverSpace = 285 - cardTextElement.clientHeight;
        cardTextElement.style.paddingTop = `${leftoverSpace/3}px`;
      },
    }
  }
</script>

<style>
  @import "https://cdn.jsdelivr.net/npm/keyrune@latest/css/keyrune.css";
  /* Magic Title */
  @font-face {
    font-family: "Magic";
    font-style: normal;
    font-weight: 100;
    src: url("~@/assets/fonts/Goudy Medieval Alternate.ttf");
  }
  /* magic text */
  @font-face {
    font-family: "Plantin";
    font-style: normal;
    font-weight: 100;
    src: url("~@/assets/fonts/Plantin.otf");
  }
  /* magic text italic */
  @font-face {
    font-family: "Plantin";
    font-style: italic;
    font-weight: 100;
    src: url("~@/assets/fonts/Plantin-Italic.otf");
  }
  /* magic symbols */
  @font-face {
    font-family: "Magic Symbols";
    font-style: normal;
    font-weight: 100;
    src: url("~@/assets/fonts/MagicSymbols2012 Z.ttf");
  }
  /* some updated symbols */
  @font-face {
    font-family: "Mana";
    font-style: normal;
    font-weight: 100;
    src: url("~@/assets/fonts/mana.ttf");
  }
  /* magic symbols 04 */
  @font-face {
    font-family: "Magic Symbols Old";
    font-style: normal;
    font-weight: 100;
    src: url("~@/assets/fonts/magis2004.ttf");
  }
  .magicSymbol {
    font-family: "Magic Symbols";
  }
  .manaWhite { color: #FAF6D8; }
  .manaWhitePhy { color: #E9E3B1; }
  .manaBlue { color: #C1D7E9; }
  .manaBluePhy { color: #8EBBD1; }
  .manaBlack { color: #BAB1AB; }
  .manaBlackPhy { color: #9B8E8A; }
  .manaRed { color: #E49977; }
  .manaRedPhy { color: #DE8166; }
  .manaGreen { color: #A3C095; }
  .manaGreenPhy { color: #80B092; }
  .manaGeneric { color: #CAC5C0; }
  .manaSnow { color: #fff; }
  .manaEnergy { font-family: 'Mana';}
  .manaColorless { font-family: 'Mana'; font-size: .78em; padding-left: .05em; }
  .cardBorder {
    display: inline-block;
    width: 744px;
    height: 1038px;
    margin: 10px;
    border-radius: 20px;
    background-color: #222;
    zoom: 0.5;
  }
  .card {
    position: relative;
    display: inline-block;
    background-color: #222;
    margin: 38px 36px;
    overflow: hidden;
  }
  .cardTemplate2 {
    position: absolute;
    left: 0;
    top: 0;
    -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0) 60%);
  }
  .cardTitle, .cardType, .cardArtist, .cardDisclaimer, .cardPowerToughness {
    text-shadow: 2px 2px 2px #000;
  }
  .cardManaCost, .symbolGroup {
    text-shadow: none;
    font-family: "Magic Symbols";
    font-style: normal;
  }
  .cardText, .cardManaCost, .cardType, .cardArtist, .cardDisclaimer, .cardPowerToughness {
    font-family: "Plantin";
  }
  .cardTitle, .cardType, .cardArtist {
    white-space: nowrap;
  }
  .cardTombstone {
    position: absolute;
    top: 8px;
    left: 15px;
    font-size: 38px;
    color: gray;
    font-family: "Magic Symbols Old";
  }
  .cardTombstone:before, .cardTombstone:after {
    content: "Q";
    position: absolute;
    left: 0
  }
  .cardTitle {
    position: absolute;
    top: 8px;
    left: 45px;
    font-size: 40px;
    color: #eee;
    font-family: "Magic";
    letter-spacing: 1px;
  }
  .cardManaCost {
    position: absolute;
    top: 5px;
    right: 45px;
    font-size: 40px;
  }
  .cardImage {
    top: 61px;
    left: 48px;
    position: absolute;
    width: 575px;
    height: 465px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .cardType {
    position: absolute;
    top: 535px;
    left: 45px;
    font-size: 33px;
    color: #eee;
  }
  .cardExpansion {
    position: absolute;
    top: 538px;
    right: 45px;
    font-size: 40px;
  }
  .cardExpansion:before{
    background-size: cover;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    paint-order: stroke fill;
  }
  .cardExpansion.fill, .cardTombstone:after {
    text-shadow: 
    2px 2px 0 black, 
    -2px -2px 0 black, 
    -2px 2px 0 black, 
    2px -2px 0 black,
    2px 1px 0 black, 
    -2px -1px 0 black, 
    -2px 1px 0 black, 
    2px -1px 0 black,
    1px 2px 0 black, 
    -1px -2px 0 black, 
    -1px 2px 0 black, 
    1px -2px 0 black,
    0 2px 0 black,
    0 -2px 0 black,
    2px 0 0 black,
    -2px 0 0 black;
  }
  .cardExpansion.stroke, .cardTombstone:before {
    text-shadow: 
      4px 4px 1px white, 
      -4px -4px 1px white, 
      -4px 4px 1px white, 
      4px -4px 1px white,
      0 4px 1px white,
      0 -4px 1px white,
      4px 0 1px white,
      -4px 0 1px white,
      2px 4px 1px white, 
      -2px -4px 1px white, 
      -2px 4px 1px white, 
      2px -4px 1px white,
      4px 2px 1px white, 
      -4px -2px 1px white, 
      -4px 2px 1px white, 
      4px -2px 1px white;
  }
  .cardExpansion.common.stroke {
    text-shadow: 
      2px 2px 0 white, 
      -2px -2px 0 white, 
      -2px 2px 0 white, 
      2px -2px 0 white,
      0 2px 0 white,
      0 -2px 0 white,
      2px 0 0 white,
      -2px 0 0 white,
      1px 2px 0 white, 
      -1px -2px 0 white, 
      -1px 2px 0 white, 
      1px -2px 0 white,
      2px 1px 0 white, 
      -2px -1px 0 white, 
      -2px 1px 0 white, 
      2px -1px 0 white;
  }
  .cardExpansion.common:before {
    background-color: #222;
  }
  .cardExpansion.uncommon:before {
    background-image: radial-gradient(#ccc 0%, #333 100%);
  }
  .cardExpansion.rare:before {
    background-image: radial-gradient(#dc8 0%, #984 100%);
  }
  .cardExpansion.mythic:before {
    background-image: radial-gradient(#e90 0%, #b32 100%);
  }
  .cardText {
    position: absolute;
    top: 585px;
    left: 60px;
    font-size: 33px;
    color: #222;
    width: 555px;
    max-height: 285px;
    overflow-x: scroll;
  }
  .smol {
    font-size: .7em;
    position: relative;
    top: -8px;
  }
  .cardText p {
    margin: 10px 0;
  }
  hr {
    border: 0;
    margin-block-end: 0;
    margin-block-start: 0;
    padding: .3em 0;
    position: relative;
    overflow: hidden;
    min-height: .3rem;
  }
  hr:before {
    content: "";
    width: 100%;
    position: absolute;
    border: 0;
    height: 2px;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
  }
  .cardPowerToughness{
    position: absolute;
    bottom: 15px;
    right: 27px;
    font-size: 48px;
    color: #eee;
  }
  .cardArtist{
    position: absolute;
    bottom: 35px;
    left: 45px;
    font-size: 30px;
    color: #eee;
  }
  .cardDisclaimer{
    position: absolute;
    bottom: 15px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 20px;
    color: #eee;
  }
</style>