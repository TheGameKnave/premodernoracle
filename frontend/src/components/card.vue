<template>
  <div class="cardBorder">
    <img v-if="originalCard" :src="face !== undefined ? card.card_faces[face].image_uris.large : card.image_uris.large" class="originalCard" />
    <div :class="'card ' + (originalCard ? 'originalPresent' : '')">
      <template
        v-if="['normal','mutate','prototype','meld','class','case','saga','leveler','adventure'].includes(card.layout) || (['transform','modal_dfc'].includes(card.layout) && face !== undefined)"
      >
        <img
          :src="require(`@/assets/images/card_templates/${cardTemplate((this.card.layout === 'adventure' ? 'adventurer' : 'card'))}.jpg`)"
          class="cardTemplate"
          alt="Card Template"
        >
        <img
          v-if="colorID.length === 2 && !cardTemplate((this.card.layout === 'adventure' ? 'adventurer' : 'card')).find('m') !== 0"
          :src="require(`@/assets/images/card_templates/${cardTemplate2((this.card.layout === 'adventure' ? 'adventurer' : 'card'))}.jpg`)"
          class="cardTemplate2"
          alt="Card Template"
        >
        <div
          class="cardTombstoneWrapper"
          v-if="tombstoneFrame() && !face"
        >
          <span class="cardTombstone" >Q</span>
          <span class="cardTombstoneShadow" >Q</span>
        </div>
        <span 
          v-if="face === 0 && !tombstoneFrame()" 
          class="dfc dfcFront">▲</span>
        <span 
          v-if="face === 1" 
          class="dfc dfcBack">▼</span>
        <div
          ref="cardTitleElement"
          class="cardTitle"
        >{{ face !== undefined ? card.card_faces[face].name : (card.layout === 'adventure' ? card.card_faces[0].name : card.name) }}</div>
        <div
          ref="cardManaCostElement"
          class="cardManaCost"
          v-html="parseSymbols(face !== undefined ? card.card_faces[face].mana_cost : (card.layout === 'adventure' ? card.card_faces[0].mana_cost : card.mana_cost))"
        />
        <div 
          :style="{ backgroundImage: 'url(' + (face !== undefined ? card.card_faces[face].image_uris.art_crop : card.image_uris.art_crop) + ')' }" 
          class="cardImage"/>
        <div
          ref="cardTypeElement"
          class="cardType"
        >
          {{ face !== undefined ? card.card_faces[face].type_line : (card.layout === 'adventure' ? card.card_faces[0].type_line : card.type_line) }}
        </div>
        <div class="cardExpansionWrapper">
          <i :class="'cardExpansion ' + card.rarity + ' stroke ss ss-' + card.set"/>
          <i
            v-if="card.rarity !== 'common'" 
            :class="'cardExpansion fill ss ss-' + card.set"
          />
          <i
            ref="cardExpansionElement"
            :class="'cardExpansion ' + card.rarity + ' ss ss-' + card.set"
          />
        </div>
        <adventure
          v-if="card.layout === 'adventure'"
          :card="card"
          :face="1"
        />
        <div 
          ref="cardTextElement"
          :class="'cardText ' + (((face !== undefined && card.type_line.includes('Planeswalker')) || card.type_line.includes('Planeswalker')) ? 'planeswalkerText ' : '') + (card.layout === 'adventure' ? 'adventurerText ' : '')"
          v-html="findSymbols(formatText(face !== undefined ? card.card_faces[face].oracle_text : (card.layout === 'adventure' ? card.card_faces[0].oracle_text : card.oracle_text), face !== undefined ? card.card_faces[face].flavor_text : (card.layout === 'adventure' ? card.card_faces[0].flavor_text : card.flavor_text)))"/>
        <div class="cardCopyright">©&nbsp;<span>∑</span></div>
        <div
          ref="cardArtistElement"
          class="cardArtist"
        ><span class="magicSymbol">L</span>&nbsp;{{ this.face !== undefined ? card.card_faces[this.face].artist : card.artist }}</div>
        <div class="cardDisclaimer">Playtest card—NOT FOR SALE</div>
        <div
          v-if="(face !== undefined ? (card.card_faces[face].loyalty || card.card_faces[face].power || card.card_faces[face].toughness) : (card.layout === 'adventure' ? (card.card_faces[0].power || card.card_faces[0].toughness) : (card.power || card.toughness))) && card.layout !== 'leveler'"
          ref="cardPowerToughnessElement"
          :class="'cardPowerToughness ' + (((face !== undefined && card.card_faces[face].loyalty) || card.loyalty) ? 'cardLoyalty' : '')" 
          v-html="(face !== undefined ? card.card_faces[face].loyalty : card.loyalty) || formatPT((face !== undefined ? card.card_faces[face].power : (card.layout === 'adventure' ? card.card_faces[0].power : card.power)) + '/' + (face !== undefined ? card.card_faces[face].toughness : (card.layout === 'adventure' ? card.card_faces[0].toughness : card.toughness)))"
        />
        <div
          v-if="face !== undefined ? (card.card_faces[face].defense) : (card.defense)"
          ref="cardPowerToughnessElement"
          class="cardDefense"
        >{{ face !== undefined ? card.card_faces[face].defense : card.defense }}</div>
      </template>
      <template v-if="card.layout === 'split'">
        <splitCard
          :card="card"
          :face="0"
        />
        <splitCard
          :card="card"
          :face="1"
        />
      </template>
    </div>
  </div>
