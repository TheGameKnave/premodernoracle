<template>
  <div :class="'splitCard face' + face">
    <img
      :src="require(`@/assets/images/card_templates/${cardTemplate()}.jpg`)"
      class="splitCardTemplate"
      alt="Card Template"
    >
    <img
      v-if="colorID.length === 2 && !cardTemplate().includes('msplit')"
      :src="require(`@/assets/images/card_templates/${cardTemplate2()}.jpg`)"
      class="splitCardTemplate2"
      alt="Card Template"
    >
    <div
      class="splitCardTombstoneWrapper"
      v-if="tombstoneFrame()"
    >
      <span class="splitCardTombstone" >Q</span>
      <span class="splitCardTombstoneShadow" >Q</span>
    </div>
    <div
      ref="cardTitleElement"
      class="splitCardTitle"
    >{{ face !== undefined ? card.card_faces[face].name : card.name }}</div>
    <div
      ref="cardManaCostElement"
      class="splitCardManaCost"
      v-html="parseSymbols(face !== undefined ? card.card_faces[face].mana_cost : card.mana_cost)"
    />
    <div 
      :style="{ backgroundImage: 'url(' + (card.image_uris.art_crop) + ')' }" 
      :class="'splitCardImage face' + face"
    />
    <div
      ref="cardTypeElement"
      class="splitCardType"
    >
      {{ face !== undefined ? card.card_faces[face].type_line : card.type_line }}
    </div>
    <div class="splitCardExpansionWrapper">
      <i :class="'cardExpansion ' + card.rarity + ' stroke ss ss-' + card.set" />
      <i
        v-if="card.rarity !== 'common'" 
        :class="'cardExpansion fill ss ss-' + card.set"
      />
      <i
        ref="cardExpansionElement"
        :class="'cardExpansion ' + card.rarity + ' ss ss-' + card.set"
      />
    </div>
    <div 
      ref="cardTextElement"
      :class="'splitCardText ' + (((face !== undefined && card.type_line.includes('Planeswalker')) || card.type_line.includes('Planeswalker')) ? 'planeswalkerText' : '')"
      v-html="findSymbols(formatText(face !== undefined ? card.card_faces[face].oracle_text : card.oracle_text, face !== undefined ? card.card_faces[face].flavor_text : card.flavor_text))"/>
    <div class="splitCardCopyright">©&nbsp;<span>∑</span></div>
    <div
      ref="cardArtistElement"
      class="splitCardArtist"
    ><span class="magicSymbol">L</span>&nbsp;{{ this.face !== undefined ? card.card_faces[this.face].artist : card.artist }}</div>
    <div class="splitCardDisclaimer">Playtest card—NOT FOR SALE</div>
    <template v-if="face !== undefined ? (card.card_faces[face].loyalty || card.card_faces[face].power || card.card_faces[face].toughness) : (card.loyalty || card.power || card.toughness)">
      <div
        ref="cardPowerToughnessElement"
        :class="'splitCardPowerToughness ' + (((face !== undefined && card.card_faces[face].loyalty) || card.loyalty) ? 'cardLoyalty' : '')" 
        v-html="(face !== undefined ? card.card_faces[face].loyalty : card.loyalty) || formatPT((face !== undefined ? card.card_faces[face].power : card.power) + '/' + (face !== undefined ? card.card_faces[face].toughness : card.toughness))"
      />
    </template>
  </div>
</template>

<script>
  import { tombstoneList } from '@/constants';
  export default {
    name: 'SplitCard',
    props: {
      card: {},
      face: null
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
    computed: {
      cardType(){
        let cardType = 'nonland';
        if(this.face !== undefined ? this.card.card_faces[this.face].type_line.includes('Land') : this.card.type_line.includes('Land')) cardType = 'Land';
        if(this.face !== undefined ? this.card.card_faces[this.face].type_line.includes('Artifact') : this.card.type_line.includes('Artifact')) cardType = 'Artifact';
        return cardType
      },
      colorID() {
        let colorID = [];
        if(this.face !== undefined) {
          colorID = this.getColorsFromCost(this.card.card_faces[this.face].mana_cost);
        } else {
          colorID = this.getColorsFromCost(this.card.mana_cost);
        }

        // dedup colorID
        colorID = Array.from(new Set(colorID));
        return colorID || []
      }
    },
    mounted() {
      this.adjustCardTitleSize();
      this.adjustCardTypeSize();
      this.adjustCardTextSize();
      this.adjustArtistSize();
    },
    methods: {
      tombstoneFrame() {
        let oracleText = this.face !== undefined ? this.card.card_faces[this.face].oracle_text : this.card.oracle_text;
        return tombstoneList.includes(this.card.name) && oracleText.includes('your graveyard')
      },
      getColorsFromCost(cost){
        let costArr = cost.split(/[{}]+/);
        costArr = costArr.filter(x => x);
        return costArr.filter(x => this.wubrg.includes(x));
      },
      cardTemplate() {
        let colors = this.face !== undefined ? this.getColorsFromCost(this.card.card_faces[this.face].mana_cost) : this.card.colors;
        let typeLine = this.face !== undefined ? this.card.card_faces[this.face].type_line : this.card.type_line;
        let manaCost = this.face !== undefined ? this.card.card_faces[this.face].mana_cost : this.card.mana_cost;
        let returnString = '';
        if(colors.length > 1) {
          let costArr = manaCost.split(/[{}]+/);
          costArr = costArr.filter(x => x);
          let hybridArr = [];
          costArr.forEach((cost,i) => {
            if(costArr[i].includes('/')) {
              hybridArr.push(costArr.splice(i, 1)[0]);
            }
          });
          // if hybridArr is not empty and all of its elemets are identical
          // AND if W, U, B, R, G are not in the costArr
          if(hybridArr.length > 0 && hybridArr.every(x => x === hybridArr[0]) && !this.wubrg.some(x => costArr.includes(x))) {
            returnString += hybridArr[0][0].toLowerCase();
          }else{
            returnString += 'm';
          }
        } else if(colors.length === 1) {
          returnString += colors[0].toLowerCase();
        } else if(colors.length === 0) {
          if(typeLine.includes('Land')){
            if(this.colorID.length > 2) {
              returnString += 'ml';
            }else if(this.colorID.length === 0) {
              returnString += 'cl';
            }else{
              returnString += this.colorID[0].toLowerCase() + 'l';
            }
          }else if(typeLine.includes('Artifact')) { 
            returnString += 'a';
          }else{
            returnString += 'c';
          }
        }
        return returnString + 'split'
      },
      cardTemplate2() {
        let typeLine = this.face !== undefined ? this.card.card_faces[this.face].type_line : this.card.type_line;
        let manaCost = this.face !== undefined ? this.card.card_faces[this.face].mana_cost : this.card.mana_cost;
        let costArr = manaCost.split(/[{}]+/);
        costArr = costArr.filter(x => x);
        let hybridArr = [];
        costArr.forEach((cost,i) => {
          if(costArr[i].includes('/')) {
            hybridArr.push(costArr.splice(i, 1)[0]);
          }
        });
        let returnString = '';
        if(this.colorID[1]) returnString = (hybridArr[0] ? hybridArr[0][2] : this.colorID[1]).toLowerCase();
        if(typeLine.includes('Land')){
          returnString += 'l';
        }
        return returnString + 'split'
      },
      formatText(text, flavorText) {
        let textBox = text;
        textBox = '<p>' + textBox
          .replace(/\n/g, '</p><p>')
          .replace(/\(/g,'<i class=reminderText>(')
          .replace(/\)/g,')</i>') + '</p>';
        let ftxt = flavorText || '';
        if(ftxt) {
          ftxt = (this.card.oracle_text ? '<hr>' : '') + ftxt.replace(/\n/g, '<br>');
        }
        textBox = (textBox + '<p><i>' + ftxt + '</i></p>')
          .replace(/\b\*/g, "<i>")       // Closing asterisk
          .replace(/\*\b/g, "</i>")      // Opening asterisk
          .replace(/\b'/g, "\u2019")     // Closing singles
          .replace(/'\b/g, "\u2018")     // Opening singles
          .replace(/\b"/g, "\u201d")     // Closing doubles
          .replace(/\."/g, ".\u201d")     // Closing doubles
          .replace(/"$/g, "\u201d")      // Closing doubles
          .replace(/"\b/g, "\u201c")     // Opening doubles
          .replace(/"{/g, "\u201c{")     // Opening doubles
          .replace(/^"/g, "\u201c")      // Opening doubles
          .replace(/--/g,  "\u2014")     // em-dashes;
        if(this.card.type_line.includes('Planeswalker')){
        textBox = textBox.replace(/<p>0: /g, '<p class="loyaltyAbility"><span class="textLoyalty">0</span>')
          .replace(/<p>\+([1-9X]): /g, '<p class="loyaltyAbility"><span class="textLoyaltyUp">+$1</span>')
          .replace(/<p>−([1-9X]): /g, '<p class="loyaltyAbility"><span class="textLoyaltyDown">-$1</span>')
          .replace(/<p>\+([1-9X]*): /g, '<p class="loyaltyAbility"><span class="textLoyaltyUp textLoyaltyBig">+$1</span>')
          .replace(/<p>−([1-9X]*): /g, '<p class="loyaltyAbility"><span class="textLoyaltyDown textLoyaltyBig">-$1</span>');
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
        const cardTitleElement = this.$refs.cardTitleElement || null;
        if(cardTitleElement){
          const cardManaCostElement = this.$refs.cardManaCostElement || null;
          let fontSize = parseInt(window.getComputedStyle(cardTitleElement).fontSize);
  
          while (cardTitleElement.clientWidth + (cardManaCostElement ? cardManaCostElement.clientWidth : 0) > 580) {
            fontSize -= 0.25;
            cardTitleElement.style.fontSize = `${fontSize}px`;
          }
        }
      },
      adjustCardTypeSize() {
        const cardTypeElement = this.$refs.cardTypeElement || null;
        if(cardTypeElement){
          const cardExpansionElement = this.$refs.cardExpansionElement || null;
          let fontSize = parseInt(window.getComputedStyle(cardTypeElement).fontSize);
  
          while (cardTypeElement.clientWidth + (cardExpansionElement ? cardExpansionElement.clientWidth : 0) > 580) {
            fontSize -= 0.25;
            cardTypeElement.style.fontSize = `${fontSize}px`;
          }
        }
      },
      adjustArtistSize() {
        const cardArtistElement = this.$refs.cardArtistElement || null;
        if(cardArtistElement){
          const cardPowerToughnessElement = this.$refs.cardPowerToughnessElement || null;
          let fontSize = parseInt(window.getComputedStyle(cardArtistElement).fontSize);
  
          while (cardArtistElement.clientWidth + ((cardPowerToughnessElement ? cardPowerToughnessElement.clientWidth : 0) * 2) > 580) {
            fontSize -= 0.25;
            cardArtistElement.style.fontSize = `${fontSize}px`;
          }
        }
      },
      adjustCardTextSize() {
        const cardTextElement = this.$refs.cardTextElement || null;
        if(cardTextElement){
          let fontSize = parseInt(window.getComputedStyle(cardTextElement).fontSize);
          let letterSpacing = 0;

          while (cardTextElement.scrollHeight > 220 && fontSize > 14) {
            if(fontSize > 14) fontSize -= 0.25;
            else letterSpacing -= 0.25;
            cardTextElement.style.fontSize = `${fontSize}px`;
            cardTextElement.style.letterSpacing = `${letterSpacing}px`;
          }
          if(cardTextElement.clientHeight < 60) {
            cardTextElement.style.textAlign = 'center';
          }
          let leftoverSpace = 195 - cardTextElement.clientHeight;
          cardTextElement.style.paddingTop = `${leftoverSpace/3}px`;
        }
      },
    }
  }
</script>

<style>
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

  .splitCard {
    position: absolute;
    display: inline-block;
    background-color: #222;
    transform: rotate(-90deg);
    margin: -109px 109px;
  }
  .splitCard.face0 {
    bottom: 0;
  }
  .splitCardTemplate2 {
    position: absolute;
    left: 0;
    top: 0;
    -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0) 60%);
    mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0) 60%);
  }
  .splitCardTitle, .splitCardType, .splitCardCopyright, .splitCardArtist, .splitCardDisclaimer, .splitCardPowerToughness {
    text-shadow: 2px 2px 2px #000;
  }
  .splitCardManaCost, .symbolGroup {
    text-shadow: none;
    font-family: "Magic Symbols";
    font-style: normal;
  }
  .splitCardText, .splitCardManaCost, .splitCardType, .splitCardArtist, .splitCardDisclaimer, .splitCardPowerToughness {
    font-family: "Plantin";
  }
  .splitCardTitle, .splitCardType, .splitCardArtist {
    white-space: nowrap;
  }

  .splitCardTombstoneWrapper {
    position: absolute;
    top: 6px;
    left: 12px;
    font-size: 32px;
    color: #999;
    font-family: "Magic Symbols Old";
  }
  .splitCardTombstone {
    color: #999;
    position: relative;
    z-index: 2;
  }
  .splitCardTombstone:before, .splitCardTombstone:after, .splitCardTombstoneShadow:before, .splitCardTombstoneShadow:after {
    content: 'Q';
    position: absolute;
    left: 0;
  }
  .splitCardTombstone:before {
    text-shadow: 
      2px 2px 0 #eee, 
      2px -1px 0 #eee;
  }
  .splitCardTombstoneShadow {
    text-shadow: 
      -2px 2px 0 #eee, 
      0 2px 0 #eee,
      0 -1.5px 0 #eee,
      1px -1.5px 0 #eee,
      1px -1.5px 0 #eee,
      -2px 0 0 #eee,
      -1px 1px 0 #eee, 
      -1px -1px 0 #eee,
      -2px 1px 0 #eee, 
      -2px -1px 0 #eee;
  }
  .splitCardTombstoneShadow {
    position: absolute;
    left: -3px;
    z-index: 1;
    color: #666;
  }
  .splitCardTitle {
    position: absolute;
    top: 3px;
    left: 36px;
    font-size: 42px;
    color: #eee;
    font-family: "Magic";
    letter-spacing: 0.07em;
  }
  .splitCardManaCost {
    position: absolute;
    top: 1px;
    right: 14px;
    font-size: 44px;
  }
  .splitCardImage {
    top: 58px;
    left: 38px;
    width: 383px;
    height: 257px;
    position: absolute;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .splitCardImage.face0{ background-position: left; }
  .splitCardImage.face1{ background-position: right; }
  .splitCardType {
    position: absolute;
    top: 327px;
    left: 30px;
    font-size: 34px;
    color: #eee;
  }
  .splitCardExpansionWrapper {
    position: absolute;
    top: 344px;
    right: 52px;
    font-size: 38px;
  }
  .splitCardText {
    position: absolute;
    top: 375px;
    left: 43px;
    font-size: 38px;
    line-height: 1.075em;
    color: #222;
    width: 375px;
    max-height: 220px;
  }
  .splitCardText.planeswalkerText p.loyaltyAbility {
    position: relative;
    padding-left: 25px;
  }
  .smol {
    font-size: .7em;
    position: relative;
    top: -8px;
  }
  .splitCardText p {
    margin: 0.25em 0;
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
  .splitCardCopyright {
    position: absolute;
    bottom: 16px;
    left: 16px;
    font-size: 21px;
    color: #eee;
  }
  .splitCardCopyright span {
    font-size: 42px;
    font-family: "Magic Symbols";
    position: relative;
    left: -10px;
  }
  .splitCardArtist{
    position: absolute;
    bottom: 35px;
    left: 50%;
    transform: translate(-50%, 0);
    font-size: 26px;
    color: #eee;
  }
  .splitCardDisclaimer{
    position: absolute;
    bottom: 17px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 14px;
    color: #eee;
  }
</style>