</template>

<script>
  import splitCard from '@/components/splitCard.vue';
  import adventure from '@/components/adventure.vue';
  import { tombstoneList } from '@/constants';
  export default {
    name: 'Card',
    components: {
      splitCard,
      adventure,
    },
    props: {
      card: {},
      face: null
    },
    data() {
      return {
        originalCard: false,
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
          'G/R': '<span class="manaGreen">O</span><span class="manaRed">/</span>Fm',
          'R/G': '<span class="manaRed">O</span><span class="manaGreen">/</span>Mf',
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
      colorID() {
        let colorID = [];
        if(this.face !== undefined ? this.card.card_faces[this.face].type_line.includes('Land') : this.card.type_line.includes('Land')){
          colorID = this.face !== undefined ? (this.card.card_faces[this.face].colors || this.card.card_faces[this.face].color_indicator) : this.card.color_identity;
          if((!colorID || colorID.length === 0) && (this.face !== undefined ? this.card.card_faces[this.face].type_line.includes('Land') : this.card.type_line.includes('Land'))) {
            colorID = [];
            let text = this.face !== undefined ? this.card.card_faces[this.face].oracle_text : this.card.oracle_text;
            if(text.toLowerCase().includes('add one mana of any color')) colorID = ['W', 'U', 'B', 'R', 'G'];
            if(text.includes('{W}')) colorID.push('W');
            if(text.includes('{U}')) colorID.push('U');
            if(text.includes('{B}')) colorID.push('B');
            if(text.includes('{R}')) colorID.push('R');
            if(text.includes('{G}')) colorID.push('G');
          }
        }
        return colorID
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
        return tombstoneList.includes(this.card.name)
      },
      cardTemplate(base = 'card',face) {
        let colors = face !== undefined ? this.card.card_faces[face].colors : this.card.colors;
        let typeLine = face !== undefined ? this.card.card_faces[face].type_line : this.card.type_line;
        let manaCost = face !== undefined ? this.card.card_faces[face].mana_cost : this.card.mana_cost;
        let returnString = '';
        if(colors.length > 1) {
          let costArr = manaCost.split(/[{}]+/);
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
        return returnString + base
      },
      cardTemplate2(base = 'card',face) {
        let typeLine = face !== undefined ? this.card.card_faces[face].type_line : this.card.type_line;
        let manaCost = face !== undefined ? this.card.card_faces[face].mana_cost : this.card.mana_cost;
        let costArr = manaCost.split(/[{}]+/);
        costArr = costArr.filter(x => x);
        let hybridArr = [];
        for(let i = 0; i < costArr.length; i++) {
          if(costArr[i].includes('/')) {
            hybridArr.push(costArr.splice(i, 1)[0]);
          }
          i++;
        }
        let returnString = '';
        if(this.colorID[1]) returnString = (hybridArr[0] ? hybridArr[0][2] : this.colorID[1]).toLowerCase();
        if(typeLine.includes('Land')){
          returnString += 'l';
        }
        return returnString + base
      },
      formatText(text, flavorText) {
        let textBox = text;
        textBox = '<p>' + textBox
          .replace(/\n/g, '</p><p>')
          .replace(/\(/g,'<i>(')
          .replace(/\)/g,')</i>') + '</p>';
        let ftxt = flavorText || '';
        if(ftxt) {
          ftxt = ((this.card.layout === 'adventure' ? this.card.card_faces[0].oracle_text : this.card.oracle_text) ? '<hr>' : '') + ftxt.replace(/\n/g, '<br>');
          textBox = (textBox + '<p><i>' + ftxt + '</i></p>');
        }
        textBox = textBox
          .replace(/\b\*/g, "<i>")       // Closing asterisk
          .replace(/\*\b/g, "</i>")      // Opening asterisk
          .replace(/\b'/g, "\u2019")     // Closing singles
          .replace(/'$/g, "\u2019")      // Closing singles
          .replace(/'</g, "\u2019<")     // Closing singles
          .replace(/\.'/g, "\u2019")     // Closing singles
          .replace(/'\b/g, "\u2018")     // Opening singles
          .replace(/'{/g, "\u2018{")     // Opening singles
          .replace(/\b"/g, "\u201d")     // Closing doubles
          .replace(/\."/g, ".\u201d")    // Closing doubles
          .replace(/"$/g, "\u201d")      // Closing doubles
          .replace(/"</g, "\u201d<")     // Closing doubles
          .replace(/"\b/g, "\u201c")     // Opening doubles
          .replace(/"{/g, "\u201c{")     // Opening doubles
          .replace(/^"/g, "\u201c")      // Opening doubles
          .replace(/--/g,  "\u2014")     // em-dashes;
        if(this.card.type_line.includes('Planeswalker')){
          textBox = textBox.replace(/<p>0: /g, '<p class="loyaltyAbility"><span class="textLoyalty">0</span>')
            .replace(/<p>\+([1-9X]): /g, '<p class="loyaltyAbility"><span class="textLoyaltyUp">+$1</span>')
            .replace(/<p>−([1-9X]): /g, '<p class="loyaltyAbility"><span class="textLoyaltyDown">-$1</span>')
            .replace(/<p>\+([0-9X]*): /g, '<p class="loyaltyAbility"><span class="textLoyaltyUp textLoyaltyBig">+$1</span>')
            .replace(/<p>−([0-9X]*): /g, '<p class="loyaltyAbility"><span class="textLoyaltyDown textLoyaltyBig">-$1</span>');
        }
        textBox = textBox
          .replace(/<p>Level up (.*)<\/p><p>LEVEL 1-([0-9]*)<\/p><p>([0-9]*\/[0-9]*)<\/p>(<p>(.*)<\/p>)?<p>LEVEL ([0-9]\+*)<\/p><p>([0-9]*\/[0-9]*)<\/p>(<p>(.*)<\/p>)?/g,
            `<div class="levelAbility"><div class="levelReminder">Level up $1</div><div class="levelPT">${this.formatPT((this.face !== undefined ? this.card.card_faces[face].power : this.card.power) + '/' + (this.face !== undefined ? this.card.card_faces[face].toughness : this.card.toughness))}</div></div>
<div class="levelAbility"><div class="levelSpread">1–$2</div><div class="levelText">$5</div><div class="levelPT">$3</div></div>
<div class="levelAbility"><div class="levelSpread">$6</div><div class="levelText">$9</div><div class="levelPT">$7</div></div>`);
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
          let fontSize = parseInt(window.getComputedStyle(cardTitleElement).fontSize);
  
          //count the number of mana symbols in mana_cost
          const countInstancesOfCharacter = (inputString, character) => inputString.split(character).length - 1;
          let manaCount = countInstancesOfCharacter(this.card.card_faces ? this.card.card_faces[0].mana_cost : this.card.mana_cost || '', '{');
          while (cardTitleElement.clientWidth + (manaCount * 40) > 560) {
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
  
          while (cardTypeElement.clientWidth + (cardExpansionElement ? cardExpansionElement.clientWidth : 0) > 570) {
            fontSize -= 0.25;
            cardTypeElement.style.fontSize = `${fontSize}px`;
          }
        }
      },
      adjustArtistSize() {
        const cardArtistElement = this.$refs.cardArtistElement || null;
        if(cardArtistElement){
          let fontSize = parseInt(window.getComputedStyle(cardArtistElement).fontSize);
  
          while (cardArtistElement.clientWidth > 380) {
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
  
          while (cardTextElement.scrollHeight > 270 && fontSize > 18) {
            if(fontSize > 18) fontSize -= 0.25;
            else letterSpacing -= 0.25;
            cardTextElement.style.fontSize = `${fontSize}px`;
            cardTextElement.style.letterSpacing = `${letterSpacing}px`;
          }
          if(cardTextElement.clientHeight < 60) {
            cardTextElement.style.textAlign = 'center';
          }
          let leftoverSpace = 285 - cardTextElement.clientHeight;
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
  .cardBorder {
    display: inline-block;
    position: relative;
    width: 744px;
    height: 1038px;
    overflow: hidden;
    margin: 10px;
    border-radius: 20px;
    background-color: #222;
    zoom: 0.5;
  }
  .originalCard {
    position: absolute;
    top: -3px;
    left: -2px;
    width: 746px;
    z-index: 0;
  }
  .card {
    position: relative;
    display: inline-block;
    background-color: #222;
    margin: 38px 36px;
    overflow: hidden;
    width: 672px;
    height: 962px;
  }
  .card.originalPresent {
    opacity: 0.75;
  }
  .cardTemplate2 {
    position: absolute;
    left: 0;
    top: 0;
    -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0) 60%);
    mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0) 60%);
  }
  .cardTitle, .cardType, .cardCopyright, .cardArtist, .cardDisclaimer, .cardPowerToughness, .levelPT {
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
  .cardTombstoneWrapper {
    position: absolute;
    top: 10px;
    left: 15px;
    font-size: 35px;
    color: #999;
    font-family: "Magic Symbols Old";
  }
  .cardTombstone {
    color: #999;
    position: relative;
    z-index: 2;
  }
  .cardTombstone:before, .cardTombstone:after, .cardTombstoneShadow:before, .cardTombstoneShadow:after {
    content: 'Q';
    position: absolute;
    left: 0;
  }
  .cardTombstone:before {
    text-shadow: 
      3px 3px 0 #eee, 
      3px -2px 0 #eee;
  }
  .cardTombstoneShadow {
    text-shadow: 
      -3px 3px 0 #eee, 
      0 3px 0 #eee,
      0 -2.5px 0 #eee,
      1px -2.5px 0 #eee,
      2px -2.5px 0 #eee,
      -3px 0 0 #eee,
      -2px 2px 0 #eee, 
      -2px -2px 0 #eee,
      -3px 2px 0 #eee, 
      -3px -2px 0 #eee;
  }
  .cardTombstoneShadow {
    position: absolute;
    left: -3px;
    z-index: 1;
    color: #666;
  }
  .dfc {
    color: #222;
    position: absolute;
    font-size: 35px;
    left: 5px;
    top: 2px;
    text-shadow: 
      2px 2px 0 #eee, 
      -2px -2px 0 #eee, 
      -2px 2px 0 #eee, 
      2px -2px 0 #eee,
      2px 1px 0 #eee, 
      -2px -1px 0 #eee, 
      -2px 1px 0 #eee, 
      2px -1px 0 #eee,
      1px 2px 0 #eee, 
      -1px -2px 0 #eee, 
      -1px 2px 0 #eee, 
      1px -2px 0 #eee,
      0 2px 0 #eee,
      0 -2px 0 #eee,
      2px 0 0 #eee,
      -2px 0 0 #eee;
  }
  .dfcBack { top: 6px }
  .cardTitle {
    position: absolute;
    top: 8px;
    left: 44px;
    font-size: 39px;
    letter-spacing: 0.039em;
    color: #eee;
    font-family: 'Magic';
  }
  .cardManaCost {
    position: absolute;
    top: 2px;
    right: 20px;
    font-size: 46px;
  }
  .cardImage {
    top: 61px;
    left: 48px;
    position: absolute;
    width: 575px;
    height: 465px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center top;
  }
  .cardType {
    position: absolute;
    top: 537px;
    left: 42px;
    font-size: 33.5px;
    line-height: 50px;
    color: #eee;
  }
  .cardExpansionWrapper {
    position: absolute;
    top: 558px;
    right: 68px;
    font-size: 40px;
  }
  .cardExpansion {
    position: absolute;
    right: 50%;
    top: 50%;
    transform: translate(50%, -50%) !important;
  }
  .stroke.ss-wth:after,
  .stroke.ss-por:after,
  .stroke.ss-som:after,
  .stroke.ss-rtr:after,
  .stroke.ss-bbd:after,
  .stroke.ss-mh2:after,
  .stroke.ss-clb:after,
  .stroke.ss-mom:after,
  .stroke.ss-m10:after,
  .stroke.ss-m11:after,
  .stroke.ss-m12:after,
  .stroke.ss-m13:after,
  .stroke.ss-m14:after,
  .stroke.ss-m15:after,
  .stroke.ss-m19:after,
  .stroke.ss-m20:after,
  .stroke.ss-m21:after {
    content: '';
    position: absolute;
    z-index: -1;
    width: 70%;
    height: 45%;
    background: #eee;
    top: 50%;
    right: 50%;
    border-radius: 0.2em;
    transform: translate(50%, -50%);
  }
  .stroke.ss-som:after {
    height: 71%;
    width: 83%;
    top: 19px;
  }
  .stroke.ss-por:after {
    height: 19%;
    width: 76%;
    top: 28px;
  }
  .stroke.ss-bbd:after {
    height: 34%;
    width: 48%;
    top: 10px;
  }
  .fill.ss-afr:after,
  .fill.ss-vis:after,
  .fill.ss-usg:after,
  .fill.ss-zen:after,
  .fill.ss-som:after,
  .fill.ss-mbs:after,
  .fill.ss-bbd:after,
  .fill.ss-lci:after,
  .fill.ss-dmu:after,
  .fill.ss-mid:after, .stroke.ss-mid:after,
  .fill.ss-m10:after,
  .fill.ss-m11:after,
  .fill.ss-m12:after,
  .fill.ss-m13:after,
  .fill.ss-m14:after,
  .fill.ss-m15:after,
  .fill.ss-m19:after,
  .fill.ss-m20:after,
  .fill.ss-m21:after {
    content: '';
    position: absolute;
    z-index: -1;
    width: 90%;
    height: 45%;
    background: #222;
    top: 50%;
    right: 50%;
    border-radius: 0.2em;
    transform: translate(50%, -50%);
  }
  .fill.ss-afr:after {
    height: 67%;
    width: 79%;
    top: 24px;
  }
  .fill.ss-dmu:after {
    height: 55%;
    width: 60%;
    top: 25px;
  }
  .fill.ss-vis:after {
    height: 55%;
    width: 60%;
    top: 13px;
  }
  .fill.ss-usg:after {
    height: 19%;
    width: 76%;
    top: 28px;
  }
  .fill.ss-som:after {
    height: 71%;
    width: 83%;
    top: 19px;
  }
  .fill.ss-bbd:after {
    height: 65%;
    width: 66%;
    top: 8px;
    left: 4px;
    transform: rotate(45deg);
  }
  .fill.ss-lci:after {
    height: 22%;
    width: 57%;
    top: 25px;
  }
  .cardExpansion.ss-lea { font-size: 1em; }
  .cardExpansion.ss-leb { font-size: 1em; }
  .cardExpansion.ss-2ed { font-size: 1em; }
  .cardExpansion.ss-arn { font-size: 2em; }
  .cardExpansion.ss-atq { font-size: 1.2em; }
  .cardExpansion.ss-3ed { font-size: 1em; }
  .cardExpansion.ss-fbb { font-size: 1em; }
  .cardExpansion.ss-leg { font-size: 1em; }
  .cardExpansion.ss-sum { font-size: 1em; }
  .cardExpansion.ss-drk { font-size: 1em; }
  .cardExpansion.ss-fem { font-size: 1em; }
  .cardExpansion.ss-4bb { font-size: 1em; }
  .cardExpansion.ss-4ed { font-size: 1em; }
  .cardExpansion.ss-ice { font-size: 1em; }
  .cardExpansion.ss-hml { font-size: 1em; }
  .cardExpansion.ss-all { font-size: 1.7em; }
  .cardExpansion.ss-mir { font-size: 1em; }
  .cardExpansion.ss-vis { font-size: 1em; }
  .cardExpansion.ss-5ed { font-size: 1em; }
  .cardExpansion.ss-wth { font-size: 1.4em; }
  .cardExpansion.ss-tmp { font-size: 1.1em; }
  .cardExpansion.ss-sth { font-size: 1em; }
  .cardExpansion.ss-exo { font-size: 1.8em; }
  .cardExpansion.ss-usg { font-size: 1.4em; }
  .cardExpansion.ss-ulg { font-size: 1.5em; }
  .cardExpansion.ss-6ed { font-size: 1em; }
  .cardExpansion.ss-uds { font-size: 1em; }
  .cardExpansion.ss-mmq { font-size: 1em; }
  .cardExpansion.ss-nem { font-size: 1.8em; }
  .cardExpansion.ss-pcy { font-size: 1.1em; }
  .cardExpansion.ss-inv { font-size: 1.1em; }
  .cardExpansion.ss-pls { font-size: 1.4em; }
  .cardExpansion.ss-7ed { font-size: 1em; }
  .cardExpansion.ss-apc { font-size: 1em; }
  .cardExpansion.ss-ody { font-size: 1em; }
  .cardExpansion.ss-tor { font-size: 1em; }
  .cardExpansion.ss-jud { font-size: 1.1em; }
  .cardExpansion.ss-ons { font-size: 1.2em; }
  .cardExpansion.ss-lgn { font-size: 1.6em; }
  .cardExpansion.ss-scg { font-size: 1em; }
  .cardExpansion.ss-8ed { font-size: 1em; }
  .cardExpansion.ss-mrd { font-size: 1.5em; }
  .cardExpansion.ss-dst { font-size: 1em; }
  .cardExpansion.ss-5dn { font-size: 1em; }
  .cardExpansion.ss-chk { font-size: 1.1em; }
  .cardExpansion.ss-bok { font-size: 1.1em; }
  .cardExpansion.ss-sok { font-size: 1em; }
  .cardExpansion.ss-9ed { font-size: 1em; }
  .cardExpansion.ss-rav { font-size: 1em; }
  .cardExpansion.ss-gpt { font-size: 1.1em; }
  .cardExpansion.ss-dis { font-size: 1em; }
  .cardExpansion.ss-csp { font-size: .9em; }
  .cardExpansion.ss-tsp { font-size: 1em; }
  .cardExpansion.ss-tsb { font-size: 1em; }
  .cardExpansion.ss-plc { font-size: 1.2em; }
  .cardExpansion.ss-fut { font-size: 1.3em; }
  .cardExpansion.ss-10e { font-size: 1em; }
  .cardExpansion.ss-lrw { font-size: 1em; }
  .cardExpansion.ss-mor { font-size: 1em; }
  .cardExpansion.ss-shm { font-size: 1.3em; }
  .cardExpansion.ss-eve { font-size: 1.1em; }
  .cardExpansion.ss-ala { font-size: 1.1em; }
  .cardExpansion.ss-con { font-size: 1em; }
  .cardExpansion.ss-arb { font-size: 1.1em; }
  .cardExpansion.ss-zen { font-size: 1em; }
  .cardExpansion.ss-wwk { font-size: 1.1em; }
  .cardExpansion.ss-roe { font-size: 1.1em; }
  .cardExpansion.ss-som { font-size: 1em; }
  .cardExpansion.ss-mbs { font-size: 1em; }
  .cardExpansion.ss-nph { font-size: 1em; }
  .cardExpansion.ss-isd { font-size: 1em; }
  .cardExpansion.ss-dka { font-size: 1.2em; }
  .cardExpansion.ss-avr { font-size: 1.1em; }
  .cardExpansion.ss-rtr { font-size: 1em; }
  .cardExpansion.ss-gtc { font-size: 1.3em; }
  .cardExpansion.ss-dgm { font-size: 1.2em; }
  .cardExpansion.ss-ths { font-size: 1em; }
  .cardExpansion.ss-bng { font-size: 1em; }
  .cardExpansion.ss-jou { font-size: 1.1em; }
  .cardExpansion.ss-cns { font-size: 1em; }
  .cardExpansion.ss-ktk { font-size: 1.1em; }
  .cardExpansion.ss-frf { font-size: 1.2em; }
  .cardExpansion.ss-dtk { font-size: 1.1em; }
  .cardExpansion.ss-ori { font-size: 1.2em; }
  .cardExpansion.ss-bfz { font-size: 1.1em; }
  .cardExpansion.ss-ogw { font-size: 1em; }
  .cardExpansion.ss-soi { font-size: 1.1em; }
  .cardExpansion.ss-emn { font-size: 1.2em; }
  .cardExpansion.ss-cn2 { font-size: .9em; }
  .cardExpansion.ss-kld { font-size: 1.1em; }
  .cardExpansion.ss-aer { font-size: 1em; }
  .cardExpansion.ss-akh { font-size: 1em; }
  .cardExpansion.ss-hou { font-size: 1em; }
  .cardExpansion.ss-xln { font-size: 1.1em; }
  .cardExpansion.ss-rix { font-size: 1em; }
  .cardExpansion.ss-dom { font-size: .9em; }
  .cardExpansion.ss-bbd { font-size: .9em; }
  .cardExpansion.ss-grn { font-size: 1.3em; }
  .cardExpansion.ss-rna { font-size: 1.2em; }
  .cardExpansion.ss-war { font-size: 1em; }
  .cardExpansion.ss-mh1 { font-size: 1.3em; }
  .cardExpansion.ss-eld { font-size: 1em; }
  .cardExpansion.ss-thb { font-size: 1em; }
  .cardExpansion.ss-iko { font-size: 1.1em; }
  .cardExpansion.ss-jmp { font-size: 1em; }
  .cardExpansion.ss-znr { font-size: .9em; }
  .cardExpansion.ss-cmr { font-size: 1em; }
  .cardExpansion.ss-khm { font-size: 1em; }
  .cardExpansion.ss-stx { font-size: 1.2em; }
  .cardExpansion.ss-h1r { font-size: 1em; }
  .cardExpansion.ss-mh2 { font-size: 1.3em; }
  .cardExpansion.ss-afr { font-size: 1.2em; }
  .cardExpansion.ss-mid { font-size: 1.2em; }
  .cardExpansion.ss-vow { font-size: 1.3em; }
  .cardExpansion.ss-dbl { font-size: 1em; }
  .cardExpansion.ss-neo { font-size: 1.5em; }
  .cardExpansion.ss-snc { font-size: 1.3em; }
  .cardExpansion.ss-clb { font-size: 1em; }
  .cardExpansion.ss-dmu { font-size: 1em; }
  .cardExpansion.ss-broj22 { font-size: 1em; }
  .cardExpansion.ss-one { font-size: .9em; }
  .cardExpansion.ss-mom { font-size: 1.2em; }
  .cardExpansion.ss-mat { font-size: 1em; }
  .cardExpansion.ss-ltr { font-size: 1.3em; }
  .cardExpansion.ss-woe { font-size: 1.4em; }
  .cardExpansion.ss-lci { font-size: 1.3em; }
  .cardExpansion.ss-clu { font-size: 1em; }
  .cardExpansion.ss-mkm { font-size: 1em; }
  .cardExpansion.ss-otj { font-size: 1em; }
  .cardExpansion.ss-m10,
  .cardExpansion.ss-m11,
  .cardExpansion.ss-m12,
  .cardExpansion.ss-m13,
  .cardExpansion.ss-m14,
  .cardExpansion.ss-m15 {
    font-size: 1.5em;
  }
  .cardExpansion.ss-m19,
  .cardExpansion.ss-m20,
  .cardExpansion.ss-m21 {
    font-size: 1.6em;
  }
  .cardExpansion:before {
    background-size: cover;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    paint-order: stroke fill;
  }
  .cardExpansion.fill, .cardTombstone:after, .cardTombstoneShadow:after {
    text-shadow: 
    1px 1px 0 #222, 
    -1px -1px 0 #222, 
    -1px 1px 0 #222, 
    1px -1px 0 #222,
    1px 0.75px 0 #222, 
    -1px -0.75px 0 #222, 
    -1px 0.75px 0 #222, 
    1px -0.75px 0 #222,
    0.75px 1px 0 #222, 
    -0.75px -1px 0 #222, 
    -0.75px 1px 0 #222, 
    0.75px -1px 0 #222,
    0 1px 0 #222,
    0 -1px 0 #222,
    1px 0 0 #222,
    -1px 0 0 #222;
  }
  .cardExpansion.stroke {
    text-shadow: 
      3px 3px 1.5px #eee, 
      -3px -3px 1.5px #eee, 
      -3px 3px 1.5px #eee, 
      3px -3px 1.5px #eee,
      0 3px 1.5px #eee,
      0 -3px 1.5px #eee,
      3px 0 1.5px #eee,
      -3px 0 1.5px #eee,
      2px 3px 1.5px #eee, 
      -2px -3px 1.5px #eee, 
      -2px 3px 1.5px #eee, 
      2px -3px 1.5px #eee,
      3px 2px 1.5px #eee, 
      -3px -2px 1.5px #eee, 
      -3px 2px 1.5px #eee, 
      3px -2px 1.5px #eee;
  }
  .cardExpansion.common.stroke {
    text-shadow: 
      1.75px 1.75px 1.5px #eee, 
      -1.75px -1.75px 1.5px #eee, 
      -1.75px 1.75px 1.5px #eee, 
      1.75px -1.75px 1.5px #eee,
      0 1.75px 1.5px #eee,
      0 -1.75px 1.5px #eee,
      1.75px 0 1.5px #eee,
      -1.75px 0 1.5px #eee,
      1px 1.75px 1.5px #eee, 
      -1px -1.75px 1.5px #eee, 
      -1px 1.75px 1.5px #eee, 
      1px -1.75px 1.5px #eee,
      1.75px 1px 1.5px #eee, 
      -1.75px -1px 1.5px #eee, 
      -1.75px 1px 1.5px #eee, 
      1.75px -1px 1.5px #eee;
  }
  .cardExpansion.common:before {
    background-color: #222;
  }
  .cardExpansion.uncommon:before {
    background-image: radial-gradient(#ddd 0%, #666 100%);
  }
  .cardExpansion.rare:before {
    background-image: radial-gradient(#eda 0%, #984 100%);
  }
  .cardExpansion.mythic:before {
    background-image: radial-gradient(#e90 0%, #b32 100%);
  }
  .cardText {
    position: absolute;
    top: 592px;
    left: 60px;
    font-size: 38px;
    line-height: 1.075em;
    color: #000;
    width: 555px;
    max-height: 270px;
    /* overflow-x: scroll; */
  }
  .cardText {
    left: 355px;
    width: 255px;
  }
  .cardText p {
    margin: 0.25em 0;
  }
  .cardText.planeswalkerText p.loyaltyAbility {
    position: relative;
    padding-left: 25px;
  }
  .textLoyalty, .textLoyaltyUp, .textLoyaltyDown {
    position: absolute;
    right: calc(100% - 8px);
    z-index: 1;
    color: #eee;
    font-size: 28px;
    white-space: nowrap;
    width: 50px;
    text-align: center;
  }
  .textLoyaltyBig {
    width: 65px;
  }
  .textLoyalty:after, .textLoyaltyUp:after, .textLoyaltyDown:after {
    color: #000;
    content: ":";
    position: absolute;
    right: -10px;
    top: -3px;
  }
  .textLoyalty:before, .textLoyaltyUp:before, .textLoyaltyDown:before {
    content: "";
    position: absolute;
    z-index: -1;
    font-size: 1.8em;
    left: 0;
    color:#222;
    text-shadow:
      2px 2px 0 #eee,
      -2px -2px 0 #eee,
      -2px 2px 0 #eee,
      2px -2px 0 #eee,
      0 2px 0 #eee,
      0 -2px 0 #eee,
      2px 0 0 #eee,
      -2px 0 0 #eee;
    font-family: "Mana";
  }
  .textLoyalty:before {
    content: "";
    top: -4px;
  }
  .textLoyaltyUp:before {
    content: "";
    top: -5px;
  }
  .textLoyaltyDown:before {
    content: "";
    top: -4px;
  }
  .textLoyaltyBig:before {
    transform: scaleX(1.3);
    left: 10px;
  }
  .levelAbility {
    display: flex;
    min-height: 90px;
  }
  .levelReminder {
    font-size: 29px;
    line-height: 35px;
  }
  .levelSpread {
    flex: 0 0 75px;
    color: #eee;
    position: relative;
    text-align: center;
    align-self: center;
    font-size: 40px;
    z-index: 99;
  }
  .levelSpread:before {
    content: "Level";
    font-size: 28px;
    color: #eee;
    position: absolute;
    top: -30px;
    right: 50%;
    transform: translate(50%, 0);
    z-index: 99;
    font-size: 20px;
  }
  .levelSpread:after {
    content: "\2617";
    position: absolute;
    top: -15px;
    transform: rotate(90deg);
    color: #222;
    left: -20px;
    z-index: -1;
    font-size: 90px;
    text-shadow:
      2px 2px 0 #eee,
      -2px -2px 0 #eee,
      -2px 2px 0 #eee,
      2px -2px 0 #eee,
      0 2px 0 #eee,
      0 -2px 0 #eee,
      2px 0 0 #eee,
      -2px 0 0 #eee;
  }
  .levelText {
    flex: 1 1 auto;
    padding-left: 20px;
  }
  .levelPT {
    flex: 0 0 50px;
    font-size: 45px;
    letter-spacing: 1px;
    color: #eee;
    align-self: center;
  }
  .smol {
    font-size: .7em;
    position: relative;
    top: -8px;
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
  .cardPowerToughness, .cardDefense {
    position: absolute;
    bottom: 9px;
    right: 23px;
    font-size: 45px;
    letter-spacing: 1px;
    color: #eee;
  }
  .cardDefense {
    right: 40px;
    bottom: 30px;
    z-index: 2;
  }
  .cardDefense:after {
    content: "✦";
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%) rotate(-135deg);
    font-size: 125px;
    z-index: -1;
    color: #000;
    text-shadow:
      2px 2px 0 #eee,
      -2px -2px 0 #eee,
      -2px 2px 0 #eee,
      2px -2px 0 #eee,
      0 2px 0 #eee,
      0 -2px 0 #eee,
      2px 0 0 #eee,
      -2px 0 0 #eee;
  }
  .cardLoyalty {
    z-index: 1;
    right: 20px;
    bottom: 20px;
    width: 100px;
    text-align: center;
  }
  .cardLoyalty:after {
    content: "";
    font-family: "Mana";
    position: absolute;
    bottom: -15px;
    right: 0;
    font-size: 100px;
    z-index: -1;
    color: #000;
    text-shadow:
      2px 2px 0 #eee,
      -2px -2px 0 #eee,
      -2px 2px 0 #eee,
      2px -2px 0 #eee,
      0 2px 0 #eee,
      0 -2px 0 #eee,
      2px 0 0 #eee,
      -2px 0 0 #eee;
  }
  .cardCopyright {
    position: absolute;
    bottom: 18px;
    left: 24px;
    font-size: 25px;
    color: #eee;
  }
  .cardCopyright span {
    font-size: 45px;
    font-family: "Magic Symbols";
    position: relative;
    left: -10px
  }
  .cardArtist{
    position: absolute;
    bottom: 36px;
    left: 50%;
    transform: translate(-50%, 0);
    font-size: 27px;
    color: #eee;
  }
  .cardDisclaimer{
    position: absolute;
    bottom: 19px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 16px;
    color: #eee;
  }
</style